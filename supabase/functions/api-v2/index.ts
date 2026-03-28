import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers (mandatory)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, Idempotency-Key",
};

// Rate limiting configuration
const RATE_LIMITS = {
  anonymous: { window: 60000, max: 30 }, // 30 req/min for anonymous users
  authenticated: { window: 60000, max: 120 }, // 120 req/min for authenticated users
  admin: { window: 60000, max: 300 }, // 300 req/min for admin users
};

// In-memory rate limit tracking (ephemeral per instance)
const rateLimitMap = new Map<string, { count: number; start: number; lastReset: number }>();

// Audit logging configuration
const SENSITIVE_ENDPOINTS = [
  '/hotels', '/bookings', '/profile', '/admin', '/free-nights'
];

// Simple in-memory caching for performance optimization
const responseCache = new Map<string, { data: any; timestamp: number; ttl: number }>();
const CACHE_TTL = {
  'hotels': 300000, // 5 minutes for hotels list
  'activities': 600000, // 10 minutes for activities
  'themes': 600000, // 10 minutes for themes
  'countries': 1800000, // 30 minutes for countries
};

// Compression configuration
const COMPRESSION_ENABLED = true;
const COMPRESSION_THRESHOLD = 1024; // Compress responses > 1KB

async function compressResponse(data: string): Promise<string> {
  if (!COMPRESSION_ENABLED || data.length < COMPRESSION_THRESHOLD) {
    return data;
  }
  
  try {
    // Use built-in compression
    const compressed = new CompressionStream('gzip');
    const writer = compressed.writable.getWriter();
    const reader = compressed.readable.getReader();
    
    writer.write(new TextEncoder().encode(data));
    writer.close();
    
    const chunks = [];
    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) chunks.push(value);
    }
    
    // For Edge Functions, we'll return the original data
    // as compression is handled at the CDN level
    return data;
  } catch (error) {
    console.warn('Compression failed:', error);
    return data;
  }
}

function getCacheKey(req: Request): string {
  const url = new URL(req.url);
  return `${req.method}:${url.pathname}:${url.searchParams.toString()}`;
}

function getFromCache(key: string): any | null {
  const cached = responseCache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > cached.ttl) {
    responseCache.delete(key);
    return null;
  }
  
  return cached.data;
}

function setCache(key: string, data: any, endpoint: string): void {
  const ttl = CACHE_TTL[endpoint] || 60000; // Default 1 minute
  responseCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
  
  // Simple cache size management
  if (responseCache.size > 1000) {
    const oldestKey = responseCache.keys().next().value;
    if (oldestKey) responseCache.delete(oldestKey);
  }
}

async function auditLog(endpoint: string, method: string, userId?: string, ip?: string, responseCode?: number, responseTime?: number, sensitiveData = false) {
  try {
    const auditData = {
      endpoint,
      method,
      user_id: userId,
      ip_address: ip,
      response_code: responseCode,
      response_time_ms: responseTime,
      sensitive_data_accessed: sensitiveData,
      operation_type: method === 'GET' ? 'read' : (method === 'DELETE' ? 'delete' : 'write')
    };

    // Call security audit function
    await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/security-audit/audit-log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`
      },
      body: JSON.stringify(auditData)
    });
  } catch (error) {
    console.error('Audit logging failed:', error);
  }
}

// Helpers with performance optimizations
const json = (data: any, status = 200, enableCompression = false) => {
  const jsonString = JSON.stringify(data);
  const headers = { 
    "Content-Type": "application/json", 
    ...corsHeaders,
    ...(enableCompression && jsonString.length > COMPRESSION_THRESHOLD ? {
      "Content-Encoding": "gzip"
    } : {})
  };
  
  return new Response(jsonString, {
    status,
    headers,
  });
};

function loc(en: string, es: string, pt: string, ro: string) {
  return { en, es, pt, ro };
}

function error(code: string, messages: { en: string; es: string; pt: string; ro: string }, status = 400, details: Record<string, any> = {}) {
  return json(
    {
      success: false,
      error: { code, message: messages, details },
      timestamp: new Date().toISOString(),
    },
    status,
  );
}

async function getSupabaseForRequest(req: Request) {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase URL or ANON key envs");
  }
  const authHeader = req.headers.get("Authorization") || "";
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
}

async function checkRateLimit(req: Request, userId?: string): Promise<boolean> {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const key = userId ? `user:${userId}` : `ip:${ip}`;
  const now = Date.now();
  
  // Determine rate limit based on user type
  let limit = RATE_LIMITS.anonymous;
  if (userId) {
    // Check if user is admin
    try {
      const supabase = await getSupabaseForRequest(req);
      const { data: isAdmin } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
      
      limit = isAdmin ? RATE_LIMITS.admin : RATE_LIMITS.authenticated;
    } catch {
      limit = RATE_LIMITS.authenticated;
    }
  }
  
  const entry = rateLimitMap.get(key);
  if (!entry || now - entry.start > limit.window) {
    rateLimitMap.set(key, { count: 1, start: now, lastReset: now });
    return true;
  }
  
  entry.count += 1;
  if (entry.count > limit.max) {
    // Log rate limit violation
    await auditLog(new URL(req.url).pathname, req.method, userId, ip, 429, 0, false);
    return false;
  }
  
  return true;
}

async function requireAuth(req: Request) {
  const supabase = await getSupabaseForRequest(req);
  const { data } = await supabase.auth.getUser();
  if (!data?.user) {
    throw new Response(
      JSON.stringify({
        success: false,
        error: {
          code: "ROLE_NOT_ALLOWED",
          message: loc(
            "Authentication required",
            "Autenticación requerida",
            "Autenticação necessária",
            "Autentificare necesară",
          ),
          details: {},
        },
        timestamp: new Date().toISOString(),
      }),
      { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }
  return { supabase, user: data.user };
}

async function sha256Hex(input: string) {
  const enc = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  const bytes = Array.from(new Uint8Array(digest));
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function withIdempotency(req: Request, handler: (ctx: { supabase: any; userId: string }) => Promise<Response>) {
  const { supabase, user } = await requireAuth(req);
  const key = req.headers.get("Idempotency-Key");
  if (!key) {
    return error(
      "VALIDATION_ERROR",
      loc(
        "Idempotency-Key header is required",
        "Se requiere el encabezado Idempotency-Key",
        "Cabeçalho Idempotency-Key é obrigatório",
        "Antetul Idempotency-Key este obligatoriu",
      ),
      422,
    );
  }
  const url = new URL(req.url);
  const body = req.method === "GET" ? "" : await req.clone().text();
  const bodyHash = await sha256Hex(body);

  // Try to fetch existing key
  const { data: existing, error: exErr } = await supabase
    .from("idempotency_keys")
    .select("status,response")
    .eq("user_id", user.id)
    .eq("key", key)
    .maybeSingle();

  if (exErr) {
    console.error("Idempotency fetch error", exErr);
  }

  if (existing?.status === "completed" && existing.response) {
    // Return stored response
    return json({ ...existing.response, timestamp: new Date().toISOString() }, 200);
  }

  // Insert pending if not present
  if (!existing) {
    const { error: insErr } = await supabase.from("idempotency_keys").insert({
      user_id: user.id,
      key,
      method: req.method,
      path: url.pathname,
      body_hash: bodyHash,
      status: "pending",
    });
    if (insErr) {
      console.warn("Idempotency insert warning", insErr);
    }
  }

  const res = await handler({ supabase, userId: user.id });

  // Store response on success (2xx)
  try {
    if (res.ok) {
      const payload = await res.clone().json();
      await supabase
        .from("idempotency_keys")
        .update({ status: "completed", response: payload })
        .eq("user_id", user.id)
        .eq("key", key);
    } else {
      await supabase
        .from("idempotency_keys")
        .update({ status: "failed" })
        .eq("user_id", user.id)
        .eq("key", key);
    }
  } catch (e) {
    console.error("Idempotency finalize error", e);
  }

  return res;
}

function notFound() {
  return error(
    "RESOURCE_NOT_FOUND",
    loc(
      "Resource not found",
      "Recurso no encontrado",
      "Recurso não encontrado",
      "Resursa nu a fost găsită",
    ),
    404,
  );
}

// Route handlers with caching
async function handleGetHotels(req: Request) {
  const cacheKey = getCacheKey(req);
  const cached = getFromCache(cacheKey);
  
  if (cached) {
    return json({ 
      ...cached, 
      cached: true, 
      timestamp: new Date().toISOString() 
    }, 200, true);
  }

  const supabase = await getSupabaseForRequest(req);
  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || 20)));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("hotels_public") // Use optimized view
    .select("id,name,description,country,city,address,main_image_url,property_type,style,price_per_month,created_at,updated_at", { count: "exact" });

  const country = url.searchParams.get("country");
  const city = url.searchParams.get("city");
  if (country) query = query.eq("country", country);
  if (city) query = query.eq("city", city);

  const { data, error: qErr, count } = await query.range(from, to);
  if (qErr) {
    return error("VALIDATION_ERROR", loc("Invalid filters", "Filtros inválidos", "Filtros inválidos", "Filtre nevalide"), 422, { message: qErr.message });
  }

  const result = { 
    hotels: data || [], 
    pagination: { page, limit, total: count || 0, pages: Math.ceil((count || 0) / limit) }, 
    cached: false,
    timestamp: new Date().toISOString() 
  };
  
  // Cache for 5 minutes
  setCache(cacheKey, result, 'hotels');
  
  return json(result, 200, true);
}

async function handleGetHotelById(req: Request, id: string) {
  const supabase = await getSupabaseForRequest(req);
  const { data, error: qErr } = await supabase
    .from("hotels")
    .select("id,name,description,country,city,address,main_image_url,property_type,style,price_per_month,status,check_in_weekday,created_at,updated_at")
    .eq("id", id)
    .maybeSingle();
  if (qErr || !data) return notFound();
  return json({ hotel: data, timestamp: new Date().toISOString() }, 200);
}

async function handleGetHotelPackages(req: Request, id: string) {
  const supabase = await getSupabaseForRequest(req);
  const url = new URL(req.url);
  const availableOnly = url.searchParams.get("available_only") === "true";
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || 20)));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("availability_packages")
    .select("id,hotel_id,start_date,end_date,duration_days,total_rooms,available_rooms,base_price_usd,price_increase_pct,round_step,created_at,updated_at", { count: "exact" })
    .eq("hotel_id", id);
  if (availableOnly) query = query.gt("available_rooms", 0);

  const { data, error: qErr, count } = await query.range(from, to);
  if (qErr) return error("VALIDATION_ERROR", loc("Invalid filters", "Filtros inválidos", "Filtros inválidos", "Filtre nevalide"), 422, { message: qErr.message });

  return json({ packages: data || [], pagination: { page, limit, total: count || 0, pages: Math.ceil((count || 0) / limit) }, timestamp: new Date().toISOString() }, 200);
}

async function handleGetBookings(req: Request) {
  const { supabase, user } = await requireAuth(req);
  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || 20)));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("bookings")
    .select("id,user_id,package_id,check_in,check_out,guest_count,total_price,status,payment_status,payment_timestamp,referral_code_used,created_at,updated_at", { count: "exact" })
    .eq("user_id", user.id);

  const status = url.searchParams.get("status");
  if (status) query = query.eq("status", status);

  const { data, error: qErr, count } = await query.range(from, to);
  if (qErr) return error("VALIDATION_ERROR", loc("Invalid filters", "Filtros inválidos", "Filtros inválidos", "Filtre nevalide"), 422, { message: qErr.message });

  return json({ bookings: data || [], pagination: { page, limit, total: count || 0, pages: Math.ceil((count || 0) / limit) }, timestamp: new Date().toISOString() }, 200);
}

async function handleGetBooking(req: Request, id: string) {
  const { supabase, user } = await requireAuth(req);
  const { data, error: qErr } = await supabase
    .from("bookings")
    .select("id,user_id,package_id,check_in,check_out,guest_count,total_price,status,payment_status,payment_timestamp,referral_code_used,created_at,updated_at")
    .eq("id", id)
    .maybeSingle();
  if (qErr || !data) return notFound();
  if (data.user_id !== user.id) return error("ROLE_NOT_ALLOWED", loc("Forbidden", "Prohibido", "Proibido", "Interzis"), 403);
  return json({ booking: data, timestamp: new Date().toISOString() }, 200);
}

async function handleCreateBooking(req: Request) {
  return withIdempotency(req, async ({ supabase, userId }) => {
    const body = await req.json().catch(() => ({}));
    const { package_id, check_in, check_out, guest_count = 1, referral_code_used } = body || {};
    if (!package_id || !check_in || !check_out) {
      return error("VALIDATION_ERROR", loc("Missing required fields", "Faltan campos requeridos", "Campos obrigatórios ausentes", "Câmpuri obligatorii lipsă"), 422);
    }

    // Check package exists and availability
    const { data: pkg, error: pErr } = await supabase
      .from("availability_packages")
      .select("id,hotel_id,available_rooms")
      .eq("id", package_id)
      .maybeSingle();
    if (pErr || !pkg) return notFound();

    // Concurrency-safe availability reserve
    const { data: okAvail, error: availErr } = await supabase.rpc("reserve_package_rooms_enhanced", {
      p_package_id: package_id,
      p_rooms_to_reserve: 1,
    });
    if (availErr || okAvail !== true) {
      return error(
        "INSUFFICIENT_AVAILABILITY",
        loc(
          "Not enough availability",
          "No hay suficiente disponibilidad",
          "Sem disponibilidade suficiente",
          "Nu există suficientă disponibilitate",
        ),
        400,
      );
    }

    // Insert booking (hotel_id optional; linkage derived via package in reads)
    const { data: booking, error: bErr } = await supabase
      .from("bookings")
      .insert({
        user_id: userId,
        package_id,
        check_in,
        check_out,
        guest_count,
        status: "pending",
        referral_code_used: referral_code_used || null,
        total_price: 0, // calculated elsewhere; kept for compatibility
      })
      .select("*")
      .maybeSingle();

    if (bErr || !booking) {
      // Rollback reservation
      await supabase.rpc("restore_package_availability_enhanced", { p_package_id: package_id, p_rooms_to_restore: 1 });
      return error("VALIDATION_ERROR", loc("Failed to create booking", "No se pudo crear la reserva", "Falha ao criar reserva", "Nu s-a putut crea rezervarea"), 422, { message: bErr?.message });
    }

    return json({ booking, timestamp: new Date().toISOString() }, 201);
  });
}

async function handleCancelBooking(req: Request, id: string) {
  return withIdempotency(req, async ({ supabase }) => {
    // Fetch booking
    const { data: booking, error: qErr } = await supabase
      .from("bookings")
      .select("id,package_id,status")
      .eq("id", id)
      .maybeSingle();
    if (qErr || !booking) return notFound();
    if (booking.status === "cancelled") return json({ success: true, timestamp: new Date().toISOString() }, 200);

    const { error: uErr } = await supabase
      .from("bookings")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", id);
    if (uErr) return error("CONCURRENT_MODIFICATION", loc("Update conflict", "Conflicto de actualización", "Conflito de atualização", "Conflict de actualizare"), 409, { message: uErr.message });

    // Restore availability
    await supabase.rpc("restore_package_availability_enhanced", { p_package_id: booking.package_id, p_rooms_to_restore: 1 });

    return json({ success: true, timestamp: new Date().toISOString() }, 200);
  });
}

async function handleConfirmBooking(req: Request, id: string) {
  return withIdempotency(req, async ({ supabase }) => {
    const { data: booking, error: qErr } = await supabase
      .from("bookings")
      .select("id,status")
      .eq("id", id)
      .maybeSingle();
    if (qErr || !booking) return notFound();

    if (booking.status === "confirmed") {
      return json({ booking, timestamp: new Date().toISOString() }, 200);
    }

    const { data: updated, error: uErr } = await supabase
      .from("bookings")
      .update({ status: "confirmed", payment_status: "completed", payment_timestamp: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (uErr || !updated) return error("CONCURRENT_MODIFICATION", loc("Update conflict", "Conflicto de actualización", "Conflito de atualização", "Conflict de actualizare"), 409, { message: uErr?.message });

    // Commission triggers may run via DB-side logic already
    return json({ booking: updated, timestamp: new Date().toISOString() }, 200);
  });
}

async function handleGetProfile(req: Request) {
  const { supabase, user } = await requireAuth(req);
  const { data, error: qErr } = await supabase
    .from("profiles")
    .select("id,role,first_name,last_name,avatar_url,phone,is_hotel_owner,created_at,updated_at")
    .eq("id", user.id)
    .maybeSingle();
  if (qErr) return error("RESOURCE_NOT_FOUND", loc("Profile not found", "Perfil no encontrado", "Perfil não encontrado", "Profilul nu a fost găsit"), 404);
  return json({ profile: data, timestamp: new Date().toISOString() }, 200);
}

async function handleUpdateProfile(req: Request) {
  const { supabase, user } = await requireAuth(req);
  const payload = await req.json().catch(() => ({}));
  const allowed = ["first_name", "last_name", "avatar_url", "phone"] as const;
  const update: Record<string, any> = {};
  for (const k of allowed) if (payload?.[k] !== undefined) update[k] = payload[k];
  const { data, error: uErr } = await supabase
    .from("profiles")
    .update({ ...update, updated_at: new Date().toISOString() })
    .eq("id", user.id)
    .select("id,role,first_name,last_name,avatar_url,phone,is_hotel_owner,created_at,updated_at")
    .maybeSingle();
  if (uErr) return error("VALIDATION_ERROR", loc("Invalid profile data", "Datos de perfil inválidos", "Dados de perfil inválidos", "Date de profil nevalide"), 422, { message: uErr.message });
  return json({ profile: data, timestamp: new Date().toISOString() }, 200);
}

async function handleGetFreeNights(req: Request) {
  const { supabase, user } = await requireAuth(req);
  const { data } = await supabase
    .from("free_nights_rewards")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return json({ reward: data || null, timestamp: new Date().toISOString() }, 200);
}

async function handleRedeemFreeNights(req: Request) {
  return withIdempotency(req, async ({ supabase, userId }) => {
    const body = await req.json().catch(() => ({}));
    const { package_id, check_in, check_out } = body || {};
    if (!package_id || !check_in || !check_out) return error("VALIDATION_ERROR", loc("Missing required fields", "Faltan campos requeridos", "Campos obrigatórios ausentes", "Câmpuri obligatorii lipsă"), 422);

    // Get available reward
    const { data: reward } = await supabase
      .from("free_nights_rewards")
      .select("id,status")
      .eq("owner_id", userId)
      .eq("status", "available")
      .maybeSingle();
    if (!reward) return error("BUSINESS_RULE_VIOLATION", loc("No available reward", "No hay recompensa disponible", "Sem recompensa disponível", "Nu există recompensă disponibilă"), 400);

    // Reserve package
    const { data: okAvail, error: availErr } = await supabase.rpc("reserve_package_rooms_enhanced", {
      p_package_id: package_id,
      p_rooms_to_reserve: 1,
    });
    if (availErr || okAvail !== true) {
      return error("INSUFFICIENT_AVAILABILITY", loc("Not enough availability", "No hay suficiente disponibilidad", "Sem disponibilidade suficiente", "Nu există suficientă disponibilitate"), 400);
    }

    // Create booking and mark reward redeemed
    const { data: booking, error: bErr } = await supabase
      .from("bookings")
      .insert({ user_id: userId, package_id, check_in, check_out, guest_count: 1, status: "confirmed", total_price: 0, payment_status: "completed", payment_timestamp: new Date().toISOString() })
      .select("*")
      .maybeSingle();
    if (bErr || !booking) {
      await supabase.rpc("restore_package_availability_enhanced", { p_package_id: package_id, p_rooms_to_restore: 1 });
      return error("VALIDATION_ERROR", loc("Failed to create booking", "No se pudo crear la reserva", "Falha ao criar reserva", "Nu s-a putut crea rezervarea"), 422, { message: bErr?.message });
    }

    await supabase
      .from("free_nights_rewards")
      .update({ status: "redeemed", redeemed_at: new Date().toISOString() })
      .eq("id", reward.id);

    return json({ booking, timestamp: new Date().toISOString() }, 201);
  });
}

// NEW API v2 ENDPOINTS - PHASE 2 IMPLEMENTATION

async function handleValidateCode(req: Request) {
  const { supabase } = await getSupabaseForRequest(req);
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const entityType = url.searchParams.get("entity_type");
  const excludeId = url.searchParams.get("exclude_id");

  if (!code || !entityType) {
    return error("VALIDATION_ERROR", loc("Missing code or entity_type", "Falta código o tipo de entidad", "Código ou tipo de entidade ausente", "Cod sau tip de entitate lipsă"), 422);
  }

  const upperCode = code.toUpperCase();

  // Check across all relevant tables for uniqueness
  try {
    const checks = await Promise.all([
      supabase.from('agents').select('id').or(`agent_code.eq.${upperCode},referral_code.eq.${upperCode}`),
      supabase.from('hotel_associations').select('id').or(`association_code.eq.${upperCode},referral_code.eq.${upperCode}`),
      supabase.from('hotels').select('id').eq('referral_code', upperCode),
      supabase.from('leaders').select('id').eq('referral_code', upperCode),
      supabase.from('ambassadors').select('id').eq('ambassador_code', upperCode),
      supabase.from('profiles').select('id').eq('referral_code', upperCode),
    ]);

    // Check for any existing codes (excluding current entity if updating)
    for (const { data, error: checkError } of checks) {
      if (checkError) {
        console.error('Error checking code uniqueness:', checkError);
        return error("VALIDATION_ERROR", loc("Failed to validate code uniqueness", "Error al validar unicidad del código", "Erro ao validar unicidade do código", "Eroare la validarea unicității codului"), 422, { message: checkError.message });
      }
      
      if (data && data.length > 0) {
        // If updating, exclude the current record
        if (excludeId && data.some(record => record.id !== excludeId)) {
          return json({ isUnique: false, error: "Code is already in use" }, 200);
        } else if (!excludeId) {
          return json({ isUnique: false, error: "Code is already in use" }, 200);
        }
      }
    }

    return json({ isUnique: true }, 200);
  } catch (error) {
    console.error('Error validating code uniqueness:', error);
    return error("VALIDATION_ERROR", loc("Failed to validate code uniqueness", "Error al validar unicidad del código", "Erro ao validar unicidade do código", "Eroare la validarea unicității codului"), 422);
  }
}

async function handleGenerateCode(req: Request) {
  const { supabase } = await getSupabaseForRequest(req);
  const body = await req.json().catch(() => ({}));
  const { entity_type } = body || {};

  if (!entity_type) {
    return error("VALIDATION_ERROR", loc("Missing entity_type", "Falta tipo de entidad", "Tipo de entidade ausente", "Tip de entitate lipsă"), 422);
  }

  // Define entity formats
  const entityFormats: Record<string, { prefix: string; hasCommission: boolean }> = {
    agent: { prefix: 'P', hasCommission: true },
    hotel: { prefix: 'H', hasCommission: true },
    association: { prefix: 'A', hasCommission: true },
    leader: { prefix: 'L', hasCommission: false },
    ambassador: { prefix: 'E', hasCommission: false },
  };

  const format = entityFormats[entity_type];
  if (!format) {
    return error("VALIDATION_ERROR", loc("Invalid entity_type", "Tipo de entidad inválido", "Tipo de entidade inválido", "Tip de entitate nevalid"), 422);
  }

  try {
    const functionName = format.hasCommission 
      ? 'generate_commission_entity_code' 
      : 'generate_non_commission_entity_code';
    
    const { data, error: rpcError } = await supabase.rpc(functionName, {
      prefix_letter: format.prefix
    });

    if (rpcError) {
      console.error('Error generating code:', rpcError);
      return error("VALIDATION_ERROR", loc("Failed to generate code", "Error al generar código", "Erro ao gerar código", "Eroare la generarea codului"), 422, { message: rpcError.message });
    }

    return json({ code: data }, 200);
  } catch (error) {
    console.error('Error generating code:', error);
    return error("VALIDATION_ERROR", loc("Failed to generate code", "Error al generar código", "Erro ao gerar código", "Eroare la generarea codului"), 422);
  }
}

async function handleCreateHotelReferral(req: Request) {
  return withIdempotency(req, async ({ supabase, userId }) => {
    const body = await req.json().catch(() => ({}));
    const { 
      hotel_name, 
      contact_name, 
      contact_email, 
      contact_phone, 
      city, 
      additional_info,
      referral_type,
      referral_date 
    } = body || {};

    if (!hotel_name || !contact_name || !contact_email) {
      return error("VALIDATION_ERROR", loc("Missing required fields", "Faltan campos requeridos", "Campos obrigatórios ausentes", "Câmpuri obligatorii lipsă"), 422);
    }

    try {
      const insertData: any = {
        user_id: userId,
        hotel_name,
        contact_name,
        contact_email,
        contact_phone: contact_phone || null,
        city: city || null,
        additional_info: additional_info || null,
      };

      // Handle three free nights referral specifics
      if (referral_type === "three_free_nights" && referral_date) {
        const referralDate = new Date(referral_date);
        const expirationDate = new Date(referralDate);
        expirationDate.setDate(expirationDate.getDate() + 15);
        
        insertData.referral_type = "three_free_nights";
        insertData.referral_date = referralDate.toISOString();
        insertData.expiration_date = expirationDate.toISOString();
        insertData.reward_status = "pending";
      }

      const { data, error: insertError } = await supabase
        .from("hotel_referrals")
        .insert(insertData)
        .select("*")
        .maybeSingle();

      if (insertError) {
        console.error("Error creating hotel referral:", insertError);
        return error("VALIDATION_ERROR", loc("Failed to create referral", "Error al crear referencia", "Erro ao criar referência", "Eroare la crearea referinței"), 422, { message: insertError.message });
      }

      return json({ referral: data, timestamp: new Date().toISOString() }, 201);
    } catch (error) {
      console.error('Error creating hotel referral:', error);
      return error("VALIDATION_ERROR", loc("Failed to create referral", "Error al crear referencia", "Erro ao criar referência", "Eroare la crearea referinței"), 422);
    }
  });
}

// Router with performance monitoring
serve(async (req) => {
  const startTime = Date.now();
  const url = new URL(req.url);
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  let userId: string | undefined;
  let response: Response;
  
  try {
    // Get user info for rate limiting and audit logging
    try {
      const { user } = await requireAuth(req);
      userId = user.id;
    } catch {
      // Not authenticated, continue as anonymous
    }

    // Check rate limits
    const rateLimitPassed = await checkRateLimit(req, userId);
    if (!rateLimitPassed) {
      response = error(
        "RATE_LIMIT_EXCEEDED",
        loc(
          "Rate limit exceeded. Please try again later.",
          "Límite de solicitudes excedido. Intenta más tarde.",
          "Limite de solicitações excedido. Tente novamente mais tarde.",
          "Limita de solicitări a fost depășită. Încercați din nou mai târziu."
        ),
        429
      );
      const responseTime = Date.now() - startTime;
      await auditLog(url.pathname, req.method, userId, ip, 429, responseTime, false);
      return response;
    }

    const pathSegments = url.pathname.split("/").filter(Boolean);
    console.log(`API v2: ${req.method} ${url.pathname}`);

    // Root endpoint
    if (pathSegments.length === 0) {
      return json({ message: "Hotel Living API v2", version: "2.0.0", timestamp: new Date().toISOString() });
    }

    const [resource, id, subresource] = pathSegments;
    let sensitiveData = false;

    // Check if endpoint handles sensitive data
    if (SENSITIVE_ENDPOINTS.some(endpoint => url.pathname.startsWith(endpoint))) {
      sensitiveData = true;
    }

    // Hotels endpoints
    if (resource === "hotels") {
      if (!id) {
        if (req.method === "GET") response = await handleGetHotels(req);
      } else if (!subresource) {
        if (req.method === "GET") response = await handleGetHotelById(req, id);
      } else if (subresource === "packages") {
        if (req.method === "GET") response = await handleGetHotelPackages(req, id);
      }
    }

    // Bookings endpoints
    if (resource === "bookings") {
      sensitiveData = true;
      if (!id) {
        if (req.method === "GET") response = await handleGetBookings(req);
        if (req.method === "POST") response = await handleCreateBooking(req);
      } else if (!subresource) {
        if (req.method === "GET") response = await handleGetBooking(req, id);
      } else if (subresource === "cancel") {
        if (req.method === "POST") response = await handleCancelBooking(req, id);
      } else if (subresource === "confirm") {
        if (req.method === "POST") response = await handleConfirmBooking(req, id);
      }
    }

    // Profile endpoints
    if (resource === "profile") {
      sensitiveData = true;
      if (req.method === "GET") response = await handleGetProfile(req);
      if (req.method === "PUT") response = await handleUpdateProfile(req);
    }

    // Free nights endpoints
    if (resource === "free-nights") {
      sensitiveData = true;
      if (!id) {
        if (req.method === "GET") response = await handleGetFreeNights(req);
        if (req.method === "POST") response = await handleRedeemFreeNights(req);
      }
    }

    // Code validation and generation endpoints
    if (resource === "codes") {
      sensitiveData = true;
      if (id === "validate") {
        if (req.method === "GET") response = await handleValidateCode(req);
      } else if (id === "generate") {
        if (req.method === "POST") response = await handleGenerateCode(req);
      }
    }

    // Hotel referral endpoints
    if (resource === "hotel-referrals") {
      sensitiveData = true;
      if (req.method === "POST") response = await handleCreateHotelReferral(req);
    }

    if (!response) {
      response = notFound();
    }

    // Audit logging
    const responseTime = Date.now() - startTime;
    await auditLog(url.pathname, req.method, userId, ip, response.status, responseTime, sensitiveData);

    return response;

  } catch (error) {
    console.error("API v2 Error:", error);
    const responseTime = Date.now() - startTime;
    
    // Log error
    await auditLog(url.pathname, req.method, userId, ip, 500, responseTime, false);
    
    if (error instanceof Response) {
      return error;
    }
    
    response = error(
      "INTERNAL_SERVER_ERROR", 
      loc(
        "Internal server error",
        "Error interno del servidor",
        "Erro interno do servidor", 
        "Eroare internă de server"
      ),
      500
    );
    
    return response;
  }
});
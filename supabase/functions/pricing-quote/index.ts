// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limit per IP (best-effort; instances are ephemeral)
const RATE_LIMIT_WINDOW_MS = 60_000; // 60s
const RATE_LIMIT_MAX = 60; // 60 req/min/IP
const rateMap = new Map<string, { count: number; start: number }>();

function getIp(req: Request) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf;
  return "anon";
}

function lm(key: string) {
  const dict: Record<string, Record<string, string>> = {
    MISSING_PACKAGE_ID: {
      en: "Missing package_id",
      es: "Falta el parámetro package_id",
      pt: "Falta o parâmetro package_id",
      ro: "Lipsește parametrul package_id",
    },
    RATE_LIMIT: {
      en: "Rate limit exceeded. Try again later.",
      es: "Límite de solicitudes excedido. Intenta más tarde.",
      pt: "Limite de solicitações excedido. Tente novamente mais tarde.",
      ro: "Limita de solicitări a fost depășită. Încercați mai târziu.",
    },
    NOT_AVAILABLE: {
      en: "Package not available for sale",
      es: "Paquete no disponible para la venta",
      pt: "Pacote indisponível para venda",
      ro: "Pachet indisponibil pentru vânzare",
    },
    UNKNOWN: {
      en: "Unknown error",
      es: "Error desconocido",
      pt: "Erro desconhecido",
      ro: "Eroare necunoscută",
    },
  };
  return dict[key] ?? dict.UNKNOWN;
}

async function etagFor(body: string): Promise<string> {
  const data = new TextEncoder().encode(body);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const hex = Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `W/"${hex}"`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limit
  const ip = getIp(req);
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW_MS) {
    rateMap.set(ip, { count: 1, start: now });
  } else {
    entry.count += 1;
    if (entry.count > RATE_LIMIT_MAX) {
      const body = JSON.stringify({
        success: false,
        error: { code: "RATE_LIMIT", message: lm("RATE_LIMIT") },
        timestamp: new Date().toISOString(),
      });
      return new Response(body, {
        status: 429,
        headers: { "Content-Type": "application/json", ...corsHeaders, "Cache-Control": "no-store" },
      });
    }
  }

  const url = new URL(req.url);
  const packageId = url.searchParams.get("package_id");

  if (!packageId) {
    const body = JSON.stringify({
      success: false,
      error: { code: "VALIDATION_ERROR", message: lm("MISSING_PACKAGE_ID") },
      timestamp: new Date().toISOString(),
    });
    return new Response(body, { headers: { "Content-Type": "application/json", ...corsHeaders }, status: 400 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // Fetch package
    const { data: pkg, error: pkgErr } = await supabase
      .from("availability_packages")
      .select("id, duration_days, current_price_usd, occupancy_mode, available_rooms, hotel_id")
      .eq("id", packageId)
      .maybeSingle();

    if (pkgErr) throw pkgErr;
    if (!pkg) {
      const body = JSON.stringify({
        success: false,
        error: { code: "RESOURCE_NOT_FOUND", message: lm("NOT_AVAILABLE") },
        timestamp: new Date().toISOString(),
      });
      return new Response(body, { headers: { "Content-Type": "application/json", ...corsHeaders }, status: 404 });
    }

    // Only sellable if approved hotel and rooms available
    const { data: hotel, error: hotelErr } = await supabase
      .from("hotels")
      .select("status")
      .eq("id", pkg.hotel_id)
      .maybeSingle();

    if (hotelErr) throw hotelErr;

    const sellable = hotel?.status === "approved" && (pkg.available_rooms ?? 0) > 0;
    if (!sellable) {
      const body = JSON.stringify({
        success: false,
        error: { code: "RESOURCE_NOT_FOUND", message: lm("NOT_AVAILABLE") },
        timestamp: new Date().toISOString(),
      });
      return new Response(body, { headers: { "Content-Type": "application/json", ...corsHeaders }, status: 404 });
    }

    const duration_days = pkg.duration_days as number;
    const per_room_total_usd = pkg.current_price_usd as number;
    const occupancy = pkg.occupancy_mode === "double" ? 2 : 1;

    const per_person_total_usd = Math.ceil(per_room_total_usd / occupancy);
    const per_person_per_night_usd = Math.ceil(per_person_total_usd / Math.max(1, duration_days));

    const payload = {
      success: true,
      data: {
        per_room_total_usd,
        duration_days,
        occupancy,
        per_person_total_usd,
        per_person_per_night_usd,
      },
      timestamp: new Date().toISOString(),
    };

    const body = JSON.stringify(payload);
    const etag = await etagFor(body);

    // Cache a bit to protect infra
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
        "Cache-Control": "public, max-age=60",
        ETag: etag,
      },
    });
  } catch (e: any) {
    const body = JSON.stringify({
      success: false,
      error: { code: "INTERNAL_ERROR", message: lm("UNKNOWN") },
      timestamp: new Date().toISOString(),
      details: e?.message ?? undefined,
    });
    return new Response(body, { headers: { "Content-Type": "application/json", ...corsHeaders }, status: 500 });
  }
});

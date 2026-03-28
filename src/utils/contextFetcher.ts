import { supabase } from "@/integrations/supabase/client";
import { type AvatarId } from "@/constants/avatarVoices";

interface ContextItem {
  type: 'offer' | 'testimonial' | 'example' | 'case';
  content: string;
  relevance: number;
}

// Avatar specialization keywords for scoped knowledge retrieval
const AVATAR_KEYWORDS = {
  antonio: "jubilado retirement senior mayor tercera edad",
  luisa: "social amistad compañía actividades comunidad", 
  john: "trabajo remoto digital nomad internet wifi",
  teresa: "viaje travel aventura explore ciudad nueva",
  juan: "servicio hotel práctico recepción limpieza 24h",
  ion: "alquiler libre independiente factura contrato",
  maria: "urbano ciudad ubicación transporte centro",
  martin: "hotel gestión ocupación beneficio rentabilidad"
};

export async function fetchContextForAvatar(
  avatarId: AvatarId, 
  locale: 'es' | 'en' | 'pt' | 'ro' = 'es'
): Promise<string> {
  const startTime = performance.now();
  
  try {
    console.log(`[PERFORMANCE] Starting context fetch for avatar: ${avatarId}, locale: ${locale}`);
    
    // Create a scoped query using avatar-specific keywords
    const keywords = AVATAR_KEYWORDS[avatarId] || '';
    const scopedQuery = `${keywords} Hotel Living specialization ${avatarId}`;
    
    console.log(`[SCOPED QUERY] Using scoped query: "${scopedQuery}"`);
    
    // Use the new embedding-based knowledge retrieval system for real-time, accurate responses
    const { data, error } = await supabase.functions.invoke('avatar-knowledge-embeddings', {
      body: {
        query: scopedQuery,
        avatarId,
        language: locale
      }
    });

    const fetchTime = performance.now() - startTime;
    console.log(`[PERFORMANCE] Knowledge fetch completed in ${fetchTime.toFixed(2)}ms`);

    if (error) {
      console.warn('Error fetching embedded knowledge:', error);
      return getFallbackContext(avatarId, locale);
    }

    if (data?.knowledge) {
      console.log(`[PERFORMANCE] Retrieved scoped knowledge: ${data.knowledge.substring(0, 100)}... (${data.knowledge.length} chars)`);
      return `\n\nCONTEXTO RELEVANTE ESPECIALIZADO:\n${data.knowledge}\n`;
    }

    console.log(`[PERFORMANCE] No knowledge returned, using fallback`);
    return getFallbackContext(avatarId, locale);
    
  } catch (error) {
    const errorTime = performance.now() - startTime;
    console.warn(`[PERFORMANCE] Error in context fetch after ${errorTime.toFixed(2)}ms:`, error);
    return getFallbackContext(avatarId, locale);
  }
}

// Fallback context for when embeddings are not available
function getFallbackContext(avatarId: AvatarId, locale: string): string {
  const contextItems: ContextItem[] = [];
  
  // Fallback context based on avatar type
  if (avatarId === 'antonio' || avatarId === 'luisa') {
    contextItems.push({
      type: 'offer',
      content: locale === 'es' ? 'Estancias de 2-3 meses con descuentos para jubilados en la Costa del Sol' :
               locale === 'en' ? '2-3 month stays with senior discounts on the Costa del Sol' :
               locale === 'pt' ? 'Estadias de 2-3 meses com descontos para aposentados na Costa del Sol' :
               'Șederi de 2-3 luni cu reduceri pentru pensionari pe Costa del Sol',
      relevance: 0.9
    });
  }
  
  if (avatarId === 'john' || avatarId === 'teresa') {
    contextItems.push({
      type: 'offer', 
      content: locale === 'es' ? 'Paquetes de trabajo remoto con internet de alta velocidad garantizado' :
               locale === 'en' ? 'Remote work packages with guaranteed high-speed internet' :
               locale === 'pt' ? 'Pacotes de trabalho remoto com internet de alta velocidade garantida' :
               'Pachete de lucru la distanță cu internet de mare viteză garantat',
      relevance: 0.9
    });
  }
  
  
  if (contextItems.length === 0) {
    return '';
  }
  
  const contextText = contextItems
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 3)
    .map(item => `• ${item.content}`)
    .join('\n');
  
  return `\n\nCONTEXTO ACTUAL DISPONIBLE:\n${contextText}\n`;
}
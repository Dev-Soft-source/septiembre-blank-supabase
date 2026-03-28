import { supabase } from '@/integrations/supabase/client';

const LS_KEY = 'leaders-hotel-map-v1';

export async function getLeadersHotelMap(slugs: string[]): Promise<Record<string, string>> {
  try {
    const cachedRaw = localStorage.getItem(LS_KEY);
    if (cachedRaw) {
      const parsed = JSON.parse(cachedRaw) as { map: Record<string,string>, ts: number };
      if (parsed && parsed.map) {
        // Ensure all requested slugs are mapped; otherwise regenerate
        const missing = slugs.some(s => !parsed.map[s]);
        if (!missing) return parsed.map;
      }
    }
  } catch {}

  // Fetch approved hotels to assign distinct ones
  const { data: hotels, error } = await supabase
    .from('hotels')
    .select('id')
    .eq('status', 'approved')
    .limit(Math.max(slugs.length, 20));

  if (error) {
    console.warn('Error fetching hotels for leaders map:', error);
  }

  const ids = (hotels || []).map(h => h.id);
  const map: Record<string, string> = {};
  let i = 0;
  slugs.forEach(slug => {
    if (ids[i]) {
      map[slug] = ids[i];
      i++;
    }
  });

  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ map, ts: Date.now() }));
  } catch {}

  return map;
}

export function clearLeadersHotelMap() {
  try { localStorage.removeItem(LS_KEY); } catch {}
}

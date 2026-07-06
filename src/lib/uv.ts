/**
 * UV index client — currentuvindex.com (keyless, CC BY 4.0).
 * See docs/04-DATA-SOURCES-AND-APIS.md §4. Attribute the source in-app.
 */
export interface UvNow {
  uvi: number;
  time: string;
}

interface CurrentUvResponse {
  ok: boolean;
  now?: { time: string; uvi: number };
  message?: string;
}

export async function fetchUvIndex(lat: number, lon: number): Promise<UvNow | null> {
  const url = `https://currentuvindex.com/api/v1/uvi?latitude=${lat}&longitude=${lon}`;
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    const data = (await res.json()) as CurrentUvResponse;
    if (data.ok && data.now) return { uvi: data.now.uvi, time: data.now.time };
    return null;
  } catch {
    return null;
  }
}

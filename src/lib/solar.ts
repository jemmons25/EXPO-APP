/**
 * Solar position + vitamin-D sun guidance.
 * See docs/02-SCIENCE-CONTENT.md Topic 3 and docs/04 §4–5.
 *
 * Only UVB (which tracks sun elevation) makes vitamin D, so we combine a UV index
 * with the solar elevation angle. Rules encoded: UV >= 3 and shadow shorter than
 * height (elevation > 45deg is the strong-UVB window) for meaningful synthesis.
 */

const RAD = Math.PI / 180;

/** Fractional day-of-year helpers, using the NOAA solar-position approximation. */
function toJulian(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/** Solar elevation angle (degrees above horizon) for a lat/long at a given instant. */
export function solarElevation(lat: number, lon: number, date: Date): number {
  const jd = toJulian(date);
  const n = jd - 2451545.0;
  const L = (280.46 + 0.9856474 * n) % 360; // mean longitude
  const g = ((357.528 + 0.9856003 * n) % 360) * RAD; // mean anomaly
  const lambda = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * RAD; // ecliptic longitude
  const epsilon = 23.439 * RAD; // obliquity
  const declination = Math.asin(Math.sin(epsilon) * Math.sin(lambda)); // radians

  // Equation of time (minutes)
  const eqTime =
    4 *
    (L -
      0.0057183 -
      (Math.atan2(Math.cos(epsilon) * Math.sin(lambda), Math.cos(lambda)) / RAD)) %
    360;

  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const trueSolarTime = (utcHours * 60 + eqTime + 4 * lon) % 1440;
  const hourAngle = (trueSolarTime / 4 - 180) * RAD;

  const latRad = lat * RAD;
  const elevation = Math.asin(
    Math.sin(latRad) * Math.sin(declination) +
      Math.cos(latRad) * Math.cos(declination) * Math.cos(hourAngle),
  );
  return elevation / RAD;
}

/** Peak solar elevation for the day (at solar noon), used for the sun-arc apex. */
export function peakElevationToday(lat: number, lon: number, date = new Date()): number {
  let peak = -90;
  const base = new Date(date);
  for (let h = 0; h < 24; h += 0.25) {
    const d = new Date(base);
    d.setHours(0, 0, 0, 0);
    d.setMinutes(h * 60);
    const e = solarElevation(lat, lon, d);
    if (e > peak) peak = e;
  }
  return peak;
}

export interface SunTimes {
  sunrise: Date | null;
  sunset: Date | null;
  solarNoon: Date | null;
  /** Window where elevation > 45deg (shadow shorter than height => strong UVB). */
  uvbWindowStart: Date | null;
  uvbWindowEnd: Date | null;
}

/** Compute sunrise/sunset/solar-noon and the strong-UVB window by scanning the day. */
export function sunTimes(lat: number, lon: number, date = new Date()): SunTimes {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  let sunrise: Date | null = null;
  let sunset: Date | null = null;
  let solarNoon: Date | null = null;
  let uvbWindowStart: Date | null = null;
  let uvbWindowEnd: Date | null = null;
  let peak = -90;
  let prevAbove = false;

  for (let m = 0; m <= 24 * 60; m += 2) {
    const d = new Date(start);
    d.setMinutes(m);
    const e = solarElevation(lat, lon, d);

    const above = e > 0;
    if (above && !prevAbove && !sunrise) sunrise = d;
    if (!above && prevAbove && !sunset) sunset = d;
    prevAbove = above;

    if (e > peak) {
      peak = e;
      solarNoon = d;
    }
    if (e >= 45) {
      if (!uvbWindowStart) uvbWindowStart = d;
      uvbWindowEnd = d;
    }
  }

  return { sunrise, sunset, solarNoon, uvbWindowStart, uvbWindowEnd };
}

export type Fitzpatrick = 1 | 2 | 3 | 4 | 5 | 6;

export const fitzpatrickLabels: Record<Fitzpatrick, string> = {
  1: 'Type I · Very fair, always burns',
  2: 'Type II · Fair, burns easily',
  3: 'Type III · Medium, sometimes burns',
  4: 'Type IV · Olive, rarely burns',
  5: 'Type V · Brown, very rarely burns',
  6: 'Type VI · Deeply pigmented, never burns',
};

/**
 * Recommended unprotected-sun minutes for vitamin D today, with a "don't burn" ceiling.
 * Based on Fitzpatrick skin type at UV index >= 3 (see docs/02 Topic 3):
 * Types I–II ~ up to 10 min, III–IV ~ up to 15 min, V–VI ~ up to 30 min. Scaled by UV.
 */
export interface SunAdvice {
  canSynthesize: boolean;
  recommendedMinutes: number;
  burnCeilingMinutes: number;
  reason: string;
}

export function sunAdvice(uvIndex: number, skinType: Fitzpatrick, elevation: number): SunAdvice {
  if (uvIndex < 3 || elevation < 30) {
    return {
      canSynthesize: false,
      recommendedMinutes: 0,
      burnCeilingMinutes: 0,
      reason:
        uvIndex < 3
          ? 'UV index below 3 — too low for meaningful vitamin D. Consider supplementation or wait for a higher-UV window.'
          : 'Sun is too low in the sky (little UVB reaches you). Aim for mid-day when your shadow is shorter than you are.',
    };
  }

  // Base ceiling by skin type at UV 3, then scale inversely with UV intensity.
  const baseCeiling: Record<Fitzpatrick, number> = { 1: 10, 2: 10, 3: 15, 4: 15, 5: 30, 6: 30 };
  const uvScale = 3 / uvIndex; // higher UV => shorter safe time
  const ceiling = Math.max(4, Math.round(baseCeiling[skinType] * uvScale));
  // Recommended vitamin-D dose ~ 60-70% of burn ceiling (synthesis plateaus before burn).
  const recommended = Math.max(3, Math.round(ceiling * 0.65));

  return {
    canSynthesize: true,
    recommendedMinutes: recommended,
    burnCeilingMinutes: ceiling,
    reason: `UV ${uvIndex.toFixed(
      0,
    )} with sun high enough for UVB. Expose arms/legs without sunscreen, then cover up before ${ceiling} min to avoid burning. Synthesis plateaus, so more time doesn't add vitamin D.`,
  };
}

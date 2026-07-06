/**
 * Transparent, dose- & evidence-aware clean score — see docs/03-INGREDIENT-DATABASE.md §3.
 * Unlike Yuka: NOVA processing is the biggest lever, flags are graded (not binary),
 * and whole foods are NOT penalized for being naturally fatty/caloric.
 */
import { EvidenceStrength, FlagColor } from '@/theme/colors';
import { IngredientInfo, matchIngredient } from '@/data/ingredients';

export interface ParsedIngredient {
  raw: string;
  info?: IngredientInfo;
  position: number; // index in the ingredient list (earlier = larger quantity)
}

export interface ScoreComponent {
  label: string;
  delta: number; // contribution to score (can be negative or positive)
  detail: string;
}

export interface ScoreResult {
  score: number; // 0..100
  components: ScoreComponent[];
  novaGroup?: number;
  flaggedIngredients: ParsedIngredient[];
}

export interface Nutriments {
  sugars_100g?: number;
  saturated_fat_100g?: number;
  sodium_100g?: number; // grams
  salt_100g?: number; // grams
  fiber_100g?: number;
  proteins_100g?: number;
}

/** Split a raw ingredient string into tokens, honoring nested parentheses. */
export function parseIngredientList(text: string): string[] {
  if (!text) return [];
  const tokens: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of text) {
    if (ch === '(' || ch === '[') depth++;
    if (ch === ')' || ch === ']') depth = Math.max(0, depth - 1);
    if ((ch === ',' || ch === ';') && depth === 0) {
      if (current.trim()) tokens.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) tokens.push(current.trim());
  return tokens
    .map((t) => t.replace(/^[^a-zA-Z0-9]+/, '').replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

const evidenceWeight: Record<EvidenceStrength, number> = {
  strong: 1,
  moderate: 0.75,
  emerging: 0.5,
  contested: 0.35,
};

const flagBasePenalty: Record<FlagColor, number> = {
  red: 20,
  yellow: 6,
  green: 0,
};

interface ScoreInput {
  ingredientsText?: string;
  novaGroup?: number;
  nutriments?: Nutriments;
  /** Number of additives reported (e.g. from Open Food Facts additives_tags). */
  additivesCount?: number;
  isWholeFood?: boolean;
}

export function computeScore(input: ScoreInput): ScoreResult {
  const components: ScoreComponent[] = [];
  let score = 100;

  // 1. Processing level (NOVA) — the biggest single lever.
  const nova = input.novaGroup;
  if (nova) {
    const novaPenalty = { 1: 0, 2: 5, 3: 15, 4: 35 }[nova] ?? 0;
    if (novaPenalty > 0) {
      score -= novaPenalty;
      components.push({
        label: `Processing level (NOVA ${nova})`,
        delta: -novaPenalty,
        detail:
          nova === 4
            ? 'Ultra-processed: industrial formulation with additives not used in home kitchens.'
            : nova === 3
              ? 'Processed food (whole ingredients + salt/sugar/oil).'
              : 'Minimally processed.',
      });
    } else {
      components.push({
        label: 'Whole / minimally processed (NOVA 1)',
        delta: 0,
        detail: 'Whole food — the ideal.',
      });
    }
  }

  // 2. Ingredient flags — evidence- AND dose-weighted (position in list as a dose proxy).
  const tokens = parseIngredientList(input.ingredientsText ?? '');
  const parsed: ParsedIngredient[] = tokens.map((raw, position) => ({
    raw,
    position,
    info: matchIngredient(raw),
  }));
  const flagged = parsed.filter((p) => p.info && p.info.flag !== 'green');

  for (const p of flagged) {
    const info = p.info!;
    const base = flagBasePenalty[info.flag];
    const ev = evidenceWeight[info.evidence];
    // Dose proxy: earlier in the list = more of it. First 3 ingredients hit full weight.
    const doseFactor = p.position < 3 ? 1 : p.position < 8 ? 0.7 : 0.45;
    const penalty = Math.round(base * ev * doseFactor);
    if (penalty > 0) {
      score -= penalty;
      components.push({
        label: info.name,
        delta: -penalty,
        detail: `${info.flag === 'red' ? 'Red' : 'Yellow'} flag · ${info.evidence} evidence${
          p.position >= 8 ? ' · minor ingredient' : ''
        }`,
      });
    }
  }

  // 3. Nutrient quality (whole-food aware: skip fat/sugar penalties for whole foods).
  const n = input.nutriments;
  if (n && !input.isWholeFood) {
    if (typeof n.sugars_100g === 'number' && n.sugars_100g > 5) {
      const p = Math.min(15, Math.round((n.sugars_100g - 5) * 0.6));
      if (p > 0) {
        score -= p;
        components.push({ label: 'Added/total sugar', delta: -p, detail: `${n.sugars_100g.toFixed(1)} g / 100 g` });
      }
    }
    const saltG = n.salt_100g ?? (typeof n.sodium_100g === 'number' ? n.sodium_100g * 2.5 : undefined);
    if (typeof saltG === 'number' && saltG > 1.2) {
      const p = Math.min(12, Math.round((saltG - 1.2) * 6));
      if (p > 0) {
        score -= p;
        components.push({ label: 'Sodium', delta: -p, detail: `~${saltG.toFixed(1)} g salt / 100 g` });
      }
    }
    if (typeof n.fiber_100g === 'number' && n.fiber_100g >= 5) {
      score += 4;
      components.push({ label: 'High fiber', delta: +4, detail: `${n.fiber_100g.toFixed(1)} g / 100 g` });
    }
    if (typeof n.proteins_100g === 'number' && n.proteins_100g >= 10) {
      score += 3;
      components.push({ label: 'Good protein', delta: +3, detail: `${n.proteins_100g.toFixed(1)} g / 100 g` });
    }
  }

  // 4. Additive load (stacking penalty for many cosmetic/industrial additives).
  const additiveCount = input.additivesCount ?? flagged.filter((f) => f.info?.upfMarker).length;
  if (additiveCount >= 3) {
    const p = Math.min(10, (additiveCount - 2) * 2);
    score -= p;
    components.push({ label: 'Many additives', delta: -p, detail: `${additiveCount} additives detected` });
  }

  // 5. Bonuses: short, recognizable ingredient list.
  const knownCount = parsed.filter((p) => p.info || p.raw.split(' ').length <= 2).length;
  if (tokens.length > 0 && tokens.length <= 5 && flagged.length === 0) {
    score += 5;
    components.push({ label: 'Short, clean ingredient list', delta: +5, detail: `${tokens.length} recognizable ingredients` });
  }
  void knownCount;

  score = Math.max(0, Math.min(100, Math.round(score)));

  return { score, components, novaGroup: nova, flaggedIngredients: flagged };
}

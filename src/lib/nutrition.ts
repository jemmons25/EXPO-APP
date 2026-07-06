/**
 * Protein & amino-acid targets — see docs/02-SCIENCE-CONTENT.md Topic 5.
 * Leucine (~2.5-3 g/meal, ~20-40 g quality protein) is taught as a useful
 * heuristic, not an iron law; older adults need more (anabolic resistance).
 */
import { Goal, Sex } from './storage';

export interface ProteinTarget {
  dailyGrams: number;
  perMealGrams: number;
  gPerKg: number;
  meals: number;
  note: string;
}

export function proteinTarget(
  weightKg: number,
  age: number,
  goals: Goal[],
  _sex: Sex,
): ProteinTarget {
  // Base multiplier: general health ~1.2, muscle/longevity higher, older adults higher.
  let gPerKg = 1.2;
  if (goals.includes('muscle')) gPerKg = 1.8;
  else if (goals.includes('longevity') || goals.includes('hormones')) gPerKg = 1.6;
  if (age >= 60) gPerKg = Math.max(gPerKg, 1.5); // anabolic resistance

  const dailyGrams = Math.round(weightKg * gPerKg);
  const meals = 3;
  // Per-meal target crosses the leucine threshold (~2.5-3 g leucine ~ 30-40 g protein).
  const perMealGrams = Math.max(25, Math.min(45, Math.round(dailyGrams / meals)));

  const note =
    age >= 60
      ? 'Older adults face anabolic resistance — aim for ~3 g leucine (~35-40 g protein) per meal.'
      : 'Each meal needs ~2.5-3 g leucine (~25-40 g quality protein) to fully trigger muscle protein synthesis.';

  return { dailyGrams, perMealGrams, gPerKg, meals, note };
}

/** Leucine content anchors (g leucine) for common foods — docs/02 Topic 5. */
export const leucineAnchors: { food: string; protein: number; leucine: number }[] = [
  { food: '4 oz steak', protein: 30, leucine: 3.4 },
  { food: '1 cup cottage cheese', protein: 24, leucine: 2.9 },
  { food: '4 oz ground beef', protein: 22, leucine: 2.5 },
  { food: '4 oz pork chop', protein: 27, leucine: 2.5 },
  { food: '3 oz chicken breast', protein: 26, leucine: 2.4 },
  { food: '1 cup Greek yogurt', protein: 23, leucine: 2.3 },
  { food: '2 eggs', protein: 12, leucine: 1.2 },
  { food: '1 scoop whey', protein: 25, leucine: 2.7 },
];

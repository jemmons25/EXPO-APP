/**
 * Open Food Facts client (API v3) — see docs/04-DATA-SOURCES-AND-APIS.md §1.
 * A unique User-Agent is required. Data is OdBL: attribute OFF in-app.
 */
import { computeScore, Nutriments, ParsedIngredient, ScoreComponent } from './scoring';
import { parseIngredientList } from './scoring';
import { matchIngredient } from '@/data/ingredients';

const BASE = 'https://world.openfoodfacts.org/api/v3';
const USER_AGENT = 'TrueHealth/1.0 (contact@truehealth.app)';
const FIELDS = 'product_name,brands,ingredients_text,nova_group,nutriments,additives_tags,nutrition_grades,image_front_small_url';

export interface ScannedProduct {
  barcode: string;
  name: string;
  brand?: string;
  imageUrl?: string;
  novaGroup?: number;
  ingredientsText?: string;
  nutriments?: Nutriments;
  additivesCount: number;
  score: number;
  scoreComponents: ScoreComponent[];
  flaggedIngredients: ParsedIngredient[];
  allIngredients: ParsedIngredient[];
  found: boolean;
}

interface OffNutriments {
  sugars_100g?: number;
  'saturated-fat_100g'?: number;
  sodium_100g?: number;
  salt_100g?: number;
  fiber_100g?: number;
  proteins_100g?: number;
}

interface OffProduct {
  product_name?: string;
  brands?: string;
  ingredients_text?: string;
  nova_group?: number;
  nutriments?: OffNutriments;
  additives_tags?: string[];
  image_front_small_url?: string;
}

interface OffResponse {
  product?: OffProduct;
  status?: number;
  status_verbose?: string;
}

function normalizeNutriments(n?: OffNutriments): Nutriments | undefined {
  if (!n) return undefined;
  return {
    sugars_100g: n.sugars_100g,
    saturated_fat_100g: n['saturated-fat_100g'],
    sodium_100g: n.sodium_100g,
    salt_100g: n.salt_100g,
    fiber_100g: n.fiber_100g,
    proteins_100g: n.proteins_100g,
  };
}

export async function fetchProduct(barcode: string): Promise<ScannedProduct> {
  const url = `${BASE}/product/${encodeURIComponent(barcode)}?fields=${FIELDS}`;
  let data: OffResponse | undefined;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' } });
    data = (await res.json()) as OffResponse;
  } catch {
    data = undefined;
  }

  const p = data?.product;
  if (!p || (data?.status !== 1 && !p.product_name && !p.ingredients_text)) {
    return {
      barcode,
      name: 'Product not found',
      additivesCount: 0,
      score: 0,
      scoreComponents: [],
      flaggedIngredients: [],
      allIngredients: [],
      found: false,
    };
  }

  const nutriments = normalizeNutriments(p.nutriments);
  const additivesCount = p.additives_tags?.length ?? 0;
  const result = computeScore({
    ingredientsText: p.ingredients_text,
    novaGroup: p.nova_group,
    nutriments,
    additivesCount,
  });

  const allIngredients: ParsedIngredient[] = parseIngredientList(p.ingredients_text ?? '').map(
    (raw, position) => ({ raw, position, info: matchIngredient(raw) }),
  );

  return {
    barcode,
    name: p.product_name || 'Unnamed product',
    brand: p.brands?.split(',')[0]?.trim(),
    imageUrl: p.image_front_small_url,
    novaGroup: p.nova_group,
    ingredientsText: p.ingredients_text,
    nutriments,
    additivesCount,
    score: result.score,
    scoreComponents: result.components,
    flaggedIngredients: result.flaggedIngredients,
    allIngredients,
    found: true,
  };
}

/** Score a manually-entered / OCR'd ingredient list with no barcode. */
export function scoreIngredientText(name: string, text: string): ScannedProduct {
  const result = computeScore({ ingredientsText: text, novaGroup: undefined });
  const allIngredients: ParsedIngredient[] = parseIngredientList(text).map((raw, position) => ({
    raw,
    position,
    info: matchIngredient(raw),
  }));
  return {
    barcode: `manual-${Date.now()}`,
    name: name || 'Label scan',
    additivesCount: result.flaggedIngredients.filter((f) => f.info?.upfMarker).length,
    score: result.score,
    scoreComponents: result.components,
    flaggedIngredients: result.flaggedIngredients,
    allIngredients,
    found: true,
  };
}

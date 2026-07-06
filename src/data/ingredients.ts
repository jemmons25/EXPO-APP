/**
 * Ingredient-risk catalog — see docs/03-INGREDIENT-DATABASE.md.
 * Dose- and evidence-aware. Flags are honest: e.g. seed oils are a
 * ultra-processing MARKER (yellow), not a toxin (never red).
 */
import { EvidenceStrength, FlagColor } from '@/theme/colors';

export type IngredientCategory =
  | 'color'
  | 'preservative'
  | 'emulsifier'
  | 'sweetener'
  | 'sugar'
  | 'oil'
  | 'flavor'
  | 'thickener'
  | 'flour_agent'
  | 'whole_food'
  | 'other';

export interface RegulatoryStatus {
  jurisdiction: 'US_FDA' | 'US_CA' | 'EU' | 'UK' | 'CANADA' | 'WHO';
  status:
    | 'allowed'
    | 'allowed_limited'
    | 'banned'
    | 'under_review'
    | 'warning_label'
    | 'voluntary_phaseout';
  detail?: string;
}

export interface Citation {
  title: string;
  publisher?: string;
  studyType?: string;
  url: string;
}

export interface IngredientInfo {
  id: string;
  name: string;
  eNumber?: string;
  aliases: string[];
  category: IngredientCategory;
  flag: FlagColor;
  evidence: EvidenceStrength;
  /** Presence implies ultra-processing (NOVA 4). */
  upfMarker: boolean;
  whatItIs: string;
  whatItDoes: string;
  concern?: string;
  doseContext?: string;
  regulatory?: RegulatoryStatus[];
  citations?: Citation[];
}

export const INGREDIENTS: IngredientInfo[] = [
  // ---------- Colors / dyes ----------
  {
    id: 'titanium-dioxide',
    name: 'Titanium dioxide',
    eNumber: 'E171',
    aliases: ['titanium dioxide', 'ci 77891', 'color added', 'colour: white'],
    category: 'color',
    flag: 'red',
    evidence: 'contested',
    upfMarker: true,
    whatItIs: 'A white pigment used to brighten candy coatings, gum, frosting, and some supplements.',
    whatItDoes:
      'Not a nutrient — purely cosmetic. The concern is that nanoscale particles may be genotoxic (able to damage DNA); the EU could not establish a safe dose.',
    concern: 'Possible nanoparticle genotoxicity; the EU could not set a safe level.',
    doseContext:
      'Contested: the EU banned it in 2022 under the precautionary principle, while a 2023 WHO/JECFA review called food use safe. We flag it but show both sides.',
    regulatory: [
      { jurisdiction: 'EU', status: 'banned', detail: 'Banned in food since 2022' },
      { jurisdiction: 'US_FDA', status: 'allowed_limited', detail: 'Allowed up to 1% by weight; petition under review' },
      { jurisdiction: 'US_CA', status: 'banned', detail: 'Banned via AB 2316 (effective 2027)' },
      { jurisdiction: 'WHO', status: 'allowed', detail: 'JECFA 2023 concluded food use is safe' },
    ],
    citations: [
      { title: 'EFSA opinion on titanium dioxide (E171)', publisher: 'EFSA', studyType: 'review', url: 'https://www.efsa.europa.eu/en/news/titanium-dioxide-e171-no-longer-considered-safe-when-used-food-additive' },
    ],
  },
  {
    id: 'red-3',
    name: 'Red Dye No. 3',
    eNumber: 'E127',
    aliases: ['red 3', 'red dye 3', 'erythrosine', 'fd&c red no. 3', 'red no. 3'],
    category: 'color',
    flag: 'red',
    evidence: 'moderate',
    upfMarker: true,
    whatItIs: 'A synthetic cherry-red dye used in candy, drinks, and some medications.',
    whatItDoes: 'Purely cosmetic color. Caused cancer in animal studies, which led the FDA to revoke its authorization.',
    concern: 'Carcinogenic in animal studies.',
    doseContext: 'FDA revoked authorization Jan 2025; manufacturers must phase it out by Jan 2027.',
    regulatory: [
      { jurisdiction: 'US_FDA', status: 'voluntary_phaseout', detail: 'Authorization revoked 2025; phase-out by 2027' },
      { jurisdiction: 'EU', status: 'allowed_limited', detail: 'Restricted to specific uses' },
    ],
  },
  {
    id: 'red-40',
    name: 'Red 40 (Allura Red)',
    eNumber: 'E129',
    aliases: ['red 40', 'allura red', 'fd&c red no. 40', 'red no. 40'],
    category: 'color',
    flag: 'yellow',
    evidence: 'contested',
    upfMarker: true,
    whatItIs: 'The most common synthetic red dye in the US — candy, cereal, drinks, snacks.',
    whatItDoes: 'Cosmetic color. Some studies link artificial dyes to hyperactivity in sensitive children (the McCann study); regulators dispute the strength.',
    concern: 'Possible hyperactivity signal in some children.',
    doseContext: 'Contested. The EU requires a warning label; the US allows it without one.',
    regulatory: [
      { jurisdiction: 'EU', status: 'warning_label', detail: 'Requires "may affect activity in children" label' },
      { jurisdiction: 'US_FDA', status: 'allowed' },
    ],
  },
  {
    id: 'yellow-5',
    name: 'Yellow 5 (Tartrazine)',
    eNumber: 'E102',
    aliases: ['yellow 5', 'tartrazine', 'fd&c yellow no. 5', 'yellow no. 5'],
    category: 'color',
    flag: 'yellow',
    evidence: 'contested',
    upfMarker: true,
    whatItIs: 'A synthetic lemon-yellow dye.',
    whatItDoes: 'Cosmetic color. Part of the artificial-dye/behavior debate; some people report sensitivity.',
    doseContext: 'Contested; EU warning label required.',
    regulatory: [
      { jurisdiction: 'EU', status: 'warning_label' },
      { jurisdiction: 'US_FDA', status: 'allowed' },
    ],
  },

  // ---------- Flour / bread agents ----------
  {
    id: 'potassium-bromate',
    name: 'Potassium bromate',
    eNumber: 'E924',
    aliases: ['potassium bromate', 'bromated flour'],
    category: 'flour_agent',
    flag: 'red',
    evidence: 'moderate',
    upfMarker: true,
    whatItIs: 'A flour-strengthening agent that helps bread rise higher.',
    whatItDoes: 'Classified a possible human carcinogen (IARC Group 2B). Most should convert during baking, but residues can remain.',
    concern: 'Possible carcinogen (IARC 2B).',
    doseContext: 'Banned across the EU, UK, Canada and more. FDA has asked bakers to stop voluntarily since 1991 but never banned it; California bans it (2027).',
    regulatory: [
      { jurisdiction: 'EU', status: 'banned' },
      { jurisdiction: 'CANADA', status: 'banned' },
      { jurisdiction: 'US_FDA', status: 'voluntary_phaseout', detail: 'FDA voluntary-avoid since 1991; not banned' },
      { jurisdiction: 'US_CA', status: 'banned', detail: 'Effective 2027' },
    ],
  },
  {
    id: 'azodicarbonamide',
    name: 'Azodicarbonamide (ADA)',
    eNumber: 'E927a',
    aliases: ['azodicarbonamide', 'ada'],
    category: 'flour_agent',
    flag: 'yellow',
    evidence: 'emerging',
    upfMarker: true,
    whatItIs: 'A dough conditioner and bleaching agent (also used industrially in foamed plastics — the "yoga mat" chemical).',
    whatItDoes: 'Breaks down during baking; some degradation products (semicarbazide, urethane) are questioned.',
    doseContext: 'Banned in the EU; allowed in the US.',
    regulatory: [
      { jurisdiction: 'EU', status: 'banned' },
      { jurisdiction: 'US_FDA', status: 'allowed_limited' },
    ],
  },

  // ---------- Emulsifiers / thickeners ----------
  {
    id: 'polysorbate-80',
    name: 'Polysorbate 80',
    eNumber: 'E433',
    aliases: ['polysorbate 80', 'polyoxyethylene sorbitan monooleate'],
    category: 'emulsifier',
    flag: 'yellow',
    evidence: 'emerging',
    upfMarker: true,
    whatItIs: 'A synthetic emulsifier that keeps oil and water mixed in processed foods.',
    whatItDoes: 'Emerging research (animal + in-vitro/pilot human) suggests some emulsifiers can thin the gut mucus layer and reduce microbial diversity, nudging low-grade inflammation.',
    concern: 'Possible gut-barrier / microbiome disruption.',
    doseContext: 'Emerging evidence, additive- and dose-specific; not settled in humans.',
  },
  {
    id: 'cmc',
    name: 'Carboxymethylcellulose (CMC)',
    eNumber: 'E466',
    aliases: ['carboxymethylcellulose', 'cellulose gum', 'cmc', 'sodium carboxymethyl cellulose'],
    category: 'emulsifier',
    flag: 'yellow',
    evidence: 'emerging',
    upfMarker: true,
    whatItIs: 'A thickener/stabilizer (cellulose gum) common in ice cream, dressings, and baked goods.',
    whatItDoes: 'A small human trial plus animal data suggest it can alter the microbiome and gut barrier in some people.',
    concern: 'Possible gut-barrier / microbiome disruption.',
    doseContext: 'Emerging; effects appear variable between people.',
  },
  {
    id: 'carrageenan',
    name: 'Carrageenan',
    eNumber: 'E407',
    aliases: ['carrageenan'],
    category: 'thickener',
    flag: 'yellow',
    evidence: 'contested',
    upfMarker: true,
    whatItIs: 'A seaweed-derived thickener used in plant milks, deli meats, and dairy.',
    whatItDoes: 'Food-grade carrageenan is widely used; a degraded form (poligeenan) is inflammatory. Whether food-grade harms the gut is debated.',
    doseContext: 'Contested — evidence differs between degraded and food-grade forms.',
  },

  // ---------- Sugars / sweeteners ----------
  {
    id: 'hfcs',
    name: 'High-fructose corn syrup',
    aliases: ['high fructose corn syrup', 'hfcs', 'high-fructose corn syrup', 'corn syrup high fructose'],
    category: 'sugar',
    flag: 'yellow',
    evidence: 'moderate',
    upfMarker: true,
    whatItIs: 'A liquid sweetener high in fructose, ubiquitous in sodas and processed foods.',
    whatItDoes: 'Fructose is processed almost entirely by your liver, insulin-independently. In large/liquid amounts it drives fat production in the liver (de novo lipogenesis) and raises uric acid.',
    concern: 'High liquid-fructose intake is linked to fatty liver and insulin resistance.',
    doseContext: 'A dose story: the concern is large amounts of liquid/added fructose, not whole fruit.',
    citations: [
      { title: 'Divergent effects of glucose and fructose on hepatic lipogenesis', publisher: 'JCI', studyType: 'mechanistic', url: 'https://www.jci.org/articles/view/94585' },
    ],
  },
  {
    id: 'added-sugar',
    name: 'Added sugar (sucrose)',
    aliases: ['sugar', 'sucrose', 'cane sugar', 'invert sugar', 'dextrose', 'glucose syrup'],
    category: 'sugar',
    flag: 'yellow',
    evidence: 'moderate',
    upfMarker: false,
    whatItIs: 'Refined sugar added during manufacturing.',
    whatItDoes: 'Half glucose (raises blood sugar/insulin), half fructose (liver). Fine in small amounts; problematic in the large doses typical of processed food.',
    doseContext: 'Graduated by amount — a little is fine; the penalty scales with quantity.',
  },
  {
    id: 'aspartame',
    name: 'Aspartame',
    eNumber: 'E951',
    aliases: ['aspartame'],
    category: 'sweetener',
    flag: 'yellow',
    evidence: 'contested',
    upfMarker: true,
    whatItIs: 'A low-calorie artificial sweetener.',
    whatItDoes: 'Provides sweetness without sugar. IARC classified it "possibly carcinogenic" (2B) in 2023, while food regulators maintain it is safe within the acceptable daily intake.',
    doseContext: 'Contested — IARC 2B vs. regulator ADI. We show both.',
    regulatory: [
      { jurisdiction: 'WHO', status: 'under_review', detail: 'IARC Group 2B (2023); JECFA kept ADI' },
      { jurisdiction: 'US_FDA', status: 'allowed' },
    ],
  },
  {
    id: 'sucralose',
    name: 'Sucralose',
    eNumber: 'E955',
    aliases: ['sucralose'],
    category: 'sweetener',
    flag: 'yellow',
    evidence: 'emerging',
    upfMarker: true,
    whatItIs: 'A zero-calorie artificial sweetener (~600× sweeter than sugar).',
    whatItDoes: 'Emerging, mixed signals about effects on the microbiome and glucose response.',
    doseContext: 'Emerging; evidence is mixed.',
  },

  // ---------- Fats / oils ----------
  {
    id: 'trans-fat',
    name: 'Partially hydrogenated oil (trans fat)',
    aliases: ['partially hydrogenated', 'hydrogenated oil', 'trans fat'],
    category: 'oil',
    flag: 'red',
    evidence: 'strong',
    upfMarker: true,
    whatItIs: 'Industrial trans fat created by partially hydrogenating oil.',
    whatItDoes: 'Strongly raises heart-disease risk. Largely phased out, but still worth avoiding entirely.',
    concern: 'Artificial trans fat clearly increases cardiovascular risk.',
    doseContext: 'One of the few "avoid entirely" ingredients — evidence is strong.',
  },
  {
    id: 'seed-oil',
    name: 'Seed / vegetable oil',
    aliases: [
      'vegetable oil',
      'canola oil',
      'soybean oil',
      'sunflower oil',
      'corn oil',
      'cottonseed oil',
      'safflower oil',
      'rapeseed oil',
      'grapeseed oil',
    ],
    category: 'oil',
    flag: 'yellow',
    evidence: 'contested',
    upfMarker: true,
    whatItIs: 'Oils high in the omega-6 fat linoleic acid (canola, soybean, sunflower, corn, etc.).',
    whatItDoes:
      'Contrary to popular claims, the weight of human evidence links linoleic acid to LOWER heart-disease and diabetes risk, and it does not reliably raise inflammation. We flag it as an ultra-processing marker (it is everywhere in processed food), not as a toxin.',
    concern:
      'Not the oil itself — the real, better-supported concerns are ultra-processing and repeatedly-heated/oxidized frying oil.',
    doseContext:
      'Contested in public, but published evidence is neutral-to-beneficial. Flagged yellow only because its presence usually signals a processed product. Do not treat as toxic.',
    citations: [
      { title: 'Concerns about seed oils are without scientific foundation (scoping review)', publisher: 'Crit Rev Food Sci Nutr 2026', studyType: 'review', url: 'https://www.tandfonline.com/doi/full/10.1080/10408398.2026.2657527' },
      { title: 'The Evidence Behind Seed Oils\u2019 Health Effects', publisher: 'Johns Hopkins Bloomberg SPH', url: 'https://publichealth.jhu.edu/2025/the-evidence-behind-seed-oils-health-effects' },
    ],
  },

  // ---------- Preservatives ----------
  {
    id: 'sodium-nitrite',
    name: 'Sodium nitrite',
    eNumber: 'E250',
    aliases: ['sodium nitrite', 'sodium nitrate', 'e250'],
    category: 'preservative',
    flag: 'yellow',
    evidence: 'moderate',
    upfMarker: true,
    whatItIs: 'A curing/preserving agent that keeps processed meats pink and inhibits botulism.',
    whatItDoes: 'Can form nitrosamines under heat; processed-meat intake is associated with colorectal cancer risk.',
    concern: 'Nitrosamine formation; processed-meat/cancer association.',
    doseContext: 'The association is with processed meat generally; effect size is modest but consistent.',
  },
  {
    id: 'bha-bht',
    name: 'BHA / BHT',
    eNumber: 'E320',
    aliases: ['bha', 'bht', 'butylated hydroxyanisole', 'butylated hydroxytoluene'],
    category: 'preservative',
    flag: 'yellow',
    evidence: 'emerging',
    upfMarker: true,
    whatItIs: 'Synthetic antioxidants that stop fats from going rancid.',
    whatItDoes: 'Some animal studies raise carcinogenicity questions at high doses; human relevance is unclear.',
    doseContext: 'Emerging; concern is mostly high-dose animal data.',
  },
  {
    id: 'sodium-benzoate',
    name: 'Sodium benzoate',
    eNumber: 'E211',
    aliases: ['sodium benzoate', 'benzoic acid', 'e211'],
    category: 'preservative',
    flag: 'green',
    evidence: 'moderate',
    upfMarker: false,
    whatItIs: 'A common preservative in acidic foods and drinks.',
    whatItDoes: 'Generally recognized as safe; only forms trace benzene when combined with vitamin C and heat/light.',
    doseContext: 'Low concern in normal use.',
  },
];

/** Alias → ingredient index for fast lookup. */
const ALIAS_INDEX: { alias: string; ingredient: IngredientInfo }[] = INGREDIENTS.flatMap((ing) =>
  [ing.name.toLowerCase(), ing.eNumber?.toLowerCase(), ...ing.aliases]
    .filter((a): a is string => !!a)
    .map((alias) => ({ alias, ingredient: ing })),
).sort((a, b) => b.alias.length - a.alias.length); // longest alias first for greedy match

/** Match a raw ingredient token against the catalog. Returns undefined if unknown. */
export function matchIngredient(token: string): IngredientInfo | undefined {
  const t = token.toLowerCase().trim();
  if (!t) return undefined;
  for (const { alias, ingredient } of ALIAS_INDEX) {
    if (t === alias || t.includes(alias)) return ingredient;
  }
  return undefined;
}

export function getIngredient(id: string): IngredientInfo | undefined {
  return INGREDIENTS.find((i) => i.id === id);
}

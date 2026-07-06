# Ingredient-Risk Database & Scoring Model

This is the heart of the scanner. It is deliberately **dose- and evidence-aware** to avoid Yuka's binary, dose-blind penalties.

## 1. Design principles

1. **Evidence-graded, not binary.** Every flag carries a `strength` and an honest note. A trace "contested" additive must not tank an otherwise-whole food.
2. **Processing is first-class.** NOVA level is a primary scoring input, not an afterthought — this fixes Yuka rating Chef Boyardee above 3-ingredient beef jerky.
3. **Whole-food-aware.** Do not penalize natural fat/sugar in single-ingredient whole foods.
4. **Transparent.** Every score renders a "Why this score" breakdown.
5. **Regulatory context, multi-jurisdiction.** Show US vs EU/other status so users see divergence themselves.

## 2. Schema (Postgres)

```sql
-- Canonical ingredient / additive record
CREATE TABLE ingredients (
  id                BIGSERIAL PRIMARY KEY,
  canonical_name    TEXT NOT NULL,
  e_number          TEXT,                 -- e.g. 'E171'
  aliases           TEXT[],               -- ['titanium dioxide','CI 77891','colour: white']
  category          TEXT NOT NULL,        -- 'emulsifier','color','preservative','sweetener','oil','sugar','flavor','thickener','whole_food','other'
  flag              TEXT NOT NULL,        -- 'green' | 'yellow' | 'red'
  evidence_strength TEXT NOT NULL,        -- 'strong' | 'moderate' | 'emerging' | 'contested'
  what_it_is        TEXT NOT NULL,        -- one-line plain-English
  what_it_does      TEXT NOT NULL,        -- "what it does in your body", plain-English
  concern_summary   TEXT,                 -- why flagged (null for green)
  dose_context      TEXT,                 -- dose at which concern applies / typical exposure
  is_upf_marker     BOOLEAN DEFAULT FALSE,-- presence implies ultra-processing (NOVA 4)
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- Per-jurisdiction regulatory status (drives US-vs-EU comparison UI)
CREATE TABLE ingredient_regulatory_status (
  id            BIGSERIAL PRIMARY KEY,
  ingredient_id BIGINT REFERENCES ingredients(id) ON DELETE CASCADE,
  jurisdiction  TEXT NOT NULL,   -- 'US_FDA','US_CA','EU','UK','CANADA','WHO_JECFA'
  status        TEXT NOT NULL,   -- 'allowed','allowed_limited','banned','under_review','warning_label','voluntary_phaseout'
  detail        TEXT,            -- '<=1% by weight'; 'ban effective 2027-01'; etc.
  effective_date DATE,
  source_url    TEXT
);

-- Citations, reusable across ingredients and science topics
CREATE TABLE citations (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  publisher   TEXT,
  study_type  TEXT,        -- 'RCT','meta-analysis','cohort','in-vitro','animal','review','regulatory'
  sample_size INT,
  year        INT,
  url         TEXT NOT NULL,
  pubmed_id   TEXT
);
CREATE TABLE ingredient_citations (
  ingredient_id BIGINT REFERENCES ingredients(id) ON DELETE CASCADE,
  citation_id   BIGINT REFERENCES citations(id) ON DELETE CASCADE,
  PRIMARY KEY (ingredient_id, citation_id)
);

-- Cached resolved products (from Open Food Facts / USDA / OCR)
CREATE TABLE products (
  barcode         TEXT PRIMARY KEY,       -- or synthetic id for OCR-only items
  product_name    TEXT,
  brand           TEXT,
  source          TEXT,                   -- 'off','usda','ocr'
  nova_group      SMALLINT,               -- 1..4
  raw_ingredients TEXT,                   -- original ingredient string
  parsed_ingredient_ids BIGINT[],         -- resolved ingredient ids
  nutriments      JSONB,                  -- per-100g and per-serving
  clean_score     SMALLINT,               -- 0..100 (cached)
  score_breakdown JSONB,                  -- component contributions for transparency
  cached_at       TIMESTAMPTZ DEFAULT now()
);

-- Cleaner-swap suggestions
CREATE TABLE product_swaps (
  product_barcode TEXT REFERENCES products(barcode),
  swap_barcode    TEXT REFERENCES products(barcode),
  reason          TEXT,
  PRIMARY KEY (product_barcode, swap_barcode)
);
```

## 3. Clean-score model (0–100, transparent)

Compute additively, then clamp 0–100. Persist each component in `score_breakdown`.

```
base = 100

# 1. Processing (biggest lever)
NOVA 1  ->  +0
NOVA 2  ->  -5
NOVA 3  ->  -15
NOVA 4  ->  -35   (ultra-processed)

# 2. Nutrient quality (per serving, whole-food-aware)
added_sugar         : graduated penalty, weighted for fructose-heavy/liquid sugar
sodium (high)       : graduated penalty
fiber, protein      : bonuses
# DO NOT penalize natural fat/sugar in single-ingredient whole foods

# 3. Ingredient flags (evidence- AND dose-weighted; NOT binary)
red    flag : -8 to -20 each, scaled by evidence_strength and by dose/position in list
yellow flag : -2 to -6 each
green      : 0
# Trace of a 'contested' additive in an otherwise-whole food: capped small penalty

# 4. Additive load
each cosmetic/industrial-only additive (is_upf_marker): small stacking penalty

# 5. Bonuses
short recognizable ingredient list (<=5 whole-food items): +5
third-party certification (verified): +3
```

Render bands: **80–100 excellent (teal) · 60–79 good (mint) · 40–59 fair (honey) · 0–39 poor (coral)** — and *always* show the breakdown so the number is never a black box.

> Note vs Yuka: no automatic "one red additive caps you at 49." Penalties scale with evidence and dose, and whole foods aren't punished for being fatty/caloric.

## 4. Flagged-ingredient starter catalog (seed data)

Grades reflect [`02-SCIENCE-CONTENT.md`](02-SCIENCE-CONTENT.md). "Flag" is the app's color; keep notes honest.

### Colors / dyes
| Ingredient | Flag | Evidence | Note / dose context | Reg. divergence |
|---|---|---|---|---|
| Titanium dioxide (E171) | red | moderate | EU could not establish safe level (nanoparticle genotoxicity) | EU banned 2022; US allowed ≤1%; CA banned (2027); WHO/JECFA 2023 called it safe → **contested**, show both |
| Red Dye No. 3 (erythrosine) | red | moderate | Carcinogenic in animal studies; FDA revoked auth. | US phase-out by Jan 2027; long restricted elsewhere |
| Red 40 (Allura Red) | yellow | contested | Hyperactivity signal in some children (McCann study) | EU warning label; US allowed |
| Yellow 5 / Yellow 6 / Blue 1 | yellow | contested | Dye-sensitivity/behavioral debate | Warning labels/limits abroad |

### Bread / flour agents
| Ingredient | Flag | Evidence | Note | Reg. divergence |
|---|---|---|---|---|
| Potassium bromate | red | moderate | IARC 2B possible carcinogen | Banned EU/UK/Canada; FDA voluntary-avoid since 1991; CA ban 2027 |
| Azodicarbonamide (ADA) | yellow | emerging | "Yoga-mat" agent; degradation products questioned | Banned EU; allowed US |
| Propylparaben | yellow | emerging | Endocrine-activity concern | Restricted EU; CA ban 2027 |

### Emulsifiers / thickeners (gut-barrier emerging concern)
| Ingredient | Flag | Evidence | Note |
|---|---|---|---|
| Polysorbate 80 | yellow | emerging | Reduced microbial diversity / mucus thinning in models |
| Carboxymethylcellulose (CMC, E466) | yellow | emerging | Gut-barrier disruption signals (human pilot + animal) |
| Sodium stearoyl lactylate (SSL) / PGMS | yellow | emerging | Cut butyrate-producers; raised LPS in fecal models |
| Carrageenan | yellow | contested | Intestinal-inflammation debate; degraded vs food-grade |

### Sugars / sweeteners
| Ingredient | Flag | Evidence | Note |
|---|---|---|---|
| High-fructose corn syrup | yellow | moderate | Liquid fructose → hepatic DNL + uric acid at high intake (dose story) |
| Added sugar / sucrose (high amt) | yellow | moderate | Graduated by amount; distinguishes liquid vs whole-food |
| Aspartame | yellow | contested | IARC 2B (2023); regulators maintain ADI safety → show both |
| Sucralose / acesulfame-K | yellow | emerging | Microbiome/glycemic-response signals, mixed |

### Fats / oils
| Ingredient | Flag | Evidence | Note |
|---|---|---|---|
| Partially hydrogenated oils (trans fat) | red | strong | Trans fat → CVD; largely phased out but check | 
| "Vegetable/seed oils" (canola, soybean, etc.) | yellow (as **UPF marker**, not toxin) | contested | Published evidence neutral-to-beneficial; flag as ultra-processing signal + note oxidation-when-reheated concern. **Do not mark red.** See [`02`](02-SCIENCE-CONTENT.md) Topic 2 |
| Repeatedly-heated/oxidized frying oils | red | moderate | Oxidation products; context = commercial deep-fryers |

### Preservatives (examples)
| Ingredient | Flag | Evidence | Note |
|---|---|---|---|
| BHA / BHT | yellow | emerging | Animal-carcinogenicity questions at high dose |
| Sodium nitrite (cured meats) | yellow | moderate | Nitrosamine formation; processed-meat/CRC association |
| Sodium benzoate | green/yellow | moderate | Generally fine; benzene formation only with vitamin C + heat |

> **Green examples** (no penalty): water, sea salt, olive oil, single whole-food ingredients (beef, oats, spinach), spices, vinegar, cultures.

## 5. Ingredient parsing & matching pipeline

1. Get `raw_ingredients` from Open Food Facts, else OCR the label.
2. Normalize: lowercase, strip percentages/parentheticals, split on commas honoring nested parens.
3. Match each token against `canonical_name` + `aliases` + `e_number` (fuzzy + synonym table). Map E-numbers ↔ names.
4. Unmatched tokens → "unknown ingredient" (neutral, queued for review) — never guess a flag.
5. Compute score; cache in `products`.

## 6. Data governance

- Ingredient risk classifications are **reviewed by a qualified nutrition/tox reviewer** before publishing (mirror Yuka's human-in-the-loop, avoid pure-AI mislabeling).
- Every flag must have ≥1 citation for `red`, and honest "emerging/contested" labeling where the science isn't settled.
- Versioned: keep `updated_at`; surface "last reviewed" date in-app.

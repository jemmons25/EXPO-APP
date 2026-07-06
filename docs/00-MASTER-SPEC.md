# TrueHealth — Master Product Spec

> A science-backed health-optimization app. Scan food and learn what's really in it, find clean/whole-food sources near you, and get personalized daily protocols for sun, sleep, protein, and hormone support — every recommendation graded by evidence quality, with mainstream (CDC/FDA/USDA) guidance and newer research shown side-by-side.

This document is the top-level spec. It links out to the detailed reference docs. Everything here was researched against primary sources; see [`docs/07-RESEARCH-SOURCES.md`](07-RESEARCH-SOURCES.md) for the full citation list.

---

## 1. Positioning & why this exists

The category leader is **Yuka** (~60M users, 20M+ in the US). It scans a barcode and returns a 0–100 score built from **60% nutrition (Nutri-Score), 30% additives, 10% organic bonus**. Its documented weaknesses are the exact gaps TrueHealth fills:

| Yuka weakness (documented) | TrueHealth's answer |
|---|---|
| Scores a food in isolation on a per-100g basis; ignores portion, frequency, and the rest of your diet | Context-aware scoring: portion-adjusted, and factored into the user's daily/weekly pattern |
| Additive penalties are binary and dose-blind (one "red" additive caps the score at 49) | Dose- and evidence-aware flags; every flag shows evidence strength and typical exposure |
| Conflates "low in bad stuff" with "healthy" — dings whole foods like nuts, cheese, grass-fed jerky; rates Chef Boyardee above clean beef jerky | Whole-food-aware model; NOVA processing level is a first-class input, not just nutrient math |
| Opaque: users can't see why | Fully transparent scoring breakdown on every result |
| No action layer — tells you "no" but not "what instead / where" | Cleaner-swap suggestions + **Real Food Finder** map to actually buy better |
| Purely informational | A daily-use tool: protocols, tracking, reminders, streaks |

**One-line pitch:** *Yuka tells you a number. TrueHealth tells you the truth, the evidence behind it, and where to go do better.*

**Design north star:** the UI is the retention moat. See [`docs/05-DESIGN-SYSTEM.md`](05-DESIGN-SYSTEM.md). Build the animated component library first so all six features feel like one app.

---

## 2. The six core features

| # | Feature | One-liner | Detail doc |
|---|---|---|---|
| 1 | **Ingredient Scanner** (flagship) | Scan a barcode or photograph a label → clean score + per-ingredient red/yellow/green flags + plain-English "what it does in your body" + cleaner swaps | [`04-DATA-SOURCES-AND-APIS.md`](04-DATA-SOURCES-AND-APIS.md), [`03-INGREDIENT-DATABASE.md`](03-INGREDIENT-DATABASE.md) |
| 2 | **Real Food Finder** (map) | Farmers markets, farms, CSAs, raw-milk sources (with state legality), pastured eggs, grass-fed beef, wild-caught fish, clean grocers | [`04-DATA-SOURCES-AND-APIS.md`](04-DATA-SOURCES-AND-APIS.md) |
| 3 | **Daily Protocol Engine** | Personalized sun minutes, morning-light timing, protein/amino targets, sleep & movement, hormone-support modules | [`02-SCIENCE-CONTENT.md`](02-SCIENCE-CONTENT.md) |
| 4 | **Food & Symptom Log** | Fast logging (scan/photo/voice); correlate diet with energy, sleep, digestion, skin, mood over time | this doc §4.4 |
| 5 | **Health News & Trends Feed** | Curated studies/recalls/trends, each with a "hype check" (headline vs. what the study actually showed) | this doc §4.5 |
| 6 | **Learn Hub** | Layered explainers (30-sec → 5-min → full citations) on the core science topics | [`02-SCIENCE-CONTENT.md`](02-SCIENCE-CONTENT.md) |

### 4.1 Ingredient Scanner (flagship — build this first after the design system)

**Flow:** Tap scan → camera (shared-element expand) → barcode or label photo → resolve product → result card springs up → animated clean-score ring counts up → ingredient rows cascade in with flags → tap any row to expand its explanation → "cleaner swaps" carousel at the bottom.

**Data resolution order:**
1. Barcode → **Open Food Facts API v3** (`/api/v3/product/{barcode}`), enriched with **USDA FoodData Central** for nutrients.
2. If not found or label-only → **OCR the ingredient list** (on-device text recognition) → parse → match against the ingredient-risk DB.
3. Cache every resolved product locally so repeat scans and offline history work.

**The clean score (0–100) — transparent, context-aware.** Unlike Yuka's fixed weights, expose every component:
- **Processing level (NOVA 1–4)** — biggest single lever. NOVA 4 (ultra-processed) is capped lower; NOVA 1 (whole foods) starts high.
- **Nutrient quality** — sugar type & amount, sodium, fiber, protein, fat quality. Do **not** blanket-penalize natural fat in whole foods (the Yuka mistake).
- **Ingredient flags** — weighted by **evidence strength AND typical dose**, not binary. A trace of a "contested" additive should not tank an otherwise-whole food.
- **Additives count & type** — cosmetic additives exclusive to ultra-processing (emulsifiers, colors, flavors) count against.
- **Bonuses** — short ingredient list, recognizable whole-food ingredients, third-party certifications.

Always render a **"Why this score" breakdown** so the number is never a black box.

**Per-ingredient card contents:** name (+ common aliases / E-number), flag color, one-line "what it is," "what it does in your body" (plain English), evidence-strength grade, regulatory status (US vs EU/other — see [`03`](03-INGREDIENT-DATABASE.md)), and PubMed/source links.

### 4.2 Real Food Finder

Map with custom dark style (matches palette). Categories: farmers markets, local farms/ranches, CSAs, raw-milk sources, pastured eggs, grass-fed beef shares, wild-caught fish, clean-sourcing grocers. Community reviews + verification badges ("confirmed pastured," "no glyphosate," "grass-finished").

**Raw milk is special-cased:** show the user's **state legality tier** (retail / on-farm / herd-share / pet-food-only / illegal) and an honest benefit-vs-pathogen-risk panel. Federal law bans interstate raw-milk sale for human consumption (21 CFR 1240.61); intrastate rules vary — see [`04`](04-DATA-SOURCES-AND-APIS.md) for the data model and source.

### 4.3 Daily Protocol Engine

Personalized from onboarding profile (location, Fitzpatrick skin type, age, sex, goals) + live data (UV index, sunrise/sunset, wearable data if connected). Modules:
- **Sun / vitamin D:** today's recommended unprotected-sun minutes (from live UV index + skin type), with a "don't burn" ceiling. Live sun-arc UI showing the UVB window (UV index ≥ 3, shadow-shorter-than-height rule).
- **Morning light / circadian:** get outside within ~30–60 min of waking; the evidence, dose, and honest caveats are in [`02`](02-SCIENCE-CONTENT.md).
- **Protein & amino acids:** daily target (g/kg) + per-meal leucine-threshold guidance, with built-in education on essential vs. non-essential AAs, complete vs. incomplete protein, and the nuance that leucine is a useful heuristic, not the whole story.
- **Sleep, movement, light hygiene:** targets + tracking.
- **Hormone-support modules** (testosterone, estrogen balance, thyroid, insulin, cortisol): lifestyle/nutrition levers with evidence grades + which blood panels to request and how to read them.

Rings (Apple-Watch style): **Sun / Protein / Clean-eating**, with particle burst on close.

### 4.4 Food & Symptom Log

Fast capture (scan, photo, voice-to-text). Daily check-ins for energy, sleep quality, digestion, skin, mood (1–5). After enough data, surface **personal correlations** ("your low-energy days follow days with 3+ ultra-processed items") — framed as observations, not medical claims, and clearly labeled correlational.

### 4.5 Health News & Trends Feed

Curated feed: new studies, regulatory changes, recalls, trends. Every item gets a **Hype Check** badge:
- **Headline** (what's being claimed)
- **What the study actually showed** (design, sample size, effect size, population)
- **Evidence grade** (strong / moderate / emerging / contested)
- **Bottom line** (one sentence)

Followable topics: seed oils, fasting, sauna/cold, microplastics, supplements, raw milk, sleep, circadian, food dyes, GRAS/regulatory. Pull-to-refresh = custom "sun rising over horizon" animation.

### 4.6 Learn Hub

Layered explainers, all sourced from [`02-SCIENCE-CONTENT.md`](02-SCIENCE-CONTENT.md): **30-second summary → 5-minute deep dive → full citations**. Topics: fructose vs. glucose, seed oils / linoleic acid, amino acids & MPS, insulin resistance, circadian biology, cholesterol & lipoproteins (honest), ultra-processed foods & NOVA, vitamin D & immunity, food additives & the GRAS loophole.

---

## 3. Trust & science standards (the product's spine)

These rules are non-negotiable and appear throughout the UI:

1. **Every health claim carries an evidence-strength grade:** `strong` / `moderate` / `emerging` / `contested`. Definitions in [`02`](02-SCIENCE-CONTENT.md).
2. **Cite primary research** — link the study, name the design (RCT / cohort / in-vitro / animal), and note sample size where relevant.
3. **Show both sides on contested topics.** When CDC/FDA/USDA guidance conflicts with newer or stronger research, present *both positions with their evidence* and let the user decide. Never blindly defer to institutions; never blindly contradict them. (This framing is also what keeps the app credible and app-store-safe.)
4. **Dose and context matter.** No fear-mongering; rank risks by real effect size. A trace additive is not treated like a dietary staple.
5. **Educational, not medical.** Persistent, clear disclaimer: not a substitute for professional medical care. Especially on hormone/blood-panel and raw-milk content.

> ⚠️ **Reality check baked into the spec:** the current *weight* of published evidence actually supports seed oils / linoleic acid being neutral-to-beneficial for cardiometabolic health, and supports mainstream advice to replace saturated fat with PUFAs. The user's instinct (seed oils are suspicious) is a live scientific debate, not settled fact in either direction. TrueHealth's credibility depends on presenting this honestly — the strongest version of the app flags *ultra-processing and oxidized/repeatedly-heated oils* (well-supported concerns) rather than declaring all seed oils toxic (not supported). See [`02`](02-SCIENCE-CONTENT.md) §Seed Oils. This is how the app earns trust instead of getting dismissed as another influencer app.

---

## 4. Screens / information architecture

```
Onboarding (≤90s): goals → profile (age, sex, location, Fitzpatrick skin type,
                    dietary pattern) → optional wearable connect → paywall
Tab bar (floating pill, liquid indicator):
  🏠 Home        → aurora bg (time-of-day hue), 3 protocol rings, today's sun window,
                   quick-scan FAB, "today" cards (protein left, next study, streak)
  🔍 Scan        → flagship scanner (also reachable via Home FAB)
  🗺️ Find        → Real Food Finder map
  📚 Learn       → Learn Hub + News/Trends feed (segmented)
  👤 Me          → profile, protocols, history, streaks, blood-panel guides, settings
```

---

## 5. Monetization & retention (research-backed)

Health & Fitness has the **highest per-install LTV of any app category (~$1.21)**. Key 2026 benchmarks that shape the model:

- **Hard paywall converts ~5× better than freemium** (10.7% vs 2.1% install→paid) — but 1-year retention converges, so the paywall must come *right after the user sees core value*.
- **AI features earn ~41% more revenue per payer but churn ~30% faster** → use AI for genuinely sticky value (personal correlations, protocol adaptation), not a novelty chatbot.
- **Annual plans are the retention backbone.** Push annual at first purchase; the **24-month mark (2nd annual renewal)** is the churn-stabilization milestone to design toward.
- **Time-to-first-value < 7 days** and **streaks / accountability** materially cut churn.

**Recommended model:** free tier = limited scans/day + basic protocol; **onboarding paywall with trial → annual plan** ("TrueHealth Pro"): unlimited scans, full protocol engine, correlations, offline history, blood-panel guides. Never guilt-based; celebratory streaks only.

---

## 6. Tech stack

- **React Native (Expo)** + **Reanimated 3** (spring-physics motion), **Skia** (custom rings/arcs/aurora), **Rive/Lottie** (animated tab icons), **Expo Camera + on-device OCR/ML Kit** (label scanning + barcode).
- **HealthKit (iOS)** / **Health Connect (Android)** via unified wrapper for sleep/steps/HRV — both are on-device only, per-type consent, need background sync (see [`04`](04-DATA-SOURCES-AND-APIS.md)).
- **Backend:** ingredient-risk DB + science content + product cache + user profiles/logs. Postgres + a thin API. Sync tokens for wearable delta reads.
- **Data:** Open Food Facts (OdBL — attribution + share-alike obligations), USDA FoodData Central (public domain), a UV index API, and curated raw-milk-legality + food-source datasets.

---

## 7. Build order (do not reorder)

1. **Design system** — palette, typography, and the animated component library (buttons, score ring, cards, tab bar, aurora background). *This is what makes all six features feel cohesive.* → [`05`](05-DESIGN-SYSTEM.md)
2. **Ingredient Scanner** end-to-end (camera → OFF/USDA/OCR → score → flagged rows → swaps).
3. **Home** (aurora bg + 3 protocol rings + sun window + quick-scan FAB).
4. **Daily Protocol Engine** (sun calc, protein/amino, circadian).
5. **Real Food Finder** map.
6. **Learn Hub + News feed**.
7. **Food & Symptom Log** + correlations.
8. Monetization, streaks, wearable sync, polish.

---

## Reference docs

- [`01-FEATURES-BACKLOG.md`](01-FEATURES-BACKLOG.md) — full feature list incl. researched additions & nice-to-haves
- [`02-SCIENCE-CONTENT.md`](02-SCIENCE-CONTENT.md) — Learn Hub content, each topic sourced & evidence-graded
- [`03-INGREDIENT-DATABASE.md`](03-INGREDIENT-DATABASE.md) — schema + flagged-ingredient catalog + scoring model
- [`04-DATA-SOURCES-AND-APIS.md`](04-DATA-SOURCES-AND-APIS.md) — every API/dataset with endpoints, auth, licensing
- [`05-DESIGN-SYSTEM.md`](05-DESIGN-SYSTEM.md) — Biolume palette, motion specs, component library
- [`06-BUILDER-PROMPT.md`](06-BUILDER-PROMPT.md) — the copy-paste prompt for an AI app builder
- [`07-RESEARCH-SOURCES.md`](07-RESEARCH-SOURCES.md) — bibliography with links

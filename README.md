# TrueHealth

A science-backed health-optimization app. Scan food and learn what's really in it, find clean/whole-food sources near you, and get personalized daily protocols for sun, sleep, protein, and hormone support — every recommendation graded by evidence quality, with mainstream (CDC/FDA/USDA) guidance and newer research shown side-by-side.

This repository holds both the **Expo/React Native app** (in `app/` and `src/`) and the **researched product specification** (in `docs/`) it was built from.

## Running the app

```bash
npm install            # install dependencies
npx expo start         # start the dev server, then press i / a, or scan the QR in Expo Go
```

Requires Node 18+. The app targets iOS and Android (dark-mode first). Camera scanning and location (for the sun calculator) use on-device permissions; the scanner also accepts a typed barcode or a sample product so it works without a physical barcode.

Useful scripts: `npm run typecheck` (tsc), `npx expo export --platform ios` (verify the bundle).

## Project structure

```
app/                     expo-router routes
  _layout.tsx            fonts, providers, root stack
  index.tsx              onboarding gate → tabs
  onboarding.tsx         4-step personalization (goals, basics, skin type)
  (tabs)/                Home, Scan, Find, Learn, Me + floating tab bar
  learn/[slug].tsx       layered explainer detail (summary → deep dive → sources)
src/
  theme/                 Biolume palette, typography, spacing, spring presets
  components/            animated library (ScoreRing, ActivityRings, SunArc, Aurora, …)
  lib/                   scoring engine, Open Food Facts + UV clients, solar/nutrition, storage
  data/                  ingredient catalog, learn topics, news, raw-milk laws, food sources
docs/                    the researched product spec (see below)
```

## The specification

The `docs/` folder is the definitive plan, built from primary research into the science, the competitor landscape (chiefly Yuka), the available data/APIs, and 2026 health-app market benchmarks.

## Start here

| Doc | What's in it |
|---|---|
| [`docs/00-MASTER-SPEC.md`](docs/00-MASTER-SPEC.md) | Positioning vs Yuka, the six core features, screens/IA, trust standards, monetization, tech stack, build order |
| [`docs/01-FEATURES-BACKLOG.md`](docs/01-FEATURES-BACKLOG.md) | Full prioritized feature list (core + researched additions + later) |
| [`docs/02-SCIENCE-CONTENT.md`](docs/02-SCIENCE-CONTENT.md) | Learn Hub content, each topic evidence-graded and sourced (sun, seed oils, fructose/glucose, protein/leucine, circadian, UPFs, GRAS, cholesterol, hormones) |
| [`docs/03-INGREDIENT-DATABASE.md`](docs/03-INGREDIENT-DATABASE.md) | Ingredient-risk DB schema, the transparent scoring model, and a flagged-ingredient starter catalog |
| [`docs/04-DATA-SOURCES-AND-APIS.md`](docs/04-DATA-SOURCES-AND-APIS.md) | Every API/dataset with endpoints, auth, licensing (Open Food Facts, USDA, UV index, sunrise, HealthKit/Health Connect, raw-milk legality) |
| [`docs/05-DESIGN-SYSTEM.md`](docs/05-DESIGN-SYSTEM.md) | "Biolume" palette, typography, motion specs, animated component library |
| [`docs/06-BUILDER-PROMPT.md`](docs/06-BUILDER-PROMPT.md) | A copy-paste prompt to scaffold the app in an AI builder |
| [`docs/07-RESEARCH-SOURCES.md`](docs/07-RESEARCH-SOURCES.md) | Full bibliography with links |

## The core idea

The market leader, **Yuka**, gives you a number from an opaque, dose-blind formula that rates ultra-processed ravioli above clean beef jerky and offers no way to act on the result. **TrueHealth** fixes that:

- **Transparent, context-aware scoring** — processing level (NOVA) is the biggest lever; evidence- and dose-weighted flags; no "one red additive tanks everything"; whole foods aren't punished for being fatty.
- **Honest science** — every claim graded (strong/moderate/emerging/contested) with a primary citation; contested topics show both sides. (Notably, the app treats seed oils as an ultra-processing marker rather than a toxin, because that's what the evidence actually supports — this honesty is the credibility moat.)
- **An action layer** — cleaner-swap suggestions and a map to find real food, raw milk (with state legality), pastured/grass-fed/wild-caught sources near you.
- **A daily tool** — personalized sun/protein/sleep protocols, symptom correlations, a hype-checked news feed, and a UI (the "Biolume" design system) built to be smooth and alive.

See [`docs/00-MASTER-SPEC.md`](docs/00-MASTER-SPEC.md) to dive in.

> Educational tool, not a substitute for professional medical care.

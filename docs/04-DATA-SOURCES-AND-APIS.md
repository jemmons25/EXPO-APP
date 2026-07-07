# Data Sources & APIs

Every external dependency the app needs, with endpoints, auth, licensing, and gotchas. All verified against current (2026) docs.

## 1. Food product data — Open Food Facts (primary)

- **Use API v3** (latest v3.6); v2 is deprecated but still needed for structured search.
- **Get product by barcode:** `GET https://world.openfoodfacts.org/api/v3/product/{barcode}`
- **Limit fields (do this for speed):** `?fields=product_name,brands,ingredients_text,nova_group,nutriments,additives_tags,nutrition_grades`
- **Structured search (v2 only):** `GET https://world.openfoodfacts.org/api/v2/search?...`
- **Official JS/TS SDK:** `@openfoodfacts/openfoodfacts-nodejs` (`client.getProductV3("<barcode>")`).
- **Required:** send a unique, identifying **User-Agent** header (e.g., `TrueHealth/1.0 (contact@…)`).
- **Key fields you'll rely on:** `nova_group` (1–4, feeds the score), `additives_tags` (E-numbers → your ingredient DB), `ingredients_text` (parse pipeline), `nutriments`.
- **⚖️ Licensing (important):** OFF data is **Open Database License (OdBL)** — you must **attribute** OFF as the source and honor **share-alike** for the database; keep non-free data separable. Add OFF to your app credits and don't relicense their data as closed.

## 2. Nutrients — USDA FoodData Central (enrichment)

- Public-domain US government nutrient database; use to fill/verify `nutriments` and for whole foods without barcodes.
- REST API with free API key (`api.nfacts`… key via api.data.gov). Endpoints for food search and food details by FDC ID.
- No attribution legally required (public domain) but crediting is good practice.

## 3. Label OCR (no barcode / fresh labels)

- On-device text recognition: **Expo/React Native ML Kit Text Recognition** (Google ML Kit) or Vision (iOS). Keeps scans fast and offline-capable.
- Pipeline: capture → OCR → isolate the "Ingredients:" block → feed to the parser in [`03-INGREDIENT-DATABASE.md`](03-INGREDIENT-DATABASE.md) §5.
- Barcode scanning: `expo-camera` / `expo-barcode-scanner` (EAN-13/UPC-A).

## 4. UV Index — for the Sun Calculator

Pick one; all give lat/long UV. Recommended primary + fallback:

| Provider | Endpoint | Key? | Notes / license |
|---|---|---|---|
| **currentuvindex.com** (recommended, keyless) | `GET https://currentuvindex.com/api/v1/uvi?latitude={lat}&longitude={lng}` | No | 500 req/IP/day; returns `now` + ~120h hourly forecast + 24h history; **CC BY 4.0** (link back required) |
| uvindexapi.com | `GET https://uvindexapi.com/api/v1/forecast?latitude=&longitude=&timezone=Auto` | No | NOAA-sourced; 1000 req/IP/day; **CC BY-SA 4.0** (visible attribution) |
| OpenUV.io | `GET https://api.openuv.io/api/v1/uv?lat=&lng=` header `x-access-token` | Yes | Free tier 50 req/day; paid $15/mo 15k/day; clear-sky + cloud correction |
| EPA (US only) | `https://data.epa.gov/dmapservice/getEnvirofactsUVHOURLY/ZIP/{zip}/JSON` | No | US ZIP/city only |

**Accuracy note:** UV *index* mixes UVA+UVB, but only **UVB** makes vitamin D, and the UVB fraction depends on **sun elevation**. For a correct calculator, combine the UV index with **solar-elevation** (compute sun angle from lat/long + date/time) so morning/evening readings aren't overestimated. Enforce the **UV≥3** and **shadow-shorter-than-height** rules from [`02`](02-SCIENCE-CONTENT.md) Topic 3.

## 5. Sunrise/sunset & solar position — circadian + sun arc

- **Sunrise-Sunset API:** `GET https://api.sunrise-sunset.org/json?lat=&lng=&date=today` (keyless) for sunrise, sunset, solar noon, civil twilight.
- Solar elevation angle: compute locally (NOAA solar-position algorithm) — no network needed; powers the live sun-arc UI and the UVB-window shading.

## 6. Wearable / health data — HealthKit & Health Connect

Both are **on-device only** (no server API), **per-data-type consent**, and need background sync. Use a unified wrapper.

- **iOS:** `react-native-health` (HealthKit). Read: `StepCount`, `HeartRate`, `SleepAnalysis`, `Weight`, `HeartRateVariability`. Background: `enableBackgroundDelivery` (max ~hourly).
- **Android:** `react-native-health-connect` (Health Connect; standalone APK on Android 9–13, built into 14+). **Check SDK availability before any call.** Read via `aggregateRecord` (totals) and `readRecords` (raw). Background sync via **WorkManager** + change tokens; request `READ_HEALTH_DATA_IN_BACKGROUND`.
- **Normalize** both platforms' schemas to one internal model on the backend; use provided UUIDs as idempotency keys to dedupe; store timestamps timezone-aware (avoid naive UTC `toISOString`).
- Use these for: sleep tracking, activity rings input, and correlation engine (Food & Symptom Log).

## 7. Real Food Finder — location datasets

No single clean API exists; combine sources + community contributions.

- **Farmers markets / CSAs / local farms:** USDA **Local Food Directories** (National Farmers Market Directory, CSA Directory, Food Hub Directory) — downloadable/APIs from USDA AMS. Seed the map with these.
- **Base map + geocoding + POI:** Mapbox (custom dark style matching palette) or MapLibre + OpenStreetMap (Overpass API for farm/market POIs). OSM is free/attribution.
- **Raw milk sources & legality:** no official API — build a curated dataset. Legality tiers sourced from the Farm-to-Consumer Legal Defense Fund + state Dept. of Agriculture pages; source aggregators: farm-to-door.com/raw-milk-laws, getrawmilk.com. **Verify per state before shipping; laws change (e.g., 2026 legislative activity).**
- **Community layer:** user-submitted listings + verification badges ("confirmed pastured," "grass-finished," "no glyphosate"), with moderation.

### Raw-milk legality data model
```sql
CREATE TABLE raw_milk_state_law (
  state_code   TEXT PRIMARY KEY,   -- 'CA','TX',...
  tier         TEXT NOT NULL,      -- 'retail','on_farm','herd_share','pet_food_only','illegal'
  summary      TEXT NOT NULL,
  benefits_note TEXT,              -- honest claimed-benefit summary
  risk_note    TEXT,               -- honest pathogen-risk summary (Listeria, E. coli, Campylobacter, Salmonella, H5N1 concern)
  source_url   TEXT,
  last_verified DATE
);
```
**Legal facts to encode:** federal law (21 CFR 1240.61) bans **interstate** sale of raw milk for human consumption since 1987; **drinking** raw milk is legal everywhere; ~30 states allow some intrastate sale (retail / on-farm / herd-share), the rest restrict or ban. Always show state tier + honest benefit/risk panel + medical disclaimer.

## 8. Health News & Trends Feed

- **Study sources:** PubMed E-utilities API (query by topic terms), bioRxiv/medRxiv, and curated journal RSS. Attach `study_type`, `sample_size`, `year`.
- **Recalls:** FDA openFDA food-enforcement API (`https://api.fda.gov/food/enforcement.json`).
- **Regulatory changes:** FDA/USDA/EFSA press feeds.
- Each item gets a **Hype Check** object (headline / what-it-showed / grade / bottom-line) — human-curated or AI-drafted-then-reviewed.

## 9. Rate-limit & caching strategy

- Cache OFF/USDA product lookups in `products` (see schema) — dedupe repeat scans, enable offline history.
- Cache UV/sun data per (lat-rounded, hour).
- Respect keyless-API IP limits (500–1000/day) by proxying through your backend with a shared cache, not calling direct from every device.

## 10. Attribution checklist (ship-blocker)

- [ ] Open Food Facts credited; OdBL share-alike honored for DB portions
- [ ] UV provider attribution + backlink (CC BY / CC BY-SA)
- [ ] OpenStreetMap attribution if used
- [ ] "Educational, not medical advice" disclaimer persistent
- [ ] "Last reviewed" dates on ingredient + legality data

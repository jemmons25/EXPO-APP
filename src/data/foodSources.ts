/**
 * Real Food Finder categories + sample seed listings.
 * In production, seed from USDA Local Food Directories + OSM/Overpass + community
 * submissions (docs/04 §7). These samples make the UI meaningful before live data.
 */
export type SourceCategory =
  | 'farmers_market'
  | 'farm'
  | 'csa'
  | 'raw_milk'
  | 'pastured_eggs'
  | 'grass_fed'
  | 'wild_fish'
  | 'clean_grocer';

export interface CategoryMeta {
  key: SourceCategory;
  label: string;
  emoji: string;
}

export const SOURCE_CATEGORIES: CategoryMeta[] = [
  { key: 'farmers_market', label: 'Farmers Markets', emoji: '🧺' },
  { key: 'farm', label: 'Local Farms', emoji: '🚜' },
  { key: 'csa', label: 'CSA Programs', emoji: '📦' },
  { key: 'raw_milk', label: 'Raw Milk', emoji: '🥛' },
  { key: 'pastured_eggs', label: 'Pastured Eggs', emoji: '🥚' },
  { key: 'grass_fed', label: 'Grass-Fed Beef', emoji: '🐄' },
  { key: 'wild_fish', label: 'Wild-Caught Fish', emoji: '🐟' },
  { key: 'clean_grocer', label: 'Clean Grocers', emoji: '🛒' },
];

export interface FoodSource {
  id: string;
  name: string;
  category: SourceCategory;
  distanceMi: number;
  badges: string[];
  note: string;
}

/** Sample listings shown until live location data is wired up. */
export const SAMPLE_SOURCES: FoodSource[] = [
  { id: '1', name: 'Riverbend Family Farm', category: 'farm', distanceMi: 4.2, badges: ['Confirmed pastured', 'No glyphosate'], note: 'Pastured eggs, grass-finished beef, seasonal produce. Farm store open Fri–Sun.' },
  { id: '2', name: 'Downtown Farmers Market', category: 'farmers_market', distanceMi: 1.1, badges: ['Local only'], note: '40+ vendors, Saturdays 8am–1pm. Look for grass-fed and pastured stalls.' },
  { id: '3', name: 'Green Valley Herd Share', category: 'raw_milk', distanceMi: 8.7, badges: ['Herd-share', 'Grass-fed'], note: 'Raw A2 milk via herd-share agreement. Check your state legality below.' },
  { id: '4', name: 'Coastal Catch Co.', category: 'wild_fish', distanceMi: 12.4, badges: ['Wild-caught', 'Traceable'], note: 'Wild Alaskan salmon and cod, flash-frozen at sea. Weekly pickup.' },
  { id: '5', name: 'Meadowlark CSA', category: 'csa', distanceMi: 6.0, badges: ['Organic practices'], note: 'Weekly veg box, spring–fall. Add-ons for pastured eggs and honey.' },
  { id: '6', name: 'PastureRaise Ranch', category: 'grass_fed', distanceMi: 15.3, badges: ['Grass-finished', '100% pasture'], note: 'Quarter/half beef shares, regenerative grazing.' },
  { id: '7', name: 'Whole Roots Market', category: 'clean_grocer', distanceMi: 2.8, badges: ['Clean sourcing'], note: 'Strong whole-food selection; scan products here to compare clean scores.' },
  { id: '8', name: 'Sunrise Egg Co-op', category: 'pastured_eggs', distanceMi: 5.5, badges: ['Confirmed pastured'], note: 'Truly pastured eggs, soy-free feed. Self-serve fridge.' },
];

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fitzpatrick } from './solar';
import { ScannedProduct } from './openFoodFacts';

export type Sex = 'male' | 'female';
export type Goal = 'longevity' | 'hormones' | 'muscle' | 'metabolic' | 'energy';

export interface Profile {
  name?: string;
  age: number;
  sex: Sex;
  weightKg: number;
  skinType: Fitzpatrick;
  goals: Goal[];
  onboarded: boolean;
}

export const DEFAULT_PROFILE: Profile = {
  age: 30,
  sex: 'male',
  weightKg: 75,
  skinType: 3,
  goals: ['longevity'],
  onboarded: false,
};

const KEYS = {
  profile: 'th:profile',
  history: 'th:scanHistory',
  dailyLog: 'th:dailyLog',
} as const;

export async function loadProfile(): Promise<Profile> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.profile);
    if (raw) return { ...DEFAULT_PROFILE, ...(JSON.parse(raw) as Partial<Profile>) };
  } catch {
    /* ignore */
  }
  return DEFAULT_PROFILE;
}

export async function saveProfile(profile: Profile): Promise<void> {
  await AsyncStorage.setItem(KEYS.profile, JSON.stringify(profile));
}

export interface HistoryEntry {
  barcode: string;
  name: string;
  brand?: string;
  score: number;
  scannedAt: number;
}

export async function loadHistory(): Promise<HistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.history);
    if (raw) return JSON.parse(raw) as HistoryEntry[];
  } catch {
    /* ignore */
  }
  return [];
}

export async function addToHistory(product: ScannedProduct): Promise<void> {
  const entry: HistoryEntry = {
    barcode: product.barcode,
    name: product.name,
    brand: product.brand,
    score: product.score,
    scannedAt: Date.now(),
  };
  const history = await loadHistory();
  const deduped = [entry, ...history.filter((h) => h.barcode !== entry.barcode)].slice(0, 50);
  await AsyncStorage.setItem(KEYS.history, JSON.stringify(deduped));
}

/** Daily protocol log keyed by ISO date (rings progress). */
export interface DailyLog {
  date: string; // YYYY-MM-DD
  sunMinutes: number;
  proteinGrams: number;
  cleanItems: number;
}

export function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export async function loadTodayLog(): Promise<DailyLog> {
  const date = todayKey();
  try {
    const raw = await AsyncStorage.getItem(`${KEYS.dailyLog}:${date}`);
    if (raw) return JSON.parse(raw) as DailyLog;
  } catch {
    /* ignore */
  }
  return { date, sunMinutes: 0, proteinGrams: 0, cleanItems: 0 };
}

export async function saveTodayLog(log: DailyLog): Promise<void> {
  await AsyncStorage.setItem(`${KEYS.dailyLog}:${log.date}`, JSON.stringify(log));
}

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import {
  DailyLog,
  DEFAULT_PROFILE,
  loadProfile,
  loadTodayLog,
  Profile,
  saveProfile as persistProfile,
  saveTodayLog,
} from './storage';

interface ProfileContextValue {
  profile: Profile;
  ready: boolean;
  dailyLog: DailyLog;
  updateProfile: (patch: Partial<Profile>) => Promise<void>;
  addSunMinutes: (min: number) => Promise<void>;
  addProtein: (g: number) => Promise<void>;
  addCleanItem: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [dailyLog, setDailyLog] = useState<DailyLog>({
    date: new Date().toISOString().slice(0, 10),
    sunMinutes: 0,
    proteinGrams: 0,
    cleanItems: 0,
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const [p, log] = await Promise.all([loadProfile(), loadTodayLog()]);
      setProfile(p);
      setDailyLog(log);
      setReady(true);
    })();
  }, []);

  const updateProfile = useCallback(
    async (patch: Partial<Profile>) => {
      const next = { ...profile, ...patch };
      setProfile(next);
      await persistProfile(next);
    },
    [profile],
  );

  const mutateLog = useCallback(
    async (patch: Partial<DailyLog>) => {
      const next = { ...dailyLog, ...patch };
      setDailyLog(next);
      await saveTodayLog(next);
    },
    [dailyLog],
  );

  const addSunMinutes = useCallback(
    (min: number) => mutateLog({ sunMinutes: dailyLog.sunMinutes + min }),
    [dailyLog.sunMinutes, mutateLog],
  );
  const addProtein = useCallback(
    (g: number) => mutateLog({ proteinGrams: dailyLog.proteinGrams + g }),
    [dailyLog.proteinGrams, mutateLog],
  );
  const addCleanItem = useCallback(
    () => mutateLog({ cleanItems: dailyLog.cleanItems + 1 }),
    [dailyLog.cleanItems, mutateLog],
  );

  return (
    <ProfileContext.Provider
      value={{ profile, ready, dailyLog, updateProfile, addSunMinutes, addProtein, addCleanItem }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}

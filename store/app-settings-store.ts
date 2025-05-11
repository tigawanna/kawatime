import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ThemeStoreState = {
  theme: "dark" | "light" | null;
  dynamicColors:boolean;
  localBackupPath: string | null;
  lastBackup: Date | null;
  toggleDynamicColors: () => void;
  toggleTheme: () => void;
};

export const useSettingsStore = create<ThemeStoreState>()(
  persist(
    (set, get) => ({
      theme: null,
      dynamicColors: true,
      localBackupPath: null,
      lastBackup: null,
      toggleDynamicColors: () => set((state) => ({ 
        dynamicColors: !state.dynamicColors 
      })),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === "light" ? "dark" : "light" 
      })),
    }),
    {
      name: 'theme-storage', // unique name for the storage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function useStoredTheme() {
  const colorScheme = useColorScheme();
  const { theme,  toggleTheme } = useSettingsStore();

  // Use the device color scheme as fallback if theme is null
  const effectiveTheme = theme ?? colorScheme ?? "light";
  const isDarkMode = effectiveTheme === "dark";

  return {
    theme: effectiveTheme,
    toggleTheme,
    isDarkMode,
  };
}

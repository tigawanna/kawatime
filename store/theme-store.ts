import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ThemeStoreState = {
  theme: "dark" | "light" | null;
  localBackupPath: string | null;
  lastBackup: Date | null;
  
  // Actions
  setTheme: (theme: "dark" | "light" | null) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeStoreState>()(
  persist(
    (set, get) => ({
      theme: null,
      localBackupPath: null,
      lastBackup: null,
      
      setTheme: (theme) => set({ theme }),
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
  const { theme, setTheme, toggleTheme } = useThemeStore();

  // Use the device color scheme as fallback if theme is null
  const effectiveTheme = theme ?? colorScheme ?? "light";
  const isDarkMode = effectiveTheme === "dark";

  return {
    theme: effectiveTheme,
    setTheme,
    toggleTheme,
    isDarkMode,
  };
}

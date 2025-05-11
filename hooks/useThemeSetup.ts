import { Colors } from "@/constants/Colors";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";

import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
} from "react-native-paper";

import { useStoredTheme } from "@/store/theme-store";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import merge from "deepmerge";

export function useThemeSetup() {
  // Get device-generated Material You theme
  const { theme: material3Theme } = useMaterial3Theme();
  
  // Get stored theme preference
  const { theme: userThemePreference, isDarkMode } = useStoredTheme();

  // Define custom themes (fallback if Material You theme is unavailable)
  const customDefaultTheme = { ...MD3LightTheme, colors: Colors.light };
  const customDarkTheme = { ...MD3DarkTheme, colors: Colors.dark };
  
  // Navigation themes
  const { DarkTheme, LightTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });
  
console.log(" mui theme primary ===", MD3LightTheme.colors.primary)
console.log(" default theme primary ===", customDefaultTheme.colors.primary);

  // Use Material You theme if available, otherwise fall back to custom theme
  const lightThemeColors = material3Theme?.light || customDefaultTheme.colors;
  const darkThemeColors = material3Theme?.dark || customDarkTheme.colors;

  // Create combined themes (Material You or fallback)
  const lightBasedTheme = merge(LightTheme, { 
    ...MD3LightTheme, 
    colors: lightThemeColors 
  });
  
  const darkBasedTheme = merge(DarkTheme, { 
    ...MD3DarkTheme, 
    colors: darkThemeColors 
  });

  // Use the appropriate theme based on user preference
  const paperTheme = isDarkMode ? darkBasedTheme : lightBasedTheme;

  return {
    paperTheme,
    colorScheme: userThemePreference,
    isDarkMode
  };
}

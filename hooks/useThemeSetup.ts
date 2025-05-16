import { Colors, defaultMaterial3PrimaryDarkTheme, defaultMaterial3PrimaryLightTheme, defaultPaperTheme } from "@/constants/Colors";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";

import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
} from "react-native-paper";

import { useThemeStore } from "@/store/app-settings-store";
import { Material3Theme, useMaterial3Theme } from "@pchmn/expo-material3-theme";
import merge from "deepmerge";

export function useThemeSetup(dynamicColors?:boolean) {
  // Get device-generated Material You theme
  const { theme: material3Theme } = useMaterial3Theme(
    // {fallbackSourceColor: Colors.light.primary},
  );
  console.log("Material You Theme", material3Theme.light.primary);
  // Get stored theme preference
  const { theme: userThemePreference, isDarkMode } = useThemeStore();


  const { DarkTheme, LightTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });
  
  // Use Material You theme if available, otherwise fall back to custom theme
  const lightThemeColors = dynamicColors ? materialYouThemeOrMyTheme(material3Theme).light : Colors.light;
  const darkThemeColors = dynamicColors ? materialYouThemeOrMyTheme(material3Theme).dark :Colors.dark

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


function materialYouThemeOrMyTheme(theme: Material3Theme) {
  if (
    theme.dark.primary === defaultMaterial3PrimaryDarkTheme &&
    theme.light.primary === defaultMaterial3PrimaryLightTheme
  ) {
    return {
      light: Colors.light,
      dark: Colors.dark,
    };
  } else {
    return {
      light: theme.light,
      dark: theme.dark,
    };
  }
}

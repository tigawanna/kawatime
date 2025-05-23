import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useThemeSetup } from "@/hooks/useThemeSetup";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { useSettingsStore } from "@/store/app-settings-store";
import { focusManager, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppStateStatus, Platform } from "react-native";
import { useOnlineManager, useAppState } from "@/lib/tanstack/hooks";

const queryClient = new QueryClient();
function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

export default function RootLayout() {
  const { settings } = useSettingsStore();
  const { colorScheme, paperTheme } = useThemeSetup(settings.dynamicColors);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
    useOnlineManager();
    useAppState(onAppStateChange);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperProvider theme={paperTheme}>
            <ThemeProvider value={paperTheme as any}>
              <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
            </ThemeProvider>
          </PaperProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from "@tanstack/react-query";
import { AppStateStatus, Platform } from "react-native";
import { useAppState, useOnlineManager } from "./hooks";


interface TanstackQueryProviderProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();
function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

export default function TanstackQueryProvider({ children }: TanstackQueryProviderProps) {
  useOnlineManager();
  useAppState(onAppStateChange);

  return {children} ;
}

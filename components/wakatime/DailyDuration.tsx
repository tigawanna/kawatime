import { Suspense, useState, useTransition } from "react";
import { StyleSheet } from "react-native";
import { Text, Surface, useTheme } from "react-native-paper";
import { DailyCodingDuration } from "./DailyCodingDuration";
import { DatePicker } from "./DatPicker";
import Nprogress from "../nprogress/Nprogress";

export function DailyDuration() {
  const [today, setToday] = useState(new Date());
    const [isTransitioning, startTransition] = useTransition();
  return (
    <Surface style={{ ...styles.container }}>
     <DatePicker today={today} setToday={
        (d)=>startTransition(() => setToday(d))
     } />
     <Nprogress isAnimating={isTransitioning}/>
      <Suspense fallback={<DailyDurationSuspenseFallback />}>
        <DailyCodingDuration today={today}/>
      </Suspense>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export function DailyDurationSuspenseFallback() {
  const theme = useTheme();
  return (
    <Surface style={{ ...styles.container, backgroundColor: theme.colors.surface }}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Surface
          key={index}
          style={{
            ...styles.container,
            backgroundColor: theme.colors.primaryContainer,
            marginVertical: 8,
            borderRadius: 12,
          }}>
          <Text variant="titleLarge" style={{ color: theme.colors.onPrimaryContainer }}>
            Loading...
          </Text>
        </Surface>
      ))}
    </Surface>
  );
}

import { Suspense, useState, useTransition } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Surface, useTheme } from "react-native-paper";
import { DailyCodingDuration } from "./DailyCodingDuration";
import { DatePicker } from "./DatPicker";
import Nprogress from "../nprogress/Nprogress";

export function DailyDuration() {
  const [today, setToday] = useState(new Date());
    const [isTransitioning, startTransition] = useTransition();
  return (
    <Surface style={{ ...styles.container }}>
      <DatePicker today={today} setToday={(d) => startTransition(() => setToday(d))} />
      <Nprogress isAnimating={isTransitioning} />
      {/* <DailyDurationSuspenseFallback /> */}
      <Suspense fallback={<DailyDurationSuspenseFallback />}>
        <DailyCodingDuration today={today} />
      </Suspense>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 6,
    padding: 16,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export function DailyDurationSuspenseFallback() {
  const theme = useTheme();
  return (
    <Surface style={{ ...styles.container, }}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Surface
          key={index}
          style={{
            ...styles.container,
            backgroundColor: theme.colors.elevation.level4,
            marginVertical: 8,
            borderRadius: 6,
            padding: 50,
          }}>
          <View  style={{ backgroundColor: theme.colors.elevation.level2 }}/>

        </Surface>
      ))}
    </Surface>
  );
}

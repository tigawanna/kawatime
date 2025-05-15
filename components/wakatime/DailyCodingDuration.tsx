import { wakatimePiKey } from "@/env";
import { getTodaysWakatimeDurations } from "@/lib/wakatime/apis";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect,useState } from "react";
import {  RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Card, Surface, Text, useTheme } from "react-native-paper";

import Animated, {
  FadeIn,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { formatDuration, formrtDateFprWakatime, nameOfDayToday } from "@/utils/dates";
import { useGroupedDurationData } from "./utils/use-data";

export type ProjectSummary = {
  name: string;
  duration: number;
  color: string;
  percentage: number;
};

interface DailyCodingDurationProps{
  today: Date | undefined;
}

export function 
DailyCodingDuration({
  today = new Date(),
}: DailyCodingDurationProps) {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const { data,error, isError, refetch } = useSuspenseQuery({
    queryKey: ["duration", today],
    queryFn: async () => {
      return getTodaysWakatimeDurations({
        api_key: wakatimePiKey!,
        date: formrtDateFprWakatime(today),
      });
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  // Handle refresh action
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const { totalTime, sortedProjects } = useGroupedDurationData({
    data: data?.data,
    theme,
  });

  return (
    <Surface style={styles.container}>
      {(isError || data?.error) ? (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={48}
            color={theme.colors.error}
          />
          <Text variant="bodyMedium" style={styles.errorText}>
            {error instanceof Error ? error.message : "Failed to load data"}
            {data.error}
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          <Animated.View style={styles.totalTimeContainer} entering={FadeIn.duration(800)}>
            <Text variant="headlineLarge" style={styles.totalTime}>
              {formatDuration(totalTime)}
            </Text>
            <View style={{}}>
              <Text variant="bodyMedium" style={styles.totalTimeLabel}>
                {nameOfDayToday(new Date(today))}
              </Text>
            </View>
          </Animated.View>

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Projects
          </Text>

          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }>
            {sortedProjects.map((project, index) => (
              <AnimatedProjectCard
                key={`project-${index}`}
                project={project}
                index={index}
                formatDuration={formatDuration}
                theme={theme}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </Surface>
  );
}

function AnimatedProjectCard({
  project,
  index,
  formatDuration,
  theme,
}: {
  project: ProjectSummary;
  index: number;
  formatDuration: (seconds: number) => string;
  theme: ReturnType<typeof useTheme>;
}) {
  const widthAnim = useSharedValue(0);

  useEffect(() => {
    // Start animation after a staggered delay
    const delay = 300 + index * 100;
    widthAnim.value = withTiming(project.percentage, { duration: delay });
  }, [widthAnim, project.percentage, index]);

  const barStyle = useAnimatedStyle(() => {
    return {
      width: `${widthAnim.value}%`,
      backgroundColor: project.color,
    };
  });

  return (
    <Animated.View entering={SlideInRight.delay(index * 100).springify()}>
      <Card style={styles.projectCard} mode="outlined">
        <Card.Content>
          <View style={styles.projectHeader}>
            <View style={styles.projectInfo}>
              <View style={[styles.projectColor, { backgroundColor: project.color }]} />
              <Text variant="titleMedium" style={styles.projectName}>
                {project.name}
              </Text>
            </View>
            <Text variant="titleMedium" style={styles.projectDuration}>
              {formatDuration(project.duration)}
            </Text>
          </View>

          <View style={styles.progressBarContainer}>
            <Animated.View style={[styles.progressBar, barStyle]} />
          </View>

          <Text variant="bodySmall" style={styles.percentageText}>
            {Math.round(project.percentage)}% of total time
          </Text>
        </Card.Content>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
    borderRadius: 12,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    marginLeft: 8,
    fontWeight: "bold",
  },
  divider: {
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    marginTop: 16,
    textAlign: "center",
    opacity: 0.7,
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  totalTimeContainer: {
    alignItems: "center",
    marginVertical: 14,
    gap: 14,
  },
  totalTime: {
    fontWeight: "bold",
    fontSize: 56,
  },
  totalTimeLabel: {
    opacity: 0.7,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 16,
  },
  projectCard: {
    marginBottom: 12,
    borderRadius: 8,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  projectInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 8,
  },
  projectColor: {
    width: 12,
    height: 24,
    borderRadius: 4,
    marginRight: 12,
  },
  projectName: {
    flexShrink: 1,
  },
  projectDuration: {
    fontWeight: "bold",
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 5,
    overflow: "hidden",
    marginVertical: 8,
  },
  progressBar: {
    height: "100%",
    borderRadius: 5,
  },
  percentageText: {
    textAlign: "right",
    opacity: 0.7,
  },
});

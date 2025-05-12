import { wakatimePiKey } from "@/env";
import { getTodaysWakatimeDurations } from "@/lib/wakatime/apis";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { Card, Surface, Text, useTheme } from "react-native-paper";

export function Duration() {
  const theme = useTheme();
  
  const { data, isPending, error, isError } = useQuery({
    queryKey: ["duration"],
    queryFn: async () => {
      return getTodaysWakatimeDurations({
        api_key: wakatimePiKey!,
        date: "2025-05-12",
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Use useMemo to avoid calculating on every render and prevent immutability issues
  const totalTime = useMemo(() => 
    data?.data?.reduce((acc, curr) => acc + curr.duration, 0) || 0,
    [data?.data]
  );
  
  return (
    <Surface style={styles.container} elevation={1}>

      {isPending ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="bodyMedium" style={styles.loadingText}>
            Loading activity data...
          </Text>
        </View>
      ) : isError ? (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={48}
            color={theme.colors.error}
          />
          <Text variant="bodyMedium" style={styles.errorText}>
            {error instanceof Error ? error.message : "Failed to load data"}
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.totalTimeContainer}>
            <Text variant="headlineLarge" style={styles.totalTime}>
              {formatDuration(totalTime)}
            </Text>
            <Text variant="bodyMedium" style={styles.totalTimeLabel}>
              Total coding time today
            </Text>
          </View>

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Projects
          </Text>

          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            {data?.data?.map((project, index) => (
              <Card key={`project-${index}-${project.project}`} style={styles.projectCard} mode="outlined">
                <Card.Content style={styles.projectCardContent}>
                  <View style={styles.projectInfo}>
                    <View
                      style={[
                        styles.projectColor,
                        { backgroundColor: project.color || theme.colors.primary },
                      ]}
                    />
                    <Text variant="titleMedium" style={styles.projectName}>
                      {project.project}
                    </Text>
                  </View>
                  <Text variant="titleMedium" style={styles.projectDuration}>
                    {formatDuration(project.duration)}
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
        </View>
      )}
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
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
  },
  totalTime: {
    fontWeight: "bold",
    fontSize:56
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
  projectCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
});

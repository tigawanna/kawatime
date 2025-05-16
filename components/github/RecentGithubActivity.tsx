import React, { useState } from "react";
import { View, ScrollView, StyleSheet, RefreshControl } from "react-native";
import {
  Card,
  Text,
  Avatar,
  Chip,
  Divider,
  Surface,
  IconButton,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import Animated, { SlideInRight } from "react-native-reanimated";
import { fetchGitHubEvents, GitHubEvent } from "./data";

interface RecentGithubActivityProps {
  username?: string;
}



export function RecentGithubActivity({ username = "github-user" }: RecentGithubActivityProps) {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: events,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["github-events", username],
    queryFn: () => fetchGitHubEvents(username),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "PushEvent":
        return "source-commit";
      case "PullRequestEvent":
        return "source-pull";
      case "IssueCommentEvent":
        return "comment-text-outline";
      case "CreateEvent":
        return "source-branch-plus";
      case "DeleteEvent":
        return "source-branch-remove";
      case "WatchEvent":
        return "star-outline";
      case "ForkEvent":
        return "source-fork";
      default:
        return "github";
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "PushEvent":
        return theme.colors.primary;
      case "PullRequestEvent":
        return "#28a745";
      case "IssueCommentEvent":
        return "#0366d6";
      case "CreateEvent":
        return "#6f42c1";
      case "DeleteEvent":
        return "#d73a49";
      case "WatchEvent":
        return "#f1c40f";
      case "ForkEvent":
        return "#e67e22";
      default:
        return theme.colors.primary;
    }
  };

  const renderEventContent = (event: GitHubEvent) => {
    switch (event.type) {
      case "PushEvent":
        return (
          <>
            {event.payload.commits?.map((commit, index) => (
              <View key={commit.sha} style={{ marginTop: index > 0 ? 8 : 0 }}>
                <Text variant="bodySmall" style={{ fontFamily: "monospace" }}>
                  {commit.sha.substring(0, 7)}
                </Text>
                <Text variant="bodyMedium">{commit.message}</Text>
              </View>
            ))}
          </>
        );

      case "PullRequestEvent":
        return (
          <>
            <Text variant="bodyMedium" style={{ fontWeight: "500" }}>
              #{event.payload.pull_request?.number} {event.payload.pull_request?.title}
            </Text>
            <Chip
              icon={event.payload.pull_request?.state === "open" ? "source-pull" : "check-circle"}
              style={{
                alignSelf: "flex-start",
                backgroundColor:
                  event.payload.pull_request?.state === "open" ? "#28a7454d" : "#6f42c14d",
              }}>
              {event.payload.action} {event.payload.pull_request?.state}
            </Chip>
          </>
        );

      case "IssueCommentEvent":
        return (
          <>
            <Text variant="bodyMedium" style={{ fontWeight: "500" }}>
              #{event.payload.issue?.number} {event.payload.issue?.title}
            </Text>
            <Chip
              icon="comment-text-outline"
              style={{ alignSelf: "flex-start", backgroundColor: "#0366d64d" }}>
              Commented on issue
            </Chip>
          </>
        );

      default:
        return <Text variant="bodyMedium">Activity in {event.repo.name}</Text>;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16 }}>Loading GitHub activity...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
        />
      }>
      <Surface style={styles.header} elevation={0}>
        <Avatar.Image size={48} source={{ uri: events?.[0]?.actor.avatar_url }} />
        <View style={{ marginLeft: 16 }}>
          <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
            {username}
          </Text>
          <Text variant="bodyMedium">Recent GitHub Activity</Text>
        </View>
      </Surface>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Activity Timeline
      </Text>

      {events?.map((event, index) => (
        <Animated.View key={event.id} entering={SlideInRight.delay(index * 100).springify()}>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.eventHeader}>
                <Avatar.Icon
                  size={40}
                  icon={getEventIcon(event.type)}
                  style={{ backgroundColor: getEventColor(event.type) }}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text variant="titleMedium" style={{ fontWeight: "500" }}>
                    {event.repo.name}
                  </Text>
                  <Text variant="bodySmall" style={styles.dateText}>
                    {formatDate(event.created_at)}
                  </Text>
                </View>
                <IconButton icon="open-in-new" size={20} onPress={() => {}} />
              </View>

              <Divider style={{ marginVertical: 12 }} />

              <View style={styles.eventContent}>{renderEventContent(event)}</View>
            </Card.Content>
          </Card>
        </Animated.View>
      ))}

      <View style={styles.footer}>
        <Text variant="bodySmall" style={{ textAlign: "center", opacity: 0.7 }}>
          Pull to refresh for latest activity
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginHorizontal: 16,
    marginVertical: 12,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    opacity: 0.7,
  },
  eventContent: {
    marginTop: 4,
  },
  footer: {
    padding: 24,
  },
});

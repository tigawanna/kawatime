import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { Button, Card, Divider, Surface, Text, useTheme } from "react-native-paper";

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <Surface style={styles.container}>
      <Surface style={styles.header} elevation={0}>
        <Text variant="headlineMedium" style={styles.title}>Kawatime</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Welcome to your daily companion</Text>
      </Surface>

      <Card style={styles.card} mode="elevated">
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons name="chart-timeline-variant" size={32} color={theme.colors.primary} />
          <Text variant="titleMedium" style={styles.cardTitle}>Your Activity</Text>
          <Text variant="bodyMedium">Track your daily progress and achievements</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="text">View Details</Button>
        </Card.Actions>
      </Card>
      
      <Card style={styles.card} mode="elevated">
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons name="calendar-check" size={32} color={theme.colors.primary} />
          <Text variant="titleMedium" style={styles.cardTitle}>Today&apos;s Plan</Text>
          <Text variant="bodyMedium">2 tasks remaining for today</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="text">View Tasks</Button>
        </Card.Actions>
      </Card>

      <Divider style={styles.divider} />

      <Surface style={styles.footer} elevation={0}>
        <Button 
          mode="contained" 
          icon="logout-variant" 
          style={styles.button}
          contentStyle={styles.buttonContent}
          onPress={() => {}}
        >
          Logout
        </Button>
      </Surface>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginVertical: 24,
  },
  title: {
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
  card: {
    marginVertical: 8,
    borderRadius: 12,
  },
  cardContent: {
    gap: 8,
  },
  cardTitle: {
    fontWeight: "bold",
    marginTop: 4,
  },
  divider: {
    marginVertical: 24,
  },
  footer: {
    marginTop: 'auto',
    alignItems: "center",
  },
  button: {
    width: "80%",
    borderRadius: 8,
  },
  buttonContent: {
    height: 48,
  }
});

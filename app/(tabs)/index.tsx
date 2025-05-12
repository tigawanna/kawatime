import { Duration } from "@/components/wakatime/Duration";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { Button, Card, Divider, Surface, Text, useTheme } from "react-native-paper";

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <Surface style={styles.container}>
      <Duration />
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
    marginTop: "auto",
    alignItems: "center",
  },
  button: {
    width: "80%",
    borderRadius: 8,
  },
  buttonContent: {
    height: 48,
  },
});

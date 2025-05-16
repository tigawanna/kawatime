import { RecentGithubActivity } from "@/components/github/RecentGithubActivity";
import { StyleSheet, ScrollView } from "react-native";

export default function ExploreScreen() {
return (
    <ScrollView style={styles.container}>
      <RecentGithubActivity/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4,
  }
});

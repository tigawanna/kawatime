import { GetTodaysWakatimeDurationsResponse } from "@/lib/wakatime/apis";
import { useMemo } from "react";
import { MD3Theme } from "react-native-paper";
import { ProjectSummary } from "../DailyCodingDuration";

interface UseGroupedDurationData {
  data?: GetTodaysWakatimeDurationsResponse | null;
  theme: MD3Theme;
}
export function useGroupedDurationData({data,theme}: UseGroupedDurationData) {
    // Use useMemo to avoid calculating on every render and prevent immutability issues
    const totalTime = useMemo(
      () => data?.data?.reduce((acc, curr) => acc + curr.duration, 0) || 0,
      [data?.data]
    );
  
    // Group and sort projects by duration, then calculate percentages
    const sortedProjects = useMemo(() => {
      if (!data?.data || totalTime === 0) return [];
      const projects: Record<string, ProjectSummary> = {};
      // Aggregate duration for each project
        data.data.forEach((project) => {
        if (!projects[project.project]) {
          projects[project.project] = {
            name: project.project,
            duration: 0,
            color: project.color || theme.colors.primary,
            percentage: 0,
          };
        }
        projects[project.project].duration += project.duration;
      });
  
      // Convert to array and calculate percentages
      const projectList = Object.values(projects).map((project) => ({
        ...project,
        percentage: (project.duration / totalTime) * 100,
      }));
  
      // Sort by duration (descending)
      return projectList.sort((a, b) => b.duration - a.duration);
    }, [data?.data, totalTime, theme.colors.primary]);

    return {
      totalTime,
      sortedProjects,
    };
  
}

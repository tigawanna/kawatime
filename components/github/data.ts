export interface GitHubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
  };
  actor: {
    login: string;
    avatar_url: string;
  };
  payload: {
    commits?: {
      sha: string;
      message: string;
    }[];
    pull_request?: {
      title: string;
      number: number;
      state: string;
    };
    issue?: {
      title: string;
      number: number;
      state: string;
    };
    action?: string;
  };
  created_at: string;
}

// Demo function that would be replaced with actual fetch to GitHub API
export async function fetchGitHubEvents(username: string): Promise<GitHubEvent[]> {
  // In a real implementation, you would make an API call like:
  // return fetch(`https://api.github.com/users/${username}/events?per_page=10`)
  //   .then(response => response.json())

  // For now, return mock data
  return [
    {
      id: "1",
      type: "PushEvent",
      repo: { name: "username/awesome-project" },
      actor: {
        login: username,
        avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
      },
      payload: {
        commits: [
          { sha: "abc123", message: "Fix navigation bug in settings screen" },
          { sha: "def456", message: "Add pull-to-refresh on activity screen" },
        ],
      },
      created_at: "2025-05-12T14:32:19Z",
    },
    {
      id: "2",
      type: "PullRequestEvent",
      repo: { name: "organization/react-native-app" },
      actor: {
        login: username,
        avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
      },
      payload: {
        action: "opened",
        pull_request: {
          title: "Implement dynamic theme support",
          number: 42,
          state: "open",
        },
      },
      created_at: "2025-05-11T09:15:44Z",
    },
    {
      id: "3",
      type: "IssueCommentEvent",
      repo: { name: "organization/design-system" },
      actor: {
        login: username,
        avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
      },
      payload: {
        action: "created",
        issue: {
          title: "Button component inconsistent on Android",
          number: 78,
          state: "open",
        },
      },
      created_at: "2025-05-10T16:22:31Z",
    },
  ];
}

import { Story, StoryInterface } from "@/types/interfaces";
import { url } from "@/utils/url-api";
import { useQuery } from "@tanstack/react-query";
import { Alert } from "react-native";

export default function StoriesUser(userId: string) {
  const { data: stories, error, isLoading, refetch } = useQuery<{ stories: Story[]; viewedStories: Set<string> }>({
    queryKey: ["stories", userId],
    queryFn: async () => {
      if (!userId) return { stories: [], viewedStories: new Set<string>() };

      const response = await fetch(`${url}/api/user/getStories/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar Stories.");
      }

      const viewedStoriesSet: Set<string> = new Set(
        data.filter((story: any) => story.isViewed).map((story: any) => story.id)
      );

      return {
        stories: Array.isArray(data) ? data : [],
        viewedStories: viewedStoriesSet,
      };
    },
    staleTime: 1000,
    enabled: !!userId,
  });

  return {
    stories: stories?.stories || [],
    viewedStories: stories?.viewedStories || new Set<string>(),
    isLoading,
    error,
    refetch,
  };
}


export const createStory = async (userId: string, story: StoryInterface) => {
  try {
    const response = await fetch(`${url}/api/user/storiesCreate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...story }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Erro ao enviar Story.");
    return data;
  } catch (error) {
    console.error(error);
    Alert.alert("Erro", "Falha ao enviar Story.");
    throw error;
  }
};

export const onStoryView = async (userId: string, storyId: string) => {
  try {
    const res = await fetch(`${url}/api/user/stories/view`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, storyId }),
    })

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erro ao marcar Story como vista.");
  } catch (error) {
    console.error(error);
    Alert.alert("Erro", "Falha ao marcar Story como vista.");
    throw error;
  }
}

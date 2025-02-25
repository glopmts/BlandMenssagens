import { Story } from "@/types/interfaces";
import { url } from "@/utils/url-api";
import { useQuery } from "@tanstack/react-query";
import { Alert, ToastAndroid } from "react-native";

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


export const createStory = async (userId: string, imageUrl: string, text: string, videoUrl: string) => {
  try {
    const response = await fetch(`${url}/api/user/storiesCreate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, imageUrl, text, videoUrl }),
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

export const handleDeleteStories = (userId: string, storyId: string, refetch: () => void) => {
  Alert.alert(
    "Excluir Story",
    "Tem certeza que deseja excluir esta Story?",
    [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Excluir",
        onPress: async () => {
          try {
            const res = await fetch(`${url}/api/user/stories/deleteStory`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userId, storyId }),
            });

            const data = await res.json();
            if (!res.ok) {
              throw new Error(data.error || "Erro desconhecido ao excluir Story.");
            }

            ToastAndroid.show("Story excluído com sucesso!", ToastAndroid.SHORT);
            refetch();
          } catch (error) {
            if (error instanceof Error) {
              console.error("Erro ao excluir Story:", error);
              Alert.alert("Erro", error.message);
            }
          }
        }
      },
    ],
    { cancelable: true }
  );
};

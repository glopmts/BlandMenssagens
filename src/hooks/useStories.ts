import { url } from "@/utils/url-api";
import { useQuery } from "@tanstack/react-query";
import { Alert } from "react-native";

export default function StoriesUser(userId: string) {
  const { data: stories, error, isLoading, refetch } = useQuery({
    queryKey: ["stories", userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await fetch(`${url}/api/user/getStories/${userId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar Stories.");
      }
      return (data);
    },
    staleTime: 1000 * 60 * 1,
    enabled: !!userId,
  })

  return {
    stories,
    isLoading,
    error,
    refetch,
  }
}

type Story = {
  imageUrl?: string;
  text?: string;
  videosUrl?: string;
}

export const createStory = async (userId: string, story: Story) => {
  try {
    const response = await fetch(`${url}/api/user/storiesCreate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...story }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Erro ao enviar Story.");
    }
    return data;
  } catch (error) {
    console.error(error);
    Alert.alert("Erro", "Falha ao enviar Story.");
  }
}
import { User } from "@/types/interfaces";
import { url } from "@/utils/url-api";
import { useQuery } from "@tanstack/react-query";
import { Alert } from "react-native";

interface UserProps {
  userId: string;
}

interface UserData {
  id: string;
  name: string;
  imageurl: string | null;
  isOnline: boolean;
  phone?: string | null;
  email?: string | null;
}

export default function useUserData({ userId }: UserProps) {
  const { data, error, isLoading } = useQuery<User>({
    queryKey: ["userData", userId],
    queryFn: async () => {
      if (!userId) throw new Error("ID do usuário inválido");

      const response = await fetch(`${url}/api/user/${userId}`);
      if (!response.ok) throw new Error("Falha ao buscar dados do usuário");

      const userData = await response.json();
      return userData;
    },
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 15,
    enabled: !!userId,
  });

  if (error) {
    Alert.alert("Erro", error.message);
  }

  return {
    userData: data,
    isLoading,
    error,
  };
}

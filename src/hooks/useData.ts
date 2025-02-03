import { url } from "@/utils/url-api";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

interface UserProps {
  userId: string;
}

interface UserState {
  id?: string;
  name: string;
  imageurl: string | null;
  isOnline: boolean;
  isLoader: boolean;
  error: string | null;
  phone?: string | null;
  email?: string | null;
}

export default function UserData({ userId }: UserProps) {
  const [state, setState] = useState<UserState>({
    name: "",
    imageurl: null,
    isOnline: false,
    isLoader: true,
    error: null,
  });
  const [userData, setUser] = useState<UserState | null>(null);

  const fetchData = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await fetch(`${url}/api/user/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();
      setState({
        name: userData.name,
        imageurl: userData.imageurl,
        isOnline: userData.isOnline,
        isLoader: false,
        error: null,
      });
      setUser(userData);
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        isLoader: false,
        error: (error as Error).message || "Unknown error",
      }));
      Alert.alert("Error", "Failed to fetch user data");
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    name: state.name,
    image: state.imageurl,
    isOnline: state.isOnline,
    isLoader: state.isLoader,
    error: state.error,
    userData: userData
  };
}

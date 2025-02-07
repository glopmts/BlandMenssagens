import { Contact } from "@/types/interfaces";
import { url } from "@/utils/url-api";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export function ContactsListUser({ userId }: { userId: string }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [commercialContacts, setCommercialContacts] = useState<Contact[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadContacts = async (userId: string) => {
    if (!userId) return;

    try {
      const response = await fetch(`${url}/api/user/contacts/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        setError("Não foi possível buscar contatos.");
        throw new Error(data.message || "Erro ao buscar contatos.");
      }

      setContacts(data.contacts);
      setCommercialContacts(data.commercialContacts);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadContacts(userId);
    }
  }, [userId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (userId) {
      loadContacts(userId).finally(() => setRefreshing(false));
    }
  }, [userId]);

  return {
    onRefresh,
    contacts,
    commercialContacts,
    isLoading,
    error,
    loadContacts,
    refreshing,
  };
}

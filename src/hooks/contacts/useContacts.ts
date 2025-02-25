import { Contact } from "@/types/interfaces";
import { url } from "@/utils/url-api";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

type NoContactProps = {
  phone: string;
  isUnknown: boolean;
};

type ContactListProps = {
  userId: string;
  chatWithToken: string;
}

type ContactResp = {
  contact: {
    id: string;
    name: string;
    phone: string;
    imageurl: string | null;
    isOnline: boolean;
    lastOnline: Date;
  },
  name: string;

}

export function ContactsListUser(userId: string, chatWithToken?: string) {
  const [commercialContacts, setCommercialContacts] = useState<Contact[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [noContact, setNoContact] = useState<NoContactProps | null>(null);
  const [contact, setContact] = useState<ContactResp | null>(null);

  const { data: contacts, error, isLoading, refetch } = useQuery({
    queryKey: ["contacts", userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await fetch(`${url}/api/user/contacts/${userId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar contatos.");
      }
      return (data.contacts || []);
    },
    staleTime: 1000 * 60 * 1,
    enabled: !!userId,
  })

  const fetchContactInfo = async () => {
    if (!userId || !chatWithToken) return;

    try {
      const response = await fetch(`${url}/api/user/contactInfor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, chatWithToken: chatWithToken }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar informações do contato.");
      }
      setNoContact(data.contactInfo);
      setContact(data.contact);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  useEffect(() => {
    if (chatWithToken) {
      fetchContactInfo();
    }
  }, [userId, chatWithToken]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return {
    onRefresh,
    contacts,
    commercialContacts,
    isLoading,
    error,
    refreshing,
    noContact,
    contact
  };
}

import { Mensagens } from "@/types/interfaces";
import { url } from "@/utils/url-api";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(url || "https://backend-app-send.vercel.app");

export function useMessages(chatId: string, userId: string) {
  const [messages, setMessages] = useState<Mensagens[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.on(`chat:${userId}`, (message: Mensagens) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on(`chat:${chatId}`, (message: Mensagens) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off(`chat:${userId}`);
      socket.off(`chat:${chatId}`);
    };
  }, [userId, chatId]);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`${url}/api/menssagens/${userId}`);
        if (!res.ok) throw new Error("Erro ao buscar mensagens");
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [userId]);

  const sendMessage = (content: string) => {
    const newMessage: Mensagens = {
      id: Date.now().toString(),
      sender_id: chatId,
      receiver_id: userId,
      content,
      created_at: new Date().toISOString(),
      status: "send",
      contact_name: "",
      contact_phone: "",
      images: [],
    };

    socket.emit("send_message", newMessage);
  };

  return { messages, loading, sendMessage };
}

import { Mensagens } from "@/types/interfaces";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://192.168.18.8:5001");

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
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();

    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMessage = payload.new as Mensagens;
          if (newMessage.receiver_id === userId || newMessage.sender_id === userId) {
            setMessages((prev) => [...prev, newMessage]);
          }
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const sendMessage = (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      sender_id: chatId,
      receiver_id: userId,
      content,
      created_at: new Date().toISOString(),
      status: "send" as "send" | "delivered" | "read",
      contact_name: "",
      contact_phone: "",
      images: [],
    };
    socket.emit("send_message", newMessage);
  };

  return { messages, loading, sendMessage };
}

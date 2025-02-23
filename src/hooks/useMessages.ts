import { socket } from "@/server/socket-io";
import { Mensagens } from "@/types/interfaces";
import { url } from "@/utils/url-api";
import { useEffect, useState } from "react";
import { Alert, ToastAndroid } from "react-native";

type SendMenssagenProps = {
  content: string,
  legendImage: string,
  imageUrl: string[],
  audioUrl?: string,
  filesUrls: string[],
}

export function useMessages(userId: string, chatId: string,) {
  const [messages, setMessages] = useState<Mensagens[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return

    socket.on(`chat:${userId}`, (message: Mensagens) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      socket.off(`chat:${userId}`)
    }
  }, [socket, userId])

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`${url}/api/user/menssagens?userId=${userId}&chatWithToken=${chatId}`)
        if (!res.ok) {
          throw new Error("Failed to fetch messages")
        }
        const data = await res.json()
        setMessages(data)
      } catch (error) {
        console.error("Error fetching messages:", error)
        setError("Failed to load messages. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [userId, chatId, url])


  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      await fetch(`${url}/api/user/updateMessageStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageId, userId, status }),
      });
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  }

  const handleDeleteMessage = async (messageId: string[]) => {

    try {
      const res = await fetch(`${url}/api/user/deleteMessages`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          messageId: messageId,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error?.message || "Unknown error")
      }

      ToastAndroid.show("Mensagem deletada com sucesso!", ToastAndroid.SHORT);
      setMessages((prev) => prev.filter((msg) => !messageId.includes(msg.id)));
    } catch (err) {
      Alert.alert("Erro ao deletar mensagem");
      console.error("Erro deletando mensagem:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = ({ content, legendImage, imageUrl, audioUrl, filesUrls }: SendMenssagenProps) => {
    const newMessage: Mensagens = {
      id: Date.now().toString(),
      sender_id: userId,
      receiver_id: chatId,
      content,
      created_at: new Date().toISOString(),
      status: "send",
      legendImage: legendImage,
      is_deleted: false,
      images: imageUrl,
      audioUrl: audioUrl,
      filesUrls: filesUrls,
    };

    setMessages((prev) => [...prev, newMessage])

    try {
      socket.emit("send_message", {
        sender_id: userId,
        receiver_id: chatId,
        content,
        created_at: new Date().toISOString(),
        status: "send",
        legendImage: legendImage,
        is_deleted: false,
        images: imageUrl,
        audioUrl: audioUrl,
        filesUrls: filesUrls,
      })
    } catch (error) {
      setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id))
      setError("Failed to send message. Please try again.")
    }
  };

  return { messages, loading, sendMessage, handleDeleteMessage, updateMessageStatus };
}

export const handleClearMenssagens = async (userId: string, chatWith: string) => {
  Alert.alert("Trabalhando nesta função!")
}


export const handleChatUser = async (userId: string, chatWith: string) => {
  try {
    await fetch(`${url}/api/user/deleteChatUser`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, chatWith }),
    });
    ToastAndroid.show("Mensagens limpas com sucesso!", ToastAndroid.SHORT);
  } catch (error) {
    console.error("Error clearing messages:", error);
  }
}

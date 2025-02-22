import { socket } from "@/server/socket-io";
import { deleteOldAudio, deleteOldImage } from "@/types/deleteImagemFirebase";
import { Mensagens } from "@/types/interfaces";
import { url } from "@/utils/url-api";
import { useEffect, useState } from "react";
import { Alert, ToastAndroid } from "react-native";


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
        setLoading(true)
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

  const handleDeleteMessage = async (messageId: string, createdAt: string, userId: string, audioUrl?: string, images: string[] = []) => {
    const messageTime = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - messageTime;
    const fiveMinutes = 5 * 60 * 1000;

    const deleteImages = async () => {
      if (images.length > 0) {
        await Promise.all(images.map((url) => deleteOldImage(url)));
      }
    };

    const deleteAudio = async () => {
      if (audioUrl) {
        await deleteOldAudio(audioUrl);
      }
    };

    Alert.alert(
      "Deletar Mensagem",
      timeDifference < fiveMinutes
        ? "Esta mensagem será deletada para todos. Tem certeza?"
        : "Esta mensagem será deletada apenas para você. Tem certeza?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          onPress: async () => {
            try {
              await deleteImages();
              await deleteAudio();

              await fetch(`${url}/api/user/deleteMessagen`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ messageId, userId }),
              });

              ToastAndroid.show("Mensagem deletada com sucesso!", ToastAndroid.SHORT);
              setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
            } catch (err) {
              Alert.alert("Erro ao deletar mensagem");
              console.error("Erro deletando mensagem:", err);
            }
          },
        },
      ]
    );
  };


  const sendMessage = (content: string, legendImage: string, imageUrl: string[] = [], audioUrl?: string) => {
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
      audioUrl: audioUrl
    };

    setMessages((prev) => [...prev, newMessage])

    try {
      socket.emit("send_message", {
        sender_id: userId,
        receiver_id: chatId,
        content,
        images: imageUrl,
        audioUrl,
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

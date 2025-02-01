import { Mensagens } from "@/types/interfaces"
import { supabase } from "@/utils/supabase"
import { useEffect, useState } from "react"
import io from "socket.io-client"

export function useMessages(chatId: string, userId: string) {
  const [messages, setMessages] = useState<Mensagens[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const socket = io("YOUR_SOCKET_SERVER_URL", {
      auth: {
        userId,
      },
    })

    socket.on("new_message", (message: Mensagens) => {
      if (message.receiver_id === userId || message.sender_id === userId) {
        setMessages((prev) => [...prev, message])
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [userId])

  useEffect(() => {
    async function fetchMessages() {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("sender_id", chatId)
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
          .order("created_at", { ascending: true })


        if (error) throw error
        setMessages(data || [])
      } catch (error) {
        console.error("Error fetching messages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

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
          const newMessage = payload.new as Mensagens
          if (newMessage.receiver_id === userId || newMessage.sender_id === userId) {
            setMessages((prev) => [...prev, newMessage])
          }
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId])

  const sendMessage = async (content: string, receiverId: string) => {
    try {
      const newMessage = {
        sender_id: userId,
        receiver_id: receiverId,
        content,
        created_at: new Date().toISOString(),
        status: "send",
      }

      const { error } = await supabase.from("messages").insert([newMessage])

      if (error) throw error
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  return {
    messages,
    loading,
    sendMessage,
  }
}


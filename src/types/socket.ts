export interface ServerToClientEvents {
  new_message: (message: {
    id: string
    sender_id: string
    receiver_id: string
    content: string
    created_at: string
    status: "send" | "delivered" | "read"
  }) => void
}

export interface ClientToServerEvents {
  join_room: (userId: string) => void
  send_message: (message: {
    sender_id: string
    receiver_id: string
    content: string
  }) => void
  message_read: (messageId: string) => void
}

export interface InterServerEvents {
  ping: () => void
}

export interface SocketData {
  userId: string
}

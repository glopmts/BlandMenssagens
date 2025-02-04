
export interface Contact {
  id: string;
  name: string;
  contact_id?: string;
  phone: string;
  clerk_id?: string;
  image?: string | null;
  created_at: Date;
  phoneNumbers?: { number: string }[];
}

export interface User {
  id: string;
  clerk_id: string;
  name: string | null;
  phone: string;
  imageurl?: string | null;
  email: string | null;
  last_seen: Date;
}

export interface Mensagens {
  sender?: any;
  receiver?: any;
  id: string
  sender_id: string
  receiver_id: string
  content: string
  legendImage?: string,
  created_at: string
  contact_name: string
  contact_phone: string
  is_deleted: boolean
  contact_image?: string | null;
  images: string[]
  status: "send" | "delivered" | "read"
}

export interface MessageProperties {
  item: Mensagens
  user: any
  colors: any
  handleCopy: (text: string, messageId: string) => void
  downloadImage: (image: string) => void
  deleteMessage: (messageId: string, created_at: string) => void
}

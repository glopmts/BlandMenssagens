
export interface Contact {
  id: string;
  name: string;
  contact_id?: string;
  phone: string;
  clerk_id?: string;
  image?: string | null;
  created_at: Date;
  isUnknown: boolean;
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
  isOnline?: boolean;
  search_token?: string;
}

export interface Mensagens {
  contact_name?: string;
  sender?: any;
  receiver?: any;
  id: string
  sender_id: string
  receiver_id: string
  content: string
  legendImage?: string,
  created_at: string
  is_deleted: boolean;
  hidden_by_sender?: boolean;
  hidden_by_receiver?: boolean;
  deleted_at_receiver?: Date;
  deleted_at_sender?: Date;
  contact_image?: string | null;
  images: string[],
  files: string[],
  status: "send" | "delivered" | "read"
  audioUrl?: string;
}

export interface MessageProperties {
  item: Mensagens
  user?: any
  userId: string
  colors: any
  imageUser?: string
  handleCopy: (text: string, messageId: string, legendImage: string) => void
  downloadImage: (image: string) => void
  deleteMessage: (messageId: string, created_at: string) => void;
  updateMessageStatus: (messageId: string, newStatus: string) => void;
}

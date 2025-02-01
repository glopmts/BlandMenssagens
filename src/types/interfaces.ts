interface ImagePickerResult {
  canceled: boolean;
  assets: {
    uri: string;
  }[];
}

interface SupabaseStorageResponse {
  data: {
    path: string;
  } | null;
  error: Error | null;
}

interface SupabasePublicUrlResponse {
  data: {
    publicUrl: string;
  } | null;
}

export interface Contact {
  id: string;
  name: string;
  image?: string | null;
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
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  contact_name: string
  contact_phone: string
  status: "send" | "delivered" | "read"
}

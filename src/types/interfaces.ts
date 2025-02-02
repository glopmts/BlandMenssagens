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
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  contact_name: string
  contact_phone: string
  contact_image?: string | null;
  images: string[]
  status: "send" | "delivered" | "read"
}

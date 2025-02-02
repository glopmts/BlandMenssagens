import { supabase } from "./supabase"

export async function updateUserOnlineStatus(userId: string | undefined, isOnline: boolean): Promise<void> {
  if (!userId) return

  const { error } = await supabase
    .from("users")
    .update({
      isOnline,
      lastOnline: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) {
    console.error(`Error updating online status to ${isOnline}:`, error.message)
  }
}


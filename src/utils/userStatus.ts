import { url } from "./url-api";

export async function updateUserOnlineStatus(userId: string | undefined, isOnline: boolean): Promise<void> {
  if (!userId) {
    return;
  }

  const lastOnline = new Date().toISOString()

  const userUpdated = await fetch(`${url}/api/user/updateIsOnline`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, isOnline, lastOnline }),
  })
  const { error } = await userUpdated.json()

  if (error) {
    console.error(`Error updating online status to ${isOnline}:`, error.message)
  }
}


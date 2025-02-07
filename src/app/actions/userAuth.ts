import { url } from "@/utils/url-api";
import { useEffect } from "react";

export default function CreateUserBackend({ userId }: { userId: string }) {

  if (!userId) {
    return null;
  }

  useEffect(() => {
    const saveUserInfo = async () => {
      const userInfo = await fetch(`${url}/api/user/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clerk_id: userId }),
      })
      if (!userInfo.ok) {
        throw new Error('Failed to save user info');
      }
    };
    saveUserInfo();
  }, [userId]);
  return null;
}
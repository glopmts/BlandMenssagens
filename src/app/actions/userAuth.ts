import { url } from "@/utils/url-api";
import { useUser } from "@clerk/clerk-expo";
import { parsePhoneNumber } from "libphonenumber-js";
import { useEffect } from "react";

export default function CreateUserBackend() {
  const { user } = useUser()
  useEffect(() => {
    const saveUserInfo = async () => {
      if (user) {
        const phoneNumber = user.phoneNumbers[0]?.phoneNumber;
        if (!phoneNumber) {
          console.error("No phone number found for user");
          return;
        }

        const phoneNumberFormatted = parsePhoneNumber(phoneNumber, "BR")?.format("E.164");
        if (!phoneNumberFormatted) {
          console.error("Error formatting phone number");
          return;
        }

        try {
          const response = await fetch(`${url}/api/user/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              clerk_id: user.id,
              phone: phoneNumberFormatted,
            }),
          });

          const data = await response.json();
          console.log("Resposta do backend:", data)

          if (!response.ok) {
            throw new Error("Failed to save user");
          }

          console.log("User saved successfully");
        } catch (error) {
          console.error("Error saving user:", error);
        }
      }
    };

    saveUserInfo();
  }, [user]);
}
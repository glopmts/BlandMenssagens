import { url } from "@/utils/url-api";
import { Alert, ToastAndroid } from "react-native";

export default function DeleteContact({ contactId, userId }: { contactId: string, userId: string }) {
  const deleteContact = async () => {
    try {
      const res = await fetch(`${url}/api/user/deleteContact`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contactId, userId }),
      },);
      if (!res.ok) {
        throw new Error("Falha ao deletar contato.");
      }
      ToastAndroid.show("Contato deletado com sucesso", ToastAndroid.SHORT)
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error ao deletar contato ' + error.message)
        ToastAndroid.show("Erro ao deletar contato", ToastAndroid.SHORT);
      }
    }
  }

  return {
    deleteContact
  }
}
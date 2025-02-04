import { storage } from "@/utils/firebase";
import { deleteObject, ref } from "firebase/storage";

export const deleteOldImage = async (imageUrl: string) => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Erro ao excluir a imagem antiga:", error);
  }
};
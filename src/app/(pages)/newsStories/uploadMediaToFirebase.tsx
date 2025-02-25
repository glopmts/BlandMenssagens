import { storage } from "@/utils/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export const uploadMediaToFirebase = async (uri: string, fileType: "image" | "video") => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const fileName = `${Date.now()}.${fileType === "image" ? "jpg" : "mp4"}`;
    const storageRef = ref(storage, `app-menssagens/stories/${fileName}`);

    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    throw error;
  }
};

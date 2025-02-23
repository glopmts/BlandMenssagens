
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { Alert, Platform, ToastAndroid } from "react-native";

export const downloadImage = async (imageUrl: string) => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync()
    if (status !== "granted") {
      if (Platform.OS === "android") {
        ToastAndroid.show("Permissão negada para acessar a biblioteca de mídia", ToastAndroid.SHORT)
      } else {
        alert("Permissão negada para acessar a biblioteca de mídia")
      }
      return
    }

    const fileUri = FileSystem.documentDirectory + "temp_image.jpg"
    const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri)

    const asset = await MediaLibrary.createAssetAsync(uri)
    await MediaLibrary.createAlbumAsync("BlobSendImagens", asset, false)

    await FileSystem.deleteAsync(uri)

    if (Platform.OS === "android") {
      ToastAndroid.show("Imagem salva na galeria!", ToastAndroid.SHORT)
    } else {
      alert("Imagem salva na galeria!")
    }

    return imageUrl
  } catch (error) {
    console.error("Erro ao baixar imagem:", error)
    if (Platform.OS === "android") {
      ToastAndroid.show("Erro ao baixar imagem!", ToastAndroid.SHORT)
    } else {
      alert("Erro ao baixar imagem!")
    }
    return null
  }
}


export const downloadFiles = async (fileUrl: string) => {
  try {
    const fileName = "arquivos_bland";
    if (!FileSystem.documentDirectory) {
      throw new Error("Diretório de documentos não está disponível.");
    }

    const directory = FileSystem.documentDirectory + "files/";
    const fileUri = directory + fileName;

    const dirInfo = await FileSystem.getInfoAsync(directory);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    }

    const { uri } = await FileSystem.downloadAsync(fileUrl, fileUri);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert("Download concluído", "O arquivo foi salvo em: " + uri);
    }
  } catch (error) {
    console.error("Erro ao baixar o arquivo:", error);
    Alert.alert("Erro", "Não foi possível baixar o arquivo.");
  }
};
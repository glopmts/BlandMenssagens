import NoAddContact from "@/components/conatcts/NoContactAdd"
import MenuOptions from "@/components/MenuOptionsMenssagens"
import AudioRecorder from "@/components/messages/MessageAud"
import { MessageItem } from "@/components/messages/MessagensRenderChat"
import { ContactsListUser } from "@/hooks/contacts/useContacts"
import { useMessages } from "@/hooks/useMessages"
import { useTheme } from "@/hooks/useTheme"
import { deleteOldImage } from "@/types/DeleteItensFirabese"
import type { FilePreview, Mensagens } from "@/types/interfaces"
import { storage } from "@/utils/firebase"
import { downloadFiles, downloadImage } from "@/utils/saveImagesUrl"
import { useAuth } from "@clerk/clerk-expo"
import { Ionicons } from "@expo/vector-icons"
import * as Clipboard from "expo-clipboard"
import * as DocumentPicker from "expo-document-picker"
import * as FileSystem from 'expo-file-system'
import { Image } from "expo-image"
import * as ImageManipulator from "expo-image-manipulator"
import * as ImagePicker from "expo-image-picker"
import { useLocalSearchParams } from "expo-router"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useRef, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native"
import { stylesChat } from "../../../styles/stylesChat"

export default function MensagensPageRender() {
  const { userId } = useAuth()
  const { id } = useLocalSearchParams<{ id: string }>()
  const chatWithToken = id
  const { colors } = useTheme()
  const {
    messages,
    loading,
    sendMessage,
    handleDeleteMessage,
    updateMessageStatus
  } = useMessages(userId || "", id)
  const { noContact } = ContactsListUser(userId!, chatWithToken)
  const [newMessage, setNewMessage] = useState("")
  const [legendImage, setLegendImage] = useState("")
  const [imageUrl, setImageUrl] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const flatListRef = useRef<FlatList>(null)
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)
  const [files, setFiles] = useState<string[]>([])
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null)

  const handleCopy = async (text: string, id: string, legendImage: string) => {
    try {
      const copyText = legendImage ? `${text}\n${legendImage}` : text
      await Clipboard.setStringAsync(copyText)
      ToastAndroid.show("Mensagem copiada!", ToastAndroid.SHORT)
    } catch (error) {
      console.error("Erro ao copiar para a área de transferência:", error)
    }
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
      aspect: [4, 3],
      allowsMultipleSelection: true,
    })

    if (!result.canceled && result.assets.length > 0) {
      const compressedImages = await Promise.all(
        result.assets.map(async (asset) => {
          const manipResult = await ImageManipulator.manipulateAsync(asset.uri, [{ resize: { width: 800 } }], {
            compress: 0.7,
            format: ImageManipulator.SaveFormat.JPEG,
          })
          return manipResult.uri
        }),
      )
      setImageUrl(compressedImages)
    }
  }

  const uploadImage = async (uris: string[]) => {
    try {
      setIsUploading(true)
      const uploadedUrls = await Promise.all(
        uris.map(async (uri) => {
          const response = await fetch(uri)
          const blob = await response.blob()
          const storageRef = ref(
            storage,
            `app-menssagens/chat-images/${Date.now()}-${userId}-${Math.random().toString(36).substring(7)}`,
          )
          await uploadBytes(storageRef, blob)
          return getDownloadURL(storageRef)
        }),
      )
      return uploadedUrls
    } catch (error) {
      console.error("Error uploading images:", error)
      ToastAndroid.show("Error uploading images", ToastAndroid.SHORT)
      return []
    } finally {
      setIsUploading(false)
    }
  }

  const handleSend = async () => {
    if (!newMessage.trim() && (!imageUrl || imageUrl.length === 0) && (!files || files.length === 0)) return
    let uploadedImageUrls: string[] = []
    if (imageUrl.length > 0) {
      uploadedImageUrls = await uploadImage(imageUrl)
    }
    await sendMessage({
      content: newMessage,
      legendImage,
      imageUrl: uploadedImageUrls,
      filesUrls: files,
    })
    setNewMessage("")
    setImageUrl([])
    setLegendImage("")
    setFiles([])
    setFilePreview(null)
    Keyboard.dismiss()
    flatListRef.current?.scrollToEnd({ animated: true })
  }

  const handleSendAudio = async (audioUri: string) => {
    try {
      const response = await fetch(audioUri)
      const blob = await response.blob()
      const audioRef = ref(
        storage,
        `app-menssagens/audio/${Date.now()}-${userId}-${Math.random().toString(36).substring(7)}.m4a`,
      )
      await uploadBytes(audioRef, blob)
      const audioUrl = await getDownloadURL(audioRef)
      await sendMessage({
        content: "",
        legendImage: "",
        imageUrl: [],
        filesUrls: [],
        audioUrl,
      })
    } catch (error) {
      console.error("Error sending audio message:", error)
      ToastAndroid.show("Error sending audio message", ToastAndroid.SHORT)
    }
  }

  const closeImage = async () => {
    try {
      await Promise.all(imageUrl.map((url) => deleteOldImage(url)))
      setImageUrl([])
      setLegendImage("")
      ToastAndroid.show("Imagem removida!", ToastAndroid.SHORT)
    } catch (error) {
      console.error("Erro ao excluir imagem:", error)
      ToastAndroid.show("Erro ao remover imagem", ToastAndroid.SHORT)
    }
  }

  const handleMenu = () => {
    setIsKeyboardOpen(!isKeyboardOpen)
  }

  const handleFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "text/plain",
        ],
        copyToCacheDirectory: true,
      })

      if (result.canceled) return
      const file = result.assets[0]
      setFilePreview({
        uri: file.uri,
        type: file.mimeType || "application/octet-stream",
        name: file.name,
        size: file.size,
      })

      const response = await fetch(file.uri)
      const blob = await response.blob()
      const fileRef = ref(storage, `app-menssagens/files/${Date.now()}-${userId}-${file.name}`)
      await uploadBytes(fileRef, blob)
      const fileUrl = await getDownloadURL(fileRef)
      setFiles((prev) => [...prev, fileUrl]);
      return fileUrl
    } catch (error) {
      console.error("Erro ao selecionar arquivo:", error)
      ToastAndroid.show("Erro ao selecionar arquivo", ToastAndroid.SHORT)
    }
  }

  const handleAudiosUrls = async () => {

  }

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permissão para acessar a câmera é necessária!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];

      if (!FileSystem.documentDirectory) {
        alert('Falha ao acessar o diretório de documentos');
        return;
      }
      const newUri = FileSystem.documentDirectory + uri.split('/').pop();
      await FileSystem.copyAsync({ from: uri, to: newUri });

      setImageUrl([newUri]);
    }
  };


  if (loading) {
    return (
      <View
        style={[
          stylesChat.container,
          { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size={36} color={colors.primary} />
      </View>
    )
  }

  const renderMessage = ({ item }: { item: Mensagens }) => (
    <MessageItem
      item={item}
      userId={userId!}
      colors={colors}
      handleCopy={handleCopy}
      downloadImage={downloadImage}
      downloadFiles={downloadFiles}
      updateMessageStatus={updateMessageStatus}
      deleteMessage={(messageId) => handleDeleteMessage(messageId)}
    />
  )

  const renderFilePreview = () => {
    if (!filePreview) return null

    return (
      <View style={stylesChat.filePreviewContainer}>
        <View style={[stylesChat.filePreview, { backgroundColor: colors.card }]}>
          <Ionicons name="document-outline" size={24} color={colors.text} />
          <View style={stylesChat.fileInfo}>
            <Text style={[stylesChat.fileName, { color: colors.text }]} numberOfLines={1}>
              {filePreview.name}
            </Text>
            {filePreview.size && (
              <Text style={[stylesChat.fileSize, { color: colors.gray }]}>
                {(filePreview.size / 1024).toFixed(1)} KB
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={() => setFilePreview(null)} style={stylesChat.removeFileButton}>
            <Ionicons name="close-circle" size={24} color={colors.gray} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={[stylesChat.container, { backgroundColor: colors.background }]}>
      <View style={[stylesChat.header, { borderBottomColor: colors.borderColor }]}>
        {noContact && (
          <View>
            <NoAddContact number={noContact.phone!} contactId={id!} userId={userId!} />
          </View>
        )}
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => `${item.id}-${item.sender_id}-${item.created_at}-${index}`}
        contentContainerStyle={stylesChat.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {imageUrl && imageUrl.length > 0 && (
        <View style={stylesChat.imagePreviewContainer}>
          {imageUrl.map((url, index) => (
            <Image key={index} source={{ uri: url }} style={stylesChat.imagePreview} />
          ))}
          <TouchableOpacity onPress={closeImage} style={stylesChat.removeImageButton}>
            <Ionicons name="close-circle" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}


      {filePreview && renderFilePreview()}

      {isKeyboardOpen && (
        <MenuOptions
          onCilckImage={pickImage}
          onCilckFiles={handleFiles}
          onCilckCam={takePhoto}
          isVisible={isKeyboardOpen}
          onclickAudiosUrls={handleAudiosUrls}
          onClose={() => setIsKeyboardOpen(false)}
        />
      )}

      <View style={[stylesChat.inputContainer, { borderTopColor: colors.borderColor }]}>
        <View style={{ flex: 1 }}>
          {imageUrl.length > 0 ? (
            <TextInput
              style={[
                stylesChat.input,
                {
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.borderColor,
                  borderWidth: 1,
                },
              ]}
              value={legendImage}
              onChangeText={setLegendImage}
              placeholder="Legenda imagem.."
              placeholderTextColor={colors.PlaceholderTextColor}
              multiline={true}
              scrollEnabled={true}
              textAlignVertical="center"
            />
          ) : (
            <View style={{ flexDirection: "row", gap: 4 }}>
              <TextInput
                style={[
                  stylesChat.input,
                  {
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: colors.borderColor,
                    borderWidth: 1,
                  },
                ]}
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder={"Nova mensagem..."}
                placeholderTextColor={colors.PlaceholderTextColor}
                multiline={true}
                scrollEnabled={true}
                textAlignVertical="center"
              />
              <AudioRecorder onSend={handleSendAudio} />
            </View>
          )}
        </View>
        {isUploading ? (
          <ActivityIndicator size={24} color={colors.primary} style={{ marginLeft: 12 }} />
        ) : (
          <View style={{ position: "relative" }}>
            {newMessage.trim() || imageUrl.length > 0 || files.length > 0 ? (
              <TouchableOpacity
                style={[stylesChat.sendButton, { backgroundColor: colors.primary }]}
                onPress={handleSend}
              >
                <Ionicons name="send" size={24} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[stylesChat.sendButton, { backgroundColor: colors.backgroundColorContacts }]}
                onPress={handleMenu}
              >
                <Ionicons name="file-tray" size={24} color={colors.gray} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  )
}


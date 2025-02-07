import NoAddContact from "@/components/conatcts/NoContactAdd"
import AudioRecorder from "@/components/messages/MessageAud"
import { MessageItem } from "@/components/messages/MessagensRenderChat"
import { useMessages } from "@/hooks/useMessages"
import { useTheme } from "@/hooks/useTheme"
import { deleteOldImage } from "@/types/deleteImagemFirebase"
import type { Mensagens } from "@/types/interfaces"
import { storage } from "@/utils/firebase"
import { downloadImage } from "@/utils/saveImagesUrl"
import { url } from "@/utils/url-api"
import { useClerk } from "@clerk/clerk-expo"
import { Ionicons } from "@expo/vector-icons"
import * as Clipboard from "expo-clipboard"
import { Image } from "expo-image"
import * as ImageManipulator from "expo-image-manipulator"
import * as ImagePicker from "expo-image-picker"
import { useLocalSearchParams } from "expo-router"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useEffect, useRef, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native"
import { stylesChat } from "../../../styles/stylesChat"

export default function MensagensPageRender() {
  const { user } = useClerk()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { colors } = useTheme()
  const { messages, loading, sendMessage, handleDeleteMessage, updateMessageStatus } = useMessages(user?.id || "", id)
  const [newMessage, setNewMessage] = useState("")
  const [legendImage, setLegendImage] = useState("")
  const [imageUrl, setImageUrl] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const flatListRef = useRef<FlatList>(null)
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [imageUser, setImage] = useState<string | null>(null)
  const contactId = messages.find((d) => user?.id === d.receiver_id)?.sender_id

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${url}/api/user/${contactId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch user data")
      }
      const userData = await response.json()
      setPhoneNumber(userData.phone)
      setImage(userData.imageurl)
    }
    fetchData()
  }, [contactId])

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
            `app-menssagens/chat-images/${Date.now()}-${user?.id}-${Math.random().toString(36).substring(7)}`,
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
    if (!newMessage.trim() && (!imageUrl || imageUrl.length === 0)) return

    let uploadedImageUrls: string[] = []
    if (imageUrl.length > 0) {
      uploadedImageUrls = await uploadImage(imageUrl)
    }

    await sendMessage(newMessage, legendImage, uploadedImageUrls)
    setNewMessage("")
    setImageUrl([])
    setLegendImage("")
    Keyboard.dismiss()
    flatListRef.current?.scrollToEnd({ animated: true })
  }

  const handleSendAudio = async (audioUri: string) => {
    try {
      const response = await fetch(audioUri)
      const blob = await response.blob()
      const audioRef = ref(
        storage,
        `app-menssagens/audio/${Date.now()}-${user?.id}-${Math.random().toString(36).substring(7)}.m4a`,
      )
      await uploadBytes(audioRef, blob)
      const audioUrl = await getDownloadURL(audioRef)

      await sendMessage("", "", [], audioUrl)
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
      user={user}
      imageUser={imageUser!}
      colors={colors}
      handleCopy={handleCopy}
      downloadImage={downloadImage}
      updateMessageStatus={updateMessageStatus}
      deleteMessage={(messageId) => handleDeleteMessage(messageId, item.created_at, user?.id!, item.audioUrl)}
    />
  )

  return (
    <View style={[stylesChat.container, { backgroundColor: colors.background }]}>
      <View style={[stylesChat.header, { borderBottomColor: colors.borderColor }]}>
        <Text style={[stylesChat.headerText, { color: colors.gray }]}>
          As menssagens são protegidas com a criptografia de ponta a ponta e ficam somente entre você e os participantes
          desta conversa.
        </Text>
        <View>
          <NoAddContact number={phoneNumber!} contactId={id!} userId={user?.id!} />
        </View>
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
          <>
            {newMessage.trim() || imageUrl.length > 0 ? (
              <TouchableOpacity
                style={[stylesChat.sendButton, { backgroundColor: colors.primary }]}
                onPress={handleSend}
              >
                <Ionicons name="send" size={24} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[stylesChat.imageButton, { backgroundColor: colors.primary }]}
                onPress={pickImage}
              >
                <Ionicons name="image" size={24} color="#fff" />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  )
}


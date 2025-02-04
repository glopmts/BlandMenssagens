import { useMessages } from "@/hooks/useMessages"
import { useTheme } from "@/hooks/useTheme"
import type { Mensagens } from "@/types/interfaces"
import { storage } from "@/utils/firebase"
import { useClerk } from "@clerk/clerk-expo"
import { Ionicons } from "@expo/vector-icons"
import * as Clipboard from "expo-clipboard"
import { Image } from "expo-image"
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
  View,
} from "react-native"
import { stylesChat } from "../styles/stylesChat"

export default function MensagensPageRender() {
  const { user } = useClerk()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { colors } = useTheme()
  const { messages, loading, sendMessage } = useMessages(user?.id || "", id)
  const [newMessage, setNewMessage] = useState("")
  const [imageUrl, setImageUrl] = useState<string[] | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const flatListRef = useRef<FlatList>(null)

  const handleCopy = async (text: string) => {
    try {
      await Clipboard.setStringAsync(text)
      ToastAndroid.show("Mensagem copiada!", ToastAndroid.SHORT)
    } catch (error) {
      console.error("Erro ao copiar para a área de transferência:", error)
    }
  }

  const renderImages = (images: string[]) => {
    if (images.length === 1) {
      return <Image source={{ uri: images[0] }} style={stylesChat.image} />
    } else {
      return (
        <View style={stylesChat.imageGrid}>
          {images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={stylesChat.smallImage} />
          ))}
        </View>
      )
    }
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: true,
    })

    if (!result.canceled && result.assets.length > 0) {
      setIsUploading(true)
      try {
        const uploadedUrls = await Promise.all(
          result.assets.map(async (asset) => {
            const response = await fetch(asset.uri)
            const blob = await response.blob()

            const storageRef = ref(
              storage,
              `app-menssagens/chat-images/${Date.now()}-${user?.id}-${Math.random().toString(36).substring(7)}`,
            )
            await uploadBytes(storageRef, blob)
            return getDownloadURL(storageRef)
          }),
        )

        setImageUrl(uploadedUrls)
      } catch (error) {
        console.error("Error uploading images:", error)
        ToastAndroid.show("Error uploading images", ToastAndroid.SHORT)
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleSend = async () => {
    if (!newMessage.trim() && (!imageUrl || imageUrl.length === 0)) return

    await sendMessage(newMessage, imageUrl)
    setNewMessage("")
    setImageUrl(null)
    Keyboard.dismiss()
    flatListRef.current?.scrollToEnd({ animated: true })
  }

  const renderMessage = ({ item }: { item: Mensagens }) => (
    <TouchableOpacity
      onLongPress={() => handleCopy(item.content)}
      delayLongPress={300}
      style={[
        stylesChat.messageContainer,
        item.sender_id === user?.id ? stylesChat.sentMessage : stylesChat.receivedMessage,
      ]}
    >
      {item.images && item.images.length > 0 && <View style={stylesChat.ImagesChat}>{renderImages(item.images)}</View>}
      <View
        style={[
          stylesChat.messageBubble,
          {
            backgroundColor: item.sender_id === user?.id ? colors.primary : colors.card,
          },
        ]}
      >
        <Text style={[stylesChat.messageText, { color: item.sender_id === user?.id ? "#fff" : colors.text }]}>
          {item.content}
        </Text>
        <Text
          style={[
            stylesChat.timeText,
            { color: item.sender_id === user?.id ? "rgba(255, 255, 255, 0.7)" : colors.text },
          ]}
        >
          {new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
    </TouchableOpacity>
  )

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

  return (
    <View style={[stylesChat.container, { backgroundColor: colors.background }]}>
      <View style={[stylesChat.header, { borderBottomColor: colors.borderColor }]}>
        <Text style={[stylesChat.headerText, { color: colors.gray }]}>
          As menssagens são protegidas com a criptografia de ponta a ponta
          e ficam somente entre você e os participantes desta conversa.
        </Text>
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
          {renderImages(imageUrl)}
          <TouchableOpacity onPress={() => setImageUrl(null)} style={stylesChat.removeImageButton}>
            <Ionicons name="close-circle" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
      <View style={[stylesChat.inputContainer, { borderTopColor: colors.borderColor }]}>
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
          placeholder="Type a message..."
          placeholderTextColor={colors.PlaceholderTextColor}
          multiline={true}
          scrollEnabled={true}
          textAlignVertical="center"
        />

        {isUploading ? (
          <ActivityIndicator size={24} color={colors.primary} style={{ marginLeft: 12 }} />
        ) : (
          <>
            {newMessage.trim() || imageUrl ? (
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


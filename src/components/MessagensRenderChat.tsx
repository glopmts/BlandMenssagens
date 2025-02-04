import { stylesChat } from "@/app/(pages)/menssagens/styles/stylesChat"
import { Mensagens } from "@/types/interfaces"
import { Ionicons } from "@expo/vector-icons"
import { Image } from "expo-image"
import React, { useState } from "react"
import {
  Text,
  TouchableOpacity,
  View
} from "react-native"


interface MessageProperties {
  item: Mensagens
  user: any
  colors: any
  handleCopy: (text: string, messageId: string) => void
  downloadImage: (image: string) => void
  deleteMessage: (messageId: string) => void
}

export const MessageItem = React.memo(({ item, user, colors, handleCopy, downloadImage, deleteMessage }: MessageProperties) => {
  const [showOptions, setShowOptions] = useState(false);

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

  return (
    <TouchableOpacity
      onLongPress={() => setShowOptions(true)}
      delayLongPress={300}
      style={[
        stylesChat.messageContainer,
        item.sender_id === user?.id ? stylesChat.sentMessage : stylesChat.receivedMessage,
      ]}
    >
      {item.images && item.images.length > 0 && (
        <View style={stylesChat.ImagesChat}>
          {renderImages(item.images)}
        </View>
      )}
      {showOptions && (
        <View style={stylesChat.optionsButton}>
          <TouchableOpacity onPress={() => handleCopy(item.content, item.id)}>
            <Ionicons name="copy" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => item.images && downloadImage(item.images[0])}>
            <Ionicons name="download-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteMessage(item.id)}>
            <Ionicons name="trash" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowOptions(false)}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
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
  );
});
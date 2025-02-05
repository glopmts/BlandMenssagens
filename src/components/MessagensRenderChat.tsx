import { stylesChat } from "@/app/(pages)/menssagens/styles/stylesChat"
import { MessageProperties } from "@/types/interfaces"
import { Ionicons } from "@expo/vector-icons"
import { Image } from "expo-image"
import React, { useState } from "react"
import {
  Text,
  TouchableOpacity,
  View
} from "react-native"
import FullScreenImage from "./FullScreenImagem"


export const MessageItem = React.memo(({ item, user, colors, handleCopy, downloadImage, deleteMessage }: MessageProperties) => {
  const [showOptions, setShowOptions] = useState(false);
  const messageTime = new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const renderImages = (images: string[]) => {
    return (
      <View style={stylesChat.ImagesChat}>
        {images.length === 1 ? (
          <View style={stylesChat.imageContainer}>
            <FullScreenImage imageUrl={images[0]} />
            {!item.legendImage && (
              <Text style={[stylesChat.imageTime, { color: colors.text }]}>{messageTime}</Text>
            )}
          </View>
        ) : (
          <View style={stylesChat.imageGrid}>
            {images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={stylesChat.smallImage} />
            ))}
          </View>
        )}
        {item.legendImage && (
          <View style={stylesChat.imageCaption}>
            <Text style={[stylesChat.messageText, { color: colors.text }]}>{item.legendImage}</Text>
            <Text style={[stylesChat.timeText, { color: colors.text }]}>{messageTime}</Text>
          </View>
        )}
      </View>
    );
  };

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
        <View style={[stylesChat.ImagesChat, { backgroundColor: item.sender_id === user?.id ? colors.primary : colors.card, }]}>
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
          <TouchableOpacity onPress={() => deleteMessage(item.id, item.created_at)}>
            <Ionicons name="trash" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowOptions(false)}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
      {item.content && (
        <View
          style={[
            stylesChat.messageBubble,
            { backgroundColor: item.sender_id === user?.id ? colors.primary : colors.card },
          ]}
        >
          <Text style={[stylesChat.messageText, item.is_deleted && stylesChat.deletedMessage, { color: item.sender_id === user?.id ? "#fff" : colors.text }]}>
            {item.content}
          </Text>
          <Text style={[stylesChat.timeText, { color: colors.text }]}>{messageTime}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

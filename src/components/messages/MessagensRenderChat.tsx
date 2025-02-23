import { stylesChat } from "@/app/styles/stylesChat";
import { MessageProperties } from "@/types/interfaces";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import FullScreenImage from "../FullScreenImagem";
import { detectLinks } from "../types/DetectLinksChat";
import AudioPlayer from "./AudPlayButton";

export const MessageItem = React.memo(({ item, userId, colors, imageUser, handleCopy, downloadImage, deleteMessage, updateMessageStatus, downloadFiles }: MessageProperties) => {
  const messageTime = new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  const handleUpdateStatus = async (newStatus: "send" | "delivered" | "read") => {
    try {
      await updateMessageStatus(item.id, newStatus);
    } catch (error) {
      console.error("Failed to update message status:", error);
    }
  };

  useEffect(() => {
    if (item.sender_id !== userId && item.status !== "read") {
      handleUpdateStatus("read");
    }
  }, [item]);

  const renderImages = (images: string[]) => {
    return (
      <View style={stylesChat.ImagesChat}>
        {images.length === 1 ? (
          <View style={stylesChat.imageContainer}>
            <FullScreenImage imageUrl={images[0]} onLongPress={() => setSelectedMessageId(item.id)} />
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
            <Text style={[stylesChat.messageText, { color: colors.text }]}>{detectLinks(item.legendImage)}</Text>
            <View style={{ flexDirection: 'row', gap: 4, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <Text style={[stylesChat.timeText, { color: colors.text }]}>{messageTime}</Text>
              {item.sender_id === userId && (
                <TouchableOpacity>
                  <Ionicons name="checkmark-done" size={16} color={item.status === "read" ? "blue" : "gray"} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      onLongPress={() => setSelectedMessageId(item.id)}
      onPress={() => setSelectedMessageId(null)}
      delayLongPress={300}
      style={[
        stylesChat.messageContainer,
        item.sender_id === userId ? stylesChat.sentMessage : stylesChat.receivedMessage,
      ]}
    >
      {item.images && item.images.length > 0 && (
        <View style={[stylesChat.ImagesChat, { backgroundColor: item.sender_id === userId ? colors.primary : colors.card }]}>
          {renderImages(item.images)}
        </View>
      )}
      {selectedMessageId === item.id && (
        <View style={[stylesChat.optionsButton, { right: item.sender_id === userId ? 'auto' : -39 }]}>
          <TouchableOpacity onPress={() => handleCopy(item.content, item.id, item.legendImage ?? '')}>
            <Ionicons name="copy" size={24} color="#fff" />
          </TouchableOpacity>
          {item.images && item.images.length > 0 && (
            <TouchableOpacity onPress={() => downloadImage(item.images[0])}>
              <Ionicons name="download-outline" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          {item.filesUrls && item.filesUrls.length > 0 && (
            <TouchableOpacity onPress={() => downloadFiles(item.filesUrls[0])}>
              <Ionicons name="download-sharp" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          {item.sender_id === userId && (
            <TouchableOpacity onPress={() => deleteMessage([item.id])}>
              <Ionicons name="trash" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setSelectedMessageId(null)}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {(item.content || item.filesUrls.length > 0) && (
        <View
          style={[
            stylesChat.messageBubble,
            { backgroundColor: item.sender_id === userId ? colors.sendchatCorlo : colors.card },
          ]}
        >
          {item.content && (
            <Text dataDetectorType="all" style={[stylesChat.messageText, item.is_deleted && stylesChat.deletedMessage, { color: item.sender_id === userId ? "#fff" : colors.text }]}>
              {item.content}
            </Text>
          )}
          {item.filesUrls && item.filesUrls.map((file, index) => {
            const fileName = decodeURIComponent(file.split("?")[0].split("/").pop() || "");
            return (
              <Text key={index} style={[stylesChat.messageText, item.is_deleted && stylesChat.deletedMessage, { color: item.sender_id === userId ? "#fff" : colors.text }]}>
                {fileName}
              </Text>
            );
          })}
          <View style={{ flexDirection: 'row', gap: 4, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            <Text style={[stylesChat.timeText, { color: colors.text }]}>{messageTime}</Text>
            {item.sender_id === userId && (
              <TouchableOpacity>
                <Ionicons name="checkmark-done" size={16} color={item.status === "read" ? "blue" : "gray"} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {item.audioUrl && <AudioPlayer imageUrl={imageUser!} audioUrl={item.audioUrl} />}
    </TouchableOpacity>
  );
});
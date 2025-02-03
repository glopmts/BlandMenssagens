import { useMessages } from "@/hooks/useMessages"
import { useTheme } from "@/hooks/useTheme"
import type { Mensagens } from "@/types/interfaces"
import { useClerk } from "@clerk/clerk-expo"
import { Ionicons } from "@expo/vector-icons"
import * as Clipboard from 'expo-clipboard'
import { useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { ActivityIndicator, FlatList, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native"
import { stylesChat } from "../styles/stylesChat"

export default function MensagensPageRender() {
  const { user } = useClerk()
  const { id } = useLocalSearchParams<{
    id: string
  }>()
  const { colors } = useTheme()
  const [newMessage, setNewMessage] = useState("")
  const { messages, loading, sendMessage } = useMessages(user?.id || "", id);
  const [trueInput, setInput] = useState(false)

  const handleCopy = async (text: string) => {
    setTimeout(async () => {
      try {
        await Clipboard.setStringAsync(text)
        ToastAndroid.show("Mensagem copiada!", ToastAndroid.SHORT)
      } catch (error) {
        console.error("Erro ao copiar para a área de transferência:", error)
      }
    }, 500)
  }

  const handleSend = async () => {
    if (!newMessage.trim()) return
    await sendMessage(newMessage)
    setNewMessage("")
  }

  const renderMessage = ({ item }: { item: Mensagens }) => (
    <TouchableOpacity
      onPress={() => handleCopy(item.content)}
      delayLongPress={300}
      style={[
        stylesChat.messageContainer,
        item.sender_id === user?.id ? stylesChat.sentMessage : stylesChat.receivedMessage,
      ]}
    >
      <View
        style={[
          stylesChat.messageBubble,
          {
            backgroundColor: item.sender_id === user?.id ? colors.primary : colors.card,
          },
        ]}
      >
        <Text style={[stylesChat.messageText, { color: item.sender_id === user?.id ? '#fff' : colors.text }]}>
          {item.content}
        </Text>
        <Text style={[stylesChat.timeText, { color: item.sender_id === user?.id ? '#fff' : colors.text }]}>
          {new Date(item.created_at).toLocaleTimeString()}
        </Text>
      </View>
      <View
        style={[
          stylesChat.arrow,
          item.sender_id === user?.id ? stylesChat.arrowRight : stylesChat.arrowLeft,
          {
            borderRightColor: item.sender_id === user?.id ? colors.primary : 'transparent',
            borderLeftColor: item.sender_id !== user?.id ? colors.card : 'transparent',
          },
        ]}
      />
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={[stylesChat.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size={28} color={colors.text} />
      </View>
    )
  }

  return (
    <View style={[stylesChat.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => `${item.id}-${item.sender_id}-${item.created_at}-${index}`}
        contentContainerStyle={stylesChat.messagesList}
      />
      <View style={stylesChat.inputContainer}>
        <TextInput
          style={[
            stylesChat.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              maxHeight: 150,
            }
          ]}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor={colors.PlaceholderTextColor}
          multiline={true}
          scrollEnabled={true}
          textAlignVertical="top"
        />
        <TouchableOpacity style={[stylesChat.sendButton, { backgroundColor: colors.primary }]} onPress={handleSend}>
          <Ionicons name="send" size={24} color={'#fff'} />
        </TouchableOpacity>
      </View>
    </View>
  )
}


import { useMessages } from "@/hooks/useMessages"
import { useTheme } from "@/hooks/useTheme"
import type { Mensagens } from "@/types/interfaces"
import { useClerk } from "@clerk/clerk-expo"
import { Ionicons } from "@expo/vector-icons"
import * as Clipboard from 'expo-clipboard'
import { useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { ActivityIndicator, FlatList, Platform, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native"

export default function MensagensPageRender() {
  const { user } = useClerk()
  const { id } = useLocalSearchParams<{
    id: string
  }>()
  const { colors } = useTheme()
  const [newMessage, setNewMessage] = useState("")
  const { messages, loading, sendMessage } = useMessages(user?.id || "", id)
  const [refreshing, setRefreshing] = useState(false)

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
        styles.messageContainer,
        item.sender_id === user?.id ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          {
            backgroundColor: item.sender_id === user?.id ? colors.primary : colors.card,
          },
        ]}
      >
        <Text style={[styles.messageText, { color: item.sender_id === user?.id ? '#fff' : colors.text }]}>
          {item.content}
        </Text>
        <Text style={[styles.timeText, { color: item.sender_id === user?.id ? '#fff' : colors.text }]}>
          {new Date(item.created_at).toLocaleTimeString()}
        </Text>
      </View>
      <View
        style={[
          styles.arrow,
          item.sender_id === user?.id ? styles.arrowRight : styles.arrowLeft,
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size={28} color={colors.text} />
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => `${item.id}-${item.sender_id}-${item.created_at}-${index}`}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
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
        <TouchableOpacity style={[styles.sendButton, { backgroundColor: colors.primary }]} onPress={handleSend}>
          <Ionicons name="send" size={24} color={'#fff'} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    paddingTop: Platform.OS === "ios" ? 60 : 80,
  },
  header: {
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  messagesList: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  messageContainer: {
    maxWidth: "80%",
    marginVertical: 4,
    position: "relative",
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sentMessage: {
    alignSelf: "flex-end",
  },
  receivedMessage: {
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
  },
  timeText: {
    fontSize: 12,
    opacity: 0.9,
    marginTop: 4,
    textAlign: "right",
  },
  arrow: {
    position: "absolute",
    top: 0,
    width: 0,
    height: 0,
    borderWidth: 8,
    borderStyle: "solid",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
  },
  arrowRight: {
    right: -8,
    borderRightColor: "transparent",
  },
  arrowLeft: {
    left: -8,
    borderLeftColor: "transparent",
  },
  inputContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    gap: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
  },
  sendButton: {
    padding: 12,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
})
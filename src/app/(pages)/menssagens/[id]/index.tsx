import { useMessages } from "@/hooks/useMessages"
import { useTheme } from "@/hooks/useTheme"
import { Mensagens } from "@/types/interfaces"
import { useClerk } from "@clerk/clerk-expo"
import { useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { Button, FlatList, Platform, StyleSheet, Text, TextInput, View } from "react-native"

export default function MensagensPageRender() {
  const { user } = useClerk()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { colors } = useTheme()
  const [newMessage, setNewMessage] = useState("")

  const { messages, loading, sendMessage } = useMessages(id, user?.id || '')

  const handleSend = async () => {
    if (!newMessage.trim()) return
    await sendMessage(newMessage, id)
    setNewMessage("")
  }

  const renderMessage = ({ item }: { item: Mensagens }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender_id === user?.id ? styles.sentMessage : styles.receivedMessage,
        { backgroundColor: item.sender_id === user?.id ? colors.primary : colors.card }
      ]}
    >
      <Text style={[
        styles.messageText,
        { color: item.sender_id === user?.id ? colors.background : colors.text }
      ]}>
        {item.content}
      </Text>
      <Text style={styles.timeText}>
        {new Date(item.created_at).toLocaleTimeString()}
      </Text>
    </View>
  )

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text>Loading messages...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor={colors.text}
        />
        <Button title="Send" onPress={handleSend}>

        </Button>
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
  messagesList: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  sentMessage: {
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  timeText: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
  },
  sendButton: {
    paddingHorizontal: 20,
  },
})

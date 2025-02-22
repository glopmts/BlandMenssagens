import { stylesChat } from "@/app/styles/stylesChat"
import { Linking, Text, TouchableOpacity } from "react-native"

export const renderMessageText = (text: string, isSentMessage: boolean, colors: any) => {
  const parts = text.split(/(\s+)/)
  return parts.map((part, index) => {
    const isLink = /^(https?:\/\/|www\.)/.test(part)
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(part)
    const isPhoneNumber = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(part)

    if (isLink || isEmail || isPhoneNumber) {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => {
            if (isLink) {
              Linking.openURL(part.startsWith("www.") ? `https://${part}` : part)
            } else if (isEmail) {
              Linking.openURL(`mailto:${part}`)
            } else if (isPhoneNumber) {
              Linking.openURL(`tel:${part}`)
            }
          }}
        >
          <Text
            style={[
              stylesChat.messageText,
              {
                color: isSentMessage ? colors.card : colors.primary,
                textDecorationLine: "underline",
              },
            ]}
          >
            {part}
          </Text>
        </TouchableOpacity>
      )
    }
    return (
      <Text key={index} style={[stylesChat.messageText, { color: isSentMessage ? "#fff" : colors.text }]}>
        {part}
      </Text>
    )
  })
}
import DropwMenu from "@/components/drawer/DropwMenu"
import { ContactsListUser } from "@/hooks/contacts/useContacts"
import { handleChatUser, handleClearMenssagens } from "@/hooks/useMessages"
import { useTheme } from "@/hooks/useTheme"
import { useUser } from "@clerk/clerk-expo"
import { Ionicons } from "@expo/vector-icons"
import { format, } from "date-fns"
import { formatDistanceToNow } from "date-fns/formatDistanceToNow"
import { Image } from "expo-image"
import { router, Stack, useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { Alert, Modal, SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import { stylesLayoutId } from "../../../styles/stylesLayout-id"

export default function MensagensLayout() {
  const { user } = useUser()
  const { colors } = useTheme()
  const { id } = useLocalSearchParams<{ id: string }>();
  const chatWith = id;
  const userId = user?.id;
  const [dropdown, setDropdown] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [clearModalVisible, setClearModalVisible] = useState(false);
  const { contact } = ContactsListUser(userId!, id)

  const formatLastOnline = (lastOnlineDate?: string) => {
    if (!lastOnlineDate) return "Data indisponível"

    const date = new Date(lastOnlineDate)

    if (isNaN(date.getTime())) {
      console.warn("Data inválida recebida:", lastOnlineDate)
      return "Data inválida"
    }

    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5

    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true, })
    } else {
      return format(date, "'Visto em' dd 'de' MMMM 'às' HH:mm",)
    }
  }

  const menuItems = [
    { label: "Editar contato", value: "edit", nameIcon: "pencil" },
    { label: "Limpar histórico", value: "clear", nameIcon: "chatbubble-ellipses-outline" },
    { label: "Apagar chat", value: "delete", nameIcon: "trash" },
  ]

  const handleMenuItemPress = (value: string) => {
    if (value === "delete") {
      setDeleteModalVisible(true)
    }
    if (value === "clear") {
      setClearModalVisible(true)
    }
  }

  const handleClearPress = async () => {
    if (!userId || !chatWith) {
      Alert.alert("Erro: userId ou chatWith não definidos.");
      return;
    }
    await handleClearMenssagens(userId!, chatWith)
    setClearModalVisible(false)
  }

  const handleDeletePress = async () => {
    if (!userId || !chatWith) {
      Alert.alert("Erro: userId ou chatWith não definidos.");
      return;
    }
    await handleChatUser(userId!, chatWith)
    router.navigate("/(drawer)/(tabs)")
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.backgroundColorHeader },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "800" },
          headerShown: true,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerTitle: () => (
              <TouchableOpacity>
                <View style={stylesLayoutId.containerInfor}>
                  {contact?.contact?.imageurl ? (
                    <Image
                      style={{ width: 40, height: 40, borderRadius: 30 }}
                      source={{ uri: contact.contact.imageurl }}
                    />
                  ) : (
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 30,
                        backgroundColor: colors.primary,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={[stylesLayoutId.headerTitle, { color: colors.text }]}>
                        {contact?.contact?.name?.charAt(0).toUpperCase() || "MG"}
                      </Text>
                    </View>
                  )}
                  <View>
                    <Text style={[stylesLayoutId.headerTitle, { color: colors.text }]}>{contact?.name || contact?.contact?.phone || 'Desconhecido'}</Text>
                    <Text style={[stylesLayoutId.onlineStatus, { color: contact?.contact.isOnline ? colors.primary : colors.gray }]}>
                      {contact?.contact?.isOnline ? "Online" : formatLastOnline(
                        contact?.contact?.lastOnline?.toString()
                      )}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={() => setDropdown(true)}>
                <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>

      <DropwMenu items={menuItems} visible={dropdown} onClose={() => setDropdown(false)} onItemPress={handleMenuItemPress} />

      <Modal transparent style={{ flex: 1 }} visible={deleteModalVisible} animationType="slide">
        <View style={[stylesLayoutId.modalContainer]}>
          <View style={[stylesLayoutId.modalContainerItens, { backgroundColor: colors.card }]}>
            <Text style={[stylesLayoutId.modalText, { color: colors.text }]}>Deseja realmente apagar este chat?</Text>
            <View style={stylesLayoutId.buttonsContainer}>
              <TouchableOpacity style={stylesLayoutId.buttonCancele} onPress={() => setDeleteModalVisible(false)}>
                <Text style={[stylesLayoutId.textButtons, { color: colors.text }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={stylesLayoutId.button} onPress={handleDeletePress}>
                <Text style={[stylesLayoutId.textButtons, { color: colors.red }]}>Apagar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal transparent style={{ flex: 1 }} visible={clearModalVisible} animationType="slide">
        <View style={[stylesLayoutId.modalContainer]}>
          <View style={[stylesLayoutId.modalContainerItens, { backgroundColor: colors.card }]}>
            <Text style={[stylesLayoutId.modalText, { color: colors.text }]}>Deseja realmente limpar todas as conversas?</Text>
            <View style={stylesLayoutId.buttonsContainer}>
              <TouchableOpacity style={stylesLayoutId.buttonCancele} onPress={() => setClearModalVisible(false)}>
                <Text style={[stylesLayoutId.textButtons, { color: colors.text }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={stylesLayoutId.button} onPress={handleClearPress}>
                <Text style={[stylesLayoutId.textButtons, { color: colors.red }]}>Limpar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}



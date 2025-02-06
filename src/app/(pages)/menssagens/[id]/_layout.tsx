import DropwMenu from "@/components/DropwMenu"
import { handleClearMenssagens } from "@/hooks/useMessages"
import { useTheme } from "@/hooks/useTheme"
import { url } from "@/utils/url-api"
import { useUser } from "@clerk/clerk-expo"
import { Ionicons } from "@expo/vector-icons"
import { format, } from "date-fns"
import { formatDistanceToNow } from "date-fns/formatDistanceToNow"
import { Image } from "expo-image"
import { Stack, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { Alert, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function MensagensLayout() {
  const { user } = useUser()
  const { colors } = useTheme()
  const { id } = useLocalSearchParams<{ id: string }>();
  const chatWith = id;
  const userId = user?.id;
  const [name, setName] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [image, setImage] = useState<string | null>(null)
  const [lastOnline, setLastOnline] = useState<string>("")
  const [isOnline, setIsOnline] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [clearModalVisible, setClearModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const res = await fetch(`${url}/api/user/contactInfor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            contactId: id,
          }),
        })
        if (!res.ok) {
          throw new Error(`Error fetching user data: ${res.status}`)
        }
        const userData = await res.json()
        setName(userData.name)
        setPhone(userData.phone)
        setImage(userData.image)
        setIsOnline(userData.user.isOnline)
        setLastOnline(userData.user.lastOnline)
      }
    }
    fetchData()
  }, [userId])

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
                <View style={styles.containerInfor}>
                  {image ? (
                    <Image
                      style={{ width: 40, height: 40, borderRadius: 30 }}
                      source={{ uri: image }}
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
                      <Text style={[styles.headerTitle, { color: colors.text }]}>
                        {name?.charAt(0).toUpperCase() || "MG"}
                      </Text>
                    </View>
                  )}
                  <View>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>{name || phone}</Text>
                    <Text style={[styles.onlineStatus, { color: isOnline ? colors.primary : colors.gray }]}>
                      {isOnline ? "Online" : formatLastOnline(lastOnline)}
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
        <View style={[styles.modalContainer]}>
          <View style={[styles.modalContainerItens, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalText, { color: colors.text }]}>Deseja realmente apagar este chat?</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.buttonCancele} onPress={() => setDeleteModalVisible(false)}>
                <Text style={[styles.textButtons, { color: colors.text }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => { }}>
                <Text style={[styles.textButtons, { color: colors.red }]}>Apagar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal transparent style={{ flex: 1 }} visible={clearModalVisible} animationType="slide">
        <View style={[styles.modalContainer]}>
          <View style={[styles.modalContainerItens, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalText, { color: colors.text }]}>Deseja realmente limpar todas as conversas?</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.buttonCancele} onPress={() => setClearModalVisible(false)}>
                <Text style={[styles.textButtons, { color: colors.text }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleClearPress}>
                <Text style={[styles.textButtons, { color: colors.red }]}>Limpar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  onlineStatus: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "500",
  },
  containerInfor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalContainerItens: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    width: "60%",
    minHeight: 100
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalText: {
    fontSize: 18,
    fontWeight: "800",
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    width: "100%",
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonCancele: {
    padding: 10,
    borderRadius: 5,
  },
  textButtons: {
    fontSize: 16,
    fontWeight: "600",
  }
})


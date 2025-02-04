import { stylesListContacst } from "@/app/styles/ListContacts";
import AddContacts from "@/components/AddContacts";
import BottomSheetComponent from "@/components/BottomSheet";
import { ContactsListUser } from "@/hooks/useContacts";
import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@clerk/clerk-expo";
import { AntDesign } from "@expo/vector-icons";
import { Portal } from "@gorhom/portal";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Button, Dimensions, FlatList, Modal, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Contacts() {
  const { user } = useUser()
  const { colors } = useTheme();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const snapPoints = [screenHeight * 0.5];
  const router = useRouter()
  const userId = user?.id || ''
  const { contacts, error, isLoading, onRefresh, refreshing } = ContactsListUser({ userId })
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [name, setName] = useState("")

  const handleDeleteContact = () => {
    // Lógica para excluir o contato
    console.log('Excluir contato:', selectedContact);
    setSelectedContact(null); // Fechar o modal após a exclusão
  };

  if (isLoading) {
    return (
      <View
        style={[
          stylesListContacst.container,
          { backgroundColor: colors.backgroundColorContacts, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (error) {
    return (
      <View style={[stylesListContacst.container, { backgroundColor: colors.backgroundColorContacts }]}>
        <Text style={{ color: colors.text }}>{error}</Text>
      </View>
    )
  }

  const ContactListItem = ({ item, colors, router }: any) => {
    const handleLongPress = () => {
      setSelectedContact(item.id);
      setName(item.name)
    };

    const lastSeenText = item?.lastOnline
      ? new Date(item.lastOnline).toLocaleString()
      : "Nunca visto"

    return (
      <TouchableOpacity
        style={[styles.contactItem, { backgroundColor: colors.cardColor }]}
        onPress={() => router.navigate(`/(pages)/menssagens/${item.contact_id}`)}
        onLongPress={handleLongPress}
      >
        {item?.imageurl ? (
          <Image style={stylesListContacst.contactImage} source={{ uri: item?.imageurl }} />
        ) : (
          <View style={[stylesListContacst.contactImage, { backgroundColor: colors.primary }]}>
            <Text style={{ color: "white", fontWeight: "700", fontSize: 20 }}>{item?.name?.charAt(0)}</Text>
          </View>
        )}
        <View>
          <Text style={[stylesListContacst.contactName, { color: colors.text }]}>{item?.name || "Nome não disponível"}</Text>
          <Text style={[stylesListContacst.contactName, { color: colors.text }]}>{lastSeenText}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity onPress={() => setIsSheetOpen(true)} style={styles.button}>
        <AntDesign name="adduser" size={24} color={colors.text} />
        <Text style={[styles.buttonText, { color: colors.text }]}>Novo Contato</Text>
      </TouchableOpacity>
      {isSheetOpen && (
        <Portal>
          <BottomSheetComponent snapPoints={snapPoints} onSheetChange={setIsSheetOpen}>
            <AddContacts />
          </BottomSheetComponent>
        </Portal>
      )}

      <View>
        {contacts && (
          <FlatList
            data={contacts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ContactListItem router={router} item={item} colors={colors} />}
            ListHeaderComponent={() => <Text style={[stylesListContacst.title, { color: colors.text }]}>Seus contatos salvos</Text>}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
          />
        )}
      </View>

      <Modal
        visible={!!selectedContact}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedContact(null)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View>
              <Text style={[styles.modalText, { color: colors.text }]}>Apaga contato?</Text>
              <Text style={[styles.modalText, { color: colors.text }]}>Tem certeza que deseja apagar esses contato? {name}</Text>
            </View>
            <View style={styles.buttons}>
              <Button color="#FF0000" title="Excluir" onPress={handleDeleteContact} />
              <Button color={colors.primary} title="Cancelar" onPress={() => setSelectedContact(null)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    gap: 10,
    flexDirection: 'row',
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "800"
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  }
})
import { stylesListContacst } from "@/app/styles/ListContacts"
import { ContactsListUser } from "@/hooks/contacts/useContacts"
import { useTheme } from "@/hooks/useTheme"
import { useUser } from "@clerk/clerk-expo"
import { Image } from "expo-image"
import { useRouter } from "expo-router"
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native"

export default function ContactsScreen() {
  const { user } = useUser();
  const { colors } = useTheme();
  const router = useRouter();
  const userId = user?.id || "";
  const { contacts, commercialContacts, error, isLoading, onRefresh, refreshing } = ContactsListUser(userId!);

  const ContactListItem = ({ item, colors, router }: any) => {
    const lastSeenText = item?.lastOnline
      ? new Date(item.lastOnline).toLocaleString()
      : "Nunca visto";

    const contactImage = item.image
    const contactName = item.name || "Unknown"

    const renderContactImage = () => {
      if (contactImage) {
        return <Image source={{ uri: contactImage }} style={stylesListContacst.contactImage} />
      } else {
        const initial = contactName.charAt(0).toUpperCase()
        return (
          <View style={[stylesListContacst.contactImage, { backgroundColor: colors.primary }]}>
            <Text style={stylesListContacst.noContactsText}>{initial}</Text>
          </View>
        )
      }
    }

    return (
      <TouchableOpacity
        style={[stylesListContacst.contactItem, { backgroundColor: colors.cardColor }]}
        onPress={() => router.navigate(`/(pages)/menssagens/${item.search_token}`)}
      >
        {renderContactImage()}
        <View>
          <Text style={[stylesListContacst.contactName, { color: colors.text }]}>{item?.name || "Nome não disponível"}</Text>
          <Text style={[{ color: colors.gray }]}>{lastSeenText}</Text>
        </View>
      </TouchableOpacity>
    );
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
    );
  }

  if (error) {
    return (
      <View style={[stylesListContacst.container, { backgroundColor: colors.backgroundColorContacts }]}>
        <Text style={{ color: colors.text }}>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={[stylesListContacst.container, { backgroundColor: colors.backgroundColorContacts }]}>
      <FlatList
        data={[...contacts, ...commercialContacts]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ContactListItem router={router} item={item} colors={colors} />}
        ListHeaderComponent={() => <Text style={[stylesListContacst.title, { color: colors.text }]}>Seus contatos salvos</Text>}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
      <View style={{ justifyContent: "center", alignContent: "center", flex: 1 }}>
        {contacts.length === 0 && commercialContacts.length === 0 && (
          <Text style={{ textAlign: "center", color: colors.text, fontSize: 20, fontWeight: "800" }}>Sem contatos</Text>
        )}
      </View>
    </View>
  );
}

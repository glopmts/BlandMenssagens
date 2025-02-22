import { useTheme } from "@/hooks/useTheme";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Portal } from '@gorhom/portal';
import { useRouter } from "expo-router";
import { useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomSheetComponent from "../BottomSheet";
import AddContacts from "../conatcts/AddContacts";

export default function LinksOptionsDrawer() {
  const router = useRouter();
  const { colors } = useTheme();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const snapPoints = [screenHeight * 0.5];

  const links = [
    { title: "Contatos", route: "(pages)/(contacts-main)/contacts", Icon: <AntDesign name="contacts" size={24} color={colors.text} /> },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundColorHeaderLinks }]}>
      <View style={styles.containerLinks}>
        {links.map((link, index) => (
          <TouchableOpacity key={index} onPress={() => router.navigate(link.route as any)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              {link.Icon}
              <Text style={[styles.link, { color: colors.text }]}>{link.title}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={() => setIsSheetOpen(true)} style={styles.button}>
          <AntDesign name="adduser" size={24} color={colors.text} />
          <Text style={[styles.buttonText, { color: colors.text }]}>Novo Contato</Text>
        </TouchableOpacity>
      </View>

      {isSheetOpen && (
        <Portal>
          <BottomSheetComponent snapPoints={snapPoints} onSheetChange={setIsSheetOpen}>
            <AddContacts />
          </BottomSheetComponent>
        </Portal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    overflow: 'hidden',
    flex: 1,
  },
  containerLinks: {
    display: 'flex',
    gap: 10,
    flexDirection: 'column',
    alignContent: 'center',
  },
  link: {
    fontWeight: '800',
    fontSize: 18,
    marginLeft: 15,
  },
  button: {
    gap: 10,
    flexDirection: 'row'
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '800',
  }
});

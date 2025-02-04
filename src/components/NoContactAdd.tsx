import { useTheme } from "@/hooks/useTheme";
import { url } from "@/utils/url-api";
import { AntDesign } from "@expo/vector-icons";
import { Portal } from "@gorhom/portal";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import AddContacts from "./AddContacts";
import BottomSheetComponent from "./BottomSheet";

interface ContactProps {
  userId: string;
  contactId: string;
  number: string,
}

export default function NoAddContact({ userId, contactId, number }: ContactProps) {
  const [isContactSaved, setIsContactSaved] = useState<boolean | null>(null);
  const { colors } = useTheme();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const snapPoints = [screenHeight * 0.5];

  useEffect(() => {
    const checkContact = async () => {
      try {
        const response = await fetch(`${url}/api/user/conferiContact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            contactId,
          }),
        });

        const data = await response.json();
        setIsContactSaved(data.exists);
      } catch (error) {
        ToastAndroid.show("Erro ao verificar contato", ToastAndroid.SHORT);
        console.error("Erro ao buscar contato:", error);
      }
    };
    checkContact();
  }, [userId, contactId]);

  return (
    <View style={styles.container}>
      {isContactSaved === null ? (
        <Text style={[styles.text, { color: colors.text }]}>Verificando contato...</Text>
      ) : isContactSaved ? (
        <Text style={styles.text}></Text>
      ) : (
        <View>
          <Text style={[styles.text, { color: colors.text }]}>Contato não encontrado</Text>
          <TouchableOpacity onPress={() => setIsSheetOpen(true)} style={[styles.button, { backgroundColor: colors.backgroundButton }]}>
            <AntDesign name="adduser" size={24} color={colors.text} />
            <Text style={[styles.buttonText, { color: colors.text }]}>Novo Contato</Text>
          </TouchableOpacity>
        </View>
      )}

      {isSheetOpen && (
        <Portal>
          <BottomSheetComponent snapPoints={snapPoints} onSheetChange={setIsSheetOpen}>
            <AddContacts number={number} />
          </BottomSheetComponent>
        </Portal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    margin: 10,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
  },
});
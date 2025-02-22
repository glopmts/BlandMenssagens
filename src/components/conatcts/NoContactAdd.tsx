import { useTheme } from "@/hooks/useTheme";
import { AntDesign } from "@expo/vector-icons";
import { Portal } from "@gorhom/portal";
import { useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomSheetComponent from "../BottomSheet";
import AddContacts from "./AddContacts";

interface ContactProps {
  userId: string;
  contactId: string;
  number: string,
}

export default function NoAddContact({ number }: ContactProps) {
  const { colors } = useTheme();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const snapPoints = [screenHeight * 0.5];

  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.text, { color: colors.text }]}>Contato não encontrado</Text>
        <TouchableOpacity onPress={() => setIsSheetOpen(true)} style={[styles.button, { backgroundColor: colors.backgroundButton }]}>
          <AntDesign name="adduser" size={24} color={colors.text} />
          <Text style={[styles.buttonText, { color: colors.text }]}>Novo Contato</Text>
        </TouchableOpacity>
      </View>

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
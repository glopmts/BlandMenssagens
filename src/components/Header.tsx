import { useTheme } from "@/hooks/useTheme";
import AntDesign from '@expo/vector-icons/AntDesign';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
export default function Header() {
  const { colors } = useTheme();

  return (
    <View style={[stylesHeader.container, { backgroundColor: colors.background }]}>
      <View style={[stylesHeader.logo]}>
        <View>
          <Text style={[stylesHeader.title, { color: colors.text }]}>BlobSend</Text>
        </View>
        <View>
          <TouchableOpacity>
            <AntDesign name="search1" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const stylesHeader = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  logo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
})

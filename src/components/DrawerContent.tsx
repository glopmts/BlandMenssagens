import { useTheme } from "@/hooks/useTheme";
import { User } from "@/types/interfaces";
import { url } from "@/utils/url-api";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LinksOptionsDrawer from "./LinksOptionsDrawer";
import UserInforDrawer from "./UserInforDrawer";

export function DrawerContent(drawerProps: DrawerContentComponentProps) {
  const { colors } = useTheme();
  const { user } = useUser();
  const userId = user?.id;
  const [userData, setDataUser] = useState<User | null>(null);
  const [loader, setLoader] = useState(true);
  const { signOut } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${url}/api/user/${userId}`)
        const userData: User = await res.json()
        setDataUser(userData)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch user data");
      } finally {
        setLoader(false)
      }
    }
    fetchData()
  }, [user?.id])

  const signOutUser = async () => {
    await signOut()
    drawerProps.navigation.closeDrawer()
  }


  return (
    <View style={[styles.drawerContent, { backgroundColor: colors.background }]}>
      <View>
        <UserInforDrawer isLoader={loader} colors={colors} userData={userData} />
      </View>
      <View style={{ flex: 1 }}>
        <LinksOptionsDrawer />
      </View>
      <View style={[styles.signOutButton, { backgroundColor: colors.backgroundColorHeaderLinks }]}>
        <TouchableOpacity style={styles.buttton} onPress={signOutUser}>
          <MaterialIcons name="logout" size={24} color={colors.text} />
          <Text style={{ color: colors.text, fontSize: 18 }}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View >
  )
}

const styles = StyleSheet.create(({
  drawerContent: {
    flex: 1,
  },
  signOutButton: {
    justifyContent: 'flex-end',
    padding: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#171717',
  },
  buttton: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  }
}))
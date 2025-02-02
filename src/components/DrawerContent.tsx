import { useTheme } from "@/hooks/useTheme";
import { User } from "@/types/interfaces";
import { supabase } from "@/utils/supabase";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LinksOptionsDrawer from "./LinksOptionsDrawer";
import UserInforDrawer from "./UserInforDrawer";

export function DrawerContent(drawerProps: DrawerContentComponentProps) {
  const { colors } = useTheme();
  const { user } = useUser();
  const [userData, setDataUser] = useState<User | null>(null);
  const [loader, setLoader] = useState(true);
  const { signOut } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('clerk_id', user.id)
          .single()
        if (userError) {
          console.error('Error fetching user:', userError.message)
          return
        }
        setDataUser(userData)
        setLoader(false)
      } else {
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
        <UserInforDrawer colors={colors} userData={userData} />
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
import UserDataInfor from "@/hooks/useData";
import { useTheme } from "@/hooks/useTheme";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Sidebar from "../SidebarProfile";
import LinksOptionsDrawer from "../types/LinksOptionsDrawer";
import UserInforDrawer from "./DrawerIUserHeader";

export function DrawerContent(drawerProps: DrawerContentComponentProps) {
  const { colors } = useTheme();
  const { user } = useUser();
  const userId = user?.id ?? '';
  const { signOut } = useAuth();
  const { isLoading, userData } = UserDataInfor({ userId })


  const [isExpanded, setIsExpanded] = useState(false);
  const heightAnim = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    Animated.timing(heightAnim, {
      toValue: isExpanded ? 0 : 200,
      duration: 50,
      useNativeDriver: false,
    }).start();

    setIsExpanded(!isExpanded);
  };


  const signOutUser = async () => {
    await signOut()
    drawerProps.navigation.closeDrawer();
    router.push("/(auth)/sign-in")
  }

  return (
    <View style={[styles.drawerContent, { backgroundColor: colors.background }]}>
      <View>
        <UserInforDrawer isExpanded={isExpanded} toggleMenu={toggleMenu} isLoader={isLoading} colors={colors} userData={userData} />
      </View>
      <View style={{ flex: 1 }}>
        {isExpanded && (
          <View style={{ height: 'auto' }}>
            <Sidebar imageurl={userData?.imageurl!} name={userData?.name!} heightAnim={heightAnim} />
          </View>
        )}
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
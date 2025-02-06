import { useTheme } from "@/hooks/useTheme";
import { User } from "@/types/interfaces";
import { url } from "@/utils/url-api";
import { useClerk } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SidebarProps {
  heightAnim: Animated.Value;
  imageurl?: string;
  name?: string;
}

interface Account {
  sessionId: string;
  user: {
    id: string;
    email: string;
    userId: string;
  };
}

const Sidebar = ({ heightAnim, imageurl, name }: SidebarProps) => {
  const { colors } = useTheme();
  const { setActive } = useClerk();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [dataUser, setDataUser] = useState<User | null>(null);

  useEffect(() => {
    const loadAccounts = async () => {
      const storedAccounts = await AsyncStorage.getItem("logged_accounts");
      if (storedAccounts) {
        try {
          const parsedAccounts: Account[] = JSON.parse(storedAccounts);
          const uniqueAccounts = parsedAccounts.filter(
            (account, index, self) =>
              index === self.findIndex((a) => a.user.email === account.user.email)
          );

          setAccounts(uniqueAccounts);
          await AsyncStorage.setItem("logged_accounts", JSON.stringify(uniqueAccounts));
        } catch (error) {
          console.error("Erro ao carregar contas:", error);
        }
      }
    };

    loadAccounts();
  }, []);

  const switchAccount = async (sessionId: string) => {
    try {
      await setActive({ session: sessionId });

      const activeAccount = accounts.find(account => account.sessionId === sessionId);
      if (activeAccount?.user.userId) {
        const response = await fetch(`${url}/api/user/${activeAccount.user.userId}`);
        const data: User = await response.json();
        setDataUser(data);
      }

      router.push("/(drawer)/(tabs)");
    } catch (err) {
      Alert.alert("Erro", "Falha ao alternar contas.");
    }
  };


  const deleteAccount = async (sessionId: string) => {
    try {
      const storedAccounts = await AsyncStorage.getItem("logged_accounts");
      if (storedAccounts) {
        let parsedAccounts: Account[] = JSON.parse(storedAccounts);
        const updatedAccounts = parsedAccounts.filter(account => account.sessionId !== sessionId);
        await AsyncStorage.setItem("logged_accounts", JSON.stringify(updatedAccounts));
        setAccounts(updatedAccounts);
        Alert.alert("Conta removida com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      Alert.alert("Erro", "Não foi possível deletar a conta.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundColorHeaderLinks, borderBottomColor: colors.borderColor }]}>
      <Animated.View style={[styles.subMenu, { height: heightAnim }]}>
        <View style={styles.inforCount}>
          {imageurl ? (
            <Image style={{ width: 40, height: 40, borderRadius: 30 }} source={{ uri: imageurl }} />
          ) : (
            <View style={[styles.noImage, { backgroundColor: colors.background }]} />
          )}
          <View>
            <Text style={[styles.nameInfor, { color: colors.text }]}>{name}</Text>
          </View>
        </View>
      </Animated.View>
      <TouchableOpacity style={styles.subMenuItem}>
        <Ionicons name="add" color={colors.text} size={24} />
        <Text style={[styles.subMenuText, { color: colors.text }]}>Adicionar Conta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 15,
    padding: 10,
    borderBottomWidth: 2,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  subMenuText: {
    fontSize: 18,
    fontWeight: '800'
  },
  subMenu: {
    overflow: "hidden",
    flexDirection: 'column',
    position: "relative",
    marginBottom: 10
  },
  subMenuItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  noImage: {
    width: 40,
    height: 40,
    borderRadius: 30,
  },
  inforCount: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 15
  },
  nameInfor: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 5,
  },
  accountItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 5,
    gap: 15,
  }
});

export default Sidebar;
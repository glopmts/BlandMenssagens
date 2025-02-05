import { useTheme } from "@/hooks/useTheme";
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

const Sidebar = ({ heightAnim, imageurl, name }: SidebarProps) => {
  const { colors } = useTheme();
  const { setActive } = useClerk();
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    const loadAccounts = async () => {
      const storedAccounts = await AsyncStorage.getItem("logged_accounts");
      if (storedAccounts) {
        setAccounts(JSON.parse(storedAccounts));
      }
    };
    loadAccounts();
  }, []);

  const switchAccount = async (sessionId: string) => {
    try {
      await setActive({ session: sessionId });
      router.push("/(drawer)/(tabs)");
    } catch (err) {
      await AsyncStorage.removeItem("logged_accounts");
      Alert.alert("Erro", "Falha ao alternar contas.");
    }
  };


  const logoutAccount = async (sessionId: string) => {
    const storedAccounts = await AsyncStorage.getItem("logged_accounts");
    if (storedAccounts) {
      const parsedAccounts = JSON.parse(storedAccounts);
      const updatedAccounts = parsedAccounts.filter((account: any) => account.sessionId !== sessionId);
      await AsyncStorage.setItem("logged_accounts", JSON.stringify(updatedAccounts));
      setAccounts(updatedAccounts);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundColorHeaderLinks, borderBottomColor: colors.borderColor }]}>
      <Animated.View style={[styles.subMenu, { height: heightAnim }]}>
        <View style={styles.inforCount}>
          {imageurl ? (
            <Image
              style={{ width: 40, height: 40, borderRadius: 30 }}
              source={{ uri: imageurl }}
            />
          ) : (
            <View
              style={[styles.noImage, {
                backgroundColor: colors.background
              }]}
            />
          )}
          <View>
            <Text style={[styles.nameInfor, { color: colors.text }]}>{name}</Text>
          </View>
        </View>
        {accounts.map((account, index) => (
          <View key={index} style={styles.accountItem}>
            <TouchableOpacity style={styles.subMenuItem} onPress={() => switchAccount(account.sessionId)}>
              <Ionicons name="person" color={colors.text} size={24} />
              <Text style={[styles.subMenuText, { color: colors.text }]}>{account.user.phoneNumber}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => logoutAccount(account.sessionId)}>
              <Ionicons name="log-out" color={colors.text} size={24} />
            </TouchableOpacity>
          </View>
        ))}
      </Animated.View>
      <TouchableOpacity style={styles.subMenuItem} onPress={() => router.push("/(auth)/add-count")}>
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
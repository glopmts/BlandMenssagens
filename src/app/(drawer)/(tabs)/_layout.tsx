import { useTheme } from '@/hooks/useTheme';
import { Entypo, Ionicons } from '@expo/vector-icons'; // Importe o ícone de lupa
import { DrawerActions } from "@react-navigation/native";
import { Stack, useNavigation } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function TabLayout() {
  const { colors } = useTheme();
  const navigation = useNavigation()
  const toggleMenu = () => navigation.dispatch(DrawerActions.toggleDrawer())

  const handleSearchPress = () => {
    alert('Trabalhando nesta atualização!');
  };

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.backgroundColorHeader,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '800',
        },
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => (
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={toggleMenu} >
                <Entypo name="menu" color={colors.text} size={32} />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: colors.text }]}>BlobSend</Text>
            </View>
          ),
          headerRight: () => (
            <View>
              <TouchableOpacity onPress={handleSearchPress} style={styles.searchIcon}>
                <Ionicons name="notifications" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  searchIcon: {
    marginRight: 15,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  }
});
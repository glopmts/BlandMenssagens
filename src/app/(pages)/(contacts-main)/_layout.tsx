import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons'; // Importe o ícone de lupa
import { Stack, useNavigation } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function TabLayout() {
  const { colors } = useTheme();
  const navigation = useNavigation()

  const handleSearchPress = () => {
    alert('Lupa pressionada!');
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
        name="contacts"
        options={{
          headerTitle: () => (
            <View style={styles.headerIcons}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Contatos</Text>
            </View>
          ),
          headerRight: () => (
            <View>
              <TouchableOpacity onPress={handleSearchPress} style={styles.searchIcon}>
                <Ionicons name="search" size={24} color={colors.text} />
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
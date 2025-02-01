import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons'; // Importe o ícone de lupa
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TabLayout() {
  const { colors } = useTheme();

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
        name="index"
        options={{
          headerTitle: () => (
            <View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>BlobSend</Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleSearchPress} style={styles.searchIcon}>
              <Ionicons name="search" size={24} color={colors.text} />
            </TouchableOpacity>
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
});
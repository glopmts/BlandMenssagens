import UserData from '@/hooks/useData';
import { useTheme } from '@/hooks/useTheme';
import { useUser } from '@clerk/clerk-expo';
import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
const ProfileScreen = () => {
  const { user } = useUser();
  const { colors } = useTheme()
  const userId = user?.id || '';
  const { isLoader, userData } = UserData({ userId })

  if (isLoader) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size={18} color={colors.text} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.infor}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>Profile</Text>
        </View>
        <View style={styles.inforDetails}>
          <View>
            <Text style={[styles.phone, { color: colors.text }]}>
              {userData?.phone}
            </Text>
            <Text style={[styles.details, { color: colors.gray }]}>
              Telefone
            </Text>
          </View>
          <View style={[styles.borders, { backgroundColor: colors.borderColor }]}></View>
          <View>
            <Text style={[styles.phone, { color: colors.text }]}>
              {userData?.email}
            </Text>
            <Text style={[styles.details, { color: colors.gray }]}>
              Email
            </Text>
          </View>
          <View style={[styles.borders, { backgroundColor: colors.borderColor }]}></View>
          <View>
            <Text style={[styles.phone, { color: colors.text }]}>
              {userData?.name}
            </Text>
            <Text style={[styles.details, { color: colors.gray }]}>
              Nome de Ùsuario
            </Text>
          </View>
          <View style={[styles.borders, { backgroundColor: colors.borderColor }]}></View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
  },
  header: {
    marginBottom: 10
  },
  infor: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  details: {
    fontSize: 14,
    marginBottom: 10,
  },
  inforDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingBottom: 50,
  },
  profileImage: {
    borderRadius: 60,
    marginTop: 20,
  },
  username: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  contentText: {
    fontSize: 16,
    color: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  phone: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  borders: {
    height: 1,
    width: '100%',
    marginBottom: 10,
  }
});

export default ProfileScreen;
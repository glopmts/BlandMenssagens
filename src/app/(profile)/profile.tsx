import UserData from '@/hooks/useData';
import { useTheme } from '@/hooks/useTheme';
import { useUser } from '@clerk/clerk-expo';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
const ProfileScreen = () => {
  const { user } = useUser();
  const { colors } = useTheme()
  const userId = user?.id;

  if (!userId) {
    return (
      <ActivityIndicator size={18} color={colors.text} />
    );
  }

  const { name, image, isLoader } = UserData({ userId })

  if (isLoader) {
    return (
      <ActivityIndicator size={18} color={colors.text} />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.inforDetails}>


      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {

  },
  inforDetails: {
    display: 'flex',
    flexDirection: 'row',
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
    fontWeight: 'bold',
    color: 'white',
  }
});

export default ProfileScreen;
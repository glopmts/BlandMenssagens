import UserData from '@/hooks/useData';
import { useTheme } from '@/hooks/useTheme';
import { useUser } from '@clerk/clerk-expo';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { stylesProfile } from './(styles)/profile';
const ProfileScreen = () => {
  const { user } = useUser();
  const { colors } = useTheme()
  const userId = user?.id || '';
  const { isLoader, userData } = UserData({ userId })

  if (isLoader) {
    return (
      <View style={[stylesProfile.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size={26} color={colors.text} />
      </View>
    );
  }

  return (
    <View style={[stylesProfile.container, { backgroundColor: colors.background }]}>
      <View style={stylesProfile.infor}>
        <View style={stylesProfile.header}>
          <Text style={[stylesProfile.headerTitle, { color: colors.primary }]}>Profile</Text>
        </View>
        <View style={stylesProfile.inforDetails}>
          <View>
            <Text style={[stylesProfile.phone, { color: colors.text }]}>
              {userData?.phone}
            </Text>
            <Text style={[stylesProfile.details, { color: colors.gray }]}>
              Telefone
            </Text>
          </View>
          <View style={[stylesProfile.borders, { backgroundColor: colors.borderColor }]}></View>
          <View>
            <Text style={[stylesProfile.phone, { color: colors.text }]}>
              {userData?.email}
            </Text>
            <Text style={[stylesProfile.details, { color: colors.gray }]}>
              Email
            </Text>
          </View>
          <View style={[stylesProfile.borders, { backgroundColor: colors.borderColor }]}></View>
          <View>
            <Text style={[stylesProfile.phone, { color: colors.text }]}>
              {userData?.name}
            </Text>
            <Text style={[stylesProfile.details, { color: colors.gray }]}>
              Nome de Ùsuario
            </Text>
          </View>
          <View style={[stylesProfile.borders, { backgroundColor: colors.borderColor }]}></View>
        </View>
      </View>
    </View>
  );
};


export default ProfileScreen;
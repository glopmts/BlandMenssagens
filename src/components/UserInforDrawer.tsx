import { User } from "@/types/interfaces";
import { Image } from "expo-image";
import { Platform, StyleSheet, Text, View } from "react-native";
import { ThemeToggle } from "./ThemeToggle";

interface UserProps {
  user?: User;
  colors: any;
  userData: User | null;
}

export default function UserInforDrawer({ colors, userData }: UserProps) {
  return (
    <View style={[{ backgroundColor: colors.backgroundColorHeader }]}>
      <View style={styles.userInfo}>
        <View style={[styles.userInfoOptions]}>
          <View style={styles.userInfoAvatar}>
            {userData?.imageurl ? (
              <Image source={{ uri: userData?.imageurl }} style={styles.userInfoAvatarImage} />
            ) : (
              <View style={[styles.userInfoAvatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.userInfoAvatarText}>
                  {userData?.name?.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <View>
            <ThemeToggle />
          </View>
        </View>
        <View style={styles.inforDescription}>
          <Text style={[styles.userInfoName, { color: colors.text }]}>
            {userData?.name}
          </Text>
          <Text style={[styles.userInfoPhone, { color: colors.text }]}>
            {userData?.phone}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create(({
  userInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10,
    paddingTop: Platform.OS === "ios" ? 60 : 60,
  },
  userInfoAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderColor: '#fff',
  },
  userInfoOptions: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between'
  },
  userInfoAvatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  userInfoAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  userInfoName: {
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 10
  },
  userInfoPhone: {
    fontSize: 16,
  },
  inforDescription: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'baseline',
    paddingTop: 10,
  },

}))
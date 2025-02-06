import { Platform, StyleSheet } from "react-native";

export const stylesProfile = StyleSheet.create({
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

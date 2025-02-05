import { useTheme } from "@/hooks/useTheme";
import { deleteOldImage } from "@/types/deleteImagemFirebase";
import { storage } from "@/utils/firebase";
import { url } from "@/utils/url-api";
import { useClerk } from "@clerk/clerk-expo";
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";
import { stylesUpdateProfile } from "./styles/stylesUploadProfile";

export default function UpdateProfile() {
  const { colors } = useTheme();
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [Loaded, setLoaded] = useState(true);
  const [uploadLoad, setUpload] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const { user } = useClerk();
  const userId = user?.id;
  const router = useRouter();

  const fetchData = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch(`${url}/api/user/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();
      setName(userData.name);
      setImage(userData.imageurl);
      setEmail(userData.email);

      setUserData(userData);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch user data");
    } finally {
      setLoaded(false)
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 300, height: 300 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setImage(manipResult.uri);
    }
  };

  const uploadImage = async (uri: string) => {
    setUpload(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileRef = ref(storage, `app-menssagens/avatars/${user?.id}/${new Date().getTime()}.jpg`);
      await uploadBytes(fileRef, blob);
      const downloadURL = await getDownloadURL(fileRef);
      return downloadURL;
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      throw error;
    } finally {
      setUpload(false);
    }
  };

  const handleSave = async () => {
    setIsLoaded(true);
    try {
      let imageUrl: string | null = null;
      if (image) {
        if (userData.imageurl) {
          await deleteOldImage(userData.imageurl);
        }
        imageUrl = await uploadImage(image);
      }
      const res = await fetch(`${url}/api/user/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          name,
          email,
          imageurl: imageUrl,
        }),
      })
      if (!res.ok) {
        Alert.alert("Error updating profile!")
        throw new Error('Falha ao atualizar o usuário!');
      }
      ToastAndroid.show('Perfil atualizado com sucesso!', ToastAndroid.SHORT);
    } catch (err) {
      setError('Falha ao atualizar o perfil!');
      console.error('Error updating profile:', err);
      ToastAndroid.show('Erro ao atualizar perfil', ToastAndroid.SHORT);
    } finally {
      setIsLoaded(false);
    }
  };

  if (Loaded) {
    return (
      <View style={[stylesUpdateProfile.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size={28} color={colors.text} />
      </View>
    )
  }

  return (
    <View style={[stylesUpdateProfile.container, { backgroundColor: colors.background }]}>
      <Text style={[stylesUpdateProfile.title, { color: colors.text }]}>Atualize seu perfil!</Text>
      {error && <Text style={[stylesUpdateProfile.error, { color: colors.error }]}>{error}</Text>}
      <TouchableOpacity style={stylesUpdateProfile.imageContainer} onPress={pickImage}>
        {uploadLoad ? (
          <View style={stylesUpdateProfile.uploadLoader}>
            <ActivityIndicator size={28} color={colors.text} />
          </View>
        ) : (
          image ? (
            <Image source={{ uri: image }} style={stylesUpdateProfile.image} />
          ) : (
            <View style={[stylesUpdateProfile.placeholderImage, { backgroundColor: colors.borderColor }]}>
              <Text style={[stylesUpdateProfile.placeholderText, { color: colors.text }]}>Selecionar Imagem</Text>
            </View>
          )
        )}
      </TouchableOpacity>
      <TextInput
        style={[stylesUpdateProfile.input, { color: colors.text, borderColor: colors.borderColor }]}
        placeholder="Seu nome"
        placeholderTextColor={'#999999'}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[stylesUpdateProfile.input, { color: colors.text, borderColor: colors.borderColor }]}
        placeholder="Email"
        placeholderTextColor={'#999999'}
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity disabled={isLoaded} style={[
        stylesUpdateProfile.button,
        {
          backgroundColor: isLoaded ? "#cccccc" : colors.primary,
          opacity: isLoaded ? 0.6 : 1,
        },
      ]} onPress={handleSave}>
        <Text style={[stylesUpdateProfile.buttonText, { color: colors.buttonText }]}>
          {isLoaded ? <ActivityIndicator size={20} color={colors.text} /> : "Atualizar Perfil"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

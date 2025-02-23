import { useTheme } from "@/hooks/useTheme";
import { deleteOldImage } from "@/types/DeleteItensFirabese";
import { storage } from "@/utils/firebase";
import { url } from "@/utils/url-api";
import { useClerk } from "@clerk/clerk-expo";
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";
import { stylesUpdateProfile } from "./(styles)/stylesUploadProfile";

export default function UpdateProfile() {
  const { colors } = useTheme();
  const { user } = useClerk();
  const userId = user?.id;
  const router = useRouter();

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    imageurl: null as string | null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch(`${url}/api/user/${userId}`);
      if (!response.ok) throw new Error("Erro ao buscar os dados do usuário");

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar os dados.");
    } finally {
      setIsLoading(false);
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
      setUserData((prev) => ({ ...prev, imageurl: manipResult.uri }));
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      setIsUploading(true);
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileRef = ref(storage, `app-menssagens/avatars/${userId}/${Date.now()}.jpg`);
      await uploadBytes(fileRef, blob);
      return await getDownloadURL(fileRef);
    } catch (error) {
      Alert.alert("Erro", "Falha no upload da imagem.");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      let imageUrl = userData.imageurl;
      if (imageUrl && imageUrl.startsWith("file://")) {
        if (userData.imageurl) await deleteOldImage(userData.imageurl);
        imageUrl = await uploadImage(imageUrl);
      }

      const res = await fetch(`${url}/api/user/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, imageurl: imageUrl, userId }),
      });

      if (!res.ok) throw new Error('Erro ao atualizar o perfil');

      ToastAndroid.show("Perfil atualizado com sucesso!", ToastAndroid.SHORT);
      setUserData((prev) => ({ ...prev, imageurl: imageUrl }));
    } catch (error) {
      Alert.alert("Erro", (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[stylesUpdateProfile.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size={28} color={colors.text} />
      </View>
    );
  }

  return (
    <View style={[stylesUpdateProfile.container, { backgroundColor: colors.background }]}>
      <Text style={[stylesUpdateProfile.title, { color: colors.text }]}>Atualize seu perfil!</Text>

      <TouchableOpacity style={stylesUpdateProfile.imageContainer} onPress={pickImage}>
        {isUploading ? (
          <ActivityIndicator size={28} color={colors.text} />
        ) : (
          userData.imageurl ? (
            <Image source={{ uri: userData.imageurl }} style={stylesUpdateProfile.image} />
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
        value={userData.name}
        onChangeText={(text) => setUserData((prev) => ({ ...prev, name: text }))}
      />

      <TextInput
        style={[stylesUpdateProfile.input, { color: colors.text, borderColor: colors.borderColor }]}
        placeholder="Email"
        placeholderTextColor={'#999999'}
        value={userData.email}
        onChangeText={(text) => setUserData((prev) => ({ ...prev, email: text }))}
      />

      <TextInput
        style={[stylesUpdateProfile.input, { color: colors.text, borderColor: colors.borderColor }]}
        placeholder="Número telefone (88)xxxxxxx"
        placeholderTextColor={'#999999'}
        value={userData.phone}
        onChangeText={(text) => setUserData((prev) => ({ ...prev, phone: text }))}
        keyboardType="phone-pad"
      />

      <TouchableOpacity
        disabled={isLoading}
        style={[
          stylesUpdateProfile.button,
          { backgroundColor: isLoading ? "#cccccc" : colors.primary, opacity: isLoading ? 0.6 : 1 },
        ]}
        onPress={handleSave}
      >
        {isLoading ? (
          <ActivityIndicator size={20} color={colors.text} />
        ) : (
          <Text style={[stylesUpdateProfile.buttonText, { color: colors.buttonText }]}>Atualizar Perfil</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

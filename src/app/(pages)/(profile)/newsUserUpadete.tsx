import { useTheme } from "@/hooks/useTheme";
import { storage } from "@/utils/firebase";
import { url } from "@/utils/url-api";
import { useClerk } from "@clerk/clerk-expo";
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { Alert, Image, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";
import { stylesUpdateProfile } from "./(styles)/stylesUploadProfile";

export default function NewsUserUpdateProfile() {
  const { colors } = useTheme();
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState("");
  const { user } = useClerk();

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
    }
  };

  const handleSave = async () => {
    if (!name) {
      setError("Todos os campos devem ser preenchidos!");
      return;
    }

    setIsLoaded(true);
    try {
      let imageUrl: string | null = null;
      if (image) {
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
          imageurl: imageUrl,
          phone
        }),
      })
      if (!res.ok) {
        Alert.alert("Error updating profile!")
        throw new Error('Falha ao atualizar o usuário!');
      }
      ToastAndroid.show('Perfil atualizado com sucesso!', ToastAndroid.SHORT);
      router.push('/(drawer)/(tabs)');
    } catch (err) {
      setError('Falha ao atualizar o perfil!');
      console.error('Error updating profile:', err);
      ToastAndroid.show('Erro ao atualizar perfil', ToastAndroid.SHORT);
    } finally {
      setIsLoaded(false);
    }
  };

  return (
    <View style={[stylesUpdateProfile.container, { backgroundColor: colors.background }]}>
      <Text style={[stylesUpdateProfile.title, { color: colors.text }]}>Atualize seu perfil antes de seguir!</Text>
      {error && <Text style={[stylesUpdateProfile.error, { color: colors.error }]}>{error}</Text>}
      <TouchableOpacity style={stylesUpdateProfile.imageContainer} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={stylesUpdateProfile.image} />
        ) : (
          <View style={[stylesUpdateProfile.placeholderImage, { backgroundColor: colors.borderColor }]}>
            <Text style={[stylesUpdateProfile.placeholderText, { color: colors.text }]}>Selecionar Imagem</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={[stylesUpdateProfile.input, { color: colors.text, borderColor: colors.borderColor }]}
        placeholder="Seu nome"
        placeholderTextColor={'#999999'}
        value={name}
        onChangeText={setName}
      />
      {/* <TextInput
        style={[stylesUpdateProfile.input, { color: colors.text, borderColor: colors.borderColor }]}
        placeholder="Email"
        placeholderTextColor={'#999999'}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        textContentType="emailAddress"
      /> */}
      <TextInput
        style={[stylesUpdateProfile.input, { color: colors.text, borderColor: colors.borderColor }]}
        placeholder="Seu telefone"
        placeholderTextColor={'#999999'}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
      />
      <TouchableOpacity style={[stylesUpdateProfile.button, { backgroundColor: colors.primary }]} onPress={handleSave}>
        <Text style={[stylesUpdateProfile.buttonText, { color: colors.buttonText }]}>
          {isLoaded ? "Atualizando..." : "Atualizar Perfil"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

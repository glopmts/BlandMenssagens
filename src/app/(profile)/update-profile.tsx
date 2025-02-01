import { useTheme } from "@/hooks/useTheme";
import { storage } from "@/utils/firebase";
import { supabase } from "@/utils/supabase";
import { useClerk } from "@clerk/clerk-expo";
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { Image, Platform, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";

export default function UpdateProfile() {
  const { colors } = useTheme();
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState("");
  const { user } = useClerk();
  const router = useRouter();

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
    if (!name || !email) {
      setError("Todos os campos devem ser preenchidos!");
      return;
    }

    setIsLoaded(true);

    try {
      let imageUrl: string | null = null;

      if (image) {
        imageUrl = await uploadImage(image);
      }

      console.log('Updating user data...');
      const { error: updateError } = await supabase.from('users').update({
        clerk_id: user?.id,
        imageurl: imageUrl,
        name: name,
        email: email,
      }).eq('clerk_id', user?.id);

      if (updateError) {
        throw new Error(`Update error: ${updateError.message}`);
      }
      console.log('User data updated successfully');

      ToastAndroid.show('Perfil atualizado com sucesso!', ToastAndroid.SHORT);
      router.push('/(tabs)');
    } catch (err) {
      setError('Falha ao atualizar o perfil!');
      console.error('Error updating profile:', err);
      ToastAndroid.show('Erro ao atualizar perfil', ToastAndroid.SHORT);
    } finally {
      setIsLoaded(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Atualize seu perfil antes de seguir!</Text>
      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={[styles.placeholderImage, { backgroundColor: colors.borderColor }]}>
            <Text style={[styles.placeholderText, { color: colors.text }]}>Selecionar Imagem</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.borderColor }]}
        placeholder="Seu nome"
        placeholderTextColor={'#999999'}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.borderColor }]}
        placeholder="Email"
        placeholderTextColor={'#999999'}
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSave}>
        <Text style={[styles.buttonText, { color: colors.buttonText }]}>
          {isLoaded ? "Atualizando..." : "Atualizar Perfil"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 80,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  error: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
  }
});
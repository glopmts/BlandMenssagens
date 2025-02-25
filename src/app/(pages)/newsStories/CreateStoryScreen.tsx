import { createStory } from '@/hooks/useStories';
import { useTheme } from '@/hooks/useTheme';
import { CreateStoryParams } from '@/types/interfaces';
import { useAuth } from '@clerk/clerk-expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, Image, Platform, StyleSheet, TextInput, View } from 'react-native';
import { uploadMediaToFirebase } from './uploadMediaToFirebase';

export default function CreateStoryScreen() {
  const { userId } = useAuth();
  const router = useRouter();
  const { mediaUri, mediaType } = useLocalSearchParams<CreateStoryParams>();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme()

  const handleCreateStory = async () => {
    try {
      setLoading(true);

      if (!mediaUri) {
        Alert.alert("Erro", "Nenhuma mídia selecionada.");
        return;
      }

      const uploadedMediaUrl = await uploadMediaToFirebase(
        mediaUri,
        mediaType === "photo" ? "image" : "video"
      );

      await createStory(
        userId!,
        mediaType === "photo" ? uploadedMediaUrl : "",
        text,
        mediaType === "video" ? uploadedMediaUrl : ""
      );

      Alert.alert("Sucesso", "Story criado com sucesso!");
      router.replace("/(drawer)/(tabs)");
    } catch (error) {
      Alert.alert("Erro", "Falha ao criar Story.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={{ uri: mediaUri }} alt="Imagem do story" style={styles.imagePreview} />
      <TextInput
        placeholder="Adicione um texto..."
        value={text}
        onChangeText={setText}
        style={styles.input}
      />
      <Button title={loading ? "Enviando..." : "Criar Story"} onPress={handleCreateStory} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 60,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    resizeMode: 'contain',
  },
});

import { createStory } from '@/hooks/useStories';
import { useTheme } from '@/hooks/useTheme';
import { CreateStoryParams } from '@/types/interfaces';
import { useAuth } from '@clerk/clerk-expo';
import { ResizeMode, Video } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
      <View style={styles.containerInfors}>
        {mediaType === 'photo' && (
          <Image source={{ uri: mediaUri }} alt="Imagem do story" style={styles.imagePreview} />
        )}
        {mediaType === 'video' && (
          <Video
            source={{ uri: mediaUri }}
            style={styles.media}
            useNativeControls
            resizeMode={ResizeMode.COVER}
            shouldPlay={false}
          />
        )}
      </View>
      <TextInput
        placeholder="Adicione um texto..."
        value={text}
        onChangeText={setText}
        style={[styles.input, { color: colors.text }]}
        placeholderTextColor={colors.text}
      />
      <TouchableOpacity onPress={handleCreateStory} style={styles.button} disabled={loading}>
        {loading ? <ActivityIndicator size="small" color={colors.text} style={{ marginLeft: 10 }} /> : (
          <Text style={styles.buttonText}>Criar Story</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    paddingTop: Platform.OS === "ios" ? 60 : 60,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  containerInfors: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
  },
  imagePreview: {
    width: '100%',
    height: 400,
    marginBottom: 20,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  media: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});

import { useTheme } from '@/hooks/useTheme';
import { CreateStoryParams, MediaType } from '@/types/interfaces';
import { AntDesign, Entypo, EvilIcons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MediaInfo {
  uri: string;
  width: number;
  height: number;
  type: MediaType;
}

export default function MediaPickerExample() {
  const [media, setMedia] = useState<MediaInfo | null>(null);
  const { colors } = useTheme();

  const pickMedia = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permissão para acessar a galeria é necessária!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
      selectionLimit: 1,
      videoMaxDuration: 60
    });

    if (!result.canceled) {
      const { uri, width, height, type } = result.assets[0];

      if (!FileSystem.documentDirectory) {
        alert('Falha ao acessar o diretório de documentos');
        return;
      }
      const newUri = FileSystem.documentDirectory + uri.split('/').pop();
      await FileSystem.copyAsync({ from: uri, to: newUri });

      const mediaType = type === 'image' ? 'photo' : 'video';

      const selectedMedia = {
        uri: newUri,
        width,
        height,
        type: mediaType as MediaType,
      };
      setMedia(selectedMedia);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permissão para acessar a câmera é necessária!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const { uri, width, height } = result.assets[0];

      if (!FileSystem.documentDirectory) {
        alert('Falha ao acessar o diretório de documentos');
        return;
      }
      const newUri = FileSystem.documentDirectory + uri.split('/').pop();
      await FileSystem.copyAsync({ from: uri, to: newUri });

      const selectedMedia = {
        uri: newUri,
        width,
        height,
        type: 'photo' as MediaType,
      };
      setMedia(selectedMedia);
    }
  };

  const handleSelectMedia = () => {
    if (!media) return;

    const params: CreateStoryParams = {
      mediaUri: media.uri,
      mediaType: media.type,
    };

    router.push({
      pathname: '/(pages)/newsStories/CreateStoryScreen',
      params,
    });
  };

  const handleBack = () => {
    router.navigate("/(drawer)/(tabs)");
    setMedia(null);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.buttonBack} onPress={handleBack}>
        <AntDesign name="leftcircle" size={28} color="#fff" />
      </TouchableOpacity>

      {media && (
        <View style={styles.mediaContainer}>
          {media.type === 'photo' ? (
            <Image source={{ uri: media.uri }} style={styles.media} />
          ) : (
            <Video
              source={{ uri: media.uri }}
              style={styles.media}
              useNativeControls
              resizeMode={ResizeMode.COVER}
            />
          )}
          <Text style={styles.mediaInfo}>
            Tamanho: {media.width}x{media.height}
          </Text>

          <TouchableOpacity style={styles.nextButton} onPress={handleSelectMedia}>
            <Text style={styles.buttonText}>Próximo</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <EvilIcons name="camera" size={27} color={colors.text} />
          <Text style={styles.buttonText}>Tirar Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickMedia}>
          <Entypo name="images" size={22} color={colors.text} />
          <Text style={styles.buttonText}>Escolher da Galeria</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 60,
  },
  buttonContainer: {
    marginBottom: 20,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  mediaContainer: {
    alignItems: 'center',
  },
  buttonBack: {
    marginBottom: 20,
  },
  media: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  mediaInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
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
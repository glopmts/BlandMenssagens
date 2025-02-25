import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';

export default function VideoPickerExample() {
  const [video, setVideo] = useState<string | null>(null);
  const videoRef = React.useRef<Video>(null);

  const pickVideo = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permissão para acessar a galeria é necessária!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Selecionar Vídeo da Galeria" onPress={pickVideo} />

      {video && (
        <Video
          ref={videoRef}
          source={{ uri: video }}
          style={styles.video}
          useNativeControls
          isLooping
          onError={(error) => {
            console.log('Erro ao carregar o vídeo:', error);
            alert('Erro ao carregar o vídeo. Tente novamente.');
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: 200,
    marginTop: 20,
  },
});
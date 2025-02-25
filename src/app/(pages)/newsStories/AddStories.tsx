import { useTheme } from '@/hooks/useTheme'
import { CreateStoryParams, MediaType } from '@/types/interfaces'
import { AntDesign } from '@expo/vector-icons'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { useState } from 'react'
import { Button, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface ImageInfo {
  uri: string
  width: number
  height: number
  type: MediaType
}

export default function ImagePickerExample() {
  const [image, setImage] = useState<ImageInfo | null>(null);
  const { colors } = useTheme()

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];

      if (!FileSystem.documentDirectory) {
        alert('Failed to access document directory');
        return;
      }
      const newUri = FileSystem.documentDirectory + uri.split('/').pop();
      await FileSystem.copyAsync({ from: uri, to: newUri });
      const selectedImage = {
        uri: newUri,
        width: result.assets[0].width,
        height: result.assets[0].height,
        type: 'photo' as MediaType,
      };
      setImage(selectedImage);
    }
  };


  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
    if (!permissionResult.granted) {
      alert('Permission to access camera is required!')
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      const { uri } = result.assets[0];

      if (!FileSystem.documentDirectory) {
        alert('Failed to access document directory');
        return;
      }
      const newUri = FileSystem.documentDirectory + uri.split('/').pop();
      await FileSystem.copyAsync({ from: uri, to: newUri });
      const selectedImage = {
        uri: newUri,
        width: result.assets[0].width,
        height: result.assets[0].height,
        type: 'photo' as MediaType,
      };
      setImage(selectedImage);
    }
  }

  const handleSelectMedia = () => {
    if (!image) return;
    const params: CreateStoryParams = {
      mediaUri: image.uri,
      mediaType: image.type
    }
    router.push({
      pathname: "/(pages)/newsStories/CreateStoryScreen",
      params
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.buttonBack} onPress={() => router.back()}>
        <AntDesign name="leftcircle" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <Button onPress={pickImage} title='Pick an image from gallery' />
        <Button title='Take a photo' onPress={takePhoto} />
      </View>

      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image.uri }} style={styles.image} />
          <Text style={styles.imageInfo}>
            Size: {image.width}x{image.height}
          </Text>

          <TouchableOpacity style={styles.nextButton} onPress={handleSelectMedia}>
            <Text style={styles.nextButtonText}>Próximo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 60,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
  },
  buttonBack: {
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  imageInfo: {
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
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
})

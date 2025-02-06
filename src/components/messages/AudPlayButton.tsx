"use client"

import { useTheme } from "@/hooks/useTheme"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { Audio } from "expo-av"
import { Image } from "expo-image"
import { useEffect, useState } from "react"
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native"

export default function AudioPlayer({ audioUrl, imageUrl }: { audioUrl: string, imageUrl: string }) {
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [animation] = useState(new Animated.Value(0))
  const { colors } = useTheme()

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(animation, { toValue: 0, duration: 1000, useNativeDriver: true }),
        ]),
      ).start()
    } else {
      animation.setValue(0)
    }
  }, [isPlaying, animation])

  const playAudio = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync()
          setIsPlaying(false)
        } else {
          await sound.playAsync()
          setIsPlaying(true)
        }
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl })
        setSound(newSound)
        await newSound.playAsync()
        setIsPlaying(true)

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
            setIsPlaying(false)
          }
        })
      }
    } catch (error) {
      console.error("Erro ao reproduzir áudio", error)
    }
  }

  const animatedStyle = {
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1],
        }),
      },
    ],
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <TouchableOpacity onPress={playAudio} style={styles.button}>
        <Animated.View style={[styles.iconContainer, animatedStyle]}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>
      {imageUrl ? (
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: imageUrl }} />
          <FontAwesome style={styles.mic} name="microphone" size={18} color={colors.primary} />
        </View>
      ) : (
        <Ionicons name="person" size={24} color="white" />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: 'row',
    padding: 10,
    borderRadius: 12,
    width: '90%'
  },
  imageContainer: {
    position: 'relative'
  },
  button: {
    backgroundColor: "#4A90E2",
    borderRadius: 50,
    padding: 1,
  },
  mic: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    resizeMode: "cover",
  }
})


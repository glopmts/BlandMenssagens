import { useTheme } from "@/hooks/useTheme"
import type { StoryInterface } from "@/types/interfaces"
import { FontAwesome5 } from "@expo/vector-icons"
import { Image } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { useEffect, useState } from "react"
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface StoryModalProps {
  visible: boolean
  onClose: () => void
  story: StoryInterface
}

const { width, height } = Dimensions.get("window")

export const StoryModal = ({ visible, onClose, story }: StoryModalProps) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const { colors } = useTheme()

  const currentStory = story.stories[currentStoryIndex]

  useEffect(() => {
    if (visible && !paused) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 1) {
            setCurrentStoryIndex((prevIndex) => {
              if (prevIndex < story.stories.length - 1) {
                return prevIndex + 1;
              } else {
                clearInterval(timer);
                onClose();
                return prevIndex;
              }
            });
            return 0;
          }
          return prev + 0.01;
        });
      }, 30);

      return () => clearInterval(timer);
    }
  }, [visible, paused, onClose, story.stories.length]);


  const handlePress = (event: any) => {
    const x = event.nativeEvent.locationX
    const screenWidth = Dimensions.get("window").width

    if (x < screenWidth / 2) {
      if (currentStoryIndex > 0) {
        setCurrentStoryIndex(currentStoryIndex - 1)
        setProgress(0)
      }
    } else {
      if (currentStoryIndex < story.stories.length - 1) {
        setCurrentStoryIndex(currentStoryIndex + 1)
        setProgress(0)
      } else {
        onClose()
      }
    }
  }

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.container}>
        <LinearGradient colors={["rgba(0,0,0,0.5)", "transparent", "rgba(0,0,0,0.5)"]} style={styles.gradient}>
          <View style={styles.header}>
            <View style={styles.progressContainer}>
              {story.stories.map((s, index) => (
                <View key={s.id} style={styles.progressBar}>
                  <View
                    style={[
                      styles.progress,
                      {
                        width:
                          index === currentStoryIndex
                            ? `${progress * 100}%`
                            : index < currentStoryIndex
                              ? "100%"
                              : "0%",
                      },
                    ]}
                  />
                </View>
              ))}
            </View>
            <View style={styles.headerInfor}>
              <View style={styles.userInfo}>
                <Image source={{ uri: story.user?.imageUrl || story.contact?.imageUrl }} style={styles.avatar} />
                <View>
                  <Text style={[styles.nameContainer, { color: colors.text }]}>
                    {story.user?.name || story.contact?.name}
                  </Text>
                </View>
              </View>
              <View>
                <TouchableOpacity>
                  <FontAwesome5 name="ellipsis-v" size={14} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={handlePress}
            onPressIn={() => setPaused(true)}
            onPressOut={() => setPaused(false)}
          >
            {currentStory.imageUrl && (
              <Image source={{ uri: currentStory.imageUrl }} style={styles.storyImage} contentFit="contain" />
            )}
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  gradient: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 48,
  },
  progressContainer: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  progress: {
    height: "100%",
    backgroundColor: "#fff",
  },
  headerInfor: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  nameContainer: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  storyImage: {
    width,
    height: height - 100,
    marginTop: 50,
  },
})


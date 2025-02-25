import { handleDeleteStories } from "@/hooks/useStories"
import { useTheme } from "@/hooks/useTheme"
import type { StoryInterface } from "@/types/interfaces"
import { FontAwesome5 } from "@expo/vector-icons"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { ResizeMode, Video } from "expo-av"
import { Image } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { useVideoPlayer } from "expo-video"
import { useEffect, useRef, useState } from "react"
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface StoryModalProps {
  visible: boolean;
  onClose: () => void;
  story: StoryInterface;
  userId: string;
  user_id: string;
  storyId: string;
  refetch: () => void;
}

const { width, height } = Dimensions.get("window")

export const StoryModal = ({ visible, onClose, story, userId, user_id, storyId, refetch }: StoryModalProps) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const { colors } = useTheme()
  const bottomSheetRef = useRef<BottomSheet>(null);
  const videoRef = useRef<Video>(null);

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

  const handleDeleteStatus = async () => {
    await handleDeleteStories(userId, storyId, refetch)
    setIsMenuVisible(false)
    onClose()
  }

  const openMenu = () => {
    bottomSheetRef.current?.expand();
    setIsMenuVisible(true);
    setPaused(true);
  };

  const closeMenu = () => {
    bottomSheetRef.current?.close();
    setIsMenuVisible(false);
    setPaused(false);
  };

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      const newProgress = status.positionMillis / status.durationMillis;
      setProgress(newProgress);
    }
  };

  const videoSource = currentStory.videoUrl ?? '';

  const player = useVideoPlayer(videoSource, player => {
    player.currentTime,
      player.volume = 1,
      player.availableSubtitleTracks,
      player.bufferOptions,
      player.duration,
      player.targetOffsetFromLive
  })

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
                <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
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
            {currentStory.videoUrl && (
              <Video
                ref={videoRef}
                source={{ uri: currentStory.videoUrl }}
                shouldPlay={!paused}
                resizeMode={ResizeMode.COVER}
                style={styles.storyImage}
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
              />
            )}
          </TouchableOpacity>
        </LinearGradient>

        {isMenuVisible && (
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={["50%"]}
            backgroundStyle={[styles.container, { backgroundColor: colors.background }]}
            handleStyle={{ backgroundColor: colors.backgroundHeader, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
            handleIndicatorStyle={{ backgroundColor: colors.text }}
            backdropComponent={({ style }) => (
              <TouchableOpacity
                style={[style]}
                activeOpacity={1}
                onPress={closeMenu}
              />
            )}
          >
            <BottomSheetView style={[styles.contentContainer, { backgroundColor: colors.background }]}>
              {userId === user_id && (
                <TouchableOpacity onPress={handleDeleteStatus} style={[styles.button, { backgroundColor: colors.red, borderColor: colors.borderColor }]}>
                  <Text style={styles.textButton}>Excluir Status</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.button, { backgroundColor: colors.card, borderColor: colors.borderColor }]}>
                <Text style={styles.textButton}>Compartilhar</Text>
              </TouchableOpacity>
            </BottomSheetView>
          </BottomSheet>
        )}
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
  menuButton: {
    padding: 16,
  },
  headerInfor: {
    zIndex: 400,
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
  menuContainer: {
    position: "absolute",
    top: 60,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    elevation: 4,
  },
  menuItem: {
    padding: 8,
  },
  menuItemText: {
    fontSize: 16,
    color: "#000",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingTop: 24,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
  },
  textButton: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  }
})
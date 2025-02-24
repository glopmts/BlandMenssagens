import { useTheme } from "@/hooks/useTheme"
import { Image } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface StoryPreviewProps {
  imageurl?: string
  name: string
  hasStory?: boolean
  onPress: () => void
  userId: string
  user_id: string
  storyCount?: number;
  isViewed?: boolean
  storyId?: string;
  onStoryView: (storyId: string, userId: string) => Promise<void>;
}

export const StoryPreview = ({
  imageurl,
  name,
  hasStory,
  onPress,
  userId,
  user_id,
  storyCount = 0,
  isViewed = false,
  storyId,
  onStoryView
}: StoryPreviewProps) => {
  const { colors } = useTheme();
  const [viewed, setViewed] = useState(isViewed)

  const handlePress = async () => {
    if (storyId && onStoryView && !viewed) {
      await onStoryView(userId, storyId)
      setViewed(true)
    }
    onPress()
  }

  const gradientColors: [string, string] = viewed
    ? ["#6b7280", "#9ca3af"]
    : ["#2563eb", "#38bdf8"]

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={[styles.imageContainer]}>
        {hasStory && (
          <LinearGradient
            colors={gradientColors}
            style={styles.storyRing}
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}
        {imageurl ? (
          <View>
            <Image source={{ uri: imageurl }} style={styles.image} />
            {storyCount > 1 && (
              <View style={[styles.countBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.countText}>{storyCount}</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={[styles.fallbackImage, { backgroundColor: colors.background }]}>
            <Text style={[styles.fallbackText, { color: colors.text }]}>{name.charAt(0).toUpperCase()}</Text>
            {storyCount > 1 && (
              <View style={[styles.countBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.countText}>{storyCount}</Text>
              </View>
            )}
          </View>
        )}
      </View>
      <View style={styles.storyCont}>
        {userId === user_id ? (
          <Text style={[styles.name, { color: colors.text }]}>Meus Stories</Text>
        ) : (
          <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    alignItems: "center",
    marginBottom: 12,
  },
  imageContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    marginBottom: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  storyRing: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,
    padding: 2,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: "#082f49",
  },
  fallbackImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  fallbackText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
  },
  storyCont: {
    paddingTop: 4,
  },
  name: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    width: "100%",
  },
  countBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  countText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
})


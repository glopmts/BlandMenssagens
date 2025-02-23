import { useTheme } from "@/hooks/useTheme";
import { Image } from "expo-image";
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface StoryPreviewProps {
  imageurl?: string;
  name: string;
  hasStory?: boolean;
  onPress: () => void;
}

export const StoryPreview = ({ imageurl, name, hasStory, onPress }: StoryPreviewProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.imageContainer]}>
        {hasStory && (
          <LinearGradient
            colors={['#2563eb', '#38bdf8']}
            style={styles.storyRing}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}
        {imageurl ? (
          <Image source={{ uri: imageurl }} style={styles.image} />
        ) : (
          <View style={[styles.fallbackImage, { backgroundColor: colors.background }]}>
            <Text style={[styles.fallbackText, { color: colors.text }]}>{name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
      </View>
      <View style={styles.storyCont}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    alignItems: 'center',
    marginBottom: 12,
  },
  imageContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyRing: {
    position: 'absolute',
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
    borderColor: '#082f49',
  },
  fallbackImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  fallbackText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  storyCont: {
    paddingTop: 4,
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    width: '100%',
  },
});
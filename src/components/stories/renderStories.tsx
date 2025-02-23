import StoriesUser from "@/hooks/useStories";
import { useTheme } from "@/hooks/useTheme";
import { StoryInterface } from "@/types/interfaces";
import { useAuth } from "@clerk/clerk-expo";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { StoryModal } from "./storieModal";
import { StoryPreview } from "./storiePreview";

const RenderStoriesUsers = () => {
  const { userId } = useAuth();
  const { error, isLoading, refetch, stories } = StoriesUser(userId!);
  const [selectedStory, setSelectedStory] = useState<StoryInterface | null>(null);
  const { colors } = useTheme();

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>Stories</Text>
      <View style={styles.storiesContainer}>
        {stories.map((story: StoryInterface) => {
          const user = story.user || story.contact;
          if (!user) return null;

          return (
            <StoryPreview
              key={story.id}
              imageurl={user.imageUrl}
              name={user.name}
              hasStory={!!story.imageUrl || !!story.text}
              onPress={() => setSelectedStory(story)}
            />
          );
        })}
      </View>

      {selectedStory && (
        <StoryModal
          visible={!!selectedStory}
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
  },
  storiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 4,
    gap: 30,
  },
});

export default RenderStoriesUsers;
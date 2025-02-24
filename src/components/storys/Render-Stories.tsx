import StoriesUser from "@/hooks/useStories"
import { useTheme } from "@/hooks/useTheme"
import type { Story, StoryInterface } from "@/types/interfaces"
import { url } from "@/utils/url-api"
import { useAuth } from "@clerk/clerk-expo"
import { useMemo, useState } from "react"
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native"
import { StoryModal } from "./StoriesModal"
import { StoryPreview } from "./StoriesPreview"

const RenderStoriesUsers = () => {
  const { userId } = useAuth()
  const { error, isLoading, refetch, stories, viewedStories } = StoriesUser(userId!)
  const [selectedStory, setSelectedStory] = useState<StoryInterface | null>(null)
  const { colors } = useTheme()
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [localViewedStories, setLocalViewedStories] = useState<Set<string>>(new Set(viewedStories));

  const groupedStories = useMemo(() => {
    const groups = new Map<string, StoryInterface>();

    if (!stories || !Array.isArray(stories)) return null;
    stories?.forEach((story: Story) => {
      if (!groups.has(story.user_id)) {
        groups.set(story.user_id, {
          id: story.user_id,
          user_id: story.user_id,
          stories: [],
          user: story.user,
          contact: story.contact,
        });
      }
      groups.get(story.user_id)?.stories.push(story);
    });

    return Array.from(groups.values());
  }, [stories]);


  const onStoryView = async (userId: string, storyId: string) => {
    try {
      const res = await fetch(`${url}/api/user/stories/view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, storyId }),
      })

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao marcar Story como vista.");
      setLocalViewedStories(prev => new Set([...prev, storyId]))
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao marcar Story como vista.");
      throw error;
    }
  }

  if (error) {
    return <Text style={[styles.error, { color: colors.red }]}>Error: {error.message}</Text>
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={24} color={colors.primary} />
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>Stories</Text>
      <View style={styles.storiesContainer}>
        {groupedStories?.map((story: StoryInterface) => {
          const user = story.user || story.contact
          if (!user) return null

          const isViewed = localViewedStories.has(story.stories[0]?.id) ||
            story.stories[0]?.isViewed

          return (
            <StoryPreview
              key={story.user_id}
              imageurl={user.imageUrl}
              name={user.name}
              user_id={story.user_id}
              userId={userId!}
              onStoryView={onStoryView}
              isViewed={isViewed}
              storyId={story.stories[0]?.id}
              hasStory={story.stories.length > 0}
              storyCount={story.stories.length}
              onPress={() => setSelectedStory(story)}
            />
          )
        })}
      </View>

      {selectedStory && (
        <StoryModal
          visible={!!selectedStory}
          story={selectedStory}
          userId={userId!}
          user_id={selectedStory.user_id}
          onClose={() => {
            setSelectedStory(null)
            setCurrentStoryIndex(0)
          }}
        />
      )}
    </View>
  )
}

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
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 4,
    gap: 30,
  },
  error: {
    fontSize: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    textAlign: "center",
    fontWeight: "bold",
    lineHeight: 24,
  }
})

export default RenderStoriesUsers


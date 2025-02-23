import { useTheme } from '@/hooks/useTheme';
import { StoryInterface } from '@/types/interfaces';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StoryModalProps {
  visible: boolean;
  onClose: () => void;
  story: StoryInterface;
}

const { width, height } = Dimensions.get('window');

export const StoryModal = ({ visible, onClose, story }: StoryModalProps) => {
  const [progress, setProgress] = useState(0);
  const { colors } = useTheme();

  useEffect(() => {
    if (visible) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 1) {
            clearInterval(timer);
            onClose();
            return 1;
          }
          return prev + 0.01;
        });
      }, 30);

      return () => {
        clearInterval(timer);
        setProgress(0);
      };
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'transparent', 'rgba(0,0,0,0.5)']}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: `${progress * 100}%` }]} />
            </View>
            <View style={styles.userInfo}>
              <Image
                source={{ uri: story.user?.imageUrl || story.contact?.imageUrl }}
                style={styles.avatar}
              />
              <View>
                <Text style={[styles.nameContainer, { color: colors.text }]}>
                  {story.user?.name || story.contact?.name}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={onClose}
          >
            {story.imageUrl && (
              <Image
                source={{ uri: story.imageUrl }}
                style={styles.storyImage}
                contentFit="contain"
              />
            )}
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradient: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 48,
  },
  progressBar: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginBottom: 16,
  },
  progress: {
    height: '100%',
    backgroundColor: '#fff',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  nameContainer: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  storyImage: {
    width,
    height: height - 100,
    marginTop: 50,
  },
});
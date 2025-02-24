import { useTheme } from '@/hooks/useTheme';
import { ActivityIndicator, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function LoadingScreen() {
  const { colors } = useTheme();

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[
        styles.container,
      ]}
    >
      <ActivityIndicator size={28} color={colors.primary} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E'
  },
});
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export function LoadingScreen() {
  const { colors } = useTheme();

  return (
    <Animated.View 
      entering={FadeIn}
      exiting={FadeOut}
      style={[
        styles.container,
        { backgroundColor: colors.background }
      ]}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
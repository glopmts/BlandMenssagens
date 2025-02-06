import { useNetInfo } from '@react-native-community/netinfo';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';

const NoConnection = () => {
  const [isReloading, setIsReloading] = useState(false);
  const router = useRouter();
  const netInfo = useNetInfo();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);


  useEffect(() => {
    if (netInfo.isConnected) {
      router.replace("/(drawer)/(tabs)");
    }
  }, [netInfo.isConnected, router]);

  const handleRefresh = () => {
    setIsReloading(true);
    setTimeout(() => {
      if (netInfo.isConnected) {
        router.replace("/(drawer)/(tabs)");
      }
      setIsReloading(false);
    }, 1000);
  };

  return (
    <LinearGradient style={styles.container} colors={['#2c3e50', '#34495e', '#2c3e50']}>
      <StatusBar style="light" />
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <LottieView
          source={require('../../../assets/no-net.json')}
          autoPlay
          loop
          style={styles.lottieAnimation}
        />
        <Text style={styles.title}>Sem conexão</Text>
        <Text style={styles.text}>Não foi possível conectar à internet. Verifique sua conexão e tente novamente.</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh} disabled={isReloading}>
          {isReloading ? (
            <LottieView
              source={require('../../../assets/loading.json')}
              autoPlay
              loop
              style={styles.loadingAnimation}
            />
          ) : (
            <Text style={styles.refreshText}>Tentar Novamente</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  lottieAnimation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#ecf0f1',
    marginBottom: 30,
  },
  refreshButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 3,
  },
  refreshText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingAnimation: {
    width: 50,
    height: 50,
  },
});

export default NoConnection;

import { supabase } from '@/utils/supabase';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export const requestNotificationPermission = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== 'granted') {
      alert('Permissão para notificações não concedida!');
      return false;
    }
  }

  return true;
};


export const useRegisterPushToken = (userId: string) => {
  useEffect(() => {
    const registerForPushNotifications = async () => {
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          console.log('Permissão de notificação negada!');
          return;
        }

        const pushToken = (await Notifications.getExpoPushTokenAsync()).data;

        console.log('Novo Push Token:', pushToken);

        const { error } = await supabase
          .from('users')
          .update({ push_token: pushToken })
          .eq('clerk_id', userId);

        if (error) {
          console.error('Erro ao salvar token:', error.message);
        } else {

        }
      } catch (err) {
        console.error('Erro ao registrar notificações:', err);
      }
    };

    if (userId) {
      registerForPushNotifications();
    }
  }, [userId]);
};
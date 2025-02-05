import { url } from '@/utils/url-api';
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
        const res = await fetch(`${url}/api/user/pushtoken`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            push_token: pushToken,
          }),
        })

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
      } catch (error) {
        console.error('Error registering for push notifications:', error);
      }
    };

    if (userId) {
      registerForPushNotifications();
    }
  }, [userId]);
};
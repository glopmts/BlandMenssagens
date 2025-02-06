'use client';

import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

interface AudioRecorderProps {
  onSend: (audioUri: string) => void;
}

export default function AudioRecorder({ onSend }: AudioRecorderProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        alert('Permissão para gravar áudio negada.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await newRecording.startAsync();

      setRecording(newRecording);
      setIsRecording(true);
    } catch (error) {
      console.error('Erro ao iniciar gravação', error);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) {
        onSend(uri);
      }

      setRecording(null);
      setIsRecording(false);
    } catch (error) {
      console.error('Erro ao parar gravação', error);
    }
  };

  return (
    <TouchableOpacity onPress={isRecording ? stopRecording : startRecording}>
      <View style={{ backgroundColor: isRecording ? 'red' : '#1E90FF', padding: 10, borderRadius: 25 }}>
        <Ionicons name={isRecording ? 'stop' : 'mic'} size={24} color="white" />
      </View>
    </TouchableOpacity>
  );
}

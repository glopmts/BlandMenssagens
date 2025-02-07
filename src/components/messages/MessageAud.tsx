import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';

interface AudioRecorderProps {
  onSend: (audioUri: string, tempMessageId: string) => void
}

export default function AudioRecorder({ onSend }: AudioRecorderProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
      if (!recording) return

      await recording.stopAndUnloadAsync()
      const uri = recording.getURI()
      if (uri) {
        setIsUploading(true)
        const tempMessageId = `temp-${Date.now()}`
        onSend(uri, tempMessageId)
      }

      setRecording(null)
      setIsRecording(false)
    } catch (error) {
      console.error("Erro ao parar gravação", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <TouchableOpacity onPress={isRecording ? stopRecording : startRecording} disabled={isUploading}>
      <View style={{ backgroundColor: isRecording ? "red" : "#1E90FF", padding: 10, borderRadius: 25 }}>
        {isUploading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Ionicons name={isRecording ? "stop" : "mic"} size={24} color="white" />
        )}
      </View>
    </TouchableOpacity>
  );
}

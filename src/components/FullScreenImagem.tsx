import { stylesChat } from "@/app/(pages)/menssagens/styles/stylesChat";
import React, { useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import ImageViewing from "react-native-image-viewing";

interface ImageProps {
  imageUrl: string;
  onLongPress?: () => void;
}

export default function FullScreenImage({ imageUrl, onLongPress }: ImageProps) {
  const [visible, setVisible] = useState(false);

  const handleOpenImage = () => {
    setVisible(true);
  };

  return (
    <>
      <TouchableOpacity onPress={handleOpenImage} onLongPress={onLongPress} delayLongPress={300}>
        <Image source={{ uri: imageUrl }} style={stylesChat.image} />
      </TouchableOpacity>

      <ImageViewing
        images={[{ uri: imageUrl }]}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      />
    </>
  );
}

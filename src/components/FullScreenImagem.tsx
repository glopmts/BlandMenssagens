import { stylesChat } from "@/app/(pages)/menssagens/styles/stylesChat";
import React, { useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import ImageViewing from "react-native-image-viewing";

interface ImageProps {
  imageUrl: string;
}

export default function FullScreenImage({ imageUrl, }: ImageProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)}>
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
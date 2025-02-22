import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type MenuProps = {
  onCilckImage: () => void;
  onCilckFiles: () => void;
  onCilckCam: () => void;
  isVisible: boolean;
};

const MenuOptions = ({ onCilckFiles, onCilckImage, onCilckCam, isVisible }: MenuProps) => {
  const { colors } = useTheme();
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isVisible ? 80 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isVisible]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.borderColor,
          height: animation,
        },
      ]}
    >
      <View style={styles.itensCont}>
        <View style={styles.itensDetails}>
          <TouchableOpacity
            style={[styles.itens, { backgroundColor: colors.backgroundButton, borderColor: colors.borderColor }]}
            onPress={onCilckImage}
          >
            <Ionicons name="image" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ color: colors.text, fontSize: 12 }}>Imagens</Text>
        </View>
        <View style={styles.itensDetails}>
          <TouchableOpacity
            style={[styles.itens, { backgroundColor: colors.backgroundButton, borderColor: colors.borderColor }]}
            onPress={onCilckFiles}
          >
            <Ionicons name="file-tray-full" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ color: colors.text, fontSize: 12 }}>Arquivos</Text>
        </View>
        <View style={styles.itensDetails}>
          <TouchableOpacity
            style={[styles.itens, { backgroundColor: colors.backgroundButton, borderColor: colors.borderColor }]}
            onPress={onCilckCam}
          >
            <Ionicons name="camera" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ color: colors.text, fontSize: 12 }}>Camera</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 0,
    bottom: 0,
    width: "100%",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 20,
    zIndex: 600,
    overflow: "hidden",
  },
  itensCont: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 16,
  },
  itensDetails: {
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  itens: {
    borderRadius: 8,
    padding: 8,
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    borderWidth: 1,
  },
});

export default MenuOptions;

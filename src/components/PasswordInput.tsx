import { stylesInputs } from "@/app/styles/StylesInputs";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, TextInput, TouchableOpacity, View } from "react-native";

interface PasswordInputProps {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  loader?: boolean;
  handleShowPreview?: () => void;
}

export default function PasswordInput({ loader, password, setPassword }: PasswordInputProps) {
  const { colors } = useTheme();
  const [isPreview, setIsPreview] = useState(false);

  const handleShowPreview = () => setIsPreview(!isPreview);

  return (
    <View style={stylesInputs.passwordInput}>
      <TextInput
        style={[stylesInputs.input, { color: colors.text }]}
        placeholder="Senha"
        placeholderTextColor={colors.gray}
        value={password}
        onChangeText={setPassword}
        keyboardType={isPreview ? 'visible-password' : 'ascii-capable'}
        secureTextEntry
      />
      <TouchableOpacity style={[stylesInputs.buttonPassword]} onPress={handleShowPreview} disabled={loader}>
        {loader ? <ActivityIndicator color={colors.buttonText} /> : <Ionicons name={isPreview ? 'eye' : 'eye-off-outline'} size={24} color="#fffc" />}
      </TouchableOpacity>
    </View>
  )
}
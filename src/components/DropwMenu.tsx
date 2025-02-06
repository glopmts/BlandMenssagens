import { useTheme } from "@/hooks/useTheme"
import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface MenuItem {
  label: string
  value: string
  nameIcon: string
}

interface MenuProps {
  items: MenuItem[]
  visible: boolean
  onClose: () => void
  onItemPress: (value: string) => void
}

export default function DropwMenu({ items, visible, onClose, onItemPress }: MenuProps) {
  const { colors } = useTheme()

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.dropdownContainer, { backgroundColor: colors.backgroundColorHeaderLinks }]}>
          <View style={styles.dropdown}>
            <View style={{ flex: 1, gap: 15 }}>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => {
                    onItemPress(item.value)
                    onClose()
                  }}
                  style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
                >
                  <Ionicons size={24} name={item.nameIcon as any || "close-circle"} color={colors.text} />
                  <Text style={[styles.selectedTextStyle, { color: colors.text }]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "flex-end",
    padding: 10,
    paddingTop: 10,
  },
  dropdownContainer: {
    width: "60%",
    borderRadius: 8,
    padding: 16,
    elevation: 5,
  },
  dropdown: {
    borderRadius: 8,
    gap: 10,
    height: 120,
  },
  selectedTextStyle: {
    fontSize: 18,
  },
})

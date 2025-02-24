import { useTheme } from '@/hooks/useTheme';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

interface BottomSheetComponentProps {
  onSheetChange: (isOpen: boolean) => void;
  children: React.ReactNode;
  snapPoints: number[];
}

const BottomSheetComponent: React.FC<BottomSheetComponentProps> = ({ onSheetChange, children, snapPoints }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { colors } = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSheetChanges = (index: number) => {
    const isSheetOpen = index !== -1;
    setIsOpen(isSheetOpen);
    onSheetChange(isSheetOpen);
  };

  const closeSheet = () => {
    bottomSheetRef.current?.close();
  };

  useEffect(() => {
    const backAction = () => {
      if (isOpen) {
        closeSheet();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, [isOpen]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <TouchableWithoutFeedback onPress={closeSheet}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        backgroundStyle={[styles.container, { backgroundColor: colors.background }]}
        handleStyle={{ backgroundColor: colors.backgroundHeader, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
        handleIndicatorStyle={{ backgroundColor: colors.text }}
        onChange={handleSheetChanges}
        onClose={() => setIsOpen(false)}
      >
        <BottomSheetView style={{ padding: 16 }}>
          {children}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderTopLeftRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default BottomSheetComponent;
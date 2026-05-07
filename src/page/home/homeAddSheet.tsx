import { useEffect, useRef, useState } from "react";
import {
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { CarFront, FileText, Receipt, ChevronRight, X } from "lucide-react-native";
import { BlurView } from "expo-blur";

const { height } = Dimensions.get("window");

interface HomeAddBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onAddCar: () => void;
  onAddDocument: () => void;
  onAddExpense: () => void;
}

export default function HomeAddBottomSheet({
  visible,
  onClose,
  onAddCar,
  onAddDocument,
  onAddExpense,
}: HomeAddBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const [isMounted, setIsMounted] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [blurEnabled, setBlurEnabled] = useState(true);

  useEffect(() => {
    if (visible) {
      setBlurEnabled(true);
      setIsMounted(true);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 25,
          stiffness: 200,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setIsMounted(false);
      });
    }
  }, [visible]);

  const ACTIONS = [
    {
      label: "Adaugă o mașină",
      icon: <CarFront size={20} color="#45a5c8" strokeWidth={2.5} />,
      iconBg: "#e9f5f9",
      onPress: () => { setBlurEnabled(false); onClose(); onAddCar(); },
    },
    {
      label: "Adaugă un document",
      icon: <FileText size={20} color="#e6a23c" strokeWidth={2.5} />,
      iconBg: "#fef5e7",
      onPress: () => { setBlurEnabled(false); onClose(); onAddDocument(); },
    },
    {
      label: "Adaugă o cheltuială",
      icon: <Receipt size={20} color="#f56c6c" strokeWidth={2.5} />,
      iconBg: "#fef0f0",
      onPress: () => { setBlurEnabled(false); onClose(); onAddExpense(); },
    },
  ];

  if (!isMounted) return null;

  return (
    <View className="absolute inset-0 z-[999]">
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={{ ...StyleSheet.absoluteFillObject,
                                backgroundColor: "#2e556fbf",
                                opacity: backdropAnim }}>
          {blurEnabled && (
            <BlurView
              intensity={Platform.OS === "ios" ? 20 : 10}
              tint="light"
              style={StyleSheet.absoluteFill}
              experimentalBlurMethod="dimezisBlurView"
            />
          )}
        </Animated.View>
      </TouchableWithoutFeedback>

      <Animated.View
        style={{ flex: 1,
                 justifyContent: "flex-end",
                 paddingHorizontal: 20,
                 paddingBottom: insets.bottom + 10,
                 transform: [{ translateY: slideAnim }],
        }}
      >
        {/* White card */}
        <View className="bg-white rounded-[32px] p-4 mb-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 12,
          }}>
          {ACTIONS.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={action.onPress}
              activeOpacity={0.8}
              className={`flex-row items-center bg-background-300 p-[14px] rounded-[20px] ${
                index !== ACTIONS.length - 1 ? "mb-3" : ""
              }`}
            >
              <View style={{ backgroundColor: action.iconBg }}
                className="w-11 h-11 rounded-full items-center justify-center mr-4">
                {action.icon}
              </View>
              
              <Text className="flex-1 text-base font-semibold text-[#23394d]">
                {action.label}
              </Text>
              
              <ChevronRight size={18} color="#d1d9e0" strokeWidth={3} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Close button */}
        <View className="items-center mb-[32px]">
          <TouchableOpacity
            className="w-16 h-16 rounded-full bg-[#f86666] items-center justify-center border-[5px] border-white"
            onPress={onClose}
            activeOpacity={0.9}
            style={{
              shadowColor: "#f86666",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 10,
              elevation: 8,
            }}
          >
            <X size={28} color="white" strokeWidth={3} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { X, Gauge, Fuel, CalendarDays, Receipt } from "lucide-react-native";
import { BlurView } from "expo-blur";
import DateTimePicker from "@react-native-community/datetimepicker";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormControlError, FormControlErrorText } from "@/components/ui/form-control";
import { Controller, useForm } from "react-hook-form";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingSelect } from "@/components/ui/floating-select";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/navigation/AppNavigator";
import { carApi } from "@/src/api/services/carService";
import { useAuthStore } from "@/src/store/authStore";

const { height } = Dimensions.get("window");

interface AddFuelProps {
  visible: boolean;
  carId: number;
  onClose: () => void;
}

const insertFuelSchema = z.object({
  kilometers: z.preprocess((val) => {
    if (typeof val === 'string') return val.replace(/[^\d]/g, '');
    return val;
  }, z.string().min(1, 'Kilometrii sunt necesari')),
  liters: z.coerce.number().min(1, "Litri este obligatoriu").positive('Litri trebuie să fie un număr pozitiv'),
  date: z.date({ message: 'Data expirării este obligatorie' }),
  amount: z.coerce.number().min(0, 'Suma trebuie să fie un număr pozitiv')
});
type FuelFormData = z.input<typeof insertFuelSchema>;

export default function AddFuel({ visible, carId, onClose }: AddFuelProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const [isMounted, setIsMounted] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [blurEnabled, setBlurEnabled] = useState(true);
  const [showInsertDatePicker, setShowInsertDatePicker] = useState(false);
  const [isSaveLoading, setSaveLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FuelFormData>({
          resolver: zodResolver(insertFuelSchema),
          defaultValues: { kilometers: "", liters: "", date: new Date(), amount: 0 },
          mode: "onChange"
    });

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

  const onSubmit = async (data: FuelFormData) => {
    try {
        setSaveLoading(true);
        const validatedData = insertFuelSchema.parse(data);
        const response = await carApi.addFuel({ ...validatedData, carId });
        console.log("Fuel added successfully for user: " + useAuthStore.getState().user?.email + " with car: ", response.name);
  
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });
  
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message 
            || error?.message 
            || 'An error occurred during fuel save';
        console.error('Fuel save error:', errorMessage);
    } finally {
        setSaveLoading(false);
    }
};

  const handleClose = () => {
    setBlurEnabled(false);
    onClose();
  };

  const handleSave = () => {
    setBlurEnabled(false);
    onClose();
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (!isMounted) return null;

  return (
    
    <View className="absolute inset-0 z-[999]">
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "#2e556fbf",
            opacity: backdropAnim,
          }}
        >
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

    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="absolute inset-0 z-[999]"
    >
      {/* Sheet */}
      <Animated.View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 10,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View
          className="bg-white rounded-[32px] p-6 mb-4 gap-5"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 12,
          }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-inter-bold text-[#23394d]">Add Fuel</Text>
            <TouchableOpacity
              onPress={handleClose}
              activeOpacity={0.7}
              className="w-8 h-8 rounded-full bg-[#fef0f0] items-center justify-center"
            >
              <X size={18} color="#f42d2d" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

            {/* --- KILOMETERS --- */}
            <FormControl isInvalid={!!errors.kilometers}>
                <Controller
                    control={control}
                    name="kilometers"
                    render={({ field: { onChange, value, onBlur } }) => (
                        <FloatingInput
                            label="Kilometri"
                            leftIcon={
                                <Gauge
                                    size={20}
                                    color={'#0a4f67'}
                                    strokeWidth={1.6}
                                />
                            }
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            isInvalid={!!errors.kilometers}
                            keyboardType="numeric"
                        />
                    )}
                />
                <FormControlError>
                    <FormControlErrorText className="ml-2 mt-1 text-xs text-red-500">
                        {errors.kilometers?.message}
                    </FormControlErrorText>
                </FormControlError>
            </FormControl>

          {/* --- LITERS --- */}
            <FormControl isInvalid={!!errors.liters}>
                <Controller
                    control={control}
                    name="liters"
                    render={({ field: { onChange, value, onBlur } }) => (
                        <FloatingInput
                            label="Litri"
                            leftIcon={
                                <Fuel
                                    size={20}
                                    color={'#0a4f67'}
                                    strokeWidth={1.6}
                                />
                            }
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            isInvalid={!!errors.liters}
                            keyboardType="numeric"
                        />
                    )}
                />
                <FormControlError>
                    <FormControlErrorText className="ml-2 mt-1 text-xs text-red-500">
                        {errors.liters?.message}
                    </FormControlErrorText>
                </FormControlError>
            </FormControl>

            {/* --- AMOUNT --- */}
                    <FormControl isInvalid={!!errors.amount}>
                        <Controller
                            control={control}
                            name="amount"
                            render={({ field: { onChange, value, onBlur } }) => (
                            <FloatingInput
                                label="Suma"
                                leftIcon={
                                    <Receipt
                                        size={20}
                                        color={'#0a4f67'}
                                        strokeWidth={1.6}
                                    />
                                }
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                isInvalid={!!errors.amount}
                                keyboardType="numeric"
                            />
                            )}
                        />
                        <FormControlError>
                            <FormControlErrorText className="ml-2 mt-1 text-xs text-red-500">
                            {errors.amount?.message}
                            </FormControlErrorText>
                        </FormControlError>
                    </FormControl>

            {/* --- INSERT DATA --- */}
                    <FormControl isInvalid={!!errors.date} style={{ zIndex: 999 }}>
                        <Controller
                            control={control}
                            name="date"
                            render={({ field: { onChange, value } }) => (
                                <>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => setShowInsertDatePicker(true)}
                                    >
                                        <View pointerEvents="none">
                                            <FloatingSelect
                                                label="Data plății"
                                                leftIcon={
                                                    <CalendarDays
                                                        size={20}
                                                        color={'#0a4f67'}
                                                        strokeWidth={1.6}
                                                    />
                                                }
                                                value={value ? value.toLocaleDateString('ro-RO', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                }) : null}
                                                onValueChange={() => {}}
                                                options={value ? [{
                                                    label: value.toLocaleDateString('ro-RO', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    }),
                                                    value: value.toLocaleDateString('ro-RO', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })
                                                }] : []}
                                                isInvalid={!!errors.date}
                                            />
                                        </View>
                                    </TouchableOpacity>

                                    {showInsertDatePicker && (
                                        <DateTimePicker
                                            value={value ?? new Date()}
                                            mode="date"
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            onChange={(event, selectedDate) => {
                                                setShowInsertDatePicker(Platform.OS === 'ios');
                                                if (selectedDate) {
                                                    onChange(selectedDate);
                                                }
                                            }}
                                        />
                                    )}
                                </>
                            )}
                        />
                        <FormControlError>
                            <FormControlErrorText className="ml-2 mt-1 text-xs text-red-500">
                                {errors.date?.message}
                            </FormControlErrorText>
                        </FormControlError>
                    </FormControl>

                <View className="pb-8 pt-8">
                        <Button
                            isDisabled={isSaveLoading}
                            onPress={handleSubmit(onSubmit)}
                            className="flex-row items-center justify-center h-16 bg-secondary-500 rounded-2xl py-4 w-full gap-2 active:scale-[0.99]"
                        >
                            <HStack space="md" className="items-center justify-center">
                                {isSaveLoading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
                                        className="text-white mr-2"
                                    />
                                ) : null}
                                <ButtonText className="font-inter-bold text-primary-0 text-lg">
                                    {isSaveLoading ? 'Se salvează...' : 'Salvare'}
                                </ButtonText>
                            </HStack>
                        </Button>
                    </View>
            </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}
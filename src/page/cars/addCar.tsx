import { StatusBar, TouchableOpacity, View, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/navigation/AppNavigator";
import { Text } from "@/components/ui/text";
import { FormControl, FormControlError, FormControlErrorText } from "@/components/ui/form-control";
import { Controller, useForm } from "react-hook-form";
import { FloatingInput } from "@/components/ui/floating-input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { carApi } from "@/src/api/services/carService";
import { useState } from "react";
import { FloatingSelect } from "@/components/ui/floating-select";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAuthStore } from "@/src/store/authStore";
import { useTheme } from "@/src/context/themeContext";
import * as Icons from "lucide-react-native";

const insertCarSchema = z.object({
  name: z.coerce.string().min(2, "Numele este necesar").max(40, "Numele este prea lung"),
  energyType: z.coerce.string().min(2, "Combustibilul este necesar"),
  kilometers: z.preprocess((val) => {
    if (typeof val === 'string') return val.replace(/[^\d]/g, '');
    return val;
  }, z.string().min(1, 'Kilometrii sunt necesari')),
  year: z.coerce.number().min(1886, "Anul trebuie să fie 1886 sau mai târziu").max(new Date().getFullYear() + 1, `Anul nu poate fi în viitor`),
});
type CarFormData = z.input<typeof insertCarSchema>;

const energyTypes = [
  "Benzină", "Motorină"
];

export default function AddCar() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [isLoading, setLoading] = useState(false);
    const { isDark } = useTheme();

    const { control, handleSubmit, formState: { errors } } = useForm<CarFormData>({
        resolver: zodResolver(insertCarSchema),
        defaultValues: { name: "", energyType: "", kilometers: null, year: null },
        mode: "onChange"
    });

    const onSubmit = async (data: CarFormData) => {
        try {
            setLoading(true);
            const validatedData = insertCarSchema.parse(data);
            const response = await carApi.add(validatedData);
            console.log("Car " + response.name + " added successfully for user: " + useAuthStore.getState().user?.email);

            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });

        } catch (error: any) {
            const errorMessage = error?.response?.data?.message 
              || error?.message 
              || 'An error occurred during car save';
            console.error('Car save error:', errorMessage);
        } finally {
            setLoading(false);
        }
    };

  return (
    <SafeAreaView className={`flex-1 ${ isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'}`}>
      <StatusBar barStyle={isDark === true ? 'light-content' : 'dark-content'} />

      <View className="flex-row items-center px-6 pt-2 pb-4">
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            className={`w-10 h-10 ${ isDark ? 'bg-background-card-900' : 'bg-background-card-100'} rounded-full items-center justify-center`}
            activeOpacity={0.7}
            >
            <Icons.ChevronLeft
                className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
                size={20}
                strokeWidth={1.6} 
            />
        </TouchableOpacity>
        <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} text-lg font-inter-semibold text-center flex-1`}
                style={{ marginRight: 36 }}
        >
          Adaugă o mașină
        </Text>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
                <Box className={`flex-1 ${ isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'} px-6 py-8 gap-5`}>

                    <View className={`${ isDark ? 'bg-background-icon-900' : 'bg-background-icon-100' } self-center w-32 h-32 rounded-full items-center justify-center mb-8`}>
                        <Icons.CarFront 
                            className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                            size={60} 
                            strokeWidth={1.6} 
                        />
                    </View>
                
                    {/* --- NAME --- */}
                    <FormControl isInvalid={!!errors.name}>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, value, onBlur } }) => (
                        <FloatingInput
                            label="Nume"
                            leftIcon={
                                <Icons.CarFront
                                    className={`${ isDark ? 'text-icons-800' : 'text-icons-200'}`}
                                    size={20} 
                                    strokeWidth={1.6} 
                                />
                            }
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            isInvalid={!!errors.name}
                            autoCapitalize="words"
                        />
                        )}
                    />
                    <FormControlError>
                        <FormControlErrorText className="ml-2 mt-1 text-xs text-red-500">
                        {errors.name?.message}
                        </FormControlErrorText>
                    </FormControlError>
                    </FormControl>

                    {/* --- Energy Type --- */}
                    <FormControl isInvalid={!!errors.energyType} style={{ zIndex: 999 }}>
                        <Controller
                            control={control}
                            name="energyType"
                            render={({ field: { onChange, value } }) => (
                                <FloatingSelect
                                    label="Tipul de combustibil"
                                    leftIcon={
                                        <Icons.Fuel
                                            className={`${ isDark ? 'text-icons-800' : 'text-icons-200'}`}
                                            size={20} 
                                            strokeWidth={1.6} 
                                        />
                                    }
                                    value={value}
                                    onValueChange={onChange}
                                    options={energyTypes.map((type) => ({ label: type, value: type}))}
                                    isInvalid={!!errors.energyType}
                                />
                            )}
                        />
                        <FormControlError>
                            <Text className="ml-2 mt-1 text-xs text-red-500">
                                {errors.energyType?.message}
                            </Text>
                        </FormControlError>
                    </FormControl>

                    {/* --- KILOMETERS --- */}
                    <FormControl isInvalid={!!errors.kilometers}>
                        <Controller
                            control={control}
                            name="kilometers"
                            render={({ field: { onChange, value, onBlur } }) => (
                            <FloatingInput
                                label="Kilometri"
                                leftIcon={
                                    <Icons.Gauge
                                        className={`${ isDark ? 'text-icons-800' : 'text-icons-200'}`}
                                        size={20} 
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

                    {/* --- YEAR --- */}
                    <FormControl isInvalid={!!errors.year}>
                        <Controller
                            control={control}
                            name="year"
                            render={({ field: { onChange, value, onBlur } }) => (
                            <FloatingInput
                                label="Anul fabricației"
                                leftIcon={
                                    <Icons.Calendar
                                        className={`${ isDark ? 'text-icons-800' : 'text-icons-200'}`}
                                        size={20}
                                        strokeWidth={1.6}
                                    />
                                }
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                isInvalid={!!errors.year}
                                keyboardType="numeric"
                            />
                            )}
                        />
                        <FormControlError>
                            <FormControlErrorText className="ml-2 mt-1 text-xs text-red-500">
                            {errors.year?.message}
                            </FormControlErrorText>
                        </FormControlError>
                    </FormControl>              

                    <View className="pb-8 pt-8">
                        <Button
                            isDisabled={isLoading}
                            onPress={handleSubmit(onSubmit)}
                            className={`${isDark ? 'bg-background-primary-100' : 'bg-background-primary-900'} flex-row items-center justify-center h-16 rounded-2xl py-4 w-full gap-2 active:scale-[0.99]`}
                        >
                            <HStack space="md" className="items-center justify-center">
                                {isLoading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
                                        className="text-white mr-2"
                                    />
                                ) : null}
                                <ButtonText className={`${ isDark ? 'text-typography-100' : 'text-typography-900'} font-inter-bold text-lg`}>
                                    {isLoading ? 'Se salvează...' : 'Salvare'}
                                </ButtonText>
                            </HStack>
                        </Button>
                    </View>
                </Box>      
        </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
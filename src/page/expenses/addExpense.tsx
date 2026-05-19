import { StatusBar, TouchableOpacity, View, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { useNavigation, useRoute, RouteProp} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/navigation/AppNavigator";
import { Text } from "@/components/ui/text";
import { FormControl, FormControlError, FormControlErrorText } from "@/components/ui/form-control";
import { Controller, useForm } from "react-hook-form";
import DateTimePicker from '@react-native-community/datetimepicker';
import { FloatingInput } from "@/components/ui/floating-input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { documentApi } from "@/src/api/services/docService";
import { useEffect, useState } from "react";
import { FloatingSelect } from "@/components/ui/floating-select";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAuthStore } from "@/src/store/authStore";
import { ICON_MAP } from "@/src/constants/iconMap";
import { useTheme } from "@/src/context/themeContext";
import * as Icons from "lucide-react-native";

type ExpenseTypeItem = {
  id: number;
  name: string;
  iconName: string;
};

const renderIcon = (iconName: string) => {
  const IconComponent = ICON_MAP[iconName];

  return IconComponent ? (
    <IconComponent
      size={18}
      color="#0a4f67"
      strokeWidth={1.6}
    />
  ) : null;
};

const insertExpenseSchema = z.object({
  carId: z.coerce.number().positive("Mașina este necesară"),  
  expenseTypeId: z.coerce.number().positive("Tipul de cheltuială este necesar"),
  amount: z.coerce.number().min(0, 'Suma trebuie să fie un număr pozitiv'),
  date: z.date({ message: 'Data expirării este obligatorie' })
});
type ExpenseFormData = z.input<typeof insertExpenseSchema>;

export default function AddExpense() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, "AddExpense">>();
    const { cars } = route.params;
    const [isSaveLoading, setSaveLoading] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [expenseTypes, setExpenseTypes] = useState<ExpenseTypeItem[]>([]);
    const [showInsertDatePicker, setShowInsertDatePicker] = useState(false);
    const { isDark } = useTheme();

    const { control, handleSubmit, formState: { errors } } = useForm<ExpenseFormData>({
        resolver: zodResolver(insertExpenseSchema),
        defaultValues: { expenseTypeId: null, carId: null, amount: undefined, date: undefined },
        mode: "onChange"
    });

    useEffect(() => {
      const fetchCategories = async () => {
        try {
            setLoading(true);
            const responseData = await documentApi.expenseTypes();
            setExpenseTypes(responseData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
       };
       fetchCategories();
    }, []);

    const onSubmit = async (data: ExpenseFormData) => {
        try {
            setSaveLoading(true);
            const validatedData = insertExpenseSchema.parse(data);
            const response = await documentApi.addExpense(validatedData);
            console.log("Expense " + response.expenseTypeName + " added successfully for user: " + useAuthStore.getState().user?.email);

            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });

        } catch (error: any) {
            const errorMessage = error?.response?.data?.message 
              || error?.message 
              || 'An error occurred during expense save';
            console.error('Expense save error:', errorMessage);
        } finally {
            setSaveLoading(false);
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
          Adaugă o cheltuială
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
                        <Icons.Receipt 
                                                    className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                                                    size={60} 
                                                    strokeWidth={1.6} 
                                                />
                    </View>

                    {/* --- CARS --- */}
                    <FormControl isInvalid={!!errors.carId} style={{ zIndex: 999 }}>
                        <Controller
                            control={control}
                            name="carId"
                            render={({ field: { onChange, value } }) => (
                                <FloatingSelect
                                    label="Numele mașinii"
                                    leftIcon={
                                        <Icons.CarFront
                                                                            className={`${ isDark ? 'text-icons-800' : 'text-icons-200'}`}
                                                                            size={20} 
                                                                            strokeWidth={1.6} 
                                                                        />
                                    }
                                    value={value}
                                    onValueChange={onChange}
                                    options={cars.map((type) => ({ label: type.name, value: type.id}))}
                                    isInvalid={!!errors.carId}
                                />
                            )}
                        />
                        <FormControlError>
                            <Text className="ml-2 mt-1 text-xs text-red-500">
                                {errors.carId?.message}
                            </Text>
                        </FormControlError>
                    </FormControl>

                    {/* --- Expense Type --- */}
                    <FormControl isInvalid={!!errors.expenseTypeId} style={{ zIndex: 999 }}>
                        <Controller
                            control={control}
                            name="expenseTypeId"
                            render={({ field: { onChange, value } }) => (
                                <FloatingSelect
                                    label="Tipul de cheltuială"
                                    leftIcon={
                                        <Icons.Receipt
                                                                            className={`${ isDark ? 'text-icons-800' : 'text-icons-200'}`}
                                                                            size={20} 
                                                                            strokeWidth={1.6} 
                                                                        />
                                    }
                                    value={value}
                                    onValueChange={onChange}
                                    options={expenseTypes.map((type) => ({ label: type.name, value: type.id, icon: renderIcon(type.iconName) }))}
                                    isInvalid={!!errors.expenseTypeId}
                                />
                            )}
                        />
                        <FormControlError>
                            <Text className="ml-2 mt-1 text-xs text-red-500">
                                {errors.expenseTypeId?.message}
                            </Text>
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
                                    <Icons.Receipt
                                                                        className={`${ isDark ? 'text-icons-800' : 'text-icons-200'}`}
                                                                        size={20} 
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
                                                    <Icons.CalendarDays
                                                                                        className={`${ isDark ? 'text-icons-800' : 'text-icons-200'}`}
                                                                                        size={20} 
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
                            className={`${isDark ? 'bg-background-primary-100' : 'bg-background-primary-900'} flex-row items-center justify-center h-16 rounded-2xl py-4 w-full gap-2 active:scale-[0.99]`}
                        >
                            <HStack space="md" className="items-center justify-center">
                                {isSaveLoading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
                                        className="text-white mr-2"
                                    />
                                ) : null}
                                <ButtonText className={`${ isDark ? 'text-typography-100' : 'text-typography-900'} font-inter-bold text-lg`}>
                                    {isSaveLoading ? 'Se salvează...' : 'Salvare'}
                                </ButtonText>
                            </HStack>
                        </Button>
                    </View>
                </Box>      
        </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
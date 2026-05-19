import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { View, StatusBar, TouchableOpacity, ActivityIndicator } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/navigation/AppNavigator";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { carApi } from "@/src/api/services/carService";
import CarCard from "./carCard";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/src/context/themeContext";
import * as Icons from "lucide-react-native";

type CarWithExpenses = {
    carId: number;
    name: string;
    consumption: number;
    healthScore: number;
    amount: number;
}

export default function Cars() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [loading, setLoading] = useState(false);
    const [cars, setCars] = useState<CarWithExpenses[]>([]);
    const { isDark } = useTheme();

    useEffect(() => {
        const fetchCarsWithExpenses = async () => {
            try {
                setLoading(true);
                //const responseData = await carApi.carsWithExpenses();
                const responseData=[{"carId":3,"name":"Audi A5","consumption":7.35,"healthScore":75,"amount":5590},{"carId":17,"name":"Dacia 1300","consumption":6,"healthScore":100,"amount":1477}]
                setCars(responseData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
            fetchCarsWithExpenses();
    }, [])

    return (
        <SafeAreaView className={`flex-1 ${ isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'}`}> 
        <StatusBar barStyle={isDark === true ? 'light-content' : 'dark-content'} />

            {/* ── Header ── */}
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
                Mașinile tale
                </Text>
            </View>

            <Box className={`flex-1 ${ isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'} px-2 py-1`}>            
                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    enableOnAndroid
                    extraScrollHeight={20}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* ── Content ── */}
                    <View className="flex-1 mt-5">
                        {loading ? (
                            <ActivityIndicator
                                size="small"
                                color="#14b8a6"
                                style={{ marginTop: 40 }}
                            />
                        ) : (
                            cars.map((car) => (
                                <CarCard
                                    key={car.carId}
                                    car={car}
                                    onPress={() => navigation.navigate('CarDetail', { car })}
                                />
                            ))
                        )}
                    </View>
                    <View className="px-4 flex-1 items-center justify-center">
                        <Button
                            onPress={() => navigation.navigate('AddCar')}
                            className={`${isDark ? 'bg-background-primary-100' : 'bg-background-primary-900'} flex-row items-center justify-center h-16 rounded-2xl py-4 w-full gap-2 active:scale-[0.99]`}
                        >
                            <Icons.Plus 
                                                                                        className={`${ isDark ? 'text-icons-100' : 'text-icons-900'}`}
                                                                                        size={18} 
                                                                                        strokeWidth={2.5} 
                                                                                    />
                            <Text className={`${ isDark ? 'text-typography-100' : 'text-typography-900'} font-inter-semibold text-base`}>
                                Adaugă o mașină
                            </Text>
                        </Button>
                    </View>
                </KeyboardAwareScrollView>
            </Box>
        </SafeAreaView>
    )
}
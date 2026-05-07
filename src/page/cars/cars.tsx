import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { View, StatusBar, TouchableOpacity, ActivityIndicator } from "react-native";
import { Box } from "@/components/ui/box";
import { ChevronLeft, Plus } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/navigation/AppNavigator";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { carApi } from "@/src/api/services/carService";
import CarCard from "./carCard";
import { Button } from "@/components/ui/button";

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

    useEffect(() => {
        const fetchCarsWithExpenses = async () => {
            try {
                setLoading(true);
                const responseData = await carApi.carsWithExpenses();
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
        <SafeAreaView className="flex-1 bg-background-50">
        <StatusBar barStyle="dark-content" />

            {/* ── Header ── */}
            <View className="flex-row items-center px-6 pt-2 pb-4">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 bg-primary-0 rounded-full items-center justify-center"
                    activeOpacity={0.7}
                    >
                    <ChevronLeft size={20} color="#0a4f67" strokeWidth={1.6} />
                </TouchableOpacity>
                <Text className="text-lg font-inter-semibold text-typography-100 text-center flex-1"
                        style={{ marginRight: 36 }}
                >
                Mașinile tale
                </Text>
            </View>

            <Box className="flex-1 bg-background-50 px-2 py-1">            
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
                            className="flex-row items-center justify-center h-16 bg-secondary-500 rounded-2xl py-4 w-full gap-2 active:scale-[0.99]"
                        >
                            <Plus size={18} color="#ffffff" strokeWidth={2.5} />
                            <Text className="text-primary-0 font-inter-semibold text-base">
                                Adaugă o mașină
                            </Text>
                        </Button>
                    </View>
                </KeyboardAwareScrollView>
            </Box>
        </SafeAreaView>
    )
}
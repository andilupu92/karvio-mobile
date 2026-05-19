import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight, Car, Flame, ShieldCheck, Wallet } from "lucide-react-native";
import formatCurrency from "@/src/utils/formatCurrency";
import formatHealthScore from "@/src/utils/colorHeathScore";
import colorFuelScore from "@/src/utils/colorFuelScore";
import { useTheme } from "@/src/context/themeContext";
import { Icons } from "@/src/utils/icons";

type CarWithExpenses = {
    carId: number;
    name: string;
    consumption: number;
    healthScore: number;
    amount: number;
}

interface Props {
  car: CarWithExpenses;
  onPress: (car: CarWithExpenses) => void;
}

export default function CarCard({ car, onPress }: Props) {

    const { isDark } = useTheme();

    const getExpenseColor = (amount: number) => {
        if (amount == 0) return "text-typography-100"
        if (amount >= 2000) return "text-error-50";
        if (amount >= 1000) return "text-warning-50";
        return "text-success-50";
    };

    return (
        <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => onPress(car)}
              className={`rounded-xl mx-4 mb-3 px-4 py-4 border ${ isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100' }`}>

            <View className="flex-row items-center">
                {/* Icon */}
                <View
                    className={`${ isDark ? 'bg-background-icon-900' : 'bg-background-icon-100' } w-11 h-11 rounded-xl items-center justify-center mr-3`}>
                    <Icons.Car 
                            className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                            size={22} 
                            strokeWidth={1.6} 
                          />
                </View>    

                <View className="flex-1">
                    <Text
                        className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-semibold text-base mb-1`}
                        numberOfLines={1}
                    >
                        {car.name}
                    </Text>
                    <View className="flex-row items-center">
                        {/* Consumption */}
                        <View className="flex-row items-center gap-1"
                                style={{ width: 80 }}>
                            <Icons.Flame 
                            className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                            size={13} 
                            strokeWidth={1.8} 
                          />
                            <Text className={`text-sm font-inter-medium ${colorFuelScore(car.consumption)}`}>
                                {car.consumption != null ? `${car.consumption.toFixed(1)}%` : "—"}
                            </Text>
                        </View>

                        {/* Amount */}
                        <View className="flex-row items-center gap-1"
                              style={{ width: 130 }}>
                            <Icons.Wallet 
                            className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                            size={13} 
                            strokeWidth={1.8} 
                          />
                            <Text className={`text-sm font-inter-medium ${getExpenseColor(car.amount)}`}>
                                {formatCurrency(car.amount)}
                            </Text>
                        </View>

                        {/* Health Score */}
                        <View className="flex-row items-center gap-1"
                            style={{ width: 70 }}>
                            <Icons.ShieldCheck 
                            className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                            size={13} 
                            strokeWidth={1.8} 
                          />
                            <Text className={`text-sm font-inter-medium ${formatHealthScore(car.healthScore)}`}>
                                {car.healthScore != null ? `${car.healthScore}%` : "—"}
                            </Text>
                        </View>

                    </View>
                </View>
                {/* Arrow */}
                <Icons.ChevronRight 
                            className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                            size={16} 
                            strokeWidth={2} 
                          />
            </View>
        </TouchableOpacity>
    )
}
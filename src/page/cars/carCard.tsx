import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight, Car, Flame, ShieldCheck, Wallet } from "lucide-react-native";
import formatCurrency from "@/src/utils/formatCurrency";

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

    const getConsumptionColor = (consumption: number) => {
        if (consumption == null) return "text-typography-300"
        if (consumption >= 9) return "text-error-100";
        if (consumption >= 7) return "text-warning-50";
        return "text-success-50";
    };

    const getExpenseColor = (amount: number) => {
        if (amount == 0) return "text-typography-300"
        if (amount >= 2000) return "text-error-100";
        if (amount >= 1000) return "text-warning-50";
        return "text-success-50";
    };

    const getHealthScoreColor = (healthScore: number) => {
        if (healthScore == null) return "text-typography-300"
        if (healthScore <= 60) return "text-error-100";
        if (healthScore <= 80) return "text-warning-50";
        return "text-success-50";
    };

    return (
        <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => onPress(car)}
              className="bg-white rounded-2xl mx-4 mb-3 px-4 py-4">

            <View className="flex-row items-center">
                {/* Icon */}
                <View
                    className="w-11 h-11 bg-background-500 rounded-xl items-center justify-center mr-3">
                    <Car size={22} color="#0a4f67" strokeWidth={1.6} />
                </View>    

                <View className="flex-1">
                    <Text
                        className="text-typography-900 font-inter-semibold text-base mb-1"
                        numberOfLines={1}
                    >
                        {car.name}
                    </Text>
                    <View className="flex-row items-center">
                        {/* Consumption */}
                        <View className="flex-row items-center gap-1"
                                style={{ width: 80 }}>
                            <Flame size={13} color="#94a3b8" strokeWidth={1.8} />
                            <Text className={`text-sm font-inter-medium ${getConsumptionColor(car.consumption)}`}>
                                {car.consumption != null ? `${car.consumption.toFixed(1)}%` : "—"}
                            </Text>
                        </View>

                        {/* Amount */}
                        <View className="flex-row items-center gap-1"
                              style={{ width: 130 }}>
                            <Wallet size={13} color="#94a3b8" strokeWidth={1.8} />
                            <Text className={`text-sm font-inter-medium ${getExpenseColor(car.amount)}`}>
                                {formatCurrency(car.amount)}
                            </Text>
                        </View>

                        {/* Health Score */}
                        <View className="flex-row items-center gap-1"
                            style={{ width: 70 }}>
                            <ShieldCheck size={13} color="#94a3b8" strokeWidth={1.8} />
                            <Text className={`text-sm font-inter-medium ${getHealthScoreColor(car.healthScore)}`}>
                                {car.healthScore != null ? `${car.healthScore}%` : "—"}
                            </Text>
                        </View>

                    </View>
                </View>
                {/* Arrow */}
                <ChevronRight size={18} color="#cbd5e1" strokeWidth={2} />
            </View>
        </TouchableOpacity>
    )
}
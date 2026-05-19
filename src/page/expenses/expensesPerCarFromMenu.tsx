import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Car, ChevronRight } from "lucide-react-native";
import { useTheme } from "@/src/context/themeContext";
import * as Icons from "lucide-react-native";

type CarSummary = {
  car: {
    id: number;
    name: string;
    energyType: string;
    kilometers: number;
    year: number;
    consumption: number;
    healthScore: number | null;
  };
  totalAmount: number;
};

type ExpensesPerCarProps = {
  carResponsesList: CarSummary[];
  onCarPress?: (carId: number, name: string, consumption: number, healthScore: number | null, amount: number) => void;
  totalAmountOfMonth: number;
};

export default function ExpensesPerCarFromMenu({ carResponsesList, onCarPress, totalAmountOfMonth }: ExpensesPerCarProps) {
  if (!carResponsesList || carResponsesList.length === 0) return null;

  const grandTotal = carResponsesList.reduce((sum, c) => sum + c.totalAmount, 0);
  const { isDark } = useTheme();

  return (
    <View className="mt-6">
      <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-bold text-typography-900 text-lg mb-3`}>
        Repartizare per mașină
      </Text>

      <View
        className={`rounded-xl overflow-hidden border ${ isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100' }`}
      >
        {carResponsesList.map((item, index) => {
          const percent = grandTotal > 0 ? Math.round((item.totalAmount / grandTotal) * 100) : 0;
          const barWidth = totalAmountOfMonth > 0 ? (item.totalAmount / totalAmountOfMonth) * 100 : 0;
          const isLast = index === carResponsesList.length - 1;

          return (
            <TouchableOpacity
              key={item.car.id}
              activeOpacity={0.7}
              onPress={() => onCarPress?.(item.car.id, item.car.name, item.car.consumption, item.car.healthScore, item.totalAmount)}
            >
              {/* Separator */}
              {index > 0 && (
                <View className={`${isDark ? 'bg-outline-900' : 'bg-outline-100'}`}
                                                                style={{
                                                                height: 1,
                                                                marginHorizontal: 20,
                                                                }}
                                                            />
              )}

              <View className="flex-row items-center px-4 py-4">

                {/* Icon mașină */}
                <View
                  className={`${ isDark ? 'bg-background-icon-900' : 'bg-background-icon-100' } items-center justify-center rounded-xl mr-3 w-[42px] h-[42px] `}
                >
                  <Icons.Car 
                    className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
                    size={22} 
                    strokeWidth={1.6} 
                  />
                </View>

                {/* Nume + bara */}
                <View className="flex-1 mr-3">
                  <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-semibold text-sm mb-1`}>
                    {item.car.name}
                  </Text>

                  {/* Progress bar */}
                  <View
                    className="rounded-full overflow-hidden bg-gray-200"
                    style={{ height: 4, width: "100%" }}
                  >
                    <View
                      style={{
                        height: 5,
                        width: `${barWidth}%`,
                        borderRadius: 99,
                        backgroundColor: isDark ? "#516984" : "#1B3A5C",
                      }}
                    />
                  </View>
                </View>

                {/* Suma + procent */}
                <View className="items-end mr-2">
                  <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-bold text-sm`}>
                    {item.totalAmount.toLocaleString("ro-RO")}{" "}
                    <Text className={`${ isDark ? 'text-typography-800' : 'text-typography-200'} font-inter-regular`} style={{ fontSize: 11 }}>
                      RON
                    </Text>
                  </Text>
                  <Text className={`${ isDark ? 'text-typography-800' : 'text-typography-200'} font-inter-regular`} style={{ fontSize: 11 }}>
                    {percent}% din total
                  </Text>
                </View>

                {/* Chevron */}
                <Icons.ChevronRight 
                                            className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                                            size={16} 
                                            strokeWidth={2} 
                                          />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
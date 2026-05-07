import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Car, ChevronRight } from "lucide-react-native";

type CarSummary = {
  car: {
    id: number;
    name: string;
    energyType: string;
    kilometers: number;
    year: number;
    consumption: number;
    healthScore: number;
  };
  totalAmount: number;
};

type ExpensesPerCarProps = {
  carResponsesList: CarSummary[];
  onCarPress?: (carId: number, name: string, consumption: number, healthScore: number, amount: number) => void;
  totalAmountOfMonth: number;
};

export default function ExpensesPerCarFromMenu({ carResponsesList, onCarPress, totalAmountOfMonth }: ExpensesPerCarProps) {
  if (!carResponsesList || carResponsesList.length === 0) return null;

  const grandTotal = carResponsesList.reduce((sum, c) => sum + c.totalAmount, 0);

  return (
    <View className="mt-6">
      <Text className="font-inter-bold text-typography-900 text-lg mb-3">
        Repartizare per mașină
      </Text>

      <View
        className="rounded-3xl overflow-hidden"
        style={{
          backgroundColor: "#FFFFFF",
        }}
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
                <View style={{ height: 1, backgroundColor: "#F1F5F9", marginHorizontal: 16 }} />
              )}

              <View className="flex-row items-center px-4 py-4">

                {/* Icon mașină */}
                <View
                  className="items-center justify-center rounded-2xl mr-3"
                  style={{ width: 44, height: 44, backgroundColor: "#EEF6F6" }}
                >
                  <Car size={22} color="#0D7377" strokeWidth={1.6} />
                </View>

                {/* Nume + bara */}
                <View className="flex-1 mr-3">
                  <Text className="font-inter-semibold text-typography-900 text-sm mb-1">
                    {item.car.name}
                  </Text>

                  {/* Progress bar */}
                  <View
                    className="rounded-full overflow-hidden"
                    style={{ height: 5, backgroundColor: "#E8F0F7", width: "100%" }}
                  >
                    <View
                      style={{
                        height: 5,
                        width: `${barWidth}%`,
                        borderRadius: 99,
                        backgroundColor: "#1B3A5C",
                      }}
                    />
                  </View>
                </View>

                {/* Suma + procent */}
                <View className="items-end mr-2">
                  <Text className="font-inter-bold text-typography-900 text-sm">
                    {item.totalAmount}{" "}
                    <Text className="font-inter-regular text-typography-500" style={{ fontSize: 11 }}>
                      RON
                    </Text>
                  </Text>
                  <Text className="text-typography-400 font-inter-regular" style={{ fontSize: 11 }}>
                    {percent}% din total
                  </Text>
                </View>

                {/* Chevron */}
                <ChevronRight size={16} color="#B8CCE0" strokeWidth={2} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { CarFront } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/navigation/AppNavigator";
import { useState } from "react";

type CarItem = {
  id: number;
  name: string;
  energyType: string;
  kilometers: number;
  year: number;
  consumption: number;
  healthScore: number;
};

type Props = {
  cars: CarItem[];
  onCarSelect: (id: number, km: number, name: string, healthScore: number, consumption: number) => void;
};

export default function HomeGarage({ cars, onCarSelect }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedCarId, setSelectedCarId] = useState(cars[0]?.id);

  const handlePressCar = (id: number, km: number, name: string, healthScore: number, consumption: number) => {
    setSelectedCarId(id);
    onCarSelect(id, km, name, healthScore, consumption);
  };

  return (
    <Box className="flex-col px-4 py-5 gap-2">

      {/* Header row */}
      <View className="flex flex-row items-center justify-between mb-4">
        <View className="flex flex-row items-center gap-2">
          <Text className="text-[18px] font-inter-bold text-typography-100">
            Garajul meu
          </Text>
          <View className="bg-secondary-500 rounded-full w-7 h-6 items-center justify-center">
            <Text className="font-inter-bold text-[12px] text-white">
              {String(cars.length).padStart(2, "0")}
            </Text>
          </View>
        </View>

        {cars.length > 1 && (
          <View>
            {/* View all */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Cars')}
              className="flex flex-row items-center gap-2"
              activeOpacity={0.7}
            >
              <Text className="font-inter-medium text-[14px] text-typography-200">
                Toate mașinile
              </Text>
              <Text className="font-inter-medium text-[14px] text-typography-200">
                {" ›"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

        <View className="flex-row h-[40px]">
            {/* Horizontal car list */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingRight: 16 }}
            >
                {cars.map((car) => {
                    const isActive = selectedCarId === car.id;
                    return (
                        <TouchableOpacity 
                            key={car.id}
                            activeOpacity={0.8}
                            onPress={() => handlePressCar(car.id, car.kilometers, car.name, car.healthScore, car.consumption)}
                            className={`rounded-2xl py-3 px-4 flex-row items-center justify-center gap-2 min-w-[150px] ${
                                            isActive ? "bg-secondary-500" : "bg-background-400"
                                        }`}

                        >
                            <CarFront size={20} color={isActive ? "#FFFFFF" : "#9dabb1"} strokeWidth={1.6} />
                            <Text className={`font-inter-medium text-[14px] ${
                                                isActive ? "text-white" : "text-typography-300"
                                            }`}>
                                {car.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    </Box>
  );
}
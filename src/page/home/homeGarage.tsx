import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/navigation/AppNavigator";
import { useState } from "react";
import { useTheme } from "@/src/context/themeContext";
import { Icons } from "@/src/utils/icons";

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
  const { isDark } = useTheme();

  const handlePressCar = (id: number, km: number, name: string, healthScore: number, consumption: number) => {
    setSelectedCarId(id);
    onCarSelect(id, km, name, healthScore, consumption);
  };

  return (
    <Box className="flex-col px-4 py-5 gap-2">

      {/* Header row */}
      <View className="flex flex-row items-center justify-between mb-4">
        <View className="flex flex-row items-center gap-2">
          <Text className={`text-[18px] font-inter-bold ${ isDark ? 'text-typography-900' : 'text-typography-100'}`}>
            Garajul meu
          </Text>
          <View className={`rounded-full w-7 h-6 items-center justify-center ${ isDark ? 'bg-background-icon-900' : 'bg-background-card-100' }`}>
            <Text className={`font-inter-bold text-[12px] ${ isDark ? 'text-typography-900' : 'text-typography-100'}`}>
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
              <Text className={`font-inter-medium text-[14px] ${ isDark ? 'text-typography-800' : 'text-typography-200'}`}>
                Toate mașinile
              </Text>
              <Text className={`font-inter-medium text-[14px] ${ isDark ? 'text-typography-800' : 'text-typography-200'}`}>
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
                            className={`rounded-xl py-3 px-4 flex-row items-center justify-center gap-2 min-w-[150px] ${
                                            isActive
                                              ? isDark ? "border border-outline-900 bg-background-card-900" : "border border-outline-100 bg-background-card-100"
                                              : isDark ? "bg-background-card-800" : "bg-background-card-200"
                                        }`}

                        >
                            <Icons.CarFront 
                              className={`${ isActive
                                                ? isDark ? "text-icons-900" : "text-icons-100"
                                                : isDark ? "text-icons-800" : "text-icons-200"}`}
                              size={26} 
                              strokeWidth={1.6} 
                            />
                            <Text className={`font-inter-medium text-[14px] ${
                                              isActive
                                                ? isDark ? "text-typography-900" : "text-typography-100"
                                                : isDark ? "text-typography-800" : "text-typography-200"
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
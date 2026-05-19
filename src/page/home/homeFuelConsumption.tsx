import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { useTheme } from "@/src/context/themeContext";
import colorFuelScore from '@/src/utils/colorFuelScore';
import { Icons } from "@/src/utils/icons";

type Props = {
  consumption: number;
  onAddFuel?: () => void;
};

export default function HomeFuelConsumption({
  consumption,
  onAddFuel,
}: Props) {
    const { isDark } = useTheme();
  return (
    <Box className="px-2">
        <Box className={`rounded-xl px-4 py-4 mx-2 mb-3 flex-row items-center justify-between border ${ isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100' }`}>
        <View>
            <Text className={`font-inter-medium text-[12px] mb-1 ${ isDark ? 'text-typography-900' : 'text-typography-100'}`}>
                Consum combustibil
            </Text>
            <Text className={`font-inter-bold text-[16px] ${colorFuelScore(consumption)}`}>
                {consumption}
                {consumption ? (
                    <Text className={`font-inter-medium text-[10px] ${ isDark ? 'text-typography-900' : 'text-typography-100' }`}>
                        {" "}%
                    </Text>
                ) : (
                    <Text className={`font-inter-medium text-[10px] ${ isDark ? 'text-typography-900' : 'text-typography-100' }`}>
                        "-"
                    </Text>
                )}    
            </Text>
        </View>

        <TouchableOpacity
            onPress={onAddFuel}
            activeOpacity={0.85}
            className={`flex-row items-center rounded-xl px-4 py-3 gap-1 ${ isDark ? 'bg-background-icon-900' : 'bg-background-icon-100'}`}
            style={{ gap: 6 }}
        >
            <Icons.Plus 
              className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
              size={16} 
              strokeWidth={1.6} 
            />
            <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-semibold text-[12px]`}>Adaugă combustibil</Text>
        </TouchableOpacity>
        </Box>
    </Box>
  );
}
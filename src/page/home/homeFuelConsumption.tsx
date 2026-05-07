import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Plus } from "lucide-react-native";

type Props = {
  consumption: number;
  onAddFuel?: () => void;
};

export default function HomeFuelConsumption({
  consumption,
  onAddFuel,
}: Props) {
  return (
    <Box className="px-2">
        <Box className="bg-primary-0 rounded-2xl px-4 py-4 mx-2 mb-3 flex-row items-center justify-between">
        <View>
            <Text className="text-typography-50 font-inter-medium text-[12px] mb-1">
                Consum combustibil
            </Text>
            <Text className="text-success-50 font-inter-bold text-[16px]">
                {consumption}
                {consumption ? (
                    <Text className="text-typography-50 font-inter-medium text-[10px]">
                        {" "}%
                    </Text>
                ) : (
                    "-"
                )}    
            </Text>
        </View>

        <TouchableOpacity
            onPress={onAddFuel}
            activeOpacity={0.85}
            className="flex-row items-center bg-secondary-500 rounded-2xl px-4 py-3 gap-1"
            style={{ gap: 6 }}
        >
            <Plus size={16} color="#ffffff" strokeWidth={2.5} />
            <Text className="text-white font-inter-semibold text-[12px]">Adaugă combustibil</Text>
        </TouchableOpacity>
        </Box>
    </Box>
  );
}
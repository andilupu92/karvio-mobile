import { useMemo } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Activity } from "lucide-react-native";

type Props = {
  healthScore: number;
};

export default function HomeHealth({
  healthScore,
}: Props) {

  const healthStyle = useMemo(() => {
    if (healthScore === null) return null;

    if (healthScore <= 60) return {
      color: "text-error-100",
      backgroundColor: "bg-error-0",
      status: "Poor",
    };

    if (healthScore <= 80) return {
      color: "text-warning-50",
      backgroundColor: "bg-warning-0",
      status: "Fair",
    };

    return {
      color: "text-success-50",
      backgroundColor: "bg-success-0",
      status: "Good",
    };
  }, [healthScore]);

  return (
    <Box className="bg-white rounded-2xl px-4 pt-4 pb-3 flex-2 ml-1.5">
      {/* Top row */}
      <View className="flex-row items-center justify-between mb-5">
        <Activity size={20} color="#0a4f67" strokeWidth={1.6} />
        <View className={`rounded-full px-3 py-1 ${healthStyle?.backgroundColor}`}>
          <Text className={`font-inter-medium text-xs ${healthStyle?.color}`}>
            {healthStyle?.status}
          </Text>
        </View>
      </View>

      {/* Labels */}
      <Text className="text-typography-100 font-inter-semibold text-base leading-5">
        Health Score
      </Text>

      {/* Percent */}
      <Text className={`font-inter-bold text-[20px] ${healthStyle?.color}`}>
        {healthScore}
        {healthScore ? (
          <Text className="text-typography-50 font-inter-medium text-[12px]">
            {" "}%
          </Text>
        ) : (
          "-"
        )}    
      </Text>
    </Box>
  );
}
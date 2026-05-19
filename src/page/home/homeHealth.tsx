import { useMemo } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { useTheme } from "@/src/context/themeContext";
import { Icons } from "@/src/utils/icons";

type Props = {
  healthScore: number;
};

export default function HomeHealth({
  healthScore,
}: Props) {

  const { isDark } = useTheme();

  const healthStyle = useMemo(() => {
    if (healthScore === null) return null;

    if (healthScore <= 60) return {
      color: "text-error-50",
      backgroundColor: "bg-error-0",
      status: "Slab",
    };

    if (healthScore <= 80) return {
      color: "text-warning-50",
      backgroundColor: "bg-warning-0",
      status: "Mediu",
    };

    return {
      color: "text-success-50",
      backgroundColor: "bg-success-0",
      status: "Bun",
    };
  }, [healthScore]);

  return (
    <Box className={`rounded-xl px-4 pt-4 pb-3 flex-2 border ${ isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100' }`}>
      {/* Top row */}
      <View className="flex-row items-center justify-between mb-5">
        <Icons.Activity 
          className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
          size={20} 
          strokeWidth={1.6} 
        />
        <View className={`rounded-full px-3 py-1 ${healthStyle?.backgroundColor}`}>
          <Text className={`font-inter-medium text-xs ${healthStyle?.color}`}>
            {healthStyle?.status}
          </Text>
        </View>
      </View>

      {/* Labels */}
      <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-semibold text-base leading-5`}>
        Health Score
      </Text>

      {/* Percent */}
      <Text className={`font-inter-bold text-[20px] ${healthStyle?.color}`}>
        {healthScore}
        {healthScore ? (
          <Text className={`text-typography-50 font-inter-medium text-[14px] ${ isDark ? 'text-typography-900' : 'text-typography-100' }`}>
            {" "}%
          </Text>
        ) : (
          <Text className={`font-inter-medium text-[10px] ${ isDark ? 'text-typography-900' : 'text-typography-100' }`}>
            "-"
          </Text>
        )}    
      </Text>
    </Box>
  );
}
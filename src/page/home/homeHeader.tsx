import { TouchableOpacity, View } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Icons } from "@/src/utils/icons";
import formatHealthScore from "@/src/utils/colorHeathScore";
import { useTheme } from "@/src/context/themeContext";

interface HomeHeaderProps {
  carName: string;
  carKm: number;
  healthScore?: number;
  profileImage?: string;
  onProfilePress?: () => void;
  lengthCar: number;
}

export default function HomeHeader({
  carName,
  carKm,
  healthScore,
  onProfilePress,
  lengthCar,
}: HomeHeaderProps) {
  const { isDark } = useTheme();
  
  return (
    <Box className="flex-row items-center px-4 py-3 gap-3">
      {/* Left side */}
        {lengthCar != 0 && (
          <View className={`flex-row flex-1 items-center ${ isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100' } rounded-xl py-[11px] px-5 border`}>
            {/* Left — Car info */}
            <Box className="flex-row items-center gap-3 flex-1">
              <Icons.CarFront 
                  className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
                  size={26} 
                  strokeWidth={1.6} 
                />
              <Box>
                <Text className={`text-[12px] font-inter-medium ${ isDark ? 'text-typography-800' : 'text-typography-200'} `}>
                  {carName}
                </Text>
                <Text className={`text-[14px] font-inter-bold ${ isDark ? 'text-typography-900' : 'text-typography-100'}`}>
                  {carKm.toLocaleString("ro-RO")} km
                </Text>
              </Box>
            </Box>

            {/* Divider */}
            <View className={`mx-[38px] h-[30px] w-[1.5px] ${ isDark ? 'bg-outline-900' : 'bg-outline-100' }`} />

            {/* Right */}
            <Box className="flex-row items-center gap-3">
                <Icons.ShieldCheck 
                  className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
                  size={24} 
                  strokeWidth={1.6} 
                />
              <Box>
                <Text className={`text-[12px] font-inter-medium ${ isDark ? 'text-typography-800' : 'text-typography-200'} `}>
                  Scor
                </Text>
                <Text className={`text-[14px] font-inter-bold ${formatHealthScore(healthScore)}`}>
                  {healthScore}
                  {healthScore ? (
                    <Text className={`font-inter-medium text-[10px] ${ isDark ? 'text-typography-900' : 'text-typography-100' }`}>
                      {" "}%
                    </Text>
                  ) : (
                    <Text className={`font-inter-medium text-[10px] ${ isDark ? 'text-typography-900' : 'text-typography-100' }`}>
                      "-"
                    </Text>
                  )}
                </Text>
              </Box>
            </Box>
          </View>
        )}

      {/* Avatar */}
      <TouchableOpacity onPress={onProfilePress} activeOpacity={0.8}>
        <View className="relative">
          <View className="w-11 h-11 rounded-full items-center justify-center">
            <Icons.CircleUserRound 
              className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
              size={32} 
              strokeWidth={1.6} 
            />
          </View>

          {/* Red dot */}
          <View className="absolute top-[-1px] right-[-1px] w-[15px] h-[15px] rounded-full bg-error-50 border-2 border-outline-50" />
        </View>
      </TouchableOpacity>

    </Box>
  );
}
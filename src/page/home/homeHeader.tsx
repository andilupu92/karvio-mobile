import { Image, TouchableOpacity, View } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { CarFront, ShieldCheck } from "lucide-react-native";

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
  profileImage,
  onProfilePress,
  lengthCar,
}: HomeHeaderProps) {

  return (
    <Box className="flex-row items-center px-4 py-3 gap-3">
      {/* Left side */}
      <View className="flex-1">
        {lengthCar != 0 && (
          <View className="flex-row items-center bg-primary-0 rounded-2xl py-[11px] px-5">
            {/* Left — Car info */}
            <Box className="flex-row items-center gap-3 flex-1">
              <CarFront size={28} color="#0a4f67" strokeWidth={1.6} />
              <Box>
                <Text className="text-[12px] font-inter-medium text-typography-50">
                  {carName}
                </Text>
                <Text className="text-[14px] font-inter-bold text-typography-100">
                  {carKm.toLocaleString("ro-RO")} km
                </Text>
              </Box>
            </Box>

            {/* Divider */}
            <View className="mx-[38px] h-[30px] w-[1.5px] bg-secondary-200" />

            {/* Right */}
            <Box className="flex-row items-center gap-3">
              <ShieldCheck size={24} color="#0a4f67" strokeWidth={1.6} />
              <Box>
                <Text className="text-[12px] font-inter-medium text-typography-50">
                  Scor
                </Text>
                <Text className="text-[14px] font-inter-bold text-success-50">
                  {healthScore ? `${healthScore}%` : "—"}
                </Text>
              </Box>
            </Box>
          </View>
        )}
      </View>

      {/* Avatar */}
      <TouchableOpacity onPress={onProfilePress} activeOpacity={0.8}>
        <View className="relative">
          <View className="w-12 h-12 rounded-full bg-white items-center justify-center">
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="w-10 h-10 rounded-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-11 h-11 rounded-full bg-secondary-500 items-center justify-center">
                <Text className="text-white text-[17px] font-inter-semibold">
                  A
                </Text>
              </View>
            )}
          </View>

          {/* Red dot */}
          <View className="absolute top-[-2px] right-[-2px] w-[15px] h-[15px] rounded-full bg-error-100 border-2 border-white" />
        </View>
      </TouchableOpacity>

    </Box>
  );
}
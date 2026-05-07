import { Text } from "@/components/ui/text";
import { View } from "react-native";

type Color = {
  iconColor: string;
  iconBg: string;
}

export default function StatusCard({
  icon,
  value,
  label,
  valueColor,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  valueColor: Color;
}) {
  return (
    <View
      className="flex-1 items-center justify-center py-4 rounded-2xl bg-white">
        <View className="rounded-[8px] w-[32px] h-[32px] items-center justify-center" style={{backgroundColor : valueColor.iconBg}}>
          {icon}
        </View>
      <Text className="font-inter-bold text-base mt-2.5" style={{ color: valueColor.iconColor }}>
        {value}
      </Text>
      <Text className="font-inter-regular text-xs text-typography-400 mt-0.5">
        {label}
      </Text>
    </View>
  );
}
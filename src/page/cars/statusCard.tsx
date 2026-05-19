import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { useTheme } from "@/src/context/themeContext";

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
  const { isDark } = useTheme();
  return (
    <View
      className={`flex-1 items-center justify-center py-4 rounded-xl border ${ isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100' }`}> 
        <View className="rounded-[8px] w-[32px] h-[32px] items-center justify-center" style={{backgroundColor : valueColor.iconBg}}>
          {icon}
        </View>
      <Text className="font-inter-bold text-base mt-2.5" style={{ color: valueColor.iconColor }}>
        {value}
      </Text>
      <Text className={`${ isDark ? 'text-typography-800' : 'text-typography-200'} font-inter-regular text-xs mt-0.5`}>
        {label}
      </Text>
    </View>
  );
}
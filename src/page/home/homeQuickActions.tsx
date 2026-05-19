import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/navigation/AppNavigator";
import { useTheme } from "@/src/context/themeContext";
import { Icons } from "@/src/utils/icons";

type Car = {
  id: number;
  name: string;
  energyType: string;
  kilometers: number;
  year: number;
  consumption: number;
  healthScore: number;
};

type CarItem = {
  id: number;
  km: number;
  name: string;
  consumption: number;
  healthScore: number;
};

type Document = {
  id: number;
  documentTypeId: number;
  documentTypeName: string,
  documentTypeIconName: string,
  expiryDate: Date,
  daysRemaining: number;
};

type Action = {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
};

type Props = {
  car: CarItem;
  cars: Car[];
  documents: Document[];
};

export default function HomeQuickActions({ car, cars, documents }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isDark } = useTheme();

  const actions: Action[] = [
    {
      icon: <Icons.FileText 
                  className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
                  size={50 * 0.38} 
                  strokeWidth={1.6} 
                />,
      label: "Documentele\nmașinii",
      onPress: () => navigation.navigate("Documents", { car, cars, documents }),
    },
    {
      icon: <Icons.Plus
                  className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
                  size={50 * 0.38} 
                  strokeWidth={1.6} 
                />,
      label: "Adaugă mașină",
      onPress: () => navigation.navigate("AddCar"),
    },
  ];

  return (
    <Box className="flex-row items-center py-3 px-4">
      <View className={`px-2 py-4 flex-1 rounded-xl border ${ isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100' }`}>
        {/* Icons row */}
        <View className="flex-row justify-evenly items-start">
          {actions.map((action, index) => (
            <TouchableOpacity className="items-center gap-4"
              key={index}
              onPress={action.onPress}
              activeOpacity={0.75}
            >
              {/* White circle */}
              <View className={`w-12 h-12 rounded-full ${ isDark ? 'bg-background-icon-900' : 'bg-background-icon-100' } items-center justify-center`}>
                {action.icon}
              </View>

              {/* Label */}
              <Text className={`text-[12px] ${ isDark ? 'text-typography-900' : 'text-typography-100'} text-center font-inter-medium leading-[19px]`}
                numberOfLines={2}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Box>
  );
}
import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { FileText, Plus } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/navigation/AppNavigator";

const ICON_COLOR = "#0a4f67";

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

  const actions: Action[] = [
    {
      icon: <FileText size={50 * 0.38} color={ICON_COLOR} strokeWidth={1.6} />,
      label: "Documentele\nmașinii",
      onPress: () => navigation.navigate("Documents", { car, cars, documents }),
    },
    {
      icon: <Plus size={50 * 0.38} color={ICON_COLOR} strokeWidth={1.6} />,
      label: "Adaugă mașină",
      onPress: () => navigation.navigate("AddCar"),
    },
  ];

  return (
    <Box className="flex-row items-center py-3 px-4">
      <View className="px-2 py-4 flex-1 rounded-3xl bg-background-200 border-2 border-[#EBF4FC]">
        {/* Icons row */}
        <View className="flex-row justify-evenly items-start">
          {actions.map((action, index) => (
            <TouchableOpacity className="items-center gap-4"
              key={index}
              onPress={action.onPress}
              activeOpacity={0.75}
            >
              {/* White circle */}
              <View className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-sm"
                style={{
                  shadowColor: "#8ab0c8",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 10,
                  elevation: 3,
                }}
              >
                {action.icon}
              </View>

              {/* Label */}
              <Text className="text-[12px] text-typography-100 text-center font-inter-medium leading-[19px]"
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
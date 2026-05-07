import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, TouchableOpacity, Alert } from "react-native";
import { Text } from "@/components/ui/text";
import { ChevronLeft, CalendarDays, Trash2 } from "lucide-react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/navigation/AppNavigator";
import { ICON_MAP } from "@/src/constants/iconMap";
import formatExpiryLabel from "@/src/utils/formatExpiryLabel";
import formatDate from "@/src/utils/formatDate";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { documentApi } from "@/src/api/services/docService";
import { useAuthStore } from "@/src/store/authStore";

export default function DocumentDetail() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, "DocumentDetail">>();
    const { car, document, cars } = route.params;
    const IconComponent = ICON_MAP[document.documentTypeIconName];
    const fill = getProgressFill(document.daysRemaining);
    
    const handleDelete = () => {
        Alert.alert(
        "Șterge Document",
        `Ești sigur că vrei să ștergi documentul "${document.documentTypeName}"?`,
        [
            { text: "Înapoi", style: "cancel" },
            { text: "Șterge", style: "destructive", onPress: onDelete },
        ]
        );
    };

    const onDelete = async () => {
        try {
        await documentApi.deleteDocument(document.id);
        console.log("Document " + document.documentTypeName + " remove successfully for user: " + useAuthStore.getState().user?.email);
        
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });

        } catch (error: any) {
        const errorMessage = error?.response?.data?.message
            || error?.message
            || 'An error occurred while deleting the document';
        console.error('Document delete error:', errorMessage);
        Alert.alert('Error', errorMessage);
        }
    };

    return (
            <SafeAreaView className="flex-1 bg-background-50">
            <StatusBar barStyle="dark-content" />
                {/* ── Header ── */}
                <View className="flex-row items-center px-6 pt-2 pb-4">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 bg-primary-0 rounded-full items-center justify-center"
                        activeOpacity={0.7}
                        >
                        <ChevronLeft size={20} color="#0a4f67" strokeWidth={1.6} />
                    </TouchableOpacity>
                    <Text className="text-lg font-inter-semibold text-typography-100 text-center flex-1"
                            style={{ marginRight: 36 }}
                    >
                    Detalii document
                    </Text>
                </View>

                <Box className="flex-1 bg-background-50 px-6 py-8">
                    <View className="bg-white rounded-2xl px-5 py-5">
                        {/* Icon + Name row */}
                        <View className="flex-row items-center mb-6">
                            <View className="w-11 h-11 bg-background-500 rounded-xl items-center justify-center mr-3">
                                <IconComponent size={22} color="#0a4f67" strokeWidth={1.6} />
                            </View>
                
                            <View>
                                <Text className="text-gray-900 font-bold text-xl">
                                    {document.documentTypeName}
                                </Text>
                                <Text className="text-[11px] font-inter-medium text-typography-50">
                                    {car.name}
                                </Text>
                            </View>
                        </View>

                        {/* Expiry label */}
                        <Text className={`font-inter-semibold text-sm mb-3 ${getColor(document.daysRemaining)}`}>
                            {formatExpiryLabel(document.daysRemaining, document.expiryDate)}
                        </Text>

                        {/* Progress bar */}
                        <View className="h-2 rounded-full bg-gray-100 overflow-hidden mb-6">
                            <View className={`h-full rounded-full ${getBackgroundColor(document.daysRemaining)}`}
                            style={{
                                width: `${Math.round(fill * 100)}%`,
                            }}
                            />
                        </View>

                        {/* Divider */}
                        <View className="h-px bg-gray-100 mb-4" />
                
                        {/* Data expirare row */}
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-2">
                                <CalendarDays size={16} color="#9CA3AF" strokeWidth={1.8} />
                                <Text className="text-gray-400 text-sm">Dată expirare</Text>
                            </View>
                            <Text className="text-gray-900 font-inter-semibold text-sm">
                                {formatDate(document.expiryDate.toString())}
                            </Text>
                        </View>
                    </View>
                </Box>

                {/* ── Bottom Buttons ── */}
                <View className="absolute bottom-0 w-full px-6 pb-8 gap-4">
                    {/* Prelungeste */}
                    <Button
                        onPress={() => navigation.navigate('AddDocument', { car, cars, document } )}
                        className="flex-row items-center justify-center h-16 bg-secondary-500 rounded-2xl py-4 w-full gap-2 active:scale-[0.99]"
                    >
                        <CalendarDays  size={18} color="#ffffff" strokeWidth={2.5} />
                        <Text className="text-primary-0 font-inter-semibold text-base">
                            Prelungește document
                        </Text>
                    </Button>
            
                    {/* Sterge */}
                    <Button
                        onPress={handleDelete}
                        className="flex-row items-center justify-center h-16 bg-secondary-500 rounded-2xl py-4 w-full gap-2 active:scale-[0.99]"
                            style={{ backgroundColor: "#ff5c5c" }}
                    >
                        <Trash2 size={18} color="#ffffff" strokeWidth={2.5} />
                        <Text className="text-primary-0 font-inter-semibold text-base">
                            Șterge document
                        </Text>
                    </Button>
                </View>
            </SafeAreaView>
    )
}

const getColor = (daysRemaining: number) => {
    if (daysRemaining <= 3) return "text-error-100";
    if (daysRemaining <= 10) return "text-warning-50";
    return "text-success-50";
};

const getBackgroundColor = (daysRemaining: number) => {
    if (daysRemaining <= 3) return "bg-error-100";
    if (daysRemaining <= 10) return "bg-warning-50";
    return "bg-success-50";
};

const getProgressFill = (days: number) => {
  const MAX_DAYS = 365;
  return Math.min(Math.max((MAX_DAYS - days) / MAX_DAYS, 0.04), 1);
};
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Box } from "@/components/ui/box";
import { documentApi } from "@/src/api/services/docService";
import HomeMenu from "../home/homeMenu";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/navigation/AppNavigator";
import HomeAddBottomSheet from "../home/homeAddSheet";

type TabName = "Home" | "Documents" | "Expenses" | "Settings";

export default function Settings() {
const [activeTab, setActiveTab] = useState<TabName>("Settings");
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
const route = useRoute<RouteProp<RootStackParamList, "Settings">>();
const { car, cars } = route.params;
const [loading, setLoading] = useState(false);
const [showAddSheet, setShowAddSheet] = useState(false);

useEffect(() => {
    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const responseData = await documentApi.expensesHistory();
            //setExpenses(responseData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
        fetchExpenses();
}, [])

if (activeTab === "Home") {
    navigation.navigate("Home");
} else if (activeTab === "Expenses") {
    navigation.navigate("ExpensesMenu", { car, cars });
} else if (activeTab === "Documents") {
    navigation.navigate("DocumentsMenu", { car, cars });
}

  return (
    <SafeAreaView className="flex-1 bg-background-50">
        <StatusBar barStyle="dark-content" />
            {/* ── Header ── */}
            <View className="flex-row items-center px-6 pt-4 pb-4">
                <Text className="font-inter-bold text-typography-900 text-2xl mb-2">
                    Setări
                </Text>
            </View>

            <Box className="flex-1 bg-background-50 px-6 py-1">            
                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    enableOnAndroid
                    extraScrollHeight={20}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 mt-3">
                        {loading ? (
                            <ActivityIndicator
                                size="small"
                                color="#14b8a6"
                                style={{ marginTop: 40 }}
                            />
                        ) : (
                           <View></View>
                        )}
                    </View>

                </KeyboardAwareScrollView>
            </Box>

            <HomeMenu
                activeTab={activeTab}
                onTabPress={(tab) => setActiveTab(tab)}
                onAddPress={() => setShowAddSheet(prev => !prev)}
            />

            <HomeAddBottomSheet
                visible={showAddSheet}
                onClose={() => setShowAddSheet(false)}
                onAddCar={() => navigation.navigate('AddCar')}
                onAddDocument={() => navigation.navigate('AddDocument', { car, cars } )}
                onAddExpense={() => navigation.navigate('AddExpense', { cars } )}
            />

    </SafeAreaView>
  );
}
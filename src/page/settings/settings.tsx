import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, Switch, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Box } from "@/components/ui/box";
import HomeMenu from "../home/homeMenu";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/navigation/AppNavigator";
import HomeAddBottomSheet from "../home/homeAddSheet";
import { Bell, ChevronRight, Moon, Settings2, Tag } from "lucide-react-native";
import { useTheme } from "@/src/context/themeContext";
import ThemeToggle from "./themeToggle";

type TabName = "Home" | "Documents" | "Expenses" | "Settings";

export default function Settings() {
    const { isDark, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<TabName>("Settings");
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, "Settings">>();
    const { car, cars } = route.params;
    const [showAddSheet, setShowAddSheet] = useState(false);
    const [pushNotifications, setPushNotifications] = useState(true);
    const TEAL = "#0ea5e9";


    useEffect(() => {
        if (activeTab === "Home") {
            navigation.navigate("Home");
        } else if (activeTab === "Expenses") {
            navigation.navigate("ExpensesMenu", { car, cars });
        } else if (activeTab === "Documents") {
            navigation.navigate("DocumentsMenu", { car, cars });
        }
    }, [activeTab]);

  return (
    <SafeAreaView className="flex-1 bg-background-50">
        <StatusBar barStyle={isDark === true ? 'light-content' : 'dark-content'} />
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
                        {/* ── Settings Card ── */}
                        <View className="bg-white rounded-2xl overflow-hidden shadow-sm">

                            {/* Dark Mode */}
                            <View className="flex-row items-center px-4 py-4">
                                <View className="w-8 h-8 rounded-full bg-sky-50 items-center justify-center mr-3">
                                    <Moon size={18} color={TEAL} strokeWidth={1.8} />
                                </View>
                                <Text className="flex-1 font-inter-medium text-typography-800 text-base">
                                    Dark Mode
                                </Text>
                                <ThemeToggle value={isDark} onValueChange={toggleTheme} />
                            </View>

                            {/* Separator */}
                            <View className="h-px bg-background-100 mx-4" />

                            {/* Currency */}
                            <TouchableOpacity
                                className="flex-row items-center px-4 py-4 active:bg-background-50"
                                onPress={() => { /* navigare spre selector monedă */ }}
                            >
                                <View className="w-8 h-8 rounded-full bg-sky-50 items-center justify-center mr-3">
                                    <Settings2 size={18} color={TEAL} strokeWidth={1.8} />
                                </View>
                                <Text className="flex-1 font-inter-medium text-typography-800 text-base">
                                    Monedă
                                </Text>
                                <View className="flex-row items-center gap-1">
                                    <Text className="font-inter-regular text-typography-500 text-base mr-1">
                                        RON
                                    </Text>
                                    <ChevronRight size={16} color="#94a3b8" strokeWidth={2} />
                                </View>
                            </TouchableOpacity>

                            {/* Separator */}
                            <View className="h-px bg-background-100 mx-4" />

                            {/* Distance Unit */}
                            <TouchableOpacity
                                className="flex-row items-center px-4 py-4 active:bg-background-50"
                                onPress={() => { /* navigare spre selector unitate distanță */ }}
                            >
                                <View className="w-8 h-8 rounded-full bg-sky-50 items-center justify-center mr-3">
                                    <Tag size={18} color={TEAL} strokeWidth={1.8} />
                                </View>
                                <Text className="flex-1 font-inter-medium text-typography-800 text-base">
                                    Unitate distanță
                                </Text>
                                <View className="flex-row items-center gap-1">
                                    <Text className="font-inter-regular text-typography-500 text-base mr-1">
                                        km
                                    </Text>
                                    <ChevronRight size={16} color="#94a3b8" strokeWidth={2} />
                                </View>
                            </TouchableOpacity>

                            {/* Separator */}
                            <View className="h-px bg-background-100 mx-4" />

                            {/* Push Notifications */}
                            <View className="flex-row items-center px-4 py-4">
                                <View className="w-8 h-8 rounded-full bg-sky-50 items-center justify-center mr-3">
                                    <Bell size={18} color={TEAL} strokeWidth={1.8} />
                                </View>
                                <Text className="flex-1 font-inter-medium text-typography-800 text-base">
                                    Notificări push
                                </Text>
                                <Switch
                                    value={pushNotifications}
                                    onValueChange={setPushNotifications}
                                    trackColor={{ false: "#e2e8f0", true: TEAL }}
                                    thumbColor="#ffffff"
                                    ios_backgroundColor="#e2e8f0"
                                />
                            </View>

                        </View>                        



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
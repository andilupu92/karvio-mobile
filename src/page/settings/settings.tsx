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
import { useTheme } from "@/src/context/themeContext";
import ThemeToggle from "./themeToggle";
import { Icons } from "@/src/utils/icons";

type TabName = "Home" | "Documents" | "Expenses" | "Settings";

export default function Settings() {
    const { isDark, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<TabName>("Settings");
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, "Settings">>();
    const { car, cars } = route.params;
    const [showAddSheet, setShowAddSheet] = useState(false);
    const [pushNotifications, setPushNotifications] = useState(true);

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
    <SafeAreaView className={`flex-1 ${ isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'}`}>
        <StatusBar barStyle={isDark === true ? 'light-content' : 'dark-content'} />
            {/* ── Header ── */}
            <View className="flex-row items-center px-6 pt-4 pb-4">
                <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-bold text-2xl mb-2`}>
                    Setări
                </Text>
            </View>

            <Box className={`flex-1 ${ isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'} px-6 py-1`}>            
                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    enableOnAndroid
                    extraScrollHeight={20}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 mt-3">
                        {/* ── Settings Card ── */}
                        <View className={`${ isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100' } border rounded-xl overflow-hidden`}>

                            {/* Dark Mode */}
                            <View className="flex-row items-center px-4 py-4">
                                <View className={`${ isDark ? 'bg-background-icon-900' : 'bg-background-icon-100' } w-10 h-10 rounded-xl items-center justify-center mr-3`}>
                                    <Icons.Moon 
                                        className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
                                        size={18} 
                                        strokeWidth={1.8} 
                                    />
                                </View>
                                <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} flex-1 font-inter-medium text-base`}>
                                    Dark Mode
                                </Text>
                                <ThemeToggle value={isDark} onValueChange={toggleTheme} />
                            </View>

                            {/* Separator 
                            <View className="h-px bg-background-100 mx-4" />*/}

                            {/* Currency 
                            <TouchableOpacity
                                className="flex-row items-center px-4 py-4 active:bg-background-50"
                                onPress={() => {  }}
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
                            </TouchableOpacity>*/}

                            {/* Separator 
                            <View className="h-px bg-background-100 mx-4" />*/}

                            {/* Distance Unit 
                            
                            <TouchableOpacity
                                className="flex-row items-center px-4 py-4 active:bg-background-50"
                                onPress={() => {  }}
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
                            </TouchableOpacity>*/}

                            {/* Separator */}
                            {/*<View className="h-px bg-background-100 mx-4" />*/}

                            {/* Push Notifications */}
                            {/*<View className="flex-row items-center px-4 py-4">
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
                            </View>*/}

                        </View>                        

                        <View className={`${ isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100' } border rounded-xl overflow-hidden mt-5`}>
                            <View className="flex-row items-center px-4 py-4">
                                <View className={`${ isDark ? 'bg-background-icon-900' : 'bg-background-icon-100' } w-10 h-10 rounded-xl items-center justify-center mr-3`}>
                                    <Icons.Shield 
                                        className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
                                        size={18} 
                                        strokeWidth={1.8} 
                                    />
                                </View>
                                <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} flex-1 font-inter-medium text-base`}>
                                    Privacy Policy
                                </Text>
                                <Icons.ChevronRight 
                                    className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                                    size={16} 
                                    strokeWidth={2} 
                                />
                            </View>
                            <View
                                className={`${isDark ? 'bg-outline-900' : 'bg-outline-100'}`}
                                style={{
                                    height: 1,
                                    marginHorizontal: 16,
                                }}
                            />
                            <View className="flex-row items-center px-4 py-4">
                                <View className={`${ isDark ? 'bg-background-icon-900' : 'bg-background-icon-100' } w-10 h-10 rounded-xl items-center justify-center mr-3`}>
                                    <Icons.FileText 
                                        className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
                                        size={18} 
                                        strokeWidth={1.8} 
                                    />
                                </View>
                                <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} flex-1 font-inter-medium text-base`}>
                                    Terms & Conditions
                                </Text>
                                <Icons.ChevronRight 
                                    className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                                    size={16} 
                                    strokeWidth={2} 
                                />
                            </View>
                        </View>

                        <View className={`${ isDark ? 'text-typography-800' : 'text-typography-200'} mt-80 pt-16 font-inter-medium text-sm items-center justify-center`}>
                            <Text className="italic">App version 1.0.0</Text>
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
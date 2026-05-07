import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, ActivityIndicator, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Box } from "@/components/ui/box";
import { documentApi } from "@/src/api/services/docService";
import { TrendingDown, TrendingUp } from "lucide-react-native";
import HomeMenu from "../home/homeMenu";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/navigation/AppNavigator";
import HomeAddBottomSheet from "../home/homeAddSheet";
import ExpensesPerCarFromMenu from "./expensesPerCarFromMenu";
import TopCategoriesFromMenu from "./topCategoriesFromMenu";

type CarWithExpenses = {
    carId: number;
    name: string;
    consumption: number;
    healthScore: number;
    amount: number;
}

type CarSummary = {
  car: {
    id: number;
    name: string;
    energyType: string;
    kilometers: number;
    year: number;
    consumption: number;
    healthScore: number;
  };
  totalAmount: number;
};

type CategorySummary = {
  categoryName: string;
  totalAmount: number;
};

type ExpensesHistory = {
    monthName: string;
    totalAmount: number;
    categorySummaryResponseList: CategorySummary[];
    carResponsesList: CarSummary[];
}

const MONTH_SHORT: Record<string, string> = {
  ianuarie: "Ian", februarie: "Feb", martie: "Mar",
  aprilie: "Apr", mai: "Mai", iunie: "Iun",
  iulie: "Iul", august: "Aug", septembrie: "Sep",
  octombrie: "Oct", noiembrie: "Nov", decembrie: "Dec",
};

type TabName = "Home" | "Documents" | "Expenses" | "Settings";

export default function ExpensesMenu() {
const [activeTab, setActiveTab] = useState<TabName>("Expenses");
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
const route = useRoute<RouteProp<RootStackParamList, "ExpensesMenu">>();
const { car, cars } = route.params;
const [loading, setLoading] = useState(false);
const [expenses, setExpenses] = useState<ExpensesHistory[]>([]);
const [showAddSheet, setShowAddSheet] = useState(false);
const [selectedIndex, setSelectedIndex] = useState(expenses.length - 1);

useEffect(() => {
    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const responseData = await documentApi.expensesHistory();
            setSelectedIndex(responseData.length - 1);
            setExpenses(responseData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
        fetchExpenses();
}, [])

const selectedMonth = expenses[selectedIndex];
const prevMonth = expenses[selectedIndex - 1];
 
const currentTotal = selectedMonth?.totalAmount ?? 0;
const prevTotal = prevMonth?.totalAmount ?? 0;
const percentChange = prevTotal > 0 ? Math.round(((currentTotal - prevTotal) / prevTotal) * 100) : 0;
const isPositive = percentChange >= 0;
const maxTotal = Math.max(...expenses.map((m) => m.totalAmount), 1);
const BAR_MAX_HEIGHT = 92;

if (activeTab === "Home") {
    navigation.navigate("Home");
} else if (activeTab === "Documents") {
    navigation.navigate("DocumentsMenu", { car, cars });
} else if (activeTab === "Settings") {
    navigation.navigate("Settings");
}

  return (
    <SafeAreaView className="flex-1 bg-background-50">
        <StatusBar barStyle="dark-content" />
            {/* ── Header ── */}
            <View className="flex-row items-center px-6 pt-4 pb-4">
                <Text className="font-inter-bold text-typography-900 text-2xl mb-2">
                    Cheltuieli Garaj
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
                        ) : expenses.length > 0 ? (
                            <Box>
                            <View
                                className="rounded-3xl px-9 py-6"
                                style={{
                                    backgroundColor: "#FFFFFF",
                                }}
                            >
                                {/* ── row 1: label + badge ── */}
                                <View className="flex-row items-center justify-between mb-1">
                                    <Text className="text-typography-50 text-lg font-inter-regular">
                                        Total luna curentă
                                    </Text>
                                    <View
                                        className="flex-row items-center px-2 py-1 rounded-xl"
                                        style={{ backgroundColor: isPositive ? "#FEE2E2" : "#DCFCE7" }}
                                    >
                                        {isPositive ? (
                                            <TrendingUp size={11} color="#DC2626" strokeWidth={2.2} />
                                        ) : (
                                            <TrendingDown size={11} color="#16A34A" strokeWidth={2.2} />
                                        )}
                                        <Text
                                            className="text-xs font-inter-semibold ml-1"
                                            style={{ color: isPositive ? "#DC2626" : "#16A34A" }}
                                        >
                                            {isPositive ? "+" : ""}{percentChange}%
                                        </Text>
                                    </View>
                                </View>

                                {/* ── row 2: suma ── */}
                                <Text className="font-inter-bold text-typography-900 mb-10" style={{ fontSize: 22 }}>
                                    {currentTotal}{" "}
                                    <Text className="text-typography-50 font-inter-medium" style={{ fontSize: 14 }}>
                                        RON
                                    </Text>
                                </Text>

                                {/* ── Rând 3: bar chart ── */}
                                <View className="flex-row items-end justify-between" style={{ height: BAR_MAX_HEIGHT + 18 }}>
                                    {expenses.map((month, index) => {
                                        const isSelected = index === selectedIndex;
                                        const isLast = index === expenses.length - 1;
                                        const barHeight =
                                            month.totalAmount > 0
                                                ? Math.max((month.totalAmount / maxTotal) * BAR_MAX_HEIGHT, 8)
                                                : 6;
                                        const label = MONTH_SHORT[month.monthName.toLowerCase()] ?? month.monthName;

                                        return (
                                            <TouchableOpacity
                                                key={month.monthName}
                                                className="items-center flex-1"
                                                activeOpacity={0.7}
                                                onPress={() => setSelectedIndex(index)}
                                            >

                                                {/* Container bara — pozitionare relativa */}
                                                <View style={{ width: 30, height: BAR_MAX_HEIGHT, position: "relative" }}>

                                                    {/* Bara fundal (track) — intotdeauna la inaltime maxima */}
                                                    <View
                                                        style={{
                                                            position: "absolute",
                                                            bottom: 0,
                                                            left: 0,
                                                            right: 0,
                                                            height: BAR_MAX_HEIGHT,
                                                            borderRadius: 6,
                                                            backgroundColor: isSelected ? "#D0DCE8" : "#E2EAF0",
                                                        }}
                                                    />

                                                    {/* Bara valoare reala — deasupra */}
                                                    <View
                                                        style={{
                                                            position: "absolute",
                                                            bottom: 0,
                                                            left: 0,
                                                            right: 0,
                                                            height: barHeight,
                                                            borderRadius: 6,
                                                            backgroundColor: isSelected ? "#1B3A5C" : "#B8CCE0",
                                                        }}
                                                    />
                                                </View>

                                                <Text
                                                    className="mt-1"
                                                    style={{
                                                        fontSize: 10,
                                                        color: isSelected ? "#1B3A5C" : "#8FA7BE",
                                                        fontWeight: isSelected ? "700" : "400",
                                                        fontFamily: isSelected ? "Inter-Bold" : "Inter-Regular",
                                                    }}
                                                >
                                                    {label}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                            <ExpensesPerCarFromMenu carResponsesList={selectedMonth?.carResponsesList ?? []}
                                onCarPress={(id, name, consumption, healthScore, amount) => {
                                    const car: CarWithExpenses = {
                                        carId: id,
                                        name: name,
                                        consumption: consumption,
                                        healthScore: healthScore,
                                        amount: amount,
                                    };
                                    navigation.navigate('CarDetail', { car }); 
                                }}
                                totalAmountOfMonth={selectedMonth?.totalAmount ?? 0}
                            ></ExpensesPerCarFromMenu>

                            <TopCategoriesFromMenu
                                categorySummaryResponseList={selectedMonth?.categorySummaryResponseList ?? []}
                            />

                        </Box>
                        ) : (
                            <Text className="text-center mt-20">Nu există date despre cheltuieli.</Text>
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
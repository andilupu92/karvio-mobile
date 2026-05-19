import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, ActivityIndicator, TouchableOpacity } from "react-native";
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
import ExpensesPerCarFromMenu from "./expensesPerCarFromMenu";
import TopCategoriesFromMenu from "./topCategoriesFromMenu";
import { useTheme } from "@/src/context/themeContext";
import * as Icons from "lucide-react-native";

type CarWithExpenses = {
    carId: number;
    name: string;
    consumption: number;
    healthScore: number | null;
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
    healthScore: number | null;
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
const { isDark } = useTheme();

useEffect(() => {
    const fetchExpenses = async () => {
        try {
            setLoading(true);
            //const responseData = await documentApi.expensesHistory();
            const responseData = [{"monthName":"ianuarie","totalAmount":750,"categorySummaryResponseList":[{"categoryName":"Service&Piese","totalAmount":750}],"carResponsesList":[{"car":{"id":3,"name":"Audi A5","energyType":"Benzină","kilometers":290800,"year":2011,"consumption":7.35,"healthScore":null},"totalAmount":750}]},{"monthName":"februarie","totalAmount":540,"categorySummaryResponseList":[{"categoryName":"Amenzi","totalAmount":540}],"carResponsesList":[{"car":{"id":17,"name":"Dacia 1300","energyType":"Benzină","kilometers":324500,"year":2001,"consumption":6,"healthScore":null},"totalAmount":540}]},{"monthName":"aprilie","totalAmount":2095,"categorySummaryResponseList":[{"categoryName":"ITP","totalAmount":700},{"categoryName":"Rovinietă","totalAmount":460},{"categoryName":"Impozit auto","totalAmount":340}],"carResponsesList":[{"car":{"id":17,"name":"Dacia 1300","energyType":"Benzină","kilometers":324500,"year":2001,"consumption":6,"healthScore":null},"totalAmount":450},{"car":{"id":3,"name":"Audi A5","energyType":"Benzină","kilometers":290800,"year":2011,"consumption":7.35,"healthScore":null},"totalAmount":1645}]},{"monthName":"mai","totalAmount":7067,"categorySummaryResponseList":[{"categoryName":"Combustibil","totalAmount":4380},{"categoryName":"Impozit auto","totalAmount":700},{"categoryName":"Trusă medicală","totalAmount":660}],"carResponsesList":[{"car":{"id":17,"name":"Dacia 1300","energyType":"Benzină","kilometers":324500,"year":2001,"consumption":6,"healthScore":null},"totalAmount":1477},{"car":{"id":3,"name":"Audi A5","energyType":"Benzină","kilometers":290800,"year":2011,"consumption":7.35,"healthScore":null},"totalAmount":5590}]}]
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

useEffect(() => {
    if (activeTab === "Home") {
        navigation.navigate("Home");
    } else if (activeTab === "Documents") {
        navigation.navigate("DocumentsMenu", { car, cars });
    } else if (activeTab === "Settings") {
        navigation.navigate("Settings", { car, cars });
    }
}, [activeTab]);

  return (
    <SafeAreaView className={`flex-1 ${ isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'}`}>
        <StatusBar barStyle={isDark === true ? 'light-content' : 'dark-content'} />
            {/* ── Header ── */}
            <View className="flex-row items-center px-6 pt-4 pb-4">
                <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-bold text-2xl mb-2`}>
                    Cheltuieli Garaj
                </Text>
            </View>

            <Box className={`flex-1 ${ isDark ? 'bg-background-primary-900' : 'bg-background-primary-100' } px-6 py-1`}>            
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
                            <View className={`rounded-xl px-9 py-6 border ${ isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100' }`}
                            >
                                {/* ── row 1: label + badge ── */}
                                <View className="flex-row items-center justify-between mb-1">
                                    <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} text-lg font-inter-regular`}>
                                        Total luna curentă
                                    </Text>
                                    <View
                                        className={`${ isPositive ? 'bg-error-0' : 'bg-success-0' } flex-row items-center px-2 py-1 rounded-xl`}
                                    >
                                        {isPositive ? (
                                                                                        <Icons.TrendingUp 
                                                                                            className='text-error-50'
                                                                                            size={11} 
                                                                                            strokeWidth={2.2} 
                                                                                        />
                                                                                    ) : (
                                                                                        <Icons.TrendingDown 
                                                                                            className='text-success-50'
                                                                                            size={11} 
                                                                                            strokeWidth={2.2} 
                                                                                        />
                                                                                    )}
                                        <Text
                                            className={`${ isPositive ? 'text-error-50' : 'text-success-50' } text-xs font-inter-semibold ml-1`}
                                        >
                                            {isPositive ? "+" : ""}{percentChange}%
                                        </Text>
                                    </View>
                                </View>

                                {/* ── row 2: suma ── */}
                                <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-bold mb-10`} style={{ fontSize: 22 }}>
                                        {currentTotal.toLocaleString("ro-RO")}{" "}
                                        <Text className={`${ isDark ? 'text-typography-800' : 'text-typography-200'} font-inter-medium`} style={{ fontSize: 14 }}>
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
                                                    <View className={` ${ isSelected ? 'bg-background-chart-300' : 'bg-background-chart-400'}  `}
                                                        style={{
                                                            position: "absolute",
                                                            bottom: 0,
                                                            left: 0,
                                                            right: 0,
                                                            height: BAR_MAX_HEIGHT,
                                                            borderRadius: 6,
                                                        }}
                                                    />

                                                    {/* Bara valoare reala — deasupra */}
                                                    <View className={` ${ isSelected ? 'bg-background-chart-100' : 'bg-background-chart-200'}  `}
                                                        style={{
                                                            position: "absolute",
                                                            bottom: 0,
                                                            left: 0,
                                                            right: 0,
                                                            height: barHeight,
                                                            borderRadius: 6,
                                                        }}
                                                    />
                                                </View>

                                                <Text
                                                    className={`${ isDark ? isSelected ? 'text-typography-900' : 'text-typography-800' : isSelected ? 'text-typography-100' : 'text-typography-200'} mt-1`}
                                                    style={{
                                                        fontSize: 10,
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
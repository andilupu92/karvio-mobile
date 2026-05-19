import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/navigation/AppNavigator";
import { useState, useEffect } from "react";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Box } from "@/components/ui/box";
import { View, StatusBar, TouchableOpacity, Alert } from "react-native";
import { Text } from "@/components/ui/text";
import { TrendingDown, TrendingUp, ChevronLeft, Trash2, ChevronUp, ChevronDown, Plus } from "lucide-react-native";
import { ICON_MAP } from "@/src/constants/iconMap";
import formatDate from "@/src/utils/formatDate";
import { Button } from "@/components/ui/button";
import { documentApi } from "@/src/api/services/docService";
import { useAuthStore } from "@/src/store/authStore";
import { useTheme } from "@/src/context/themeContext";
import { Icons } from "@/src/utils/icons";

type Expense = {
  id: number,
  expenseTypeId: number,
  expenseTypeName: string,
  expenseTypeIconName: string,
  date: Date,
  amount: number
};

const MONTH_SHORT: Record<string, string> = {
  ianuarie: "Ian", februarie: "Feb", martie: "Mar",
  aprilie: "Apr", mai: "Mai", iunie: "Iun",
  iulie: "Iul", august: "Aug", septembrie: "Sep",
  octombrie: "Oct", noiembrie: "Nov", decembrie: "Dec",
};

export default function ExpensesDetail() {
    const { isDark } = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, "ExpensesDetail">>();
    const { car, cars, expenses } = route.params;
    const [selectedIndex, setSelectedIndex] = useState(expenses.length - 1);
    const [showAll, setShowAll] = useState(false);
    const INITIAL_VISIBLE = 3;

    useEffect(() => {
        setSelectedIndex(expenses.length - 1);
    }, []);

    const selectedMonth = expenses[selectedIndex];
    const prevMonth = expenses[selectedIndex - 1];
    
    const currentTotal = selectedMonth?.totalAmount ?? 0;
    const prevTotal = prevMonth?.totalAmount ?? 0;
    const percentChange = prevTotal > 0 ? Math.round(((currentTotal - prevTotal) / prevTotal) * 100) : 0;
    const isPositive = percentChange >= 0;
    const maxTotal = Math.max(...expenses.map((m) => m.totalAmount), 1);
    const BAR_MAX_HEIGHT = 92;

    const visibleItems = showAll ? selectedMonth.expenseResponseList : selectedMonth.expenseResponseList.slice(0, INITIAL_VISIBLE);
    const hasMore = selectedMonth.expenseResponseList.length > INITIAL_VISIBLE;

    const handleDelete = (expense: Expense) => {
        Alert.alert(
        "Șterge Cheltuială",
        `Ești sigur că vrei să ștergi cheltuiala "${expense.expenseTypeName}"?`,
        [
            { text: "Înapoi", style: "cancel" },
            { text: "Șterge", style: "destructive", onPress: () => onDelete(expense) },
        ]
        );
    };

    const onDelete = async (expense: Expense) => {
        try {
        await documentApi.deleteExpense(expense.id);
        console.log("Expense " + expense.expenseTypeName + " remove successfully for user: " + useAuthStore.getState().user?.email);
        
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });

        } catch (error: any) {
        const errorMessage = error?.response?.data?.message
            || error?.message
            || 'An error occurred while deleting the expense';
        console.error('Expense delete error:', errorMessage);
            Alert.alert('Error', errorMessage);
        }
    };    

    return (
        <SafeAreaView className={`flex-1 ${ isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'}`}>
            <StatusBar barStyle={isDark === true ? 'light-content' : 'dark-content'} />
                {/* ── Header ── */}
                <View className="flex-row items-center px-6 pt-2 pb-4">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className={`w-10 h-10 ${ isDark ? 'bg-background-card-900' : 'bg-background-card-100'} rounded-full items-center justify-center`}
                        activeOpacity={0.7}
                        >
                        <Icons.ChevronLeft
                            className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
                            size={20} 
                            strokeWidth={1.6} 
                        />
                    </TouchableOpacity>
                    <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} text-lg font-inter-semibold text-center flex-1`}
                            style={{ marginRight: 36 }}
                    >
                        Detalii cheltuieli
                    </Text>
                </View>
                {/* ── Car name ── */}
                <Text
                    className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} text-2xl font-inter-bold px-6 mb-4`}>
                    {car.name}
                </Text>
            
            <Box className="flex-1 px-6 py-1"> 
                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    enableOnAndroid
                    extraScrollHeight={20}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 mt-3">
                        {expenses.length > 0 ? (
                            <Box>
                                <View
                                    className={`rounded-xl px-9 py-6 border ${ isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100' }`}>
                                    {/* ── row 1: label + badge ── */}
                                    <View className="flex-row items-center justify-between mb-1">
                                        <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} text-lg font-inter-regular`}>
                                            Total luna curentă
                                        </Text>
                                        <View
                                            className={`${ isPositive ? 'bg-error-0' : 'bg-success-0' } flex-row items-center px-2 py-1 rounded-xl`}>
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
                                                className={`${ isPositive ? 'text-error-50' : 'text-success-50' } text-xs font-inter-semibold ml-1`}>
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

                                {/* ── Secțiunea "All expenses this month" ── */}
                                <View className="mt-10 mb-4">
                                    <Text className={`text-base font-inter-semibold ${ isDark ? 'text-typography-900' : 'text-typography-100'} mb-4`}>
                                        All expenses this month
                                    </Text>
                                    {/* ── Lista cheltuieli ── */}
                                    <View
                                        className={`rounded-xl overflow-hidden border ${ isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100' }`}>
                                        {visibleItems.length === 0 ? (
                                            <View className="py-8 items-center">
                                                <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-regular text-sm`}>
                                                    Nicio cheltuială înregistrată.
                                                </Text>
                                            </View>
                                        ) : (
                                            <>
                                                {visibleItems.map((item, idx) => {
                                                    const IconComponent = ICON_MAP[item.expenseTypeIconName];
                                                    return (
                                                        <View key={item.id}>
                                                            <View className="flex-row items-center px-5 py-4">
                                                            {/* Icon categorie */}
                                                            <View
                                                                className={`${ isDark ? 'bg-background-icon-900' : 'bg-background-icon-100' } rounded-xl w-[42px] h-[42px] items-center justify-center mr-3`} >
                                                                <IconComponent 
                                                                    className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
                                                                    size={20} 
                                                                    strokeWidth={1.6} 
                                                                />
                                                            </View>

                                                            {/* Nume + data */}
                                                            <View className="flex-1">
                                                                <Text className={`font-inter-semibold ${ isDark ? 'text-typography-900' : 'text-typography-100'} text-sm`}>
                                                                {item.expenseTypeName}
                                                                </Text>
                                                                <Text
                                                                className={`font-inter-regular mt-0.5 ${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                                                                style={{ fontSize: 11 }}
                                                                >
                                                                {formatDate(item.date.toString())}
                                                                </Text>
                                                            </View>

                                                            {/* Suma */}
                                                            <Text className={`font-inter-bold ${ isDark ? 'text-typography-900' : 'text-typography-100'} mr-3`} style={{ fontSize: 15 }}>
                                                                {item.amount}{" "}
                                                                <Text className={`font-inter-regular ${ isDark ? 'text-typography-800' : 'text-typography-200'}`} style={{ fontSize: 11 }}>
                                                                    RON
                                                                </Text>
                                                            </Text>

                                                            {/* Buton ștergere */}
                                                            <TouchableOpacity
                                                                activeOpacity={0.7}
                                                                className="w-8 h-8 rounded-xl items-center justify-center bg-error-0"
                                                                onPress={() => {handleDelete(item)}}
                                                            >
                                                                <Icons.Trash2 
                                                                    className='text-error-50'
                                                                    size={14} 
                                                                    strokeWidth={2} 
                                                                />
                                                            </TouchableOpacity>
                                                        </View>

                                                        {/* Separator (nu pe ultimul vizibil) */}
                                                        {idx < visibleItems.length - 1 && (
                                                            <View className={`${isDark ? 'bg-outline-900' : 'bg-outline-100'}`}
                                                                style={{
                                                                height: 1,
                                                                marginHorizontal: 20,
                                                                }}
                                                            />
                                                        )}
                                                    </View>
                                                )}
                                            )}
                                            {/* ── Show more / Show less ── */}
                                            {hasMore && (
                                                <>
                                                    <View className={`${isDark ? 'bg-outline-900' : 'bg-outline-100'}`}
                                                        style={{
                                                        height: 1,
                                                        marginHorizontal: 20,
                                                        }}
                                                    />
                                                    <TouchableOpacity
                                                        activeOpacity={0.7}
                                                        className="flex-row items-center justify-center py-4"
                                                        onPress={() => setShowAll((prev) => !prev)}
                                                    >
                                                    <Text
                                                        className={`font-inter-medium mr-1 ${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                                                        style={{ fontSize: 13 }}
                                                    >
                                                        {showAll ? "Show less" : "Show more"}
                                                    </Text>
                                                    {showAll
                                                        ? <Icons.ChevronUp 
                                                                className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                                                                size={14} 
                                                                strokeWidth={2} 
                                                            />
                                                        : <Icons.ChevronDown 
                                                                className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                                                                size={14} 
                                                                strokeWidth={2} 
                                                            />
                                                    }
                                                    </TouchableOpacity>
                                                </>
                                            )}
                                            </>
                                        )}
                                    </View>
                                </View>

                            </Box>
                        ) : (
                            <Text className="text-center mt-20">Nu există date despre cheltuieli pentru mașina aceasta.</Text>
                        )}
                    </View>
                    <View className="flex-1 items-center justify-center">
                        <Button
                            onPress={() => navigation.navigate('AddExpense', { cars })}
                            className={`${isDark ? 'bg-background-primary-100' : 'bg-background-primary-900'} flex-row items-center justify-center h-16 rounded-xl py-4 w-full gap-2 active:scale-[0.99]`}
                        >
                            <Icons.Plus 
                                className={`${ isDark ? 'text-icons-100' : 'text-icons-900'}`}
                                size={18} 
                                strokeWidth={2.5} 
                            />
                            <Text className={`${ isDark ? 'text-typography-100' : 'text-typography-900'} font-inter-semibold text-base`}>
                                Adaugă o cheltuială
                            </Text>
                        </Button>
                    </View>
                </KeyboardAwareScrollView>
            </Box>
        </SafeAreaView>
    )
}
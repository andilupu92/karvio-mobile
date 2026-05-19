import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, TouchableOpacity, Alert, ActivityIndicator, Modal } from "react-native";
import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import { Wallet, Droplets, ShieldCheck, TriangleAlert, Clock, CircleCheck, FileText, Trash2 } from "lucide-react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/navigation/AppNavigator";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ICON_MAP } from "@/src/constants/iconMap";
import formatExpiryLabel from "@/src/utils/formatExpiryLabel";
import formatDate from "@/src/utils/formatDate";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { documentApi } from "@/src/api/services/docService";
import { carApi } from "@/src/api/services/carService";
import { useAuthStore } from "@/src/store/authStore";
import StatusCard from "./statusCard";
import formatCurrency from "@/src/utils/formatCurrency";
import { useTheme } from "@/src/context/themeContext";
import * as Icons from "lucide-react-native";

type Document = {
  id: number;
  documentTypeId: number;
  documentTypeName: string,
  documentTypeIconName: string,
  expiryDate: Date,
  daysRemaining: number;
};

type Expense = {
  id: number,
  expenseTypeId: number,
  expenseTypeName: string,
  expenseTypeIconName: string,
  date: Date,
  amount: number
};

export default function CarDetail() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, "CarDetail">>();
    const { car } = route.params;
    const [documentsLoading, setDocumentsLoading] = useState(false);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteExpenses, setDeleteExpenses] = useState(false);
    const { isDark } = useTheme();

    useEffect(() => {
        const fetchDocuments = async (carId: number) => {
            try {
            setDocumentsLoading(true);
            //const responseData = await documentApi.documents(carId);
            const responseData = [{"id":2,"documentTypeId":2,"documentTypeName":"ITP","documentTypeIconName":"car","expiryDate":new Date("2026-05-22"),"daysRemaining":7,"carName":null,"carId":17}]
            setDocuments(responseData);
            fetchExpenses(carId);
            } catch (error) {
            console.error(error);
            } finally {
            setDocumentsLoading(false);
            }
        };
        fetchDocuments(car.carId);
    }, [])


    const fetchExpenses = async (carId: number) => {
        try {
            //const responseData = await documentApi.expenses(carId);
            const responseData = [{"monthName":"februarie","totalAmount":540,"expenseResponseList":[{"id":13,"expenseTypeId":14,"expenseTypeName":"Amenzi","expenseTypeIconName":"triangle-alert","date":new Date("2026-02-19T00:00:00"),"amount":540}]},{"monthName":"aprilie","totalAmount":450,"expenseResponseList":[{"id":2,"expenseTypeId":2,"expenseTypeName":"ITP","expenseTypeIconName":"car","date":new Date("2026-04-24T00:00:00"),"amount":450}]},{"monthName":"mai","totalAmount":1477,"expenseResponseList":[{"id":16,"expenseTypeId":4,"expenseTypeName":"Revizie","expenseTypeIconName":"wrench","date":new Date("2026-05-04T00:00:00"),"amount":240},{"id":21,"expenseTypeId":13,"expenseTypeName":"Combustibil","expenseTypeIconName":"fuel","date":new Date("2026-05-06T00:00:00"),"amount":230},{"id":31,"expenseTypeId":8,"expenseTypeName":"Trusă medicală","expenseTypeIconName":"cross","date":new Date("2026-05-07T00:00:00"),"amount":320},{"id":33,"expenseTypeId":3,"expenseTypeName":"RCA","expenseTypeIconName":"shield","date":new Date("2026-05-07T00:00:00"),"amount":23},{"id":34,"expenseTypeId":11,"expenseTypeName":"Spălătorie","expenseTypeIconName":"droplets","date":new Date("2026-05-07T00:00:00"),"amount":20},{"id":35,"expenseTypeId":13,"expenseTypeName":"Combustibil","expenseTypeIconName":"fuel","date":new Date("2026-05-07T00:00:00"),"amount":300},{"id":36,"expenseTypeId":1,"expenseTypeName":"Rovinietă","expenseTypeIconName":"road","date":new Date("2026-05-07T00:00:00"),"amount":344}]}]
            const top3 = responseData[responseData.length -1].expenseResponseList.sort((a, b) => b.amount - a.amount).slice(0,3);
            setExpenses(top3);
        } catch (error) {
            console.error(error);
        }
    };

    const urgentDocs = documents.filter(doc => doc.daysRemaining <= 10);
    const laterDocs = documents.filter(doc => doc.daysRemaining > 10);

    const handleDelete = () => {
        setDeleteExpenses(false);
        setDeleteModalVisible(true);
    };

    const onDelete = async () => {
        setDeleteModalVisible(false);
        try {
            await carApi.deleteCar(car.carId);
 
            if (deleteExpenses) {
                await documentApi.deleteAllExpensesByCar(car.carId); 
            }
 
            console.log("Car " + car.name + " remove successfully for user: " + useAuthStore.getState().user?.email);
            
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
 
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message
                || error?.message
                || 'An error occurred while deleting the car';
            console.error('Car delete error:', errorMessage);
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
                            className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                            size={20} 
                            strokeWidth={1.6} 
                          />
                    </TouchableOpacity>
                    <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} text-lg font-inter-semibold text-center flex-1`}
                            style={{ marginRight: 36 }}
                    >
                    Detalii mașină
                    </Text>
                </View>

                {/* ── Car name ── */}
                <Text
                    className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} text-2xl font-inter-bold px-6 mb-4`}>
                    {car.name}
                </Text>

                <Box className={`flex-1 ${ isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'} px-6 py-1`}> 
                    <KeyboardAwareScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        enableOnAndroid
                        extraScrollHeight={20}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* ── Stats Row ── */}
                        <View className="flex-row gap-3 mb-6">
                            <StatusCard
                                icon={<Droplets size={20} color={getConsumptionColor(car.consumption, isDark).iconColor} strokeWidth={1.8} />}
                                value={car.consumption != null ? `${car.consumption.toFixed(1)}%` : "—"}
                                label="Consum"
                                valueColor={getConsumptionColor(car.consumption, isDark)}
                            />
                            <StatusCard
                                icon={<Wallet size={20} color={getExpenseColor(car.amount, isDark).iconColor} strokeWidth={1.8} />}
                                value={car.amount != 0 ? `${formatCurrency(car.amount)}` : "—"}
                                label="Cheltuieli"
                                valueColor={getExpenseColor(car.amount, isDark)}
                            />
                            <StatusCard
                                icon={<ShieldCheck size={20} color={getHealthScoreColor(car.healthScore, isDark).iconColor} strokeWidth={1.8} />}
                                value={car.healthScore != null ? `${car.healthScore}%` : "—"}
                                label="Sănătate"
                                valueColor={getHealthScoreColor(car.healthScore, isDark)}
                            />
                        </View>

                        {documentsLoading ? (
                            <ActivityIndicator
                                size="small"
                                color="#14b8a6"
                                style={{ marginTop: 100 }}
                             />
                        ) : documents.length > 0 && (
                            <View className="mb-6">
                                <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-bold text-base mb-3`}>
                                    Alerte documente
                                </Text>
                                
                                <Box className={`rounded-xl p-4 gap-2 border ${ isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100' }`}>
                                    {urgentDocs.map((doc, index) => {
                                        const style = getAlertStyle(doc.daysRemaining);
                                        const Icon = getAlertIcon(doc.daysRemaining);
                                            return (
                                                    <View key={doc.id}
                                                        className="flex-row items-center px-4 py-3 rounded-2xl"
                                                        style={{
                                                            backgroundColor: style.bg,
                                                            borderBottomWidth: index < urgentDocs.length - 1 ? 1 : 0,
                                                            borderBottomColor: "#f1f5f9",
                                                        }}
                                                    >
                                                        <View
                                                            className="w-8 h-8 rounded-xl items-center justify-center mr-3"
                                                            style={{ backgroundColor: style.iconBg }}
                                                        >
                                                            <Icon size={15} color={style.icon} strokeWidth={2} />
                                                        </View>
                                                        <View className="flex-1">
                                                            <Text className="font-inter-semibold text-sm"
                                                                style={{ color: style.text }}
                                                            >
                                                                {doc.documentTypeName}
                                                            </Text>
                                                            <Text className="font-inter-regular text-xs mt-0.5"
                                                                style={{ color: style.text, opacity: 0.8 }}
                                                            >
                                                                {formatExpiryLabel(doc.daysRemaining, doc.expiryDate)}
                                                            </Text>
                                                        </View>
                                                    </View>
                                            );
                                        })}
                                        {laterDocs.length > 0 && (
                                            <View
                                                className="flex-row items-center px-4 py-3 rounded-xl"
                                                style={{ backgroundColor: "#f8fafc" }}
                                            >
                                                <View className="w-8 h-8 rounded-xl items-center justify-center mr-3 bg-slate-200">
                                                    <FileText size={15} color="#94a3b8" strokeWidth={2} />
                                                </View>
                                                <View className="flex-1">
                                                    <Text className="font-inter-semibold text-sm text-slate-500">
                                                        {laterDocs.length} {laterDocs.length === 1 ? "document valabil" : "documente valabile"}
                                                    </Text>
                                                    <Text className="font-inter-regular text-xs mt-0.5 text-slate-400">
                                                        Fără expirări în următoarele 10 zile
                                                    </Text>
                                                </View>
                                            </View>
                                        )}


                                </Box>
                            </View>
                        )}

                        {/* ── Top 3 Cheltuieli ── */}
                        {expenses.length > 0 && (
                            <View className="mb-6">
                                <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-bold text-base mb-3`}>
                                    Top 3 Cheltuieli
                                </Text>

                                <Box className={`rounded-xl p-4 gap-2 border ${ isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100' }`}>
                                    {expenses.slice(0,3).map((expense, index) => {
                                    const Icon = ICON_MAP[expense.expenseTypeIconName];

                                        return (
                                            <View key={expense.id}>
                                                <View className="flex-row items-center px-4 py-3">
                                                <View
                                                    className={`${ isDark ? 'bg-background-icon-900' : 'bg-background-icon-100' } w-9 h-9 rounded-xl items-center justify-center mr-3`}
                                                >
                                                    <Icon size={18} className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`} strokeWidth={1.8} />
                                                </View>
                                                <View className="flex-1">
                                                    <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-semibold text-sm`}>
                                                        {expense.expenseTypeName}
                                                    </Text>
                                                    <Text className={`${ isDark ? 'text-typography-800' : 'text-typography-200'} font-inter-regular text-xs mt-0.5`}>
                                                        {formatDate(expense.date.toString())}
                                                    </Text>
                                                </View>
                                                <Text
                                                    className="font-inter-bold text-sm"
                                                    style={{ color: "#ef4444" }}
                                                >
                                                    {expense.amount} RON
                                                </Text>
                                                </View>

                                                {index < expenses.slice(0,3).length - 1 && (
                                                            <View className={`${isDark ? 'bg-outline-900' : 'bg-outline-100'}`}
                                                                style={{
                                                                height: 1,
                                                                marginHorizontal: 20,
                                                                }}
                                                            />
                                                        )}
                                            </View>
                                        );
                                    })}
                                </Box>
                            </View>
                        )}

                        {/* ── Bottom Buttons ── */}
                        <View className="absolute bottom-0 w-full pb-4 gap-4">
                    
                            {/* Delete car */}
                            <Button
                                onPress={handleDelete}
                                className="flex-row items-center justify-center h-16 rounded-2xl py-4 w-full gap-2 active:scale-[0.99]"
                                    style={{ backgroundColor: "#ff5c5c" }}
                            >
                                <Trash2 size={18} color="#ffffff" strokeWidth={2.5} />
                                <Text className="text-typography-900 font-inter-semibold text-base">
                                    Șterge mașină
                                </Text>
                            </Button>
                        </View>
                    </KeyboardAwareScrollView>
                </Box>

            {/* ── Modal Delete ── */}
            <Modal
                visible={deleteModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setDeleteModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white rounded-2xl p-6 w-[85%] shadow-lg elevation-8">
 
                        {/* Titlu */}
                        <Text className="font-inter-semibold text-[17px] text-gray-900 mb-2.5">
                            Șterge mașină
                        </Text>
 
                        {/* Mesaj */}
                        <Text className="font-inter-regular text-sm text-gray-600 mb-5 leading-5">
                            Ești sigur că vrei să ștergi mașina: "{car.name}"?
                        </Text>
 
                        {/* Separator */}
                        <View className="h-px bg-gray-100 mb-4" />
 
                        {/* Checkbox */}
                        <TouchableOpacity
                            onPress={() => setDeleteExpenses(prev => !prev)}
                            className="flex-row items-center gap-3 mb-6"
                            activeOpacity={0.7}
                        >
                            <View className={`w-[22px] h-[22px] rounded-md border-2 justify-center items-center ${
                                deleteExpenses
                                    ? "border-red-500 bg-red-500"
                                    : "border-slate-300 bg-white"
                            }`}>
                                {deleteExpenses && (
                                    <Text className="text-white text-[13px] leading-4">✓</Text>
                                )}
                            </View>
                            <Text className="flex-1 font-inter-regular text-[13px] text-gray-600 leading-[18px]">
                                Șterge toate cheltuielile asociate acestei mașini
                            </Text>
                        </TouchableOpacity>
 
                        {/* BUTTONS */}
                        <View className="flex-row justify-end gap-5">
                            <TouchableOpacity onPress={() => setDeleteModalVisible(false)}>
                                <Text className="font-inter-semibold text-sm text-[#0a4f67] tracking-wide">
                                    ÎNAPOI
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onDelete}>
                                <Text className="font-inter-semibold text-sm text-red-500 tracking-wide">
                                    ȘTERGE
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>                

        </SafeAreaView>
    )
}

const getConsumptionColor = (consumption: number, isDark: boolean) => {
    if (consumption == null) {
        return {
            iconColor: "#9dabb1",
            iconBg: isDark ? "#2C2C2C" : "#edf2f7"
        };
    }

    if (consumption >= 10) {
        return {
            iconColor: "#E53E3E",
            iconBg: isDark ? "#2C2C2C" : "#fee2e2"
        };
    }

    if (consumption >= 8) {
        return {
            iconColor: "#F59E0B",
            iconBg: isDark ? "#2C2C2C" : "#fef3c7"
        };
    }

    return {
        iconColor: "#3cba70",
        iconBg: isDark ? "#2C2C2C" : "#dcfce7"
    };
};

const getExpenseColor = (amount: number, isDark: boolean) => {
    if (amount == 0) {
        return {
            iconColor: "#9dabb1",
            iconBg: isDark ? "#2C2C2C" : "#edf2f7"
        };
    }

    if (amount >= 2000) {
        return {
            iconColor: "#E53E3E",
            iconBg: isDark ? "#2C2C2C" :"#fee2e2"
        };
    }

    if (amount >= 1000) {
        return {
            iconColor: "#F59E0B",
            iconBg: isDark ? "#2C2C2C" :"#fef3c7"
        };
    }

    return {
        iconColor: "#3cba70",
        iconBg: isDark ? "#2C2C2C" :"#dcfce7"
    };
};

const getHealthScoreColor = (healthScore: number | null, isDark: boolean) => {
    if (healthScore == null) {
        return {
            iconColor: "#9dabb1",
            iconBg: isDark ? "#2C2C2C" : "#edf2f7"
        };
    }

    if (healthScore <= 60) {
        return {
            iconColor: "#E53E3E",
            iconBg: isDark ? "#2C2C2C" : "#fee2e2"
        };
    }

    if (healthScore <= 80) {
        return {
            iconColor: "#F59E0B",
            iconBg: isDark ? "#2C2C2C" : "#fef3c7"
        };
    }

    return {
        iconColor: "#3cba70",
        iconBg: isDark ? "#2C2C2C" : "#dcfce7"
    };
};

function getAlertStyle(days: number) {
  if (days <= 3)
    return { bg: "#fff1f0", icon: "#ef4444", text: "#ef4444", iconBg: "#fee2e2" };
  if (days <= 7)
    return { bg: "#fff9e4", icon: "#f59e0b", text: "#f59e0b", iconBg: "#fef3c7" };
  return { bg: "#f0fdf4", icon: "#22c55e", text: "#22c55e", iconBg: "#dcfce7" };
}

function getAlertIcon(days: number) {
  if (days <= 3) return TriangleAlert;
  if (days <= 7) return Clock;
  return CircleCheck;
}
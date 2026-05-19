import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import formatCurrency from "@/src/utils/formatCurrency";
import { useTheme } from "@/src/context/themeContext";
import { Icons } from "@/src/utils/icons";

type ExpenseItem = {
  id: number,
  expenseTypeId: number,
  expenseTypeName: string,
  expenseTypeIconName: string,
  date: Date,
  amount: number
};

type ExpenseHistory = {
  monthName: string;
  totalAmount: number;
  expenseResponseList: ExpenseItem[];
}

type Props = {
  expensesHistory: ExpenseHistory;
  period?: string;
  onExpensesPress(): void;
};

const BAR_COLORS = ["#FF4D4D", "#FF9500", "#34C759"];

export default function HomeExpenses({ period = "Monthly", expensesHistory, onExpensesPress }: Props) {
  const { isDark } = useTheme();

  // Aggregate expenses by type and calculate total amounts
  const top3 = Object.values(
    (expensesHistory?.expenseResponseList ?? []).reduce((acc, item) => {
      if (!acc[item.expenseTypeId]) {
        acc[item.expenseTypeId] = {
          ...item,
          amount: 0,
        };
      }
      acc[item.expenseTypeId].amount += item.amount;
      return acc;
    }, {} as Record<number, ExpenseItem>)
  )
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  return (
    <TouchableOpacity
      onPress={() => onExpensesPress()}
      className="flex-1"
      activeOpacity={0.7}
    >
      <Box className={`rounded-xl p-4 border ${ isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100' }`}>
        <View className="flex-row items-center justify-between mb-3">
          <Icons.BarChart2 
            className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
            size={20} 
            strokeWidth={1.6} 
          />
          <View className={`${ isDark ? 'bg-background-icon-900' : 'bg-background-icon-100'} rounded-full px-3 py-1`}>
            <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-medium text-xs`}>
              {period}
            </Text>
          </View>
        </View>

        <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-semibold text-base leading-5`}>
          Expenses
        </Text>

        {top3 ? (
          <View>
            <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-bold text-xl mb-2`}>
              {formatCurrency(expensesHistory?.totalAmount ?? 0)}
            </Text>

            {/* Horizontal bar chart */}
            <View style={{ gap: 6 }}>
              {top3.map((expense, index) => (
                <View key={expense.id} style={{ gap: 2 }}>
                  <View className="flex-row justify-between">
                    <Text className={`${ isDark ? 'text-typography-800' : 'text-typography-200'} text-[10px]`}>
                      {expense.expenseTypeName}
                    </Text>
                    <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} text-[10px] font-inter-semibold`}>
                      {formatCurrency(expense.amount)}
                    </Text>
                  </View>
                  {/* Track */}
                  <View className={`h-[3px] ${ isDark ? 'bg-background-icon-900' : 'bg-background-icon-100'} rounded`}>
                    {/* Fill */}
                    <View
                      style={{
                        height: 3,
                        width: `${(expense.amount / expensesHistory.totalAmount) * 100}%`,
                        backgroundColor: BAR_COLORS[index],
                        borderRadius: 3,
                      }}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <Text className={`text-white/60 font-inter-medium text-xs mb-3 ${ isDark ? 'text-typography-900' : 'text-typography-100' }`}>
            Încă nu ai cheltuieli pentru mașina aceasta!
          </Text>
        )}
      </Box>
    </TouchableOpacity>
  );
}
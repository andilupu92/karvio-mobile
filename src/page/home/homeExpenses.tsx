import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { BarChart2 } from "lucide-react-native";
import formatCurrency from "@/src/utils/formatCurrency";

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

  const top3 = [...(expensesHistory?.expenseResponseList ?? [])]
  .sort((a, b) => b.amount - a.amount)
  .slice(0, 3);

  return (
    <TouchableOpacity
      onPress={() => onExpensesPress()}
      className="flex-1"
      activeOpacity={0.7}
    >
      <Box className="bg-secondary-500 rounded-2xl p-4 mr-1.5">
        <View className="flex-row items-center justify-between mb-3">
          <BarChart2 size={20} color="#ffffff" strokeWidth={1.8} />
          <View className="bg-white/20 rounded-full px-3 py-1">
            <Text className="text-white font-inter-medium text-xs">{period}</Text>
          </View>
        </View>

        <Text className="text-white font-inter-semibold text-base leading-5">
          Expenses
        </Text>

        {top3 ? (
          <View>
            <Text className="text-white font-inter-bold text-xl mb-2">
              {formatCurrency(expensesHistory?.totalAmount ?? 0)}
            </Text>

            {/* Horizontal bar chart */}
            <View style={{ gap: 6 }}>
              {top3.map((expense, index) => (
                <View key={expense.id} style={{ gap: 2 }}>
                  <View className="flex-row justify-between">
                    <Text className="text-white/70 text-[10px]">
                      {expense.expenseTypeName}
                    </Text>
                    <Text className="text-white text-[10px] font-inter-semibold">
                      {formatCurrency(expense.amount)}
                    </Text>
                  </View>
                  {/* Track */}
                  <View className="h-[3px] bg-white/15 rounded">
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
          <Text className="text-white/60 font-inter-medium text-xs mb-3">
            Încă nu ai cheltuieli pentru mașina aceasta!
          </Text>
        )}
      </Box>
    </TouchableOpacity>
  );
}
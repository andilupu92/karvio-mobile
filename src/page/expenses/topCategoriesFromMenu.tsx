import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/src/context/themeContext";

type CategorySummary = {
  categoryName: string;
  totalAmount: number;
};

type TopCategoriesProps = {
  categorySummaryResponseList: CategorySummary[];
};

const CATEGORY_COLORS: Record<string, string> = {
  "Combustibil":    "#F5A623",
  "Service&Piese":  "#1B3A5C",
  "Service & Piese":"#1B3A5C",
  "Documente":      "#A8D5C2",
  "ITP":            "#0D7377",
  "CASCO":          "#4A90D9",
  "RCA":            "#7B68EE",
  "Amenzi":         "#E74C3C",
  "Rovinietă":      "#27AE60",
  "Impozit auto":   "#E67E22",
  "Spălătorie":     "#95A5A6",
};

const FALLBACK_COLORS = [
  "#F5A623", "#1B3A5C", "#A8D5C2", "#0D7377",
  "#4A90D9", "#7B68EE", "#E74C3C", "#27AE60",
];

const getColor = (name: string, index: number): string =>
  CATEGORY_COLORS[name] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];


export default function TopCategoriesFromMenu({ categorySummaryResponseList }: TopCategoriesProps) {
  if (!categorySummaryResponseList || categorySummaryResponseList.length === 0) return null;

  const grandTotal = categorySummaryResponseList.reduce((sum, c) => sum + c.totalAmount, 0);
  const { isDark } = useTheme();
  
  // Sortăm descrescător după sumă
  const sorted = [...categorySummaryResponseList].sort((a, b) => b.totalAmount - a.totalAmount);

  return (
    <View className="mt-6">
      <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-bold text-lg mb-3`}>
        Top categorii
      </Text>

      <View
        className={`rounded-xl px-7 py-5 border ${ isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100' }`}
      >
        {/* ── Lista categorii ── */}
        {sorted.map((item, index) => {
          const percent = grandTotal > 0 ? Math.round((item.totalAmount / grandTotal) * 100) : 0;
          const color = getColor(item.categoryName, index);

          return (
            <View
              key={item.categoryName}
              className="flex-row items-center justify-between mb-3"
            >
              {/* Dot + nume */}
              <View className="flex-row items-center flex-1">
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 99,
                    backgroundColor: color,
                    marginRight: 10,
                  }}
                />
                <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-medium text-sm`}>
                  {item.categoryName}
                </Text>
              </View>

              {/* Procent */}
              <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-semibold text-sm`}>
                {percent}
              </Text>
              <Text className={`${ isDark ? 'text-typography-800' : 'text-typography-100'} font-inter-regular text-sm`}>
                {" "}%
              </Text>
            </View>
          );
        })}

        {/* ── Bara segmentată ── */}
        <View
          className="flex-row rounded-full overflow-hidden mt-1"
          style={{ height: 5 }}
        >
          {sorted.map((item, index) => {
            const percent = grandTotal > 0 ? (item.totalAmount / grandTotal) * 100 : 0;
            const color = getColor(item.categoryName, index);
            const isLast = index === sorted.length - 1;

            return (
              <View
                key={item.categoryName}
                style={{
                  flex: percent,
                  backgroundColor: color,
                  marginRight: isLast ? 0 : 1,
                }}
              />
            );
          })}
        </View>

      </View>
    </View>
  );
}
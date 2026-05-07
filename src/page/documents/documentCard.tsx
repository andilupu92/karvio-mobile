import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { ICON_MAP } from "@/src/constants/iconMap";
import formatExpiryLabel from "@/src/utils/formatExpiryLabel";

type Document = {
  id: number;
  documentTypeId: number;
  documentTypeName: string,
  documentTypeIconName: string,
  expiryDate: Date,
  daysRemaining: number;
  carName?: string;
};

interface Props {
  document: Document;
  onPress: (doc: Document) => void;
}

export default function DocumentCard({ document, onPress }: Props) {
  const IconComponent = ICON_MAP[document.documentTypeIconName];
  const fill = getProgressFill(document.daysRemaining);
 
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onPress(document)}
      className="bg-white rounded-2xl mx-4 mb-3 px-4 py-4">
      {/* Top row: icon + name + chevron */}
      <View className="flex-row items-center">
        {/* Icon */}
        <View
          className="w-11 h-11 bg-background-500 rounded-xl items-center justify-center mr-3">
          <IconComponent size={22} color="#0a4f67" strokeWidth={1.6} />
        </View>
 
        {/* Text block */}
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-0.5">
            <Text className="text-typography-100 font-inter-semibold text-sm">
              {document.documentTypeName}
            </Text>
            {document.carName && (
              <View className="bg-gray-100 rounded-md px-2 py-0.5 ml-auto mr-2">
                <Text className="font-inter-medium text-typography-300 text-xs">
                  {document.carName}
                </Text>
              </View>
            )}
          </View>
          <Text className={`font-inter-medium text-xs ${getColor(document.daysRemaining)}`}
                numberOfLines={1}
          >
            {formatExpiryLabel(document.daysRemaining, document.expiryDate)}
          </Text>
        </View>
 
        {/* Chevron */}
        <ChevronRight size={16} color="#d1d5db" strokeWidth={2} />
      </View>
 
      {/* Progress bar */}
      <View className="mt-3 h-1 rounded-full bg-gray-100 overflow-hidden">
        <View
          className={`h-full rounded-full ${getBackgroundColor(document.daysRemaining)}`}
          style={{
            width: `${Math.round(fill * 100)}%`,
          }}
        />
      </View>
    </TouchableOpacity>
  );
}

const getColor = (daysRemaining: number) => {
    if (daysRemaining <= 3) return "text-error-100";
    if (daysRemaining <= 10) return "text-warning-50";
    return "text-success-50";
};

const getBackgroundColor = (daysRemaining: number) => {
    if (daysRemaining <= 3) return "bg-error-100";
    if (daysRemaining <= 10) return "bg-warning-50";
    return "bg-success-50";
};

const getProgressFill = (days: number) => {
  const MAX_DAYS = 365;
  return Math.min(Math.max((MAX_DAYS - days) / MAX_DAYS, 0.04), 1);
};
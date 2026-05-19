import { View, Text, TouchableOpacity } from "react-native";
import { ICON_MAP } from "@/src/constants/iconMap";
import formatExpiryLabel from "@/src/utils/formatExpiryLabel";
import { useTheme } from "@/src/context/themeContext";
import * as Icons from "lucide-react-native";

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
  const { isDark } = useTheme();
 
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onPress(document)}
      className={`${ isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100' } border rounded-xl mx-4 mb-3 px-4 py-4`}>
      {/* Top row: icon + name + chevron */}
      <View className="flex-row items-center">
        {/* Icon */}
        <View
          className={`w-11 h-11 ${ isDark ? 'bg-background-icon-900' : 'bg-background-icon-100' } rounded-xl items-center justify-center mr-3`}>
          <IconComponent 
                    className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
                    size={20} 
                    strokeWidth={1.6} 
                  />
        </View>
 
        {/* Text block */}
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-0.5">
            <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-semibold text-sm mb-0.5`}>
              {document.documentTypeName}
            </Text>
            {document.carName && (
              <View className={`rounded-md px-2 py-0.5 ml-auto mr-2 ${ isDark ? 'text-typography-800' : 'text-typography-200'}`}>
                <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-medium text-typography-300 text-xs`}>
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
        <Icons.ChevronRight 
                                    className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                                    size={16} 
                                    strokeWidth={2} 
                                  />
      </View>
 
      {/* Progress bar */}
      <View className={`${ isDark ? 'bg-background-icon-900' : 'bg-background-icon-100'} mt-3 h-[3px] rounded-full overflow-hidden`}>
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
    if (daysRemaining <= 3) return "text-error-50";
    if (daysRemaining <= 10) return "text-warning-50";
    return "text-success-50";
  };

const getBackgroundColor = (daysRemaining: number) => {
    if (daysRemaining <= 3) return "bg-error-50";
    if (daysRemaining <= 10) return "bg-warning-50";
    return "bg-success-50";
};

const getProgressFill = (days: number) => {
  const MAX_DAYS = 365;
  return Math.min(Math.max((MAX_DAYS - days) / MAX_DAYS, 0.04), 1);
};
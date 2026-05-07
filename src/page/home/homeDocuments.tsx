import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { ChevronRight } from "lucide-react-native";
import { ICON_MAP } from "@/src/constants/iconMap";
import formatDate from "@/src/utils/formatDate";

type DocumentItem = {
  id: number;
  documentTypeId: number;
  documentTypeName: string,
  documentTypeIconName: string,
  expiryDate: Date,
  daysRemaining: number;
};

type Props = {
  documents: DocumentItem[];
  onDocumentPress?: (doc: DocumentItem) => void;
};

export default function HomeDocuments({
  documents,
  onDocumentPress,
}: Props) {

  const getColor = (daysRemaining: number) => {
    if (daysRemaining <= 3) return "text-error-100";
    if (daysRemaining <= 10) return "text-warning-50";
    return "text-success-50";
  };

  return (
    <Box className="px-4 mb-4">

      {/* Card */}
      <Box className="bg-primary-0 rounded-2xl overflow-hidden">
        {documents.map((doc, index) => {
          const IconComponent = ICON_MAP[doc.documentTypeIconName];
          const isLast = index === documents.length - 1;

          return (
            <TouchableOpacity
              key={doc.id}
              onPress={() => onDocumentPress?.(doc)}
              activeOpacity={0.7}
            >
              <View
                className="bg-primary-0 flex-row items-center px-4 py-4">
                {/* Icon */}
                <View className="bg-background-500 rounded-xl w-[42px] h-[42px] items-center justify-center mr-3">
                  <IconComponent size={20} color="#0a4f67" strokeWidth={1.6} />
                </View>

                {/* Text */}
                <View className="flex-1">
                  <Text className="text-typography-100 font-inter-semibold text-sm mb-0.5">
                    {doc.documentTypeName}
                  </Text>
                  <Text className={`font-inter-medium text-xs ${getColor(doc.daysRemaining)}`}>
                    {formatExpiryLabel(doc.daysRemaining, doc.expiryDate)}
                  </Text>
                </View>

                {/* Chevron */}
                <ChevronRight size={16} color="#d1d5db" strokeWidth={2} />
              </View>

              {!isLast && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: "#f0f1f4",
                    marginHorizontal: 16,
                  }}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </Box>
    </Box>
  );
}

const formatExpiryLabel = (days: number, expiryDate: Date): string => {
  const formatted = formatDate(expiryDate.toString());
 
  if (days < 0) return `Expirat la ${formatted}`;
  if (days == 0) return `Expiră astăzi - ${formatted}`;
  if (days <= 10) return `Expiră în ${days} zile - ${formatted}`;
  if (days <= 30) return `Expiră în ${days} zile - ${formatted}`;
  return `Valabil până la ${formatted}`;
};
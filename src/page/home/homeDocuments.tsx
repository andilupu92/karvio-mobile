import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { ICON_MAP } from "@/src/constants/iconMap";
import { useTheme } from "@/src/context/themeContext";
import formatExpiryLabel from "@/src/utils/formatExpiryLabel";
import { Icons } from "@/src/utils/icons";

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

  const { isDark } = useTheme();
  
  const getColor = (daysRemaining: number) => {
    if (daysRemaining <= 3) return "text-error-50";
    if (daysRemaining <= 10) return "text-warning-50";
    return "text-success-50";
  };

  return (
    <Box className="px-4 mb-4">

      {/* Card */}
      <Box className={`rounded-xl overflow-hidden border ${ isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100' }`}> 
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
                className="flex-row items-center px-4 py-4">
                {/* Icon */}
                <View className={`${ isDark ? 'bg-background-icon-900' : 'bg-background-icon-100' } rounded-xl w-[42px] h-[42px] items-center justify-center mr-3`}>
                  <IconComponent 
                    className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
                    size={20} 
                    strokeWidth={1.6} 
                  />
                </View>

                {/* Text */}
                <View className="flex-1">
                  <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-semibold text-sm mb-0.5`}>
                    {doc.documentTypeName}
                  </Text>
                  <Text className={`font-inter-medium text-xs ${getColor(doc.daysRemaining)}`}>
                    {formatExpiryLabel(doc.daysRemaining, doc.expiryDate)}
                  </Text>
                </View>

                {/* Chevron */}
                <Icons.ChevronRight 
                            className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                            size={16} 
                            strokeWidth={2} 
                          />
              </View>

              {!isLast && (
                <View
                  className={`${isDark ? 'bg-outline-900' : 'bg-outline-100'}`}
                  style={{
                    height: 1,
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
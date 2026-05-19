import React from "react";
import { TouchableOpacity, View, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { Text } from "@/components/ui/text";
import { Home, FileText, Plus, BarChart2, Settings } from "lucide-react-native";
import { useTheme } from "@/src/context/themeContext";
import { Icons } from "@/src/utils/icons";

type TabName = "Home" | "Documents" | "Expenses" | "Settings";

const TABS = [
  { name: "Home" as TabName,      icon: Home,       label: "Acasă" },
  { name: "Documents" as TabName, icon: FileText,   label: "Documente" },
  { name: "Expenses" as TabName,     icon: BarChart2,  label: "Cheltuieli" },
  { name: "Settings" as TabName,  icon: Settings,   label: "Setări" },
];

interface HomeMenuProps {
  activeTab?: TabName;
  onTabPress?: (tab: TabName) => void;
  onAddPress?: () => void;
}

const W = Dimensions.get("window").width;
const BAR_HEIGHT = 64; 
const FAB_SIZE = 64;     // Total width/height of the central button
const FAB_R = FAB_SIZE / 2;

const buildWavePath = (width: number, height: number) => {
  const curveHeight = 24;
  const cx = width / 2;
  
  return [
    `M 0, ${curveHeight}`,
    `C ${cx - 70}, ${curveHeight} ${cx - 35}, 0 ${cx}, 0`,      // Left side of the hill
    `C ${cx + 35}, 0 ${cx + 70}, ${curveHeight} ${width}, ${curveHeight}`, // Right side of the hill
    `L ${width}, ${height}`,
    `L 0, ${height}`,
    `Z`,
  ].join(" ");
};

export default function HomeMenu({
  activeTab = "Home",
  onTabPress,
  onAddPress,
}: HomeMenuProps) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  
  const safeBottom = insets.bottom > 0 ? insets.bottom : 16; 
  const totalH = BAR_HEIGHT + safeBottom + 24; // Base height + safe area + wave curve height
  const cx = W / 2;

  return (
    <View style={{ width: W, height: totalH, position: "absolute", bottom: 0 }}>

      {/* 1. Background Wave */}
      <Svg
        width={W}
        height={totalH}
        style={{ position: "absolute", bottom: 0, left: 0 }}
      >
        <Path d={buildWavePath(W, totalH)} fill={ isDark ? '#303234' : '#202e3b'} />
      </Svg>

      {/* 2. Floating Action Button (FAB) */}
      <View
        className="absolute top-[-15px] z-10"
        style={{
            left: cx - FAB_R,
            shadowColor: '#303234',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 8,
        }}
        >
        <TouchableOpacity
          onPress={onAddPress}
          activeOpacity={0.85}
          className={`items-center justify-center border-[6px] ${ isDark ? 'border-outline-100' : 'border-outline-50'} `}
          style={{
            width: FAB_SIZE,
            height: FAB_SIZE,
            borderRadius: FAB_R,
            backgroundColor: isDark ? '#303234' : '#202e3b',
          }}
        >
          <Icons.Plus
                      className='text-icons-900'
                      size={28} 
                      strokeWidth={2} 
                    />
        </TouchableOpacity>
      </View>

      {/* 3. Tab items wrapper */}
      <View
        className="flex-row items-center mt-[30px]"
        style={{
            height: BAR_HEIGHT,
            paddingBottom: safeBottom - 16,
        }}
      >
        {TABS.map((tab, index) => {
          const isActive = activeTab === tab.name;
          const Icon = tab.icon;

          return (
            <React.Fragment key={tab.name}>
              {/* Insert exact gap for the FAB in the middle */}
              {index === 2 && (
                <View style={{ width: FAB_SIZE - 10 }} />
              )}

              <TouchableOpacity
                onPress={() => onTabPress?.(tab.name)}
                activeOpacity={0.7}
                className="flex-1 items-center justify-center"
              >
                <Icon
                  className={`${ isActive ? 'text-icons-900' : 'text-icons-200'}`}
                  size={26} 
                  strokeWidth={isActive ? 2.5 : 1.5} 
                />
                <Text
                  className={`text-[11px] mt-1 ${isActive ? 'font-inter-semibold text-typography-900' : 'font-inter-medium text-typography-800'}`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}
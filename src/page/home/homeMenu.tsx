import React from "react";
import { TouchableOpacity, View, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { Text } from "@/components/ui/text";
import { Home, FileText, Plus, BarChart2, Settings, X } from "lucide-react-native";

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
  
  const safeBottom = insets.bottom > 0 ? insets.bottom : 16; 
  const totalH = BAR_HEIGHT + safeBottom + 24; // Base height + safe area + wave curve height
  const cx = W / 2;

  const THEME = {
    primary: "#0a4f67", // Dark teal for active states and FAB
    inactive: "#9dabb1", // Cool gray for inactive tabs
    bg: "#d9edfc"
  };

  return (
    <View style={{ width: W, height: totalH, position: "absolute", bottom: 0 }}>

      {/* 1. Background Wave */}
      <Svg
        width={W}
        height={totalH}
        style={{ position: "absolute", bottom: 0, left: 0 }}
      >
        <Path d={buildWavePath(W, totalH)} fill={THEME.bg} />
      </Svg>

      {/* 2. Floating Action Button (FAB) */}
      <View
        className="absolute top-[-15px] z-10"
        style={{
            left: cx - FAB_R,
            shadowColor: THEME.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 8,
        }}
        >
        <TouchableOpacity
          onPress={onAddPress}
          activeOpacity={0.85}
          className="items-center justify-center border-[6px] border-white"
          style={{
            width: FAB_SIZE,
            height: FAB_SIZE,
            borderRadius: FAB_R,
            backgroundColor: THEME.primary,
          }}
        >
          <Plus size={28} color="#FFFFFF" strokeWidth={2} />
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
          const iconColor = isActive ? THEME.primary : THEME.inactive;

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
                  size={24}
                  color={iconColor}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <Text
                  className={`text-[11px] mt-1 ${isActive ? 'font-inter-semibold' : 'font-inter-medium'}`}
                  style={{
                    color: iconColor,
                  }}
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
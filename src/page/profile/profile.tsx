import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, TouchableOpacity, View } from "react-native";
import { Icons } from "@/src/utils/icons";
import { useTheme } from "@/src/context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Box } from "@/components/ui/box";

export default function ProfileScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { isDark } = useTheme();

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
                        className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
                        size={20}
                        strokeWidth={1.6} 
                    />
                </TouchableOpacity>
                <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} text-lg font-inter-semibold text-center flex-1`}
                    style={{ marginRight: 36 }}
                >
                    Profil
                </Text>
            </View>

            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                enableOnAndroid
                extraScrollHeight={20}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Box className={`flex-1 ${ isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'} px-6 py-2 gap-4`}>
                    <View className={`${ isDark ? 'bg-background-icon-900' : 'bg-background-icon-100' } self-center w-32 h-32 rounded-full items-center justify-center mb-5`}>
                        <Icons.CircleUser 
                                                    className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                                                    size={60} 
                                                    strokeWidth={1.6} 
                                                />
                    </View>

                    <View className={`${ isDark ? 'text-typography-800' : 'text-typography-200'} font-inter-medium text-sm items-center justify-center`}>
                            <Text className="italic">andilupu92@gmail.com</Text>
                        </View>

                    <View className={`${ isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100' } border rounded-xl overflow-hidden mt-1`}>
                            <View className="flex-row items-center px-4 py-4">
                                <View className={`${ isDark ? 'bg-background-icon-900' : 'bg-background-icon-100' } w-10 h-10 rounded-xl items-center justify-center mr-3`}>
                                    <Icons.Shield 
                                        className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
                                        size={18} 
                                        strokeWidth={1.8} 
                                    />
                                </View>
                                <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} flex-1 font-inter-medium text-base`}>
                                    Documente personale
                                </Text>
                                <Icons.ChevronRight 
                                    className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                                    size={16} 
                                    strokeWidth={2} 
                                />
                            </View>
                            <View
                                className={`${isDark ? 'bg-outline-900' : 'bg-outline-100'}`}
                                style={{
                                    height: 1,
                                    marginHorizontal: 16,
                                }}
                            />
                            <View className="flex-row items-center px-4 py-4">
                                <View className={`${ isDark ? 'bg-background-icon-900' : 'bg-background-icon-100' } w-10 h-10 rounded-xl items-center justify-center mr-3`}>
                                    <Icons.Bell
                                        className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
                                        size={18} 
                                        strokeWidth={1.8} 
                                    />
                                </View>
                                <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} flex-1 font-inter-medium text-base`}>
                                    Notificari
                                </Text>
                                <Icons.ChevronRight 
                                    className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                                    size={16} 
                                    strokeWidth={2} 
                                />
                            </View>
                        </View>

                        <View className={`${ isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100' } border rounded-xl overflow-hidden mt-1`}>
                            <View className="flex-row items-center px-4 py-4">
                                <View className={`${ isDark ? 'bg-background-icon-900' : 'bg-background-icon-100' } w-10 h-10 rounded-xl items-center justify-center mr-3`}>
                                    <Icons.Bug 
                                        className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
                                        size={18} 
                                        strokeWidth={1.8} 
                                    />
                                </View>
                                <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} flex-1 font-inter-medium text-base`}>
                                    Raportează un bug
                                </Text>
                                <Icons.ChevronRight 
                                    className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                                    size={16} 
                                    strokeWidth={2} 
                                />
                            </View>
                            <View
                                className={`${isDark ? 'bg-outline-900' : 'bg-outline-100'}`}
                                style={{
                                    height: 1,
                                    marginHorizontal: 16,
                                }}
                            />
                            <View className="flex-row items-center px-4 py-4">
                                <View className={`${ isDark ? 'bg-background-icon-900' : 'bg-background-icon-100' } w-10 h-10 rounded-xl items-center justify-center mr-3`}>
                                    <Icons.MessageSquare
                                        className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
                                        size={18} 
                                        strokeWidth={1.8} 
                                    />
                                </View>
                                <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} flex-1 font-inter-medium text-base`}>
                                    Trimite feedback
                                </Text>
                                <Icons.ChevronRight 
                                    className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                                    size={16} 
                                    strokeWidth={2} 
                                />
                            </View>
                        </View>

                        <View className={`${ isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100' } border rounded-xl overflow-hidden mt-1`}>
                            <View className="flex-row items-center px-4 py-4">
                                <View className={`${ isDark ? 'bg-background-icon-900' : 'bg-background-icon-100' } w-10 h-10 rounded-xl items-center justify-center mr-3`}>
                                    <Icons.Mail 
                                        className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
                                        size={18} 
                                        strokeWidth={1.8} 
                                    />
                                </View>
                                <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} flex-1 font-inter-medium text-base`}>
                                    Contactează-ne
                                </Text>
                                <Icons.ChevronRight 
                                    className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                                    size={16} 
                                    strokeWidth={2} 
                                />
                            </View>
                            <View
                                className={`${isDark ? 'bg-outline-900' : 'bg-outline-100'}`}
                                style={{
                                    height: 1,
                                    marginHorizontal: 16,
                                }}
                            />
                            <View className="flex-row items-center px-4 py-4">
                                <View className={`${ isDark ? 'bg-background-icon-900' : 'bg-background-icon-100' } w-10 h-10 rounded-xl items-center justify-center mr-3`}>
                                    <Icons.Info
                                        className={`${ isDark ? 'text-icons-900' : 'text-icons-100'}`}
                                        size={18} 
                                        strokeWidth={1.8} 
                                    />
                                </View>
                                <Text className={`${ isDark ? 'text-typography-900' : 'text-typography-100'} flex-1 font-inter-medium text-base`}>
                                    Despre aplicație
                                </Text>
                                <Icons.ChevronRight 
                                    className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                                    size={16} 
                                    strokeWidth={2} 
                                />
                            </View>
                        </View>

                        <View className={`${ isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100' } border rounded-xl overflow-hidden mt-1`}>
                            <View className="flex-row items-center px-4 py-4">
                                <View className={`${ isDark ? 'bg-background-icon-900' : 'bg-error-0' } w-10 h-10 rounded-xl items-center justify-center mr-3`}>
                                    <Icons.LogOut 
                                        className="text-error-50"
                                        size={18} 
                                        strokeWidth={1.8} 
                                    />
                                </View>
                                <Text className={`text-error-50 flex-1 font-inter-medium text-base`}>
                                    Deloghează-te
                                </Text>
                                <Icons.ChevronRight 
                                    className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                                    size={16} 
                                    strokeWidth={2} 
                                />
                            </View>
                            <View
                                className={`${isDark ? 'bg-outline-900' : 'bg-outline-100'}`}
                                style={{
                                    height: 1,
                                    marginHorizontal: 16,
                                }}
                            />
                            <View className="flex-row items-center px-4 py-4">
                                <View className={`${ isDark ? 'bg-background-icon-900' : 'bg-error-0' } w-10 h-10 rounded-xl items-center justify-center mr-3`}>
                                    <Icons.Trash2
                                        className="text-error-50"
                                        size={18} 
                                        strokeWidth={1.8} 
                                    />
                                </View>
                                <Text className={`text-error-50 flex-1 font-inter-bold text-base`}>
                                    Șterge contul
                                </Text>
                                <Icons.ChevronRight 
                                    className={`${ isDark ? 'text-typography-800' : 'text-typography-200'}`}
                                    size={16} 
                                    strokeWidth={2} 
                                />
                            </View>
                        </View>
                </Box>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, TouchableOpacity, View, Linking } from 'react-native';
import { Icons } from '@/src/utils/icons';
import { useTheme } from '@/src/context/themeContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/src/navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Box } from '@/components/ui/box';

const CONTACT_EMAIL = 'support@mygarage.ro';
const CONTACT_PHONE = '+40 743 222 774';
const CONTACT_WHATSAPP = '+40 743 222 774';

export default function ContactUsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isDark } = useTheme();

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${CONTACT_EMAIL}`);
  };

  const handlePhonePress = () => {
    Linking.openURL(`tel:${CONTACT_PHONE.replace(/\s/g, '')}`);
  };

  const handleWhatsAppPress = () => {
    const number = CONTACT_WHATSAPP.replace(/\s/g, '').replace('+', '');
    Linking.openURL(`https://wa.me/${number}`);
};

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'}`}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* ── Header ── */}
      <View className="flex-row items-center px-6 pt-2 pb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className={`w-10 h-10 ${
            isDark ? 'bg-background-card-900' : 'bg-background-card-100'
          } rounded-full items-center justify-center`}
          activeOpacity={0.7}
        >
          <Icons.ChevronLeft
            className={`${isDark ? 'text-icons-900' : 'text-icons-100'}`}
            size={20}
            strokeWidth={1.6}
          />
        </TouchableOpacity>
        <Text
          className={`${
            isDark ? 'text-typography-900' : 'text-typography-100'
          } text-lg font-inter-semibold text-center flex-1`}
          style={{ marginRight: 36 }}
        >
          Contact Us
        </Text>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Box
          className={`flex-1 ${
            isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'
          } px-6 py-4 gap-6`}
        >
          {/* ── Hero Section ── */}
          <View className="items-center gap-4 mt-2">
            {/* Icon container */}
            <View
              className={`${
                isDark ? 'bg-background-icon-900' : 'bg-background-icon-100'
              } w-24 h-24 rounded-full items-center justify-center`}
            >
              <Icons.Headphones
                className={`${isDark ? 'text-icons-900' : 'text-icons-100'}`}
                size={40}
                strokeWidth={1.5}
              />
            </View>

            {/* Title */}
            <Text
              className={`${
                isDark ? 'text-typography-900' : 'text-typography-100'
              } font-inter-bold text-2xl text-center`}
            >
              Suntem aici pentru tine
            </Text>

            {/* Description */}
            <Text
              className={`${
                isDark ? 'text-typography-800' : 'text-typography-200'
              } font-inter-regular text-sm text-center leading-6`}
            >
              Aici cateva detalii despre noi. Echipa noastra este pregatita sa va ajute cu orice
              intrebare sau nelamurire legata de aplicatia noastra.
            </Text>
          </View>

          {/* ── Contact Cards ── */}
          <View
            className={`${
              isDark
                ? 'bg-background-card-900 border-outline-900'
                : 'bg-background-card-100 border-outline-100'
            } border rounded-xl overflow-hidden mt-2`}
          >
            {/* Email */}
            <TouchableOpacity onPress={handleEmailPress} activeOpacity={0.7}>
              <View className="flex-row items-center px-4 py-4 gap-3">
                <View
                  className={`${
                    isDark ? 'bg-background-icon-900' : 'bg-background-icon-100'
                  } w-10 h-10 rounded-xl items-center justify-center`}
                >
                  <Icons.Mail
                    className={`${isDark ? 'text-icons-900' : 'text-icons-100'}`}
                    size={18}
                    strokeWidth={1.8}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className={`${
                      isDark ? 'text-typography-800' : 'text-typography-300'
                    } font-inter-regular text-xs mb-0.5`}
                  >
                    Email suport
                  </Text>
                  <Text
                    className={`${
                      isDark ? 'text-typography-900' : 'text-typography-100'
                    } font-inter-semibold text-sm`}
                  >
                    {CONTACT_EMAIL}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <View
              className={`${isDark ? 'bg-outline-900' : 'bg-outline-100'}`}
              style={{ height: 1, marginHorizontal: 16 }}
            />

            {/* Phone */}
            <TouchableOpacity onPress={handlePhonePress} activeOpacity={0.7}>
              <View className="flex-row items-center px-4 py-4 gap-3">
                <View
                  className={`${
                    isDark ? 'bg-background-icon-900' : 'bg-background-icon-100'
                  } w-10 h-10 rounded-xl items-center justify-center`}
                >
                  <Icons.Phone
                    className={`${isDark ? 'text-icons-900' : 'text-icons-100'}`}
                    size={18}
                    strokeWidth={1.8}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className={`${
                      isDark ? 'text-typography-800' : 'text-typography-300'
                    } font-inter-regular text-xs mb-0.5`}
                  >
                    Telefon (L-V, 09:00 - 18:00)
                  </Text>
                  <Text
                    className={`${
                      isDark ? 'text-typography-900' : 'text-typography-100'
                    } font-inter-semibold text-sm`}
                  >
                    {CONTACT_PHONE}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <View
              className={`${isDark ? 'bg-outline-900' : 'bg-outline-100'}`}
              style={{ height: 1, marginHorizontal: 16 }}
            />

            {/* WhatsApp */}
            <TouchableOpacity onPress={handleWhatsAppPress} activeOpacity={0.7}>
              <View className="flex-row items-center px-4 py-4 gap-3">
                <View
                  className={`${
                    isDark ? 'bg-background-icon-900' : 'bg-background-icon-100'
                  } w-10 h-10 rounded-xl items-center justify-center`}
                >
                  <Icons.MessageCircle
                    className={`${isDark ? 'text-icons-900' : 'text-icons-100'}`}
                    size={18}
                    strokeWidth={1.8}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className={`${
                      isDark ? 'text-typography-800' : 'text-typography-300'
                    } font-inter-regular text-xs mb-0.5`}
                  >
                    WhatsApp (L-V, 09:00 - 18:00)
                  </Text>
                  <Text
                    className={`${
                      isDark ? 'text-typography-900' : 'text-typography-100'
                    } font-inter-semibold text-sm`}
                  >
                    {CONTACT_WHATSAPP}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </Box>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, TouchableOpacity, View } from 'react-native';
import { Icons } from '@/src/utils/icons';
import { useTheme } from '@/src/context/themeContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/src/navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Box } from '@/components/ui/box';

const APP_VERSION = '1.0.0';

interface Feature {
  id: string;
  icon: keyof typeof import('@/src/utils/icons').Icons;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    id: '1',
    icon: 'Car',
    title: 'Garaj virtual',
    description: 'Adaugă oricâte mașini dorești și gestionează-le pe toate dintr-un singur loc.',
  },
  {
    id: '2',
    icon: 'FileText',
    title: 'Documente la un tap distanță',
    description:
      'Stochează documentele mașinii tale și fii mereu informat cu privire la data expirării lor.',
  },
  {
    id: '3',
    icon: 'Bell',
    title: 'Notificări inteligente',
    description:
      'Primești alerte din timp înainte ca un document să expire, astfel încât să nu fii luat prin surprindere.',
  },
  {
    id: '4',
    icon: 'Wallet',
    title: 'Urmărire cheltuieli',
    description:
      'Înregistrează cheltuielile fiecărei mașini și compară-le cu lunile sau anii anteriori pentru o imagine clară a costurilor.',
  },
  {
    id: '5',
    icon: 'Fuel',
    title: 'Monitorizare consum',
    description:
      'Urmărește consumul de combustibil al mașinii tale și observă tendințele în timp.',
  },
  {
    id: '6',
    icon: 'Star',
    title: 'Scorul mașinii',
    description:
      'Primești un scor general al mașinii tale calculat în funcție de consum și media cheltuielilor lunare.',
  },
  {
    id: '7',
    icon: 'Shield',
    title: 'Documente personale',
    description:
      'Gestionează documentele tale personale în siguranță, separat de documentele vehiculelor.',
  },
];

export default function AboutAppScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isDark } = useTheme();

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
          Despre aplicație
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
          {/* ── App Identity ── */}
          <View className="items-center gap-3 mt-2">
            <View
              className={`${
                isDark ? 'bg-background-icon-900' : 'bg-background-icon-100'
              } w-24 h-24 rounded-full items-center justify-center`}
            >
              <Icons.Car
                className={`${isDark ? 'text-icons-900' : 'text-icons-100'}`}
                size={42}
                strokeWidth={1.5}
              />
            </View>

            <View className="items-center gap-1">
              <Text
                className={`${
                  isDark ? 'text-typography-900' : 'text-typography-100'
                } font-inter-bold text-2xl`}
              >
                Karvio
              </Text>
              <Text
                className={`${
                  isDark ? 'text-typography-800' : 'text-typography-300'
                } italic font-inter-regular text-xs`}
              >
                Versiunea {APP_VERSION}
              </Text>
            </View>

            <Text
              className={`${
                isDark ? 'text-typography-800' : 'text-typography-200'
              } font-inter-regular text-sm text-center leading-6`}
            >
              Tot ce ai nevoie pentru a-ți gestiona mașina — documente, cheltuieli și consum —
              într-o singură aplicație simplă și intuitivă.
            </Text>
          </View>

          {/* ── Features ── */}
          <View
            className={`${
              isDark
                ? 'bg-background-card-900 border-outline-900'
                : 'bg-background-card-100 border-outline-100'
            } border rounded-xl overflow-hidden`}
          >
            {FEATURES.map((feature, index) => {
              const IconComponent = Icons[feature.icon as keyof typeof Icons] as React.ComponentType<{
                className?: string;
                size?: number;
                strokeWidth?: number;
              }>;

              return (
                <View key={feature.id}>
                  <View className="flex-row items-start px-4 py-4 gap-3">
                    <View
                      className={`${
                        isDark ? 'bg-background-icon-900' : 'bg-background-icon-100'
                      } w-10 h-10 rounded-xl items-center justify-center mt-0.5`}
                    >
                      <IconComponent
                        className={`${isDark ? 'text-icons-900' : 'text-icons-100'}`}
                        size={18}
                        strokeWidth={1.8}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className={`${
                          isDark ? 'text-typography-900' : 'text-typography-100'
                        } font-inter-semibold text-sm mb-1`}
                      >
                        {feature.title}
                      </Text>
                      <Text
                        className={`${
                          isDark ? 'text-typography-800' : 'text-typography-200'
                        } font-inter-regular text-xs leading-5`}
                      >
                        {feature.description}
                      </Text>
                    </View>
                  </View>
                  {index < FEATURES.length - 1 && (
                    <View
                      className={`${isDark ? 'bg-outline-900' : 'bg-outline-100'}`}
                      style={{ height: 1, marginHorizontal: 16 }}
                    />
                  )}
                </View>
              );
            })}
          </View>

          {/* ── Footer ── */}
          <View className="items-center pb-4">
            <Text
              className={`${
                isDark ? 'text-typography-800' : 'text-typography-300'
              } font-inter-regular text-xs text-center`}
            >
              © {new Date().getFullYear()} Karvio. Toate drepturile rezervate.
            </Text>
          </View>
        </Box>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
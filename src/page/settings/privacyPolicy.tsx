import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, TouchableOpacity, View, ScrollView } from 'react-native';
import { Icons } from '@/src/utils/icons';
import { useTheme } from '@/src/context/themeContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/src/navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { Box } from '@/components/ui/box';

export default function PrivacyPolicyScreen() {
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
          Politica de Confidențialitate
        </Text>
      </View>

      {/* ── Conținut ── */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="px-6 py-4"
      >
        <Box className="gap-6 pb-10">
          <Text className={`${isDark ? 'text-typography-800' : 'text-typography-200'} font-inter-regular text-xs`}>
            Ultima actualizare: Iunie 2026
          </Text>

          <View className="gap-2">
            <Text className={`${isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-semibold text-base`}>
              1. Datele pe care le colectăm
            </Text>
            <Text className={`${isDark ? 'text-typography-800' : 'text-typography-200'} font-inter-regular text-sm leading-6`}>
              Pentru a-ți oferi o experiență completă de management auto, aplicația colectează următoarele date introduse de tine: datele contului (email), informații despre vehicul (marcă, model, an), detalii despre documente (scadențe RCA, ITP, Rovinietă), cheltuieli logate și istoricul de alimentare pentru calculul consumului.
            </Text>
          </View>

          <View className="gap-2">
            <Text className={`${isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-semibold text-base`}>
              2. Cum utilizăm datele tale
            </Text>
            <Text className={`${isDark ? 'text-typography-800' : 'text-typography-200'} font-inter-regular text-sm leading-6`}>
              Datele colectate sunt folosite exclusiv pentru: personalizarea contului tău, generarea statisticilor financiare și a graficelor de consum, calcularea algoritmului de „Health Score” al mașinii și trimiterea alertelor/notificărilor de expirare a documentelor.
            </Text>
          </View>

          <View className="gap-2">
            <Text className={`${isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-semibold text-base`}>
              3. Partajarea datelor cu terți
            </Text>
            <Text className={`${isDark ? 'text-typography-800' : 'text-typography-200'} font-inter-regular text-sm leading-6`}>
              Îți respectăm intimitatea. Nu vindem, nu închiriem și nu partajăm datele mașinii tale sau informațiile tale financiare cu companii de asigurări, dealeri auto sau alte terțe părți în scopuri de marketing fără acordul tău explicit.
            </Text>
          </View>

          <View className="gap-2">
            <Text className={`${isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-semibold text-base`}>
              4. Ștergerea contului și GDPR
            </Text>
            <Text className={`${isDark ? 'text-typography-800' : 'text-typography-200'} font-inter-regular text-sm leading-6`}>
              Conform normelor GDPR, ai dreptul de a accesa, modifica sau șterge definitiv datele tale. Poți șterge complet contul direct din secțiunea „Profil” a aplicației apăsând pe opțiunea de ștergere cont, moment în care toate datele mașinilor,documentelor și cheltuielilor tale vor fi eliminate definitiv de pe serverele noastre.
            </Text>
          </View>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, TouchableOpacity, View, ScrollView } from 'react-native';
import { Icons } from '@/src/utils/icons';
import { useTheme } from '@/src/context/themeContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/src/navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { Box } from '@/components/ui/box';

export default function TermsAndConditionsScreen() {
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
          Termeni și Condiții
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
              1. Acceptarea termenilor
            </Text>
            <Text className={`${isDark ? 'text-typography-800' : 'text-typography-200'} font-inter-regular text-sm leading-6`}>
              Prin crearea unui cont și utilizarea acestei aplicații, ești de acord să respecți acești Termeni și Condiții. Dacă nu ești de acord cu oricare dintre aceste reguli, te rugăm să nu folosești serviciile noastre.
            </Text>
          </View>

          <View className="gap-2">
            <Text className={`${isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-semibold text-base`}>
              2. Exonerare de răspundere (Health Score)
            </Text>
            <Text className={`${isDark ? 'text-typography-800' : 'text-typography-200'} font-inter-regular text-sm leading-6`}>
              Funcționalitatea de „Health Score” (Scor de Sănătate) și estimările de consum de combustibil sunt generate algoritmic pe baza datelor pe care le introduci manual. Acestea au un caracter pur **informativ și estimativ**. Aplicația NU înlocuiește o diagnoză tehnică profesională, o inspecție periodică sau expertiza unui mecanic într-un service auto autorizat. Nu ne asumăm răspunderea pentru defecțiunile tehnice ale vehiculului tău.
            </Text>
          </View>

          <View className="gap-2">
            <Text className={`${isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-semibold text-base`}>
              3. Limitarea răspunderii pentru alerte și documente
            </Text>
            <Text className={`${isDark ? 'text-typography-800' : 'text-typography-200'} font-inter-regular text-sm leading-6`}>
              Deși depunem toate eforturile pentru a trimite notificări push și remindere corecte înainte de expirarea RCA-ului, ITP-ului sau Rovinietei, pot apărea erori tehnice independente de noi (lipsă semnal, setări de baterie ale sistemului de operare, erori de server). Utilizatorul poartă **întreaga responsabilitate** de a verifica periodic valabilitatea documentelor. Aplicația nu va fi trasă la răspundere pentru amenzile sau penalitățile primite de utilizator.
            </Text>
          </View>

          <View className="gap-2">
            <Text className={`${isDark ? 'text-typography-900' : 'text-typography-100'} font-inter-semibold text-base`}>
              4. Utilizarea corectă a aplicației
            </Text>
            <Text className={`${isDark ? 'text-typography-800' : 'text-typography-200'} font-inter-regular text-sm leading-6`}>
              Te angajezi să introduci date reale și corecte în aplicație și să nu folosești platforma în scopuri frauduloase sau pentru a perturba buna funcționare a serverelor. Ne rezervăm dreptul de a suspenda conturile care încalcă bunele practici de utilizare.
            </Text>
          </View>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, TouchableOpacity, View, ScrollView } from 'react-native';
import { Icons } from '@/src/utils/icons';
import { useTheme } from '@/src/context/themeContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/src/navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { Box } from '@/components/ui/box';

type NotificationType = 'rca' | 'revizie' | 'document' | 'cheltuiala' | 'masina';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'rca',
    title: 'Asigurare RCA expira',
    description: 'Asigurarea RCA pentru Audi A5 expira in 10 zile. Reinnoieste documentul.',
    time: '2h',
    isRead: false,
  },
  {
    id: '2',
    type: 'revizie',
    title: 'Revizie tehnica',
    description: 'Ai depasit cu 500 km limita pentru revizia tehnica la Audi A5.',
    time: '5h',
    isRead: false,
  },
  {
    id: '3',
    type: 'document',
    title: 'Document adaugat',
    description: 'Polita CASCO a fost salvata cu succes in documentele masinii.',
    time: '1 zi',
    isRead: false,
  },
  {
    id: '4',
    type: 'cheltuiala',
    title: 'Cheltuiala inregistrata',
    description: 'Plata pentru "Combustibil" in valoare de 450 RON a fost adaugata.',
    time: '2 zile',
    isRead: true,
  },
  {
    id: '5',
    type: 'masina',
    title: 'Masina noua adaugata',
    description: 'Ai adaugat cu succes Audi A5 in garajul tau virtual.',
    time: '1 sapt.',
    isRead: true,
  },
];

function NotificationIcon({
  type,
  isRead,
  isDark,
}: {
  type: NotificationType;
  isRead: boolean;
  isDark: boolean;
}) {
  const iconSize = 20;
  const iconStroke = 1.8;

  if (isRead) {
    return (
      <View
        className={`w-11 h-11 rounded-xl items-center justify-center ${
          isDark ? 'bg-background-icon-900' : 'bg-background-icon-100'
        }`}
      >
        {type === 'cheltuiala' ? (
          <Icons.CircleCheck
            className={`${isDark ? 'text-typography-800' : 'text-typography-300'}`}
            size={iconSize}
            strokeWidth={iconStroke}
          />
        ) : (
          <Icons.Car
            className={`${isDark ? 'text-typography-800' : 'text-typography-300'}`}
            size={iconSize}
            strokeWidth={iconStroke}
          />
        )}
      </View>
    );
  }

  switch (type) {
    case 'rca':
      return (
        <View className="w-11 h-11 rounded-xl items-center justify-center bg-amber-100">
          <Icons.Shield className="text-amber-500" size={iconSize} strokeWidth={iconStroke} />
        </View>
      );
    case 'revizie':
      return (
        <View className="w-11 h-11 rounded-xl items-center justify-center bg-rose-100">
          <Icons.Wrench className="text-rose-400" size={iconSize} strokeWidth={iconStroke} />
        </View>
      );
    case 'document':
      return (
        <View className="w-11 h-11 rounded-xl items-center justify-center bg-blue-100">
          <Icons.FileText className="text-blue-100" size={iconSize} strokeWidth={iconStroke} />
        </View>
      );
    default:
      return null;
  }
}

function NotificationCard({
  notification,
  isDark,
}: {
  notification: Notification;
  isDark: boolean;
}) {
  return (
    <TouchableOpacity activeOpacity={0.7}>
      <View
        className={`${
          isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100'
        } border rounded-xl px-4 py-4 flex-row items-start gap-3`}
      >
        {/* Icon */}
        <NotificationIcon type={notification.type} isRead={notification.isRead} isDark={isDark} />

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text
              className={`font-inter-semibold text-base flex-1 mr-2 ${
                notification.isRead
                  ? isDark
                    ? 'text-typography-800'
                    : 'text-typography-300'
                  : isDark
                  ? 'text-typography-900'
                  : 'text-typography-100'
              }`}
              numberOfLines={1}
            >
              {notification.title}
            </Text>

            <View className="flex-row items-center gap-1">
              <Text
                className={`font-inter-regular text-xs ${
                  isDark ? 'text-typography-800' : 'text-typography-300'
                }`}
              >
                {notification.time}
              </Text>
              {!notification.isRead && (
                <View className="w-2 h-2 rounded-full bg-error-50" />
              )}
            </View>
          </View>

          <Text
            className={`font-inter-regular text-sm leading-5 ${
              notification.isRead
                ? isDark
                  ? 'text-typography-800'
                  : 'text-typography-300'
                : isDark
                ? 'text-typography-800'
                : 'text-typography-200'
            }`}
          >
            {notification.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
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
          Notificari
        </Text>
      </View>

      {/* ── List ── */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Box
          className={`flex-1 ${
            isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'
          } px-6 py-2 gap-3`}
        >
          {NOTIFICATIONS.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              isDark={isDark}
            />
          ))}
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
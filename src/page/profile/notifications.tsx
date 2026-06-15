import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';
import { Icons } from '@/src/utils/icons';
import { useTheme } from '@/src/context/themeContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/src/navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { Box } from '@/components/ui/box';
import { useEffect, useState, useCallback } from 'react';
import { notificationApi } from '@/src/api/services/notifService';



interface Notification {
  id: number;
  userId: number;
  title: string;
  body: string;
  isRead: boolean;
}

export default function NotificationsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isDark } = useTheme();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationApi.notifications();
      setNotifications(data);
    } catch (err) {
      setError('Nu am putut încărca notificările. Încearcă din nou.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

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
          Notificări
        </Text>
      </View>

      {/* ── Body ── */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={isDark ? '#fff' : '#000'} />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Text
            className={`font-inter-regular text-sm text-center ${
              isDark ? 'text-typography-800' : 'text-typography-300'
            }`}
          >
            {error}
          </Text>
          <TouchableOpacity
            onPress={fetchNotifications}
            className={`px-5 py-2.5 rounded-xl ${
              isDark ? 'bg-background-card-900' : 'bg-background-card-100'
            }`}
            activeOpacity={0.7}
          >
            <Text
              className={`font-inter-medium text-sm ${
                isDark ? 'text-typography-900' : 'text-typography-100'
              }`}
            >
              Încearcă din nou
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <Box
            className={`flex-1 ${
              isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'
            } px-6 py-2 gap-3`}
          >
            {notifications.length === 0 ? (
              <EmptyState isDark={isDark} />
            ) : (
              notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  isDark={isDark}
                />
              ))
            )}
          </Box>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function resolveIconConfig(title: string, isRead: boolean, isDark: boolean) {
  const t = title.toLowerCase();

  if (isRead) {
    return {
      bg: isDark ? 'bg-background-icon-900' : 'bg-background-icon-100',
      icon: (
        <Icons.CircleCheck
          className={isDark ? 'text-typography-800' : 'text-typography-300'}
          size={20}
          strokeWidth={1.8}
        />
      ),
    };
  }

  if (t.includes('asigur') || t.includes('rca') || t.includes('casco')) {
    return {
      bg: 'bg-amber-100',
      icon: <Icons.Shield className="text-amber-500" size={20} strokeWidth={1.8} />,
    };
  }
  if (t.includes('revizie') || t.includes('itp')) {
    return {
      bg: 'bg-rose-100',
      icon: <Icons.Wrench className="text-rose-400" size={20} strokeWidth={1.8} />,
    };
  }
  if (t.includes('document') || t.includes('polita') || t.includes('rovinieta')) {
    return {
      bg: 'bg-blue-100',
      icon: <Icons.FileText className="text-blue-500" size={20} strokeWidth={1.8} />,
    };
  }
  if (t.includes('cheltuiala') || t.includes('plata') || t.includes('combustibil')) {
    return {
      bg: 'bg-emerald-100',
      icon: <Icons.CircleCheck className="text-emerald-500" size={20} strokeWidth={1.8} />,
    };
  }
  // fallback
  return {
    bg: isDark ? 'bg-background-icon-900' : 'bg-background-icon-100',
    icon: (
      <Icons.Car
        className={isDark ? 'text-typography-800' : 'text-typography-300'}
        size={20}
        strokeWidth={1.8}
      />
    ),
  };
}

function NotificationCard({
  notification,
  isDark,
}: {
  notification: Notification;
  isDark: boolean;
}) {
  const { bg, icon } = resolveIconConfig(notification.title, notification.isRead, isDark);

  return (
    <TouchableOpacity activeOpacity={0.7}>
      <View
        className={`${
          isDark
            ? 'bg-background-card-900 border-outline-900'
            : 'bg-background-card-100 border-outline-100'
        } border rounded-xl px-4 py-4 flex-row items-start gap-3`}
      >
        {/* Icon */}
        <View className={`w-11 h-11 rounded-xl items-center justify-center ${bg}`}>
          {icon}
        </View>

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

            {!notification.isRead && (
              <View className="w-2 h-2 rounded-full bg-error-50" />
            )}
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
            {notification.body}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function EmptyState({ isDark }: { isDark: boolean }) {
  return (
    <View className="flex-1 items-center justify-center gap-3 pb-20">
      <Icons.Bell
        className={isDark ? 'text-typography-800' : 'text-typography-300'}
        size={40}
        strokeWidth={1.4}
      />
      <Text
        className={`font-inter-medium text-base ${
          isDark ? 'text-typography-800' : 'text-typography-300'
        }`}
      >
        Nicio notificare momentan
      </Text>
    </View>
  );
}
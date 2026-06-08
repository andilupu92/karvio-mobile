import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Modal, StatusBar, TouchableOpacity, View } from 'react-native';
import { Icons } from '@/src/utils/icons';
import { useTheme } from '@/src/context/themeContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/src/navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Box } from '@/components/ui/box';
import { useAuthStore } from '@/src/store/authStore';
import { useState } from 'react';
import { authApi } from '@/src/api/services/authService';

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isDark } = useTheme();
  const logout = useAuthStore((state) => state.logout);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      setLogoutModalVisible(false);
      console.error('Logout failed:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await authApi.deleteAccount();
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      setDeleteModalVisible(false);
      console.error('Delete account failed:', error);
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'}`}
    >
      <StatusBar barStyle={isDark === true ? 'light-content' : 'dark-content'} />

      {/* ── Header ── */}
      <View className="flex-row items-center px-6 pt-2 pb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className={`w-10 h-10 ${isDark ? 'bg-background-card-900' : 'bg-background-card-100'} rounded-full items-center justify-center`}
          activeOpacity={0.7}
        >
          <Icons.ChevronLeft
            className={`${isDark ? 'text-icons-900' : 'text-icons-100'}`}
            size={20}
            strokeWidth={1.6}
          />
        </TouchableOpacity>
        <Text
          className={`${isDark ? 'text-typography-900' : 'text-typography-100'} text-lg font-inter-semibold text-center flex-1`}
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
        <Box
          className={`flex-1 ${isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'} px-6 py-2 gap-4`}
        >
          <View
            className={`${isDark ? 'bg-background-icon-900' : 'bg-background-icon-100'} self-center w-32 h-32 rounded-full items-center justify-center mb-3`}
          >
            <Icons.CircleUser
              className={`${isDark ? 'text-typography-800' : 'text-typography-200'}`}
              size={60}
              strokeWidth={1.6}
            />
          </View>

          <View
            className="font-inter-medium text-sm items-center justify-center mb-2"
          >
            <Text className={`${isDark ? 'text-typography-800' : 'text-typography-200'} italic`}>
              {useAuthStore.getState().user?.email}
            </Text>
          </View>

          <View
            className={`${isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100'} border rounded-xl overflow-hidden mt-1`}
          >
            <TouchableOpacity 
              onPress={() => navigation.navigate('PersonalDocuments')}
              activeOpacity={0.7}>
              <View className="flex-row items-center px-4 py-4">
                <View
                  className={`${isDark ? 'bg-background-icon-900' : 'bg-background-icon-100'} w-10 h-10 rounded-xl items-center justify-center mr-3`}
                >
                  <Icons.Shield
                    className={`${isDark ? 'text-icons-900' : 'text-icons-100'}`}
                    size={18}
                    strokeWidth={1.8}
                  />
                </View>
                <Text
                  className={`${isDark ? 'text-typography-900' : 'text-typography-100'} flex-1 font-inter-medium text-base`}
                >
                  Documente personale
                </Text>
                <Icons.ChevronRight
                  className={`${isDark ? 'text-typography-800' : 'text-typography-200'}`}
                  size={16}
                  strokeWidth={2}
                />
              </View>
            </TouchableOpacity>
            <View
              className={`${isDark ? 'bg-outline-900' : 'bg-outline-100'}`}
              style={{
                height: 1,
                marginHorizontal: 16,
              }}
            />
            <TouchableOpacity 
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.7}>
              <View className="flex-row items-center px-4 py-4">
                <View
                  className={`${isDark ? 'bg-background-icon-900' : 'bg-background-icon-100'} w-10 h-10 rounded-xl items-center justify-center mr-3`}
                >
                  <Icons.Bell
                    className={`${isDark ? 'text-icons-900' : 'text-icons-100'}`}
                    size={18}
                    strokeWidth={1.8}
                  />
                </View>
                <Text
                  className={`${isDark ? 'text-typography-900' : 'text-typography-100'} flex-1 font-inter-medium text-base`}
                >
                  Notificări
                </Text>
                <Icons.ChevronRight
                  className={`${isDark ? 'text-typography-800' : 'text-typography-200'}`}
                  size={16}
                  strokeWidth={2}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View
            className={`${isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100'} border rounded-xl overflow-hidden mt-1`}
          >
            <TouchableOpacity 
              onPress={() => navigation.navigate('BugReportScreen')}
              activeOpacity={0.7}>
                <View className="flex-row items-center px-4 py-4">
                  <View
                    className={`${isDark ? 'bg-background-icon-900' : 'bg-background-icon-100'} w-10 h-10 rounded-xl items-center justify-center mr-3`}
                  >
                    <Icons.Bug
                      className={`${isDark ? 'text-icons-900' : 'text-icons-100'}`}
                      size={18}
                      strokeWidth={1.8}
                    />
                  </View>
                  <Text
                    className={`${isDark ? 'text-typography-900' : 'text-typography-100'} flex-1 font-inter-medium text-base`}
                  >
                    Raportează o problemă
                  </Text>
                  <Icons.ChevronRight
                    className={`${isDark ? 'text-typography-800' : 'text-typography-200'}`}
                    size={16}
                    strokeWidth={2}
                  />
                </View>
            </TouchableOpacity>
            <View
              className={`${isDark ? 'bg-outline-900' : 'bg-outline-100'}`}
              style={{
                height: 1,
                marginHorizontal: 16,
              }}
            />
            <TouchableOpacity 
              onPress={() => navigation.navigate('FeedbackScreen')}
              activeOpacity={0.7}>
                <View className="flex-row items-center px-4 py-4">
                  <View
                    className={`${isDark ? 'bg-background-icon-900' : 'bg-background-icon-100'} w-10 h-10 rounded-xl items-center justify-center mr-3`}
                  >
                    <Icons.MessageSquare
                      className={`${isDark ? 'text-icons-900' : 'text-icons-100'}`}
                      size={18}
                      strokeWidth={1.8}
                    />
                  </View>
                  <Text
                    className={`${isDark ? 'text-typography-900' : 'text-typography-100'} flex-1 font-inter-medium text-base`}
                  >
                    Trimite feedback
                  </Text>
                  <Icons.ChevronRight
                    className={`${isDark ? 'text-typography-800' : 'text-typography-200'}`}
                    size={16}
                    strokeWidth={2}
                  />
                </View>
            </TouchableOpacity>
          </View>

          <View
            className={`${isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100'} border rounded-xl overflow-hidden mt-1`}
          >
            <TouchableOpacity 
              onPress={() => navigation.navigate('ContactUsScreen')}
              activeOpacity={0.7}>
                <View className="flex-row items-center px-4 py-4">
                  <View
                    className={`${isDark ? 'bg-background-icon-900' : 'bg-background-icon-100'} w-10 h-10 rounded-xl items-center justify-center mr-3`}
                  >
                    <Icons.Mail
                      className={`${isDark ? 'text-icons-900' : 'text-icons-100'}`}
                      size={18}
                      strokeWidth={1.8}
                    />
                  </View>
                  <Text
                    className={`${isDark ? 'text-typography-900' : 'text-typography-100'} flex-1 font-inter-medium text-base`}
                  >
                    Contactează-ne
                  </Text>
                  <Icons.ChevronRight
                    className={`${isDark ? 'text-typography-800' : 'text-typography-200'}`}
                    size={16}
                    strokeWidth={2}
                  />
                </View>
                </TouchableOpacity>
            <View
              className={`${isDark ? 'bg-outline-900' : 'bg-outline-100'}`}
              style={{
                height: 1,
                marginHorizontal: 16,
              }}
            />
            <TouchableOpacity 
              onPress={() => navigation.navigate('AboutAppScreen')}
              activeOpacity={0.7}>
                <View className="flex-row items-center px-4 py-4">
                <View
                  className={`${isDark ? 'bg-background-icon-900' : 'bg-background-icon-100'} w-10 h-10 rounded-xl items-center justify-center mr-3`}
                >
                  <Icons.Info
                    className={`${isDark ? 'text-icons-900' : 'text-icons-100'}`}
                    size={18}
                    strokeWidth={1.8}
                  />
                </View>
                <Text
                  className={`${isDark ? 'text-typography-900' : 'text-typography-100'} flex-1 font-inter-medium text-base`}
                >
                  Despre aplicație
                </Text>
                <Icons.ChevronRight
                  className={`${isDark ? 'text-typography-800' : 'text-typography-200'}`}
                  size={16}
                  strokeWidth={2}
                />
              </View>
              </TouchableOpacity>
          </View>

          <View
            className={`${isDark ? 'bg-background-card-900 border-outline-900' : 'bg-background-card-100 border-outline-100'} border rounded-xl overflow-hidden mt-1`}
          >
            <TouchableOpacity
              onPress={() => setLogoutModalVisible(true)}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center px-4 py-4">
                <View
                  className={`${isDark ? 'bg-background-icon-900' : 'bg-error-0'} w-10 h-10 rounded-xl items-center justify-center mr-3`}
                >
                  <Icons.LogOut className="text-error-50" size={18} strokeWidth={1.8} />
                </View>
                <Text className={`text-error-50 flex-1 font-inter-medium text-base`}>
                  Deloghează-te
                </Text>
                <Icons.ChevronRight
                  className={`${isDark ? 'text-typography-800' : 'text-typography-200'}`}
                  size={16}
                  strokeWidth={2}
                />
              </View>
            </TouchableOpacity>
            <View
              className={`${isDark ? 'bg-outline-900' : 'bg-outline-100'}`}
              style={{
                height: 1,
                marginHorizontal: 16,
              }}
            />
            <TouchableOpacity
              onPress={() => setDeleteModalVisible(true)}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center px-4 py-4">
                <View
                  className={`${isDark ? 'bg-background-icon-900' : 'bg-error-0'} w-10 h-10 rounded-xl items-center justify-center mr-3`}
                >
                  <Icons.Trash2 className="text-error-50" size={18} strokeWidth={1.8} />
                </View>
                <Text className={`text-error-50 flex-1 font-inter-bold text-base`}>
                  Șterge contul
                </Text>
                <Icons.ChevronRight
                  className={`${isDark ? 'text-typography-800' : 'text-typography-200'}`}
                  size={16}
                  strokeWidth={2}
                />
              </View>
            </TouchableOpacity>
          </View>
        </Box>
      </KeyboardAwareScrollView>

      {/* Modal logout */}
      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 w-[85%] shadow-lg elevation-8">
            {/* Title */}
            <Text className="font-inter-semibold text-[17px] text-gray-900 mb-2.5">
              Deloghează-te
            </Text>

            {/* Message */}
            <Text className="font-inter-regular text-sm text-gray-600 mb-5 leading-5">
              Ești sigur că vrei să te deloghezi din cont?
            </Text>

            {/* Separator */}
            <View className="h-px bg-gray-100 mb-4" />

            {/* Buttons */}
            <View className="flex-row justify-end gap-5">
              <TouchableOpacity onPress={() => setLogoutModalVisible(false)}>
                <Text className="font-inter-semibold text-sm text-[#0a4f67] tracking-wide">
                  ÎNAPOI
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout}>
                <Text className="font-inter-semibold text-sm text-red-500 tracking-wide">
                  DELOGHEAZĂ-MĂ
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal delete account */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 w-[85%] shadow-lg elevation-8">
            {/* Title */}
            <Text className="font-inter-semibold text-[17px] text-gray-900 mb-2.5">
              Șterge contul
            </Text>

            {/* Message */}
            <Text className="font-inter-regular text-sm text-gray-600 mb-5 leading-5">
              Ești sigur că vrei să ștergi contul?
            </Text>

            {/* Separator */}
            <View className="h-px bg-gray-100 mb-4" />

            {/* Buttons */}
            <View className="flex-row justify-end gap-5">
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)}>
                <Text className="font-inter-semibold text-sm text-[#0a4f67] tracking-wide">
                  ÎNAPOI
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <Text className="font-inter-semibold text-sm text-red-500 tracking-wide">
                  ȘTERGE CONTUL
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
    </SafeAreaView>
  );
}

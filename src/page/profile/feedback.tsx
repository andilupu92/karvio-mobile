import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  StatusBar,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Icons } from '@/src/utils/icons';
import { useTheme } from '@/src/context/themeContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/src/navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Box } from '@/components/ui/box';
import { useState } from 'react';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { FormControl, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { useAuthStore } from '@/src/store/authStore';
import { userApi } from '@/src/api/services/userService';

const feedbackSchema = z.object({
  description: z.string().min(10, 'Descrierea este necesară').max(200, 'Descrierea nu poate depăși 200 de caractere'),
});

type FeedbackFormData = z.input<typeof feedbackSchema>;

export default function FeedbackScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isDark } = useTheme();
  const [isSaveLoading, setSaveLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      description: '',
    },
  });
 
  const onSubmit = async (data: FeedbackFormData) => {
    try {
          setSaveLoading(true);
          const validatedData = feedbackSchema.parse(data);
          const response = await userApi.add(validatedData, 'FEEDBACK');
          console.log(
            'Feedback submitted successfully for user: ' +
               useAuthStore.getState().user?.email,
          );
    
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        } catch (error: any) {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'An error occurred during feedback submission';
          console.log('Body:', JSON.stringify(error?.response?.data));
          console.error('Feedback submission error:', errorMessage);
        } finally {
          setSaveLoading(false);
        }
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
          Trimite feedback
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
          {/* ── Subtitle ── */}
          <Text
            className={`${
              isDark ? 'text-typography-800' : 'text-typography-200'
            } font-inter-regular text-sm text-center leading-6`}
          >
            Cum putem face aplicația și mai bună pentru tine? Trimite-ne feedback-ul, sugestiile sau ideile de funcționalități noi chiar aici, iar noi le vom analiza cu prioritate!
          </Text>

          {/* ── Description Field ── */}
          <FormControl isInvalid={!!errors.description}>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <View
                  className={`${
                    isDark
                      ? 'bg-background-card-900 border-outline-900'
                      : 'bg-background-card-100 border-outline-100'
                  } ${
                    errors.description ? 'border-red-500' : 'border'
                  } border rounded-xl px-4 py-3`}
                  style={{ minHeight: 180 }}
                >
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Descrie problema aici..."
                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                    multiline
                    textAlignVertical="top"
                    style={{
                      flex: 1,
                      minHeight: 156,
                      fontFamily: 'Inter-Regular',
                      fontSize: 14,
                      color: isDark ? '#F9FAFB' : '#111827',
                      lineHeight: 22,
                    }}
                  />
                </View>
              )}
            />
            <FormControlError>
              <FormControlErrorText className="ml-2 mt-1 text-xs text-red-500">
                {errors.description?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* ── Save Button ── */}
          <View className="mt-auto pt-4">
            <Button
              isDisabled={isSaveLoading}
              onPress={handleSubmit(onSubmit)}
              className={`${isDark ? 'bg-background-primary-100' : 'bg-background-primary-900'} flex-row items-center justify-center h-16 rounded-2xl py-4 w-full gap-2 active:scale-[0.99]`}
            >
              <HStack space="md" className="items-center justify-center">
                {isSaveLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
                    className="text-white mr-2"
                  />
                ) : null}
                <ButtonText
                  className={`${isDark ? 'text-typography-100' : 'text-typography-900'} font-inter-bold text-lg`}
                >
                  {isSaveLoading ? 'Se salvează...' : 'Salvare'}
                </ButtonText>
              </HStack>
            </Button>
          </View>
        </Box>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
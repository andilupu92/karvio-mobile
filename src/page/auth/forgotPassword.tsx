import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { FormControl, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { CheckCircleIcon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { authApi } from '../../api/services/authService';
import WelcomeCard from './WelcomeCard';
import FloatingInput from '@/components/ui/floating-input';
import { Icons } from '@/src/utils/icons';
import { useToast } from '@/src/context/toastContext';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const [isLoading, setLoading] = useState(false);
  const { colorScheme } = useColorScheme();
  const { showToast } = useToast();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onChange',
  });

  const emailValue = watch('email');
  const isEmailValid = !errors.email && dirtyFields.email && emailValue.length > 0;

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      await authApi.forgotPassword(data.email);

      navigation.navigate('VerifyOTP', { email: data.email });

    } catch (error: any) {
      showToast('Eroare la solicitarea codului de resetare', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={`flex-1 ${colorScheme === 'dark' ? 'bg-background-primary-900' : 'bg-background-primary-100'}`}>
      {/* HEADER */}
      <Box style={{ zIndex: 10 }}>
        <WelcomeCard
          primaryTitle="Ai uitat parola?"
          secondaryTitle="😞"
          contain="Îți vom trimite un cod pe adresa ta"
          showBackButton={true}
        />
      </Box>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <VStack
          className={`flex-1 px-8 pt-12 mt-20 ${colorScheme === 'dark' ? 'bg-background-primary-900' : 'bg-background-primary-100'} rounded-t-[35px]`}
          style={{ zIndex: 20 }}
        >
          <Box className="mt-2">

            {/* Description */}
            <Text className={`${colorScheme === 'dark' ? 'text-typography-600' : 'text-typography-400'} text-sm mb-8 leading-5`}>
              {`Îți vom trimite un cod de 6 cifre la adresa ta de email.\nCodul va expira în 10 minute.`}
            </Text>

            {/* EMAIL INPUT */}
            <FormControl isInvalid={!!errors.email} className="mb-8">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value, onBlur } }) => (
                  <FloatingInput
                    label="Email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    isInvalid={!!errors.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    leftIcon={
                      <Icons.LucideMail
                        className={`${colorScheme === 'dark' ? 'text-icons-800' : 'text-icons-200'}`}
                        size={18}
                        strokeWidth={1.8}
                      />
                    }
                    rightIcon={
                      isEmailValid ? (
                        <CheckCircleIcon
                          size={20}
                          color="#10b981"
                          fill={colorScheme === 'dark' ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5'}
                        />
                      ) : null
                    }
                  />
                )}
              />
              <FormControlError>
                <FormControlErrorText className="ml-2 mt-1 text-xs text-red-500">
                  {errors.email?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            {/* Send Code Button */}
            <Button
              size="xl"
              className={`${colorScheme === 'dark' ? 'bg-background-primary-100' : 'bg-background-primary-900'} h-16 rounded-2xl shadow-lg shadow-gray-200 dark:shadow-none active:scale-[0.98]`}
              isDisabled={isLoading}
              onPress={handleSubmit(onSubmit)}
            >
              <ButtonText className={`${colorScheme === 'dark' ? 'text-typography-100' : 'text-typography-900'} font-inter-bold text-lg`}>
                {isLoading ? 'Se trimite...' : 'Trimite Cod'}
              </ButtonText>
            </Button>

          </Box>
        </VStack>
      </KeyboardAvoidingView>
    </Box>
  );
}
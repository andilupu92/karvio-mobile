import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Link, LinkText } from '@/components/ui/link';
import { Button, ButtonText } from '@/components/ui/button';
import { FormControl, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { EyeIcon, EyeOffIcon, CheckCircleIcon } from 'lucide-react-native';
import WelcomeCard from './WelcomeCard';
import FloatingInput from '@/components/ui/floating-input';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { authApi } from '../../api/services/authService';
import { useAuthStore } from '../../store/authStore';
import GoogleIcon from '@/src/icons/GoogleIcon';
import { Icons } from '@/src/utils/icons';
import requestUserPermissionAndRegisterToken from '../../api/registerToken';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const [isLoading, setLoading] = useState(false);
  const [isGoogleLoading, setGoogleLoading] = useState(false);
  const { colorScheme } = useColorScheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  const emailValue = watch('email');
  const isEmailValid = !errors.email && dirtyFields.email && emailValue.length > 0;

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('Attempting login...');
      setLoading(true);

      // Call the separated API function
      const responseData = await authApi.login(data);

      await login(
        responseData.accessToken,
        responseData.refreshToken,
        { email: data.email },
      );
      await requestUserPermissionAndRegisterToken(responseData.accessToken);

      console.log('Login Success for: ', data.email);
      navigation.navigate('Home');
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'An error occurred during login';
      console.error('Login error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitGoogle = async () => {
    setGoogleLoading(true);
    try {
      console.log('Google login clicked');
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const iconColor = colorScheme === 'dark' ? '#94a3b8' : '#9ca3af';
  const activeIconColor = '#10b981';

  return (
    <Box className={`flex-1 ${colorScheme === 'dark' ? 'bg-background-primary-900' : 'bg-background-primary-100'}`}>
      {/* HEADER */}
      <Box style={{ zIndex: 10 }}>
        <WelcomeCard
          primaryTitle="Bine ai venit!"
          secondaryTitle="👋"
          contain="Te rog să te autentifici pentru a continua"
          showBackButton={false}
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
            {/* --- EMAIL INPUT --- */}
            <FormControl isInvalid={!!errors.email} className="mb-5">
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
                          color={activeIconColor}
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

            {/* --- PASSWORD INPUT --- */}
            <FormControl isInvalid={!!errors.password} className="mb-5">
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value, onBlur } }) => (
                  <FloatingInput
                    label="Parolă"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    isInvalid={!!errors.password}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    leftIcon={
                                        <Icons.LucideLock
                                          className={`${colorScheme === 'dark' ? 'text-icons-800' : 'text-icons-200'}`}
                                          size={18}
                                          strokeWidth={1.8}
                                        />
                                      }
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        {showPassword ? (
                          <EyeIcon size={20} color={iconColor} />
                        ) : (
                          <EyeOffIcon size={20} color={iconColor} />
                        )}
                      </TouchableOpacity>
                    }
                  />
                )}
              />
              <FormControlError>
                <FormControlErrorText className="ml-2 mt-1 text-xs text-red-500">
                  {errors.password?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            {/* Forgot Password Link */}
            <Box className="items-end mb-8 mr-1"> 
              <Link onPress={() => navigation.navigate('ForgotPassword')}>
                <LinkText className="text-sm text-blue-500 dark:text-blue-400 font-medium no-underline">
                  Ai uitat parola?
                </LinkText>
              </Link>
            </Box>

            {/* Sign In Button */}
            <Button
              size="xl"
              className={`${colorScheme === 'dark' ? 'bg-background-primary-100' : 'bg-background-primary-900'} h-16 rounded-2xl shadow-lg shadow-gray-200 dark:shadow-none active:scale-[0.98]`}
              isDisabled={isLoading}
              onPress={handleSubmit(onSubmit)}
            >
              <HStack space="md" className="items-center justify-center">
                {isLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
                    className="text-white dark:text-blue-400 mr-2"
                  />
                ) : null}
                <ButtonText className={`${colorScheme === 'dark' ? 'text-typography-100' : 'text-typography-900'} font-inter-bold text-lg`}>
                  {isLoading ? 'Se autentifică...' : 'Autentificare'}
                </ButtonText>
              </HStack>
            </Button>

            {/*<HStack className="items-center my-8">
              <Box className="flex-1 h-[1px] bg-gray-200 dark:bg-slate-800" />
              <Text className={`${colorScheme === 'dark' ? 'text-typography-800' : 'text-typography-200'} px-4 text-sm font-medium`}>
                or continue with
              </Text>
              <Box className={`flex-1 h-[1px] ${colorScheme === 'dark' ? 'bg-outline-900' : 'bg-outline-100'}`} />
            </HStack>*/}

            {/* Social Login Buttons Container */}
            {/*<Button
              size="xl"
              action="secondary"
              className="w-full h-16 items-center justify-center border border-[#747775] bg-white dark:border-[#8E918F] dark:bg-[#131314] rounded-2xl shadow-lg shadow-gray-200 dark:shadow-none border border-gray-200"
              isDisabled={isGoogleLoading}
              onPress={handleSubmitGoogle}
            >
              <HStack space="md" className="items-center justify-center">
                {isGoogleLoading ? (
                  <ButtonSpinner color="#747775" className="mr-2" />
                ) : (
                  <GoogleIcon width={18} height={18} />
                )}
                <ButtonText className="text-[14px] leading-[20px] text-[#1F1F1F] dark:text-[#E3E3E3] font-medium">
                  {isGoogleLoading ? 'Signing up...' : 'Sign up with Google'}
                </ButtonText>
              </HStack>
            </Button>*/}

            {/* Footer Links */}
            <HStack className="justify-center mt-8 items-center" space="xs">
              <Text className={`${colorScheme === 'dark' ? 'text-typography-800' : 'text-typography-200'} font-medium`}>
                Nu ai un cont?
              </Text>
              <Link onPress={() => navigation.navigate('SignUp')}>
                <LinkText className={`${colorScheme === 'dark' ? 'text-blue-400' : 'text-blue-600'} font-bold no-underline`}>
                  Înregistrare
                </LinkText>
              </Link>
            </HStack>
          </Box>
        </VStack>
      </KeyboardAvoidingView>
    </Box>
  );
}

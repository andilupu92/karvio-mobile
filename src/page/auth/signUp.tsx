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
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { FormControl, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { EyeIcon, EyeOffIcon, CheckCircleIcon } from 'lucide-react-native';
import WelcomeCard from './WelcomeCard';
import FloatingInput from '@/components/ui/floating-input';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { authApi } from '@/src/api/services/authService';
import GoogleIcon from '@/src/icons/GoogleIcon';
import { Icons } from '@/src/utils/icons';

const signUpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const { colorScheme } = useColorScheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isGoogleLoading, setGoogleLoading] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  const emailValue = watch('email');
  const isEmailValid = !errors.email && dirtyFields.email && emailValue.length > 0;

  const onSubmit = async (data: SignUpFormData) => {
    try {
      console.log('Sign up with email:', data.email);
      setLoading(true);

      const responseData = await authApi.signUp(data);

      if (responseData && responseData.includes('created')) {
        console.log(responseData);
        navigation.navigate('Login');
      } else {
        console.error('Unexpected response:', responseData);
      }
    } catch (error) {
      console.error('Sign up failed:', error);
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
          primaryTitle="Create"
          secondaryTitle="Account"
          contain="Please sign Up to continue"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
      </Box>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <VStack
          className={`flex-1 px-8 pt-12 mt-12 ${colorScheme === 'dark' ? 'bg-background-primary-900' : 'bg-background-primary-100'} rounded-t-[35px]`}  
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
                    label="Password"
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

            {/* Sign Up Button */}
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
                                {isLoading ? 'Signing up...' : 'Sign Up'}
                              </ButtonText>
                            </HStack>
            </Button>

            <HStack className="items-center my-8">
              <Box className={`flex-1 h-[1px] ${colorScheme === 'dark' ? 'bg-outline-900' : 'bg-outline-100'}`} />
              <Text className={`${colorScheme === 'dark' ? 'text-typography-800' : 'text-typography-200'} px-4 text-sm font-medium`}>
                or continue with
              </Text>
              <Box className={`flex-1 h-[1px] ${colorScheme === 'dark' ? 'bg-outline-900' : 'bg-outline-100'}`} />
            </HStack>

            {/* Social Login Buttons Container */}
            <Button
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
                  {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
                </ButtonText>
              </HStack>
            </Button>

            {/* Footer Links */}
            <HStack className="justify-center mt-8 items-center" space="xs">
              <Text className={`${colorScheme === 'dark' ? 'text-typography-800' : 'text-typography-200'} font-medium`}>
                Already have an account?
              </Text>
              <Link onPress={() => navigation.navigate('Login')}>
                <LinkText className={`${colorScheme === 'dark' ? 'text-blue-400' : 'text-blue-600'} font-bold no-underline`}>
                  Sign in
                </LinkText>
              </Link>
            </HStack>
          </Box>
        </VStack>
      </KeyboardAvoidingView>
    </Box>
  );
}

import { useState, useRef, useEffect } from 'react';
import { TextInput, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { authApi } from '../../api/services/authService';
import WelcomeCard from './WelcomeCard';
import { useToast } from '@/src/context/toastContext';

type VerifyOTPRouteProp = RouteProp<RootStackParamList, 'VerifyOTP'>;

export default function VerifyOTPScreen() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { showToast } = useToast();

  const inputRefs = useRef<(TextInput | null)[]>([]);

  const { colorScheme } = useColorScheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<VerifyOTPRouteProp>();
  const { email } = route.params;

  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async () => {
    const otpCode = otp.join('');

    if (otpCode.length < 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await authApi.verifyOtp(email, otpCode);
      navigation.navigate('ResetPassword', { email, otpCode });

    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Invalid or expired OTP code.';
      setError(errorMessage);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await authApi.forgotPassword(email);
      setOtp(['', '', '', '', '', '']);
      setError(null);
      setCanResend(false);
      setResendTimer(60);
      inputRefs.current[0]?.focus();
    } catch (error) {
      showToast('A apărut o eroare. Încearcă din nou.', 'error');
    }
  };

  const isDark = colorScheme === 'dark';

  const getInputStyle = (index: number) => {
    const isFilled = otp[index] !== '';
    const hasError = !!error;
    return {
      width: 48,
      height: 56,
      borderRadius: 12,
      borderWidth: 1.5,
      textAlign: 'center' as const,
      fontSize: 22,
      fontWeight: 'bold' as const,
      color: isDark ? '#f1f5f9' : '#0f172a',
      backgroundColor: isDark ? '#1e293b' : '#f8fafc',
      borderColor: hasError
        ? '#ef4444'
        : isFilled
        ? '#10b981'
        : isDark ? '#334155' : '#e2e8f0',
    };
  };

  return (
    <Box className={`flex-1 ${isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'}`}>
      {/* HEADER */}
      <Box style={{ zIndex: 10 }}>
        <WelcomeCard
          primaryTitle="Enter"
          secondaryTitle="Code"
          contain={`We sent a 6-digit code to email`}
          showBackButton={true}
        />
      </Box>

      <VStack
        className={`flex-1 px-8 pt-12 mt-20 ${isDark ? 'bg-background-primary-900' : 'bg-background-primary-100'} rounded-t-[35px]`}
        style={{ zIndex: 20 }}
      >
        <Box className="mt-2">

          {/* ── 6 Inputs OTP ── */}
          <HStack className="justify-between mb-4">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={getInputStyle(index)}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </HStack>

          {/* ── error message ── */}
          {error && (
            <Text className="text-red-500 text-xs ml-1 mb-4">
              {error}
            </Text>
          )}

          {/* ── Resend timer ── */}
          <HStack className="justify-center mb-8" space="xs">
            <Text className={`text-sm ${isDark ? 'text-typography-600' : 'text-typography-400'}`}>
              Didn't receive the code?
            </Text>
            <TouchableOpacity onPress={handleResend} disabled={!canResend}>
              <Text className={`text-sm font-bold ${canResend ? 'text-blue-500' : isDark ? 'text-typography-600' : 'text-typography-400'}`}>
                {canResend ? 'Resend' : `Resend in ${resendTimer}s`}
              </Text>
            </TouchableOpacity>
          </HStack>

          {/* ── Verify Button ── */}
          <Button
            size="xl"
            className={`${isDark ? 'bg-background-primary-100' : 'bg-background-primary-900'} h-16 rounded-2xl shadow-lg shadow-gray-200 dark:shadow-none active:scale-[0.98]`}
            isDisabled={isLoading || otp.join('').length < 6}
            onPress={onSubmit}
          >
            <HStack space="md" className="items-center justify-center">
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
                />
              )}
              <ButtonText className={`${isDark ? 'text-typography-100' : 'text-typography-900'} font-inter-bold text-lg`}>
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </ButtonText>
            </HStack>
          </Button>

        </Box>
      </VStack>
    </Box>
  );
}
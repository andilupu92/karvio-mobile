import { useState, useRef } from 'react';
import { Animated, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import type { KeyboardTypeOptions, TextInputProps } from 'react-native';

interface FloatingInputProps extends Omit<TextInputProps, 'placeholder' | 'onBlur' | 'onFocus'> {
  label: string;
  value: any;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  isInvalid?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  keyboardType?: KeyboardTypeOptions;
}

export default function FloatingInput({
  label,
  value,
  onChangeText,
  onBlur,
  onFocus,
  isInvalid = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  className = '',
  ...textInputProps
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { colorScheme } = useColorScheme();
  
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    onBlur?.();
  };

  const labelTop = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [16, -10],
  });

  const labelFontSize = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const getLabelColor = () => {
    if (isInvalid) return '#f87171';
    if (isFocused) return '#3b82f6';
    if (value) return colorScheme === 'dark' ? '#94a3b8' : '#6b7280'; // Lighter color when focused or has value
    return colorScheme === 'dark' ? '#a7a8a8' : '#9ca3af'; // Lighter color when not focused and no value
  };

  const getLabelBackgroundColor = () => {
    return colorScheme === 'dark' ? '#0f172a' : '#f9fafb';
  };

  const getBorderColor = () => {
    if (isInvalid) return 'border-red-400';
    if (isFocused) return 'border-blue-500';
    return 'border-gray-100 dark:border-slate-800';
  };

  return (
    <Box style={{ position: 'relative' }} className={className}>
      {/* Floating Label */}
      <Animated.Text
        style={{
          position: 'absolute',
          left: leftIcon ? 48 : 16,
          top: labelTop,
          fontSize: labelFontSize,
          fontFamily: "Inter_600SemiBold",
          color: getLabelColor(),
          backgroundColor: getLabelBackgroundColor(),
          paddingHorizontal: 4,
          borderRadius: 4,
          zIndex: 10,
        }}
      >
        {label}
      </Animated.Text>

      {/* Input Container */}
      <Box 
        className={`
          bg-gray-50 dark:bg-slate-900 
          border ${getBorderColor()}
          rounded-2xl px-4 py-4
          ${isDisabled ? 'opacity-50' : ''}
        `}
      >
        <HStack className="items-center" space="md">
          {/* Left Icon */}
          {leftIcon && (
            <View style={{ marginRight: 8 }}>
              {leftIcon}
            </View>
          )}

          {/* Input Field */}
          <Input className="h-7 flex-1 p-0 border-0 border-transparent">
            <InputField
              className={"font-inter-bold text-base text-gray-800 dark:text-white p-0 leading-tight"}
              placeholder=""
              value={value !== undefined && value !== null ? String(value) : ''}
              onChangeText={onChangeText}
              onFocus={handleFocus}
              onBlur={handleBlur}
              editable={!isDisabled}
              {...textInputProps}
            />
          </Input>
          
          {/* Right Icon */}
          {rightIcon && (
            <View style={{ marginLeft: 8 }}>
              {rightIcon}
            </View>
          )}
        </HStack>
      </Box>
    </Box>
  );
}

export { FloatingInput };
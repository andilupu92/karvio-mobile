import { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'nativewind';
import * as SecureStore from 'expo-secure-store';

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  colorScheme: 'light' | 'dark';
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  colorScheme: 'light',
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { setColorScheme } = useColorScheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync('theme').then((saved) => {
      if (saved === 'dark') {
        setIsDark(true);
        setColorScheme('dark');
      }
    });
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    setColorScheme(next ? 'dark' : 'light');
    await SecureStore.setItemAsync('theme', next ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colorScheme: isDark ? 'dark' : 'light' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

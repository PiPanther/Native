import React, { createContext, useState, useContext, useEffect } from 'react';
import { ColorValue, OpaqueColorValue, useColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark';

// Define default colors to avoid circular dependencies
export const defaultLightColors = {
  background: '#FFFFFF',
  text: '#333333',
  card: '#F8F8F8',
  border: '#E0E0E0',
  primary: '#007AFF',
};

export const defaultDarkColors = {
  background: '#121212',
  text: '#FFFFFF',
  card: '#1E1E1E',
  border: '#333333',
  primary: '#0A84FF',
};

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: {
    textSecondary: ColorValue | undefined;
    error: string | OpaqueColorValue;
    surface: string | OpaqueColorValue;
    background: string;
    text: string;
    card: string;
    border: string;
    primary: string;
  };
}

// Create context with default values to avoid null checks
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  colors: {
      ...defaultLightColors, surface: defaultLightColors.background,
      error: '',
      textSecondary: undefined
  },
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useColorScheme() as ThemeType;
  const [theme, setTheme] = useState<ThemeType>(deviceTheme || 'light');

  useEffect(() => {
    if (deviceTheme) {
      setTheme(deviceTheme);
    }
  }, [deviceTheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const colors = theme === 'light' ? defaultLightColors : defaultDarkColors;
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: {
        ...colors, surface: colors.background,
        error: '',
        textSecondary: undefined
    } }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
}; 
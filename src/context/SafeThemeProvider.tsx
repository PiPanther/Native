import React, { useState } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from './ThemeContext';

export const SafeThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useColorScheme() as 'light' | 'dark' | null;
  const initialTheme = deviceTheme || 'light';
  
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}; 
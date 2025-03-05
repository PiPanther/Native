import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/context/ThemeContext';
import { BookmarkProvider } from '../src/context/BookmarkContext';
import { FontLoader } from '../src/components/common/FontLoader';
import { Provider as PaperProvider } from 'react-native-paper';

export default function Layout() {
  return (
    <FontLoader>
      <ThemeProvider>
        <BookmarkProvider>
          <PaperProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
          </PaperProvider>
        </BookmarkProvider>
      </ThemeProvider>
    </FontLoader>
  );
} 
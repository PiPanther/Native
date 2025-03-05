import React from 'react';
import { View, Text } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { useTheme, defaultLightColors } from '../../context/ThemeContext';
import { 
  useFonts,
  Roboto_400Regular, 
  Roboto_500Medium, 
  Roboto_700Bold,
  Roboto_300Light 
} from '@expo-google-fonts/roboto';

interface FontLoaderProps {
  children: React.ReactNode;
}

export const FontLoader: React.FC<FontLoaderProps> = ({ children }) => {
  // Use default colors directly to avoid circular dependency
  const colors = defaultLightColors;
  
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': Roboto_400Regular,
    'Roboto-Medium': Roboto_500Medium,
    'Roboto-Bold': Roboto_700Bold,
    'Roboto-Light': Roboto_300Light,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.text, fontFamily: 'System' }}>Loading fonts...</Text>
      </View>
    );
  }

  return <>{children}</>;
}; 
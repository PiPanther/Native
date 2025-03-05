import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from './src/context/ThemeContext';

// Import screens
import JobsScreen from './src/screens/jobs/JobsScreen';
import JobDetailsScreen from './src/screens/jobs/JobDetailsScreen';
import BookmarksScreen from './src/screens/bookmarks/BookmarksScreen';

// Import context
import { ThemeProvider } from './src/context/ThemeContext';
import { BookmarkProvider } from './src/context/BookmarkContext';
import { FontLoader } from './src/components/common/FontLoader';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Theme toggle button component
const ThemeToggleButton = () => {
  const { theme, toggleTheme, colors } = useTheme();
  
  return (
    <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 15 }}>
      <Ionicons 
        name={theme === 'light' ? 'moon-outline' : 'sunny-outline'} 
        size={24} 
        color={colors.text} 
      />
    </TouchableOpacity>
  );
};

// Main tab navigator
const TabNavigator = () => {
  const { colors, theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Jobs') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'Bookmarks') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0066CC',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { 
          backgroundColor: colors.background,
          height: 65, // Increase height for more space
          paddingTop: 5,
          paddingBottom: 10,
        },
        tabBarItemStyle: {
          paddingTop: 5,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 0,
          paddingTop: 0,
        },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerRight: () => <ThemeToggleButton />,
      })}
    >
      <Tab.Screen 
        name="Jobs" 
        component={JobsScreen} 
      />
      <Tab.Screen 
        name="Bookmarks" 
        component={BookmarksScreen} 
      />
    </Tab.Navigator>
  );
};

// Root stack navigator
const AppWithTheme = () => {
  const { colors } = useTheme();
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      >
        <Stack.Screen 
          name="Main" 
          component={TabNavigator} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="JobDetails" 
          component={JobDetailsScreen} 
          options={{ title: 'Job Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Root component with providers
export default function Main() {
  return (
    <FontLoader>
      <ThemeProvider>
        <BookmarkProvider>
          <PaperProvider>
            <AppWithTheme />
          </PaperProvider>
        </BookmarkProvider>
      </ThemeProvider>
    </FontLoader>
  );
}

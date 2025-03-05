import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import JobsScreen from './screens/jobs/JobsScreen';
import JobDetailsScreen from './screens/jobs/JobDetailsScreen';
import BookmarksScreen from './screens/bookmarks/BookmarksScreen';

// Import context
import { BookmarkProvider } from './context/BookmarkContext';
import { ThemeProvider } from './context/ThemeContext';
import { FontLoader } from './components/common/FontLoader';

// Import types
import { RootStackParamList } from './navigation/NavigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Main tab navigator
const TabNavigator = () => {
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

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0066CC',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Jobs" 
        component={JobsScreen} 
        options={{ title: 'Job Listings' }}
      />
      <Tab.Screen 
        name="Bookmarks" 
        component={BookmarksScreen} 
        options={{ title: 'Saved Jobs' }}
      />
    </Tab.Navigator>
  );
};

// Root stack navigator
const App = () => {
  return (
    <FontLoader>
      <ThemeProvider>
        <BookmarkProvider>
          <PaperProvider>
            <NavigationContainer>
              <Stack.Navigator>
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
          </PaperProvider>
        </BookmarkProvider>
      </ThemeProvider>
    </FontLoader>
  );
};

export default App; 
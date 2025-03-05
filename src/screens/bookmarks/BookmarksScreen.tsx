import React from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useBookmarks } from '../../context/BookmarkContext';
import JobCard from '../../components/job/JobCard';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the navigation type
type RootStackParamList = {
  JobDetails: { job: any };
  Jobs: undefined;
};

type BookmarksScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BookmarksScreen = () => {
  const { bookmarks, clearAllBookmarks, isLoading } = useBookmarks();
  const navigation = useNavigation<BookmarksScreenNavigationProp>();
  const { colors, theme } = useTheme();
  
  const handleJobPress = (job: any) => {
    navigation.navigate('JobDetails', { job });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading bookmarks...</Text>
      </View>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Ionicons name="bookmark-outline" size={80} color={colors.primary} />
        <Text style={[styles.emptyText, { color: colors.text }]}>
          No bookmarked jobs yet
        </Text>
        <Text style={[styles.emptySubText, { color: colors.text }]}>
          Jobs you bookmark will appear here for offline viewing
        </Text>
        <Button 
          mode="contained" 
          style={styles.browseButton}
          onPress={() => navigation.navigate('Jobs')}
        >
          Browse Jobs
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <JobCard 
            job={item} 
            onPress={() => handleJobPress(item)}
            onBookmarkToggle={() => {}}
            isDark={theme === 'dark'}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
      
      {bookmarks.length > 0 && (
        <View style={styles.clearButtonContainer}>
          <Button 
            mode="outlined" 
            onPress={clearAllBookmarks}
            style={[styles.clearButton, { borderColor: colors.error }]}
            textColor={colors.error as string}
          >
            Clear All Bookmarks
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: {
    padding: 10,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7,
  },
  browseButton: {
    marginTop: 20,
  },
  clearButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  clearButton: {
    borderWidth: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  }
});

export default BookmarksScreen; 
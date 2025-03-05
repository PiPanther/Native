import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, RefreshControl, ActivityIndicator, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useJobs } from '../../hooks/useJobs';
import JobCard from '../../components/job/JobCard';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import { useBookmarks } from '../../context/BookmarkContext';
import { Button, Searchbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const JobsScreen = () => {
  const { jobs, loading, refreshing, error, loadJobs, loadMoreJobs, isOffline } = useJobs();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [loadingMore, setLoadingMore] = useState(false);
  const { colors, theme } = useTheme();
  const { addBookmark, removeBookmark } = useBookmarks();
  const [searchQuery, setSearchQuery] = useState('');

  // Navigate to job details screen
  const handleJobPress = (job: any) => {
    navigation.navigate('JobDetails', { job });
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = async (jobId: string, isBookmarked: boolean) => {
    const job = jobs.find(j => j.id.toString() === jobId);
    
    if (job) {
      if (isBookmarked) {
        addBookmark(job);
      } else {
        removeBookmark(jobId);
      }
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    await loadJobs();
  };

  // Handle load more
  const handleLoadMore = async () => {
    if (!loadingMore && !refreshing && jobs.length > 0) {
      setLoadingMore(true);
      await loadMoreJobs();
      setLoadingMore(false);
    }
  };

  // Filter jobs based on search query with proper null checks
  const filteredJobs = searchQuery
    ? jobs.filter(job => {
        const query = searchQuery.toLowerCase();
        
        // Check title (with null check)
        const titleMatch = job.title ? job.title.toLowerCase().includes(query) : false;
        
        // Check company name (with null check)
        const companyMatch = job.company_name 
          ? job.company_name.toLowerCase().includes(query) 
          : false;
        
        // Check location (with null check)
        const locationMatch = job.primary_details?.Place 
          ? job.primary_details.Place.toLowerCase().includes(query) 
          : false;
        
        // Return true if any field matches
        return titleMatch || companyMatch || locationMatch;
      })
    : jobs;

  // Render error state
  if (error || isOffline) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Ionicons 
          name={isOffline ? "cloud-offline" : "alert-circle"} 
          size={80} 
          color={colors.error} 
        />
        <Text style={[styles.errorTitle, { color: colors.text }]}>
          {isOffline ? "You're Offline" : "Connection Error"}
        </Text>
        <Text style={[styles.errorMessage, { color: colors.text }]}>
          {error || "Unable to load jobs. Please check your internet connection and try again."}
        </Text>
        <Button 
          mode="contained" 
          onPress={() => loadJobs()}
          style={styles.retryButton}
          icon="refresh"
        >
          Retry
        </Button>
        <Button 
          mode="outlined" 
          onPress={() => navigation.navigate('Bookmarks')}
          style={styles.bookmarksButton}
        >
          View Saved Jobs
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search bar */}
      <Searchbar
        placeholder="Search jobs, companies, locations..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={[styles.searchBar, { backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5' }]}
        inputStyle={{ color: colors.text }}
        iconColor={colors.primary}
        placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
      />
      
      {/* Jobs list */}
      {loading && jobs.length === 0 ? (
        <View style={[styles.centered, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading jobs...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => `job-${item.id}`}
          renderItem={({ item }) => (
            <JobCard 
              job={item}
              onPress={() => handleJobPress(item)}
              onBookmarkToggle={(isBookmarked) => 
                handleBookmarkToggle(item.id.toString(), isBookmarked)
              }
              isDark={theme === 'dark'}
              hideBookmarkButton={true}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              colors={['#0066CC']}
              tintColor={colors.text}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            !loading && !error ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="search" size={60} color={colors.primary} />
                <Text style={[styles.emptyText, { color: colors.text }]}>
                  {searchQuery ? 'No jobs match your search' : 'No jobs available'}
                </Text>
                {searchQuery && (
                  <Button 
                    mode="text" 
                    onPress={() => setSearchQuery('')}
                  >
                    Clear Search
                  </Button>
                )}
              </View>
            ) : null
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator color="#0066CC" />
                <Text style={[
                  styles.loadingText, 
                  theme === 'dark' && styles.loadingTextDark
                ]}>
                  Loading more jobs...
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
    fontFamily: 'Roboto-Regular',
  },
  loadingTextDark: {
    color: '#AAA',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  searchBar: {
    margin: 10,
    elevation: 2,
    borderRadius: 8,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  retryButton: {
    marginBottom: 16,
  },
  bookmarksButton: {
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  }
});

export default JobsScreen; 


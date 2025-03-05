import { useState, useEffect, useCallback } from 'react';
import { fetchJobs, Job } from '../services/jobsApi';
import NetInfo from '@react-native-community/netinfo';

interface UseJobsReturn {
  jobs: Job[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  loadJobs: (refresh?: boolean) => Promise<void>;
  loadMoreJobs: () => Promise<void>;
  simulateError: () => void;
  isOffline: boolean;
}

export const useJobs = (): UseJobsReturn => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [forceError, setForceError] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
      
      // If we're back online and had an error, clear it
      if (state.isConnected && error && error.includes('network')) {
        setError(null);
      }
    });

    // Check initial connection state
    NetInfo.fetch().then(state => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe();
  }, [error]);

  const simulateError = useCallback(() => {
    setForceError(true);
    loadJobs(true);
  }, []);

  const loadJobs = useCallback(async (refresh = false) => {
    try {
      // Check network connectivity first
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        setIsOffline(true);
        throw new Error("No internet connection. Please check your network settings and try again.");
      }
      
      if (refresh) {
        setRefreshing(true);
        setPage(1);
      } else if (!refresh && !refreshing) {
        setLoading(true);
      }
      
      setError(null);
      
      // Simulate error if forceError is true
      if (forceError) {
        setForceError(false);
        throw new Error("Simulated network error. This is just a test!");
      }
      
      console.log('Initial load: Fetching page 1');
      const response = await fetchJobs(1, 15);
      
      // Filter out duplicates by ID
      const uniqueJobs = response.results.filter((job, index, self) => 
        index === self.findIndex((j) => j.id === job.id)
      );

      setJobs(uniqueJobs);
      
      // Always set page to 1 after initial load to enable looping
      setPage(1);
      setIsOffline(false);
    } catch (err) {
      console.error('Failed to load jobs:', err);
      
      // Check if it's a network error
      if (err instanceof Error) {
        if (err.message.includes('network') || err.message.includes('internet') || err.message.includes('connection')) {
          setIsOffline(true);
          setError("No internet connection. Please check your network settings and try again.");
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to load jobs. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing, forceError]);

  const loadMoreJobs = useCallback(async () => {
    // Don't load more if already loading or refreshing
    if (isLoadingMore || loading || refreshing || isOffline) {
      console.log('Skipping loadMoreJobs:', { isLoadingMore, loading, refreshing, isOffline });
      return;
    }
    
    try {
      // Check network connectivity first
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        setIsOffline(true);
        return; // Silently fail for pagination
      }
      
      setIsLoadingMore(true);
      
      // Simulate error for pagination if forceError is true
      if (forceError) {
        setForceError(false);
        throw new Error("Simulated pagination error. This is just a test!");
      }
      
      console.log(`Loading more jobs: page ${page}`);
      
      const nextPage = page + 1;
      const response = await fetchJobs(nextPage, 15);
      
      if (response.results.length === 0) {
        console.log('No more jobs from API, looping back to page 1');
        // If no results, loop back to page 1
        const firstPageResponse = await fetchJobs(1, 15);
        
        // Combine with existing jobs and filter out duplicates
        setJobs(prevJobs => {
          const newJobs = [...prevJobs, ...firstPageResponse.results];
          return newJobs.filter((job, index, self) => 
            index === self.findIndex((j) => j.id === job.id)
          );
        });
        
        // Reset to page 1
        setPage(1);
      } else {
        // Combine with existing jobs and filter out duplicates
        setJobs(prevJobs => {
          const newJobs = [...prevJobs, ...response.results];
          return newJobs.filter((job, index, self) => 
            index === self.findIndex((j) => j.id === job.id)
          );
        });
        
        // Increment page
        setPage(nextPage);
      }
      
      setIsOffline(false);
    } catch (err) {
      console.error('Error loading more jobs:', err);
      // For pagination errors, we don't show a full screen error
      // but we could show a toast or snackbar here
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, loading, refreshing, isLoadingMore, forceError, isOffline]);

  // Load jobs on initial render
  useEffect(() => {
    loadJobs();
  }, []);

  return {
    jobs,
    loading,
    refreshing,
    error,
    loadJobs,
    loadMoreJobs,
    simulateError,
    isOffline
  };
}; 
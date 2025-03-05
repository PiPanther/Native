import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types
type Job = any; // Replace with your actual Job type
type BookmarkContextType = {
  bookmarks: Job[];
  isBookmarked: (id: string) => boolean;
  addBookmark: (job: Job) => void;
  removeBookmark: (id: string) => void;
  clearAllBookmarks: () => void;
  isLoading: boolean;
};

// Create context
const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

// Storage key
const STORAGE_KEY = 'bookmarked_jobs';

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load bookmarks from storage when app starts
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        setIsLoading(true);
        const storedBookmarks = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedBookmarks) {
          setBookmarks(JSON.parse(storedBookmarks));
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  // Save bookmarks to storage whenever they change
  useEffect(() => {
    const saveBookmarks = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
      } catch (error) {
        console.error('Error saving bookmarks:', error);
      }
    };

    // Only save if not in initial loading state
    if (!isLoading) {
      saveBookmarks();
    }
  }, [bookmarks, isLoading]);

  // Check if a job is bookmarked
  const isBookmarked = (id: string) => {
    return bookmarks.some(bookmark => bookmark.id.toString() === id);
  };

  // Add a job to bookmarks
  const addBookmark = (job: Job) => {
    if (!isBookmarked(job.id.toString())) {
      setBookmarks(prevBookmarks => [...prevBookmarks, job]);
    }
  };

  // Remove a job from bookmarks
  const removeBookmark = (id: string) => {
    setBookmarks(prevBookmarks => 
      prevBookmarks.filter(bookmark => bookmark.id.toString() !== id)
    );
  };

  // Clear all bookmarks
  const clearAllBookmarks = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setBookmarks([]);
    } catch (error) {
      console.error('Error clearing bookmarks:', error);
    }
  };

  return (
    <BookmarkContext.Provider 
      value={{ 
        bookmarks, 
        isBookmarked, 
        addBookmark, 
        removeBookmark, 
        clearAllBookmarks,
        isLoading
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

// Custom hook to use the bookmark context
export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
}; 
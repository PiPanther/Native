import React from 'react';
import { StyleSheet, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Text, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Job } from '../../services/jobsApi';
import { useBookmarks } from '../../context/BookmarkContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/NavigationTypes';
import { useTheme } from '../../context/ThemeContext';

// Get screen width for card sizing
const screenWidth = Dimensions.get('window').width;

export interface JobCardProps {
  job: Job;
  onPress: () => void;
  onBookmarkToggle: (isBookmarked: boolean) => void;
  isDark: boolean;
  hideBookmarkButton?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, onPress, onBookmarkToggle, isDark, hideBookmarkButton = false }) => {
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const { colors } = useTheme();
  
  const isBookmarked = bookmarks.some((bookmark) => bookmark.id === job.id);

  // Format salary range for display
  const formatSalary = () => {
    if (job.salary_min && job.salary_max) {
      return `₹${job.salary_min.toLocaleString()} - ₹${job.salary_max.toLocaleString()}`;
    } else if (job.salary_min) {
      return `₹${job.salary_min.toLocaleString()}+`;
    } else if (job.primary_details?.Salary) {
      return job.primary_details.Salary;
    }
    return 'Salary not specified';
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get the first image from creatives if available
  const jobImage = job.creatives && job.creatives.length > 0 
    ? job.creatives[0].thumb_url || job.creatives[0].file 
    : null;

  // Icon colors for different categories
  const getIconColor = (iconType: string) => {
    const iconColors = {
      location: '#FF6B6B',  // Red
      cash: '#4CAF50',      // Green
      briefcase: '#2196F3', // Blue
      school: '#9C27B0',    // Purple
      calendar: '#FF9800',  // Orange
      business: '#607D8B'   // Blue-gray
    } as Record<string, string>;
    
    return iconColors[iconType] || colors.primary;
  };

  const handleBookmarkToggle = (event: any) => {
    // Stop the event from propagating to the card press
    event.stopPropagation();
    
    if (isBookmarked) {
      removeBookmark(job.id.toString());
    } else {
      addBookmark(job);
    }
    
    // Call the parent component's callback if provided
    if (onBookmarkToggle) {
      onBookmarkToggle(!isBookmarked);
    }
  };

  return (
    <Card 
      style={[styles.card, isDark ? styles.cardDark : null]} 
      onPress={onPress}
      elevation={1}
    >
      <Card.Content style={styles.cardContent}>
        {/* Main Column */}
        <View style={styles.mainColumn}>
          {/* Row with image and title/company */}
          <View style={styles.headerRow}>
            {jobImage ? (
              <Image 
                source={{ uri: jobImage }} 
                style={styles.companyLogo} 
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderLogo}>
                <Ionicons name="business" size={30} color={isDark ? "#666" : "#CCC"} />
              </View>
            )}
            
            <View style={styles.headerTextContainer}>
              <Title style={[styles.title, isDark ? styles.textLight : null]} numberOfLines={2}>
                {job.title}
              </Title>
            </View>
          </View>
          
          {/* Primary details section */}
          <View style={styles.detailsSection}>
            {job.company_name && (
              <View style={styles.detailRow}>
                <Ionicons name="business-outline" size={16} color={getIconColor('business')} />
                <Text style={[styles.detailText, isDark ? styles.textLight : null]} numberOfLines={1}>
                  {job.company_name}
                </Text>
              </View>
            )}
            
            {job.primary_details?.Place && (
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={16} color={getIconColor('location')} />
                <Text style={[styles.detailText, isDark ? styles.textLight : null]} numberOfLines={1}>
                  {job.primary_details.Place}
                </Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={16} color={getIconColor('cash')} />
              <Text style={[styles.detailText, isDark ? styles.textLight : null]} numberOfLines={1}>
                {formatSalary()}
              </Text>
            </View>
            
            {job.primary_details?.Experience && (
              <View style={styles.detailRow}>
                <Ionicons name="briefcase-outline" size={16} color={getIconColor('briefcase')} />
                <Text style={[styles.detailText, isDark ? styles.textLight : null]} numberOfLines={1}>
                  {job.primary_details.Experience}
                </Text>
              </View>
            )}
            
            {job.primary_details?.Qualification && (
              <View style={styles.detailRow}>
                <Ionicons name="school-outline" size={16} color={getIconColor('school')} />
                <Text style={[styles.detailText, isDark ? styles.textLight : null]} numberOfLines={1}>
                  {job.primary_details.Qualification}
                </Text>
              </View>
            )}
            
            {job.updated_on && (
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={16} color={getIconColor('calendar')} />
                <Text style={[styles.postedDate, isDark && styles.postedDateDark]} numberOfLines={1}>
                  Posted: {formatDate(job.updated_on)}
                </Text>
              </View>
            )}
          </View>
          
          {/* Tags section */}
          <View style={styles.tagsContainer}>
            {job.job_tags && job.job_tags.map((tag: any, index: number) => (
              <Chip 
                key={`${tag.value}-${index}`}
                style={[
                  styles.tag, 
                  { 
                    backgroundColor: tag.bg_color || '#E7F3FE',
                  }
                ]}
                textStyle={{ 
                  color: tag.text_color || '#0E56A8',
                  fontSize: 10,
                  lineHeight: 16,
                }}
              >
                {tag.value}
              </Chip>
            ))}
            
            {job.job_hours && (
              <Chip 
                style={[styles.tag, { backgroundColor: '#F6ECFE' }]}
                textStyle={{ 
                  color: '#5D0B9E', 
                  fontSize: 10,
                  lineHeight: 16,
                }}
              >
                {job.job_hours}
              </Chip>
            )}
          </View>
        </View>
        
        {/* Bookmark button - only show if not hidden */}
        {!hideBookmarkButton && (
          <TouchableOpacity 
            style={styles.bookmarkButton}
            onPress={handleBookmarkToggle}
          >
            <Ionicons 
              name={isBookmarked ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={isBookmarked ? getIconColor('bookmark') : colors.text} 
            />
          </TouchableOpacity>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    width: screenWidth - 20,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardDark: {
    backgroundColor: '#2C2C2C',
    borderColor: '#444444',
  },
  cardContent: {
    padding: 16,
  },
  mainColumn: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  placeholderLogo: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 22,
  },
  detailsSection: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
    height: 28,
    paddingVertical: 2,
    borderRadius: 14,
  },
  postedDate: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 8,
  },
  postedDateDark: {
    color: '#AAAAAA',
  },
  textLight: {
    color: '#FFFFFF',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
});

export default JobCard; 
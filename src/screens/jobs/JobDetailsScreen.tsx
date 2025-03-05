import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Image, Linking, TouchableOpacity, Share, Dimensions, FlatList, Modal, StatusBar } from 'react-native';
import { Card, Title, Paragraph, Button, Text, Divider, Chip, Surface } from 'react-native-paper';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { JobDetailsScreenRouteProp } from '../../navigation/NavigationTypes'; 
import { useBookmarks } from '../../context/BookmarkContext';
import { useTheme } from '../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const JobDetailsScreen = () => {
  const route = useRoute<JobDetailsScreenRouteProp>();
  const { job } = route.params;
  const navigation = useNavigation();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const { colors, theme } = useTheme();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isJobBookmarked, setIsJobBookmarked] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  
  // Update bookmark state when screen loads or when bookmark status changes
  useEffect(() => {
    setIsJobBookmarked(isBookmarked(job.id.toString()));
  }, [job.id, isBookmarked]);
  
  // Get all images from creatives
  const jobImages = job.creatives && job.creatives.length > 0 
    ? job.creatives.map(creative => creative.file || creative.thumb_url).filter(Boolean)
    : [];
  
  // Get icon colors for different categories
  const getIconColor = (iconType: string) => {
    const iconColors = {
      location: '#FF6B6B',  // Red
      cash: '#4CAF50',      // Green
      briefcase: '#2196F3', // Blue
      school: '#9C27B0',    // Purple
      calendar: '#FF9800',  // Orange
      business: '#607D8B',  // Blue-gray
      phone: '#00BCD4',     // Cyan
      share: '#E91E63',     // Pink
      bookmark: '#FFC107',  // Amber
      description: '#3F51B5', // Indigo
      info: '#009688',      // Teal
    } as Record<string, string>;
    
    return iconColors[iconType] || colors.primary;
  };

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
  
  // Handle bookmark toggle
  const handleBookmarkToggle = () => {
    if (isJobBookmarked) {
      removeBookmark(job.id.toString());
      setIsJobBookmarked(false);
    } else {
      addBookmark(job);
      setIsJobBookmarked(true);
    }
  };
  
  // Handle apply button press
  const handleApply = () => {
    if (job.custom_link) {
      Linking.openURL(job.custom_link);
    } else if (job.whatsapp_no) {
      const whatsappLink = job.contact_preference?.whatsapp_link || 
        `https://wa.me/${job.whatsapp_no}?text=I'm interested in the ${job.title} position`;
      Linking.openURL(whatsappLink);
    }
  };
  
  // Handle share button press
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this job: ${job.title} at ${job.company_name || 'a company'}\n\nSalary: ${formatSalary()}\nLocation: ${job.primary_details?.Place || 'Not specified'}\n\nShared from Jobs App`,
      });
    } catch (error) {
      console.error('Error sharing job:', error);
    }
  };
  
  // Handle image scroll
  const handleImageScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveImageIndex(slideIndex);
  };

  // Function to open image viewer
  const openImageViewer = (index: number) => {
    setActiveImageIndex(index);
    setImageViewerVisible(true);
  };

  // Function to close image viewer
  const closeImageViewer = () => {
    setImageViewerVisible(false);
  };

  // Add this near the top of the component to check the structure
  console.log('Job contentV3:', JSON.stringify(job.contentV3, null, 2));

  // Or if you want to check all job data
  console.log('Job data:', JSON.stringify(job, null, 2));

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Job header with image carousel and gradient overlay */}
      <View style={styles.headerContainer}>
        {jobImages.length > 0 ? (
          <>
            <FlatList
              data={jobImages}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleImageScroll}
              renderItem={({ item }) => (
                <Image 
                  source={{ uri: item }} 
                  style={styles.headerImage} 
                  resizeMode="cover"
                />
              )}
              keyExtractor={(item, index) => `image-${index}`}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.headerGradient}
            />
            
            {/* Image pagination dots */}
            {jobImages.length > 1 && (
              <View style={styles.paginationContainer}>
                {jobImages.map((_, index) => (
                  <View 
                    key={`dot-${index}`} 
                    style={[
                      styles.paginationDot,
                      index === activeImageIndex && styles.paginationDotActive
                    ]} 
                  />
                ))}
              </View>
            )}
          </>
        ) : (
          <View style={[styles.headerPlaceholder, { backgroundColor: getIconColor('business') }]}>
            <Ionicons name="business" size={60} color="#ffffff" />
          </View>
        )}
        
        {/* Floating company logo */}
        <View style={styles.companyLogoContainer}>
          <View style={styles.companyLogo}>
            <Ionicons name="business" size={30} color={getIconColor('business')} />
          </View>
        </View>
        
        {/* Bookmark button */}
        <TouchableOpacity 
          style={[
            styles.bookmarkButton, 
            isJobBookmarked ? styles.bookmarkButtonActive : null
          ]} 
          onPress={handleBookmarkToggle}
        >
          <Ionicons 
            name={isJobBookmarked ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color={isJobBookmarked ? "#FFFFFF" : getIconColor('bookmark')} 
          />
        </TouchableOpacity>
      </View>
      
      {/* Job title and company card */}
      <Surface style={[styles.detailsCard, { backgroundColor: colors.surface }]}>
        <Title style={[styles.title, { color: colors.text }]}>{job.title}</Title>
        
        {job.company_name && (
          <View style={styles.companyRow}>
            <Ionicons name="business" size={20} color={getIconColor('business')} />
            <Text style={[styles.companyName, { color: colors.text }]}>{job.company_name}</Text>
          </View>
        )}
        
        {/* Job tags */}
        <View style={styles.tagsContainer}>
          {job.job_tags && job.job_tags.map((tag: any, index: number) => (
            <Chip 
              key={`${tag.value}-${index}`}
              style={[
                styles.tag, 
                { backgroundColor: tag.bg_color || '#E7F3FE' }
              ]}
              textStyle={{ color: tag.text_color || '#0E56A8' }}
            >
              {tag.value}
            </Chip>
          ))}
        </View>
      </Surface>
      
      {/* Primary details card */}
      <Surface style={[styles.detailsCard, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionTitleContainer}>
          <Ionicons name="information-circle" size={22} color={getIconColor('info')} />
          <Title style={[styles.sectionTitle, { color: colors.text }]}>Job Details</Title>
        </View>
        
        <View style={styles.detailsGrid}>
          {job.primary_details?.Place && (
            <View style={styles.detailItem}>
              <View style={[styles.detailIconContainer, { backgroundColor: `${getIconColor('location')}20` }]}>
                <Ionicons name="location" size={18} color={getIconColor('location')} />
              </View>
              <View style={styles.detailTextContainer}>
                <Text style={[styles.detailLabel, { color: colors.text }]}>Location</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{job.primary_details.Place}</Text>
              </View>
            </View>
          )}
          
          <View style={styles.detailItem}>
            <View style={[styles.detailIconContainer, { backgroundColor: `${getIconColor('cash')}20` }]}>
              <Ionicons name="cash" size={18} color={getIconColor('cash')} />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={[styles.detailLabel, { color: colors.text }]}>Salary</Text>
              <Text style={[styles.detailValue, { color: colors.text, fontSize: 14}]}>{formatSalary()}</Text>
            </View>
          </View>
          
          {job.primary_details?.Experience && (
            <View style={styles.detailItem}>
              <View style={[styles.detailIconContainer, { backgroundColor: `${getIconColor('briefcase')}20` }]}>
                <Ionicons name="briefcase" size={18} color={getIconColor('briefcase')} />
              </View>
              <View style={styles.detailTextContainer}>
                <Text style={[styles.detailLabel, { color: colors.text }]}>Experience</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{job.primary_details.Experience}</Text>
              </View>
            </View>
          )}
          
          {job.primary_details?.Qualification && (
            <View style={styles.detailItem}>
              <View style={[styles.detailIconContainer, { backgroundColor: `${getIconColor('school')}20` }]}>
                <Ionicons name="school" size={18} color={getIconColor('school')} />
              </View>
              <View style={styles.detailTextContainer}>
                <Text style={[styles.detailLabel, { color: colors.text }]}>Qualification</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{job.primary_details.Qualification}</Text>
              </View>
            </View>
          )}
          
          {job.job_hours && (
            <View style={styles.detailItem}>
              <View style={[styles.detailIconContainer, { backgroundColor: `${getIconColor('calendar')}20` }]}>
                <Ionicons name="time" size={18} color={getIconColor('calendar')} />
              </View>
              <View style={styles.detailTextContainer}>
                <Text style={[styles.detailLabel, { color: colors.text }]}>Job Type</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{job.job_hours}</Text>
              </View>
            </View>
          )}
          
          {job.openings_count > 0 && (
            <View style={styles.detailItem}>
              <View style={[styles.detailIconContainer, { backgroundColor: `${getIconColor('briefcase')}20` }]}>
                <Ionicons name="people" size={18} color={getIconColor('briefcase')} />
              </View>
              <View style={styles.detailTextContainer}>
                <Text style={[styles.detailLabel, { color: colors.text }]}>Openings</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{job.openings_count}</Text>
              </View>
            </View>
          )}
        </View>
      </Surface>
      
     
      
      {/* Additional information */}
      {job.contentV3 && job.contentV3.V3 && job.contentV3.V3.length > 0 && (
        <Surface style={[styles.detailsCard, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="information-circle" size={22} color={getIconColor('info')} />
            <Title style={[styles.sectionTitle, { color: colors.text }]}>Additional Information</Title>
          </View>
          
          {job.contentV3.V3.map((item: any, index: number) => (
            <View key={`content-${index}`} style={styles.contentItem}>
              <View style={[styles.detailIconContainer, { backgroundColor: `${getIconColor('info')}20` }]}>
                <Ionicons name="information" size={18} color={getIconColor('info')} />
              </View>
              <View style={styles.detailTextContainer}>
                <Text style={[styles.detailLabel, { color: colors.text }]}>
                  {item.field_name || item.field_key}
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {item.field_value}
                </Text>
              </View>
            </View>
          ))}
        </Surface>
      )}

       {/* Job description */}
       {job.other_details && (
        <Surface style={[styles.detailsCard, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="document-text" size={22} color={getIconColor('description')} />
            <Title style={[styles.sectionTitle, { color: colors.text }]}>Other Details</Title>
          </View>
          
          <View style={[
            styles.descriptionContainer, 
            theme === 'dark' ? styles.descriptionContainerDark : null
          ]}>
            <Paragraph style={[
              styles.description, 
              { color: theme === 'dark' ? '#FFFFFF' : '#333333' }
            ]}>
              {job.other_details}
            </Paragraph>
          </View>
        </Surface>
      )}
      
      {/* Job images gallery */}
      {jobImages.length > 1 && (
        <Surface style={[styles.detailsCard, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="images" size={22} color={getIconColor('info')} />
            <Title style={[styles.sectionTitle, { color: colors.text }]}>Job Images</Title>
          </View>
          
          <View style={styles.galleryContainer}>
            {jobImages.map((image, index) => (
              <TouchableOpacity 
                key={`gallery-${index}`}
                style={styles.galleryImageContainer}
                onPress={() => openImageViewer(index)}
              >
                <Image 
                  source={{ uri: image }} 
                  style={[
                    styles.galleryImage,
                    index === activeImageIndex && styles.galleryImageActive
                  ]} 
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </Surface>
      )}
      
      {/* Action buttons */}
      <Surface style={[styles.actionsCard, { backgroundColor: colors.surface }]}>
        <Button 
          mode="contained" 
          style={styles.applyButton}
          onPress={handleApply}
          contentStyle={styles.applyButtonContent}
          labelStyle={styles.applyButtonLabel}
        >
          {job.button_text || "Apply Now"}
        </Button>
        
        <View style={styles.secondaryButtonsContainer}>
          <Button 
            mode="outlined" 
            style={styles.shareButton}
            onPress={handleShare}
            contentStyle={styles.secondaryButtonContent}
            icon={() => <Ionicons name="share-social-outline" size={18} color={getIconColor('share')} />}
          >
            Share
          </Button>
          
          <Button 
            mode="outlined" 
            style={[
              styles.bookmarkButtonBottom,
              isJobBookmarked ? { backgroundColor: `${getIconColor('bookmark')}20` } : null
            ]}
            contentStyle={styles.secondaryButtonContent}
            icon={() => <Ionicons 
              name={isJobBookmarked ? "bookmark" : "bookmark-outline"} 
              size={18} 
              color={getIconColor('bookmark')} 
            />}
            onPress={handleBookmarkToggle}
          >
            {isJobBookmarked ? "Unsave" : "Save"}
          </Button>
        </View>
      </Surface>
      
      {job.updated_on && (
        <Text style={[styles.postedDate, { color: theme === 'dark' ? '#AAAAAA' : '#666666' }]}>
          Posted on {new Date(job.updated_on).toLocaleDateString()}
        </Text>
      )}
      
      {/* Image Viewer Modal */}
      <Modal
        visible={imageViewerVisible}
        transparent={true}
        onRequestClose={closeImageViewer}
        animationType="fade"
      >
        <View style={styles.imageViewerContainer}>
          <StatusBar hidden />
          
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={closeImageViewer}
          >
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.fullImageContainer}>
            <Image 
              source={{ uri: jobImages[activeImageIndex] }} 
              style={styles.fullImage} 
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.imageNavigationContainer}>
            {activeImageIndex > 0 && (
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => setActiveImageIndex(activeImageIndex - 1)}
              >
                <Ionicons name="chevron-back" size={30} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {activeImageIndex + 1} / {jobImages.length}
              </Text>
            </View>
            
            {activeImageIndex < jobImages.length - 1 && (
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => setActiveImageIndex(activeImageIndex + 1)}
              >
                <Ionicons name="chevron-forward" size={30} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 200,
    position: 'relative',
  },
  headerImage: {
    width,
    height: 200,
  },
  headerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  headerPlaceholder: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  companyLogoContainer: {
    position: 'absolute',
    bottom: -30,
    right: 20,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  bookmarkButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  bookmarkButtonActive: {
    backgroundColor: '#FFC107',
  },
  detailsCard: {
    margin: 10,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 28,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyName: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 15,
    lineHeight: 20,
  },
  descriptionContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3F51B5',
  },
  descriptionContainerDark: {
    backgroundColor: '#333333',
    borderLeftColor: '#5C6BC0',
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },
  contentItem: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  galleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  galleryImageContainer: {
    width: '31%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  galleryImageActive: {
    borderColor: '#3F51B5',
  },
  actionsCard: {
    margin: 10,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  applyButton: {
    borderRadius: 8,
    elevation: 2,
  },
  applyButtonContent: {
    height: 48,
  },
  applyButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  shareButton: {
    width: '48%',
    borderRadius: 8,
  },
  bookmarkButtonBottom: {
    width: '48%',
    borderRadius: 8,
  },
  secondaryButtonContent: {
    height: 40,
  },
  postedDate: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  imageViewerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImageContainer: {
    width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: width * 0.9,
    height: '80%',
    maxWidth: width,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageNavigationContainer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 40,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  imageCounterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default JobDetailsScreen; 
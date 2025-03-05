import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Job } from '../services/jobsApi';

// Define the root stack parameter list
export type RootStackParamList = {
  Main: undefined;
  Jobs: undefined;
  JobDetails: { job: Job };
  Bookmarks: undefined;
  ErrorTest: undefined;
};

// Define the navigation prop types
export type JobsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Jobs'>;
export type JobDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'JobDetails'>;
export type BookmarksScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Bookmarks'>;

// Define the route prop types
export type JobDetailsScreenRouteProp = RouteProp<RootStackParamList, 'JobDetails'>; 
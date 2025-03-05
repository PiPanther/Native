import axios from 'axios';
import { API_BASE_URL } from '@env';

// Use the environment variable
const API_URL = API_BASE_URL;

// Job interface based on the API response
export interface Job {
  salary_min: any;
  salary_max: any;
  job_tags: any;
  job_hours: any;
  contentV3: any;
  button_text: string;
  updated_on: any;
  phone: any;
  id: number;
  title: string;
  company_name: string;
  primary_details: {
    Place: string;
    Salary: string;
    Job_Type: string;
    Experience: string;
    Qualification: string;
  };
  job_category: string;
  job_role: string;
  other_details: string;
  openings_count: number;
  creatives: Array<{
    file: string;
    thumb_url: string;
  }>;
  is_bookmarked: boolean;
  whatsapp_no?: string;
  custom_link?: string;
  contact_preference?: {
    whatsapp_link?: string;
  };
  type?: string;
  requirements?: string;
}

// API response interface
export interface JobsApiResponse {
  results: Job[];
  next_page: number | null;
}

/**
 * Fetches jobs from the API
 * @param page Page number to fetch
 * @param limit Number of jobs per page
 * @returns Promise with jobs data
 */
export const fetchJobs = async (page: number = 1, limit: number = 10): Promise<JobsApiResponse> => {
  try {
    console.log(API_URL);
    console.log(API_BASE_URL);
    console.log(`Fetching jobs: page ${page}, limit ${limit}`);
    const response = await axios.get<JobsApiResponse>(`${API_URL}/jobs`, {
      params: {
        page,
        limit,
      },
    });
    console.log(`Received ${response.data.results.length} jobs, next page: ${response.data.next_page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

/**
 * Fetches details for a specific job
 * @param jobId ID of the job to fetch
 * @returns Promise with job details
 */
export const fetchJobDetails = async (jobId: number): Promise<Job> => {
  try {
    const response = await axios.get<Job>(`${API_URL}/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching job details for ID ${jobId}:`, error);
    throw error;
  }
}; 
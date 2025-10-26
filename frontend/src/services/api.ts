import axios from 'axios';
import { CaseData } from '../pages/Home/Home';

// Use the backend API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:6767';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  // Redirect to Google OAuth login
  loginWithGoogle: () => {
    window.location.href = `${API_URL}/api/auth/login`;
  },

  // Verify token received from OAuth redirect
  verifyToken: (token: string) => {
    return api.post('/api/auth/verify-token', { token });
  },

  // Get current user info
  getCurrentUser: () => {
    return api.get('/api/auth/user');
  },

  // Logout
  logout: () => {
    localStorage.removeItem('auth_token');
    return api.get('/api/auth/logout');
  },
};

// Cases API
export const casesAPI = {
  // Create a new case
  createCase: (caseData: any) => {
    return api.post('/api/cases', caseData);
  },

  // Get all cases
  getAllCases: (): CaseData[] => {
    return api.get('/api/cases') as unknown as CaseData[];
  },

  // Get a specific case
  getCase: (id: string) => {
    return api.get(`/api/cases/${id}`);
  },
};

// Tasks API
export const tasksAPI = {
  // Submit content for analysis
  analyzeContent: (data: { text: string; files?: File[] }) => {
    const formData = new FormData();
    formData.append('text', data.text);
    
    if (data.files && data.files.length > 0) {
      data.files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });
    }
    
    return api.post('/api/tasks/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Approve a task
  approveTask: (taskId: string) => {
    return api.post(`/api/tasks/${taskId}/approve`);
  },

  // Reject a task
  rejectTask: (taskId: string) => {
    return api.post(`/api/tasks/${taskId}/reject`);
  },

  // Get task history
  getTaskHistory: () => {
    return api.get('/api/tasks/history');
  },
};

// OCR API
export const ocrAPI = {
  // Extract text from PDF
  extractTextFromPDF: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/api/ocr/extract', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
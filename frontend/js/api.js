// API Configuration
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api' 
  : 'https://athletiq-production.up.railway.app/api';

class APIService {
    constructor() {
        this.token = localStorage.getItem('authToken');
    }

    // Helper method for API calls
    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                console.error('API Error Response:', data);
                throw new Error(data.details || data.error || 'API request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication
    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (data.token) {
            this.token = data.token;
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('sportsforall_user', JSON.stringify(data.user));
            localStorage.setItem('sportsforall_logged_in', 'true');
            localStorage.setItem('sportsforall_login_time', Date.now());
        }
        
        return data;
    }

    async register(userData) {
        console.log('Sending registration data:', userData);
        try {
            const data = await this.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            return data;
        } catch (error) {
            console.error('Registration failed with data:', userData);
            console.error('Error details:', error);
            throw error;
        }
        
        if (data.token) {
            this.token = data.token;
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('sportsforall_user', JSON.stringify(data.user));
            localStorage.setItem('sportsforall_logged_in', 'true');
            localStorage.setItem('sportsforall_login_time', Date.now());
        }
        
        return data;
    }

    // Profile
    async getProfile() {
        return this.request('/auth/profile');
    }

    async updateProfile(profileData) {
        return this.request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    // Assessments
    async submitAssessment(assessmentData) {
        return this.request('/assessments', {
            method: 'POST',
            body: JSON.stringify(assessmentData)
        });
    }

    async getAssessments() {
        return this.request('/assessments');
    }

    async getAssessment(id) {
        return this.request(`/assessments/${id}`);
    }

    async submitToSAI(assessmentId) {
        return this.request(`/assessments/${assessmentId}/submit-to-sai`, {
            method: 'POST'
        });
    }

    // File Upload
    async uploadVideo(videoFile) {
        const formData = new FormData();
        formData.append('video', videoFile);
        
        return this.request('/upload/video', {
            method: 'POST',
            headers: {}, // Remove Content-Type for FormData
            body: formData
        });
    }

    // AI Analysis
    async processAIAnalysis(assessmentId, aiResults) {
        return this.request('/ai/process', {
            method: 'POST',
            body: JSON.stringify({ assessmentId, aiResults })
        });
    }

    async getAIAnalysis(assessmentId) {
        return this.request(`/ai/assessment/${assessmentId}`);
    }

    async getAIStats() {
        return this.request('/ai/stats');
    }

    // Admin/Stats
    async getStats() {
        return this.request('/admin/stats');
    }

    // Logout
    logout() {
        this.token = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('sportsforall_user');
        localStorage.removeItem('sportsforall_logged_in');
        localStorage.removeItem('sportsforall_login_time');
        localStorage.removeItem('sportsforall_remember_me');
    }
}

// Export singleton instance
window.api = new APIService();
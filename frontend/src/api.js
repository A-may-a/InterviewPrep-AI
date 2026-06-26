// frontend/src/api.js
import axios from "axios";

// Hardcode fallback to your actual Render backend URL
const API_BASE = process.env.REACT_APP_API_URL || "https://interviewprep-ai-b.onrender.com";

console.log("API BASE URL:", API_BASE); // Debug - remove after fixing

const api = axios.create({
  baseURL: API_BASE,  // ✅ Always has a value now
  timeout: 30000,
});

// Add JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Request:", config.method?.toUpperCase(), config.baseURL + config.url); // Debug
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.config?.url, error.response?.status, error.response?.data);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("authToken");
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/register')) {
        window.location.href = '/login'; // ✅ Fixed: was .replace = instead of .href =
      }
    }
    return Promise.reject(error);
  }
);

// ================= AUTH =================
export const authAPI = {
  register: (email, password, name) =>
    api.post("/auth/register", { email, password, name }),

  login: (email, password) =>
    api.post("/auth/login", { email, password }),

  getCurrentUser: () => api.get("/auth/me"),
};

// ================= QUIZ =================
export const quizAPI = {
  // Get all available tests (Test 1, Test 2, etc.)
  getAvailableTests: () =>
    api.get("/quiz/aptitude/tests"),

  // Get questions for a specific test
  getAptitudeTest: (testId) =>
    api.get(`/quiz/aptitude/test/${testId}`),

  // Get questions with filters (old method - kept for compatibility)
  getQuestions: (category = null, difficulty = null, limit = null) =>
    api.get("/questions", {
      params: {
        category: category || undefined,
        difficulty: difficulty || undefined,
        limit: limit || undefined
      },
    }),

  // ✅ FIXED: Send answers directly, NOT wrapped in { answers: ... }
  submitAptitudeQuiz: (answers) =>
    api.post("/quiz/aptitude/submit", answers),

  getHistory: () => api.get("/quiz/history"),
};

// ================= DSA =================
export const dsaAPI = {
  getProblems: (topic = null, difficulty = null, limit = 200) =>
    api.get("/dsa", {
      params: {
        topic: topic || undefined,
        difficulty: difficulty || undefined,
        limit: limit || undefined
      },
    }),

  getProblem: (problemId) =>
    api.get(`/dsa/${problemId}`),

  practiceProblem: (problemId) =>
    api.post(`/dsa/problems/${problemId}/practice`),
};

// ================= RESUME =================
export const resumeAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    });
  },

  getLatestResume: () => api.get("/resume/latest"),
  getAnalysis: () => api.get("/resume/analysis"),
};

// ================= INTERVIEW =================
export const interviewAPI = {
  startInterview: (role, difficulty = "medium") =>
    api.post("/interviews/start", { role, difficulty }),

  chatInInterview: (interviewId, message) =>
    api.post(`/interviews/${interviewId}/chat`, { content: message }),

  endInterview: (interviewId) =>
    api.post(`/interviews/${interviewId}/end`),

  generateQuestions: (role) =>
    api.post("/interviews/generate-questions", { role }),

  getHistory: () => api.get("/interview/history"),
};

// ================= DASHBOARD =================
export const dashboardAPI = {
  getStats: () => api.get("/dashboard/stats"),
};

// ================= HEALTH =================
export const healthAPI = {
  check: () => api.get("/health"),
};

export default api;
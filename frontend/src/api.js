// frontend/src/api.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://interviewprep-ai-b.onrender.com";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// Add JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle 401 responses (expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("authToken");
      // Only redirect if not already on login/register page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.replace = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ================= AUTH =================
export const authAPI = {
  register: (email, password, name) =>
    api.post("/auth/register", {
      email,
      password,
      name,
    }),

  login: (email, password) =>
    api.post("/auth/login", {
      email,
      password,
    }),

  getCurrentUser: () => api.get("/auth/me"),
};

// ================= QUIZ =================
export const quizAPI = {
  getQuestions: (category = null, difficulty = null, limit = null) =>
    api.get("/questions", {
      params: { category: category || undefined, difficulty: difficulty || undefined, limit: limit || undefined },
    }),

  submitQuiz: (answers) =>
    api.post("/quiz/submit", {
      answers,
    }),

  // Alias for backward compatibility
  submitAptitudeQuiz: (answers) =>
    api.post("/quiz/submit", {
      answers,
    }),

  getHistory: () => api.get("/quiz/history"),

  getAvailableTests: () =>
    api.get("/quiz/aptitude/tests"),
  
  getAptitudeTest: (testId) =>
    api.get(`/quiz/aptitude/test/${testId}`),

  submitAptitudeQuiz: (answers) =>
    api.post("/quiz/aptitude/submit", answers),
};

// ================= DSA =================
export const dsaAPI = {
  getProblems: (topic = null, difficulty = null, limit = null) =>
    api.get("/dsa", {
      params: { topic: topic || undefined, difficulty: difficulty || undefined, limit: limit || undefined },
    }),

  getProblem: (problemId) =>
    api.get(`/dsa/${problemId}`),

  practiceProblem: (problemId) =>
    api.post(`/dsa/problems/${problemId}/practice`),
};

// ================= RESUME =================
// ================= RESUME =================
export const resumeAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/resume/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getLatestResume: () => api.get("/resume/latest"),

  getAnalysis: () => api.get("/resume/analysis"),
};

// ================= INTERVIEW =================
export const interviewAPI = {
  startInterview: (role, difficulty = "medium") =>
    api.post("/interview/start", {
      role,
      difficulty,
    }),

  chatInInterview: (interviewId, message) =>
    api.post(`/interview/${interviewId}/chat`, {
      message,
    }),

  endInterview: (interviewId) =>
    api.post(`/interview/${interviewId}/end`),

  generateQuestions: (job_role, skills = "") =>
    api.post("/interview/generate-questions", {
      job_role,
      skills,
    }),

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

// ================= SEED =================
export const seedAPI = {
  seedData: () => api.post("/seed-data"),
};

export default api;
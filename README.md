# InterviewPrep AI 🎯

<div align="center">

![InterviewPrep AI Banner](https://img.shields.io/badge/InterviewPrep-AI-667eea?style=for-the-badge&logo=artificial-intelligence&logoColor=white)

**Your personal AI interview coach for placement success**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-F29111?style=flat&logo=mysql&logoColor=white)](https://mysql.com)
[![Google Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev)
[![Railway](https://img.shields.io/badge/Database-Railway-0B0D0E?style=flat&logo=railway&logoColor=white)](https://railway.app)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](LICENSE)

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-interviewprep--8ker.onrender.com-667eea?style=for-the-badge)](https://interviewprep-8ker.onrender.com)

**[🌐 Open Live App](https://interviewprep-8ker.onrender.com)** · [🐛 Report Bug](https://github.com/A-may-a/InterviewPrep-AI/issues) · [✨ Request Feature](https://github.com/A-may-a/InterviewPrep-AI/issues)

> ⚡ **Note:** First load may take **30–60 seconds** due to Render free tier cold start. Please wait a moment!

</div>

---

## 📖 About

**InterviewPrep AI** is a full-stack AI-powered interview preparation platform built for engineering students preparing for campus placements and job interviews. It combines structured practice with cutting-edge AI to give you real-time feedback, personalized coaching, and comprehensive coverage of all placement topics.

> Built with React, FastAPI, MySQL, and Google Gemini API — fully deployed on Render with Railway database.

---

## 🌐 Live Deployment

| Service | Platform | URL |
|---------|----------|-----|
| **Frontend** | Render (Static Site) | [https://interviewprep-8ker.onrender.com](https://interviewprep-8ker.onrender.com) |
| **Backend API** | Render (Web Service) | [https://interviewprep-ai-b.onrender.com](https://interviewprep-ai-b.onrender.com) |
| **Database** | Railway (MySQL) | Managed MySQL — private |
| **API Docs** | Render | [https://interviewprep-ai-b.onrender.com/docs](https://interviewprep-ai-b.onrender.com/docs) |

---

## ✨ Features

### 📝 Aptitude Test Series
- **160+ questions** divided into timed test series (Test 1, Test 2, ...)
- Each test has **10 questions** with a **10-minute timer**
- Categories: Numerical, Logical, Verbal reasoning
- Detailed results with **question-by-question review** and explanations
- Score tracking and grade analysis

### 💻 DSA Problem Bank
- **100+ coding problems** covering all placement topics
- Topics: Arrays, Strings, Linked Lists, Trees, Graphs, Dynamic Programming, Sorting, Searching, Backtracking, Heap, Matrix, Bit Manipulation, Stack & Queue, Hashing
- Filter by **topic and difficulty** (Easy / Medium / Hard)
- Complete solutions with **time & space complexity** analysis
- **Mark as Practiced** to track your progress

### 📄 Resume Analyzer
- Upload your resume in **PDF or DOCX** format
- AI-powered analysis using **Google Gemini**
- Get detailed feedback on:
  - ✅ Strengths
  - ⚠️ Weaknesses
  - 💡 Improvement suggestions
  - 🛠️ Identified technical skills
  - ⭐ Overall rating out of 5

### 🎤 AI Mock Interviews
- **Real-time chat** with an AI interviewer
- Select your **role** (Backend, Frontend, Full Stack, Data Scientist, etc.)
- Choose **difficulty level** (Easy / Medium / Hard)
- Multi-turn conversation with follow-up questions
- Automated **performance feedback** with scores:
  - Communication Score
  - Technical Score
  - Confidence Score
  - Overall Rating

### 📊 Progress Dashboard
- Track **quizzes attempted** and average scores
- Monitor **DSA problems** practiced per topic
- Count of **mock interviews** completed
- Recent quiz history with score breakdown
- Topic-wise progress bars

### 🔐 Authentication
- Secure **JWT-based** authentication
- **Bcrypt** password hashing
- Protected routes for logged-in users
- Persistent login sessions

---

## 🛠️ Tech Stack

| Layer | Technology | Details |
|-------|-----------|---------|
| **Frontend** | React 18, React Router v6, Axios | Deployed on Render Static Site |
| **Backend** | FastAPI, Python 3.10+, Uvicorn | Deployed on Render Web Service |
| **Database** | MySQL 8.0, SQLAlchemy ORM | Hosted on **Railway** |
| **AI** | Google Gemini API (gemini-pro) | Free tier API |
| **Auth** | JWT (PyJWT), Bcrypt | Token-based auth |
| **Icons** | Lucide React | Open source icon library |

---

## 📁 Project Structure

```
InterviewPrep-AI/
│
├── backend/                    # FastAPI backend
│   ├── main.py                 # All API routes and endpoints
│   ├── models.py               # SQLAlchemy database models
│   ├── schemas.py              # Pydantic request/response schemas
│   ├── database.py             # Database connection setup
│   ├── auth.py                 # JWT authentication logic
│   ├── ai_service.py           # Google Gemini AI integration
│   ├── dsa_seed.py             # DSA problems seed data (100+ problems)
│   ├── full_seed_data.py       # Aptitude questions seed data (160+ questions)
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Environment variables (not committed)
│
├── frontend/                   # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.js        # Login UI
│   │   │   ├── RegisterPage.js     # Registration UI
│   │   │   ├── Dashboard.js        # Main dashboard
│   │   │   ├── QuizPage.js         # Aptitude quiz interface
│   │   │   ├── DSAPage.js          # DSA problem browser
│   │   │   ├── InterviewPage.js    # Mock interview chatbot
│   │   │   └── ResumePage.js       # Resume upload & analysis
│   │   ├── context/
│   │   │   └── AuthContext.js      # Global auth state
│   │   ├── api.js                  # Axios API client
│   │   ├── App.js                  # Main app with routing
│   │   └── index.js                # React entry point
│   ├── package.json
│   └── .env                        # Environment variables (not committed)
│
└── README.md
```

---

## 🗄️ Database Schema

The MySQL database is hosted on **Railway** and contains 7 tables:

```
users               → id, email, password_hash, name, created_at
aptitude_questions  → id, text, options (JSON), correct_answer, category, difficulty
dsa_problems        → id, title, topic, difficulty, solution, time_complexity
quiz_sessions       → id, user_id, score, correct_answers, total_questions
mock_interviews     → id, user_id, role, messages (JSON), rating, feedback
resumes             → id, user_id, file_path, ai_analysis (JSON)
progress            → id, user_id, topic, questions_practiced, average_score
```

---

## 🚀 Getting Started Locally

### Prerequisites

- Python 3.10+
- Node.js 16+
- MySQL 8.0+ (or use Railway for cloud MySQL)
- Google Gemini API key ([Get free key](https://ai.google.dev/))

---

### 1. Clone the Repository

```bash
git clone https://github.com/A-may-a/InterviewPrep-AI.git
cd InterviewPrep-AI
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt
```

Create `backend/.env`:

```env
# Database (use localhost for local, Railway URL for production)
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_NAME=interview_prep_db
DB_PORT=3306

# JWT
SECRET_KEY=your_super_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# AI
GEMINI_API_KEY=your_gemini_api_key_here

# Server
DEBUG=True
PORT=8000
CORS_ORIGINS=["http://localhost:3000"]
```

Create MySQL database:

```sql
CREATE DATABASE interview_prep_db;
```

Start backend:

```bash
uvicorn main:app --reload --port 8000
```

---

### 3. Seed the Database

```bash
# Add aptitude questions (160+ questions)
python full_seed_data.py

# Add DSA problems (100+ problems)
python dsa_seed.py
```

---

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:8000
```

Start frontend:

```bash
npm start
```

---

### 5. Open the App

Visit **http://localhost:3000** → Register → Start practicing!

---

## ☁️ Deployment Guide

### Database — Railway (MySQL)

1. Go to [railway.app](https://railway.app) → **New Project**
2. Add **MySQL** service
3. Copy the connection details (host, port, user, password, database name)
4. Use these credentials in your backend `.env` on Render

### Backend — Render.com

1. Push code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo → select `backend/` folder
4. Set **Start Command**:
   ```
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
5. Add **Environment Variables** in Render dashboard:
   ```
   DB_HOST=your-railway-host
   DB_PORT=your-railway-port
   DB_USER=your-railway-user
   DB_PASSWORD=your-railway-password
   DB_NAME=railway
   SECRET_KEY=your_secret_key
   GEMINI_API_KEY=your_gemini_key
   ```
6. Click **Deploy**

### Frontend — Render.com (Static Site)

1. Go to [render.com](https://render.com) → **New Static Site**
2. Connect your GitHub repo → select `frontend/` folder
3. Set **Build Command**: `npm install && npm run build`
4. Set **Publish Directory**: `build`
5. Add **Environment Variable**:
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com
   ```
6. Click **Deploy**

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| GET | `/auth/me` | Get current user |

### Quiz
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quiz/aptitude/tests` | List all aptitude tests |
| GET | `/quiz/aptitude/test/{id}` | Get test questions |
| POST | `/quiz/aptitude/submit` | Submit answers & get results |
| GET | `/quiz/history` | User's quiz history |

### DSA
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dsa` | List all problems (with filters) |
| GET | `/dsa/{id}` | Get problem with solution |
| POST | `/dsa/problems/{id}/practice` | Mark as practiced |

### Resume
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/resume/upload` | Upload & analyze resume |
| GET | `/resume/latest` | Get latest resume analysis |

### Interview
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/interviews/start` | Start new mock interview |
| POST | `/interviews/{id}/chat` | Send message to AI interviewer |
| POST | `/interviews/{id}/end` | End interview & get feedback |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Get user statistics |

> 📚 Full interactive Swagger API docs: [https://interviewprep-ai-b.onrender.com/docs](https://interviewprep-ai-b.onrender.com/docs)

---

## 📊 DSA Topics Covered

| Topic | Problems | Placement Importance |
|-------|----------|---------------------|
| Arrays | 15 | ⭐⭐⭐⭐⭐ |
| Strings | 10 | ⭐⭐⭐⭐⭐ |
| Trees | 9 | ⭐⭐⭐⭐⭐ |
| Dynamic Programming | 8 | ⭐⭐⭐⭐⭐ |
| Linked Lists | 7 | ⭐⭐⭐⭐ |
| Graphs | 6 | ⭐⭐⭐⭐ |
| Backtracking | 6 | ⭐⭐⭐⭐ |
| Sorting & Searching | 5 | ⭐⭐⭐ |
| Stack & Queue | 3 | ⭐⭐⭐ |
| Hashing | 3 | ⭐⭐⭐ |
| Matrix | 3 | ⭐⭐⭐ |
| Heap | 2 | ⭐⭐⭐ |
| Bit Manipulation | 3 | ⭐⭐ |

> All problems commonly asked in **TCS, Infosys, Wipro, Cognizant, Accenture, Amazon, Google & Microsoft** campus placement drives.

---

## 🔒 Security

- Passwords hashed with **bcrypt** (never stored in plain text)
- **JWT tokens** with configurable expiration for session management
- Environment variables for all secrets (`.env` never committed to GitHub)
- CORS configured for allowed origins only
- Input validation via Pydantic schemas on every endpoint
- Database credentials stored securely in Railway — never exposed

---

## 🤝 Contributing

Contributions are welcome!

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m "feat: add AmazingFeature"

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

---

## 🐛 Known Issues & Roadmap

### Current Known Issues
- [ ] Render free tier cold starts (~30–60s delay on first request after inactivity)
- [ ] Resume analysis requires a valid Gemini API key configured on backend

### Upcoming Features
- [ ] Video recording for mock interviews
- [ ] Leaderboard and competitive practice
- [ ] Email notifications and reminders
- [ ] Mobile app (React Native)
- [ ] Code editor integration for DSA problems
- [ ] Interview scheduling with mentors
- [ ] Certificate generation on test completion
- [ ] More aptitude question categories

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👩‍💻 Author

**Amaya**
- GitHub: [@A-may-a](https://github.com/A-may-a)
- Project Link: [https://github.com/A-may-a/InterviewPrep-AI](https://github.com/A-may-a/InterviewPrep-AI)
- Live App: [https://interviewprep-8ker.onrender.com](https://interviewprep-8ker.onrender.com)

---

## 🙏 Acknowledgements

- [Google Gemini API](https://ai.google.dev/) — for powering all AI features
- [FastAPI](https://fastapi.tiangolo.com/) — for the blazing fast Python backend
- [React](https://react.dev/) — for the component-based frontend framework
- [Railway](https://railway.app/) — for the managed MySQL cloud database
- [Render](https://render.com/) — for free frontend and backend deployment hosting
- [Lucide React](https://lucide.dev/) — for beautiful open-source icons
- All placement preparation resources that inspired the question bank

---

<div align="center">

**Made with ❤️ for engineering students preparing for their dream job**

🌐 **[Try it live → interviewprep-8ker.onrender.com](https://interviewprep-8ker.onrender.com)**

⭐ Star this repo if InterviewPrep AI helped your placement preparation!

</div>

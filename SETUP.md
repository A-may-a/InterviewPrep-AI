# AI Interview Preparation Platform - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL 5.7+
- Git

---

## BACKEND SETUP (FastAPI + Python)

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Edit `.env` file with your actual values:

```env
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_NAME=interview_prep_db
DB_PORT=3306

SECRET_KEY=generate_a_random_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

DEBUG=True
PORT=8000
CORS_ORIGINS=["http://localhost:3000"]
```

### 3. Create MySQL Database

```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE interview_prep_db;

-- Use the database
USE interview_prep_db;
```

### 4. Run Backend Server

```bash
cd backend
uvicorn main:app --reload --port 8000
```

The API will be available at: `http://localhost:8000`

Test with: `curl http://localhost:8000/health`

### 5. Seed Sample Data

```bash
curl -X POST http://localhost:8000/api/seed-data
```

---

## FRONTEND SETUP (React)

### 1. Install Node Dependencies

```bash
cd frontend
npm install
```

### 2. Configure API URL

Create `.env` file in frontend directory:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

### 3. Start Development Server

```bash
npm start
```

The frontend will open at: `http://localhost:3000`

---

## 📱 API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Quizzes
- `GET /api/quizzes/aptitude/questions` - Get questions
- `POST /api/quizzes/aptitude/submit` - Submit answers

### DSA
- `GET /api/dsa/problems` - List problems
- `GET /api/dsa/problems/{id}` - Get problem with solution
- `POST /api/dsa/problems/practice/{id}` - Mark as practiced

### Resume
- `POST /api/resume/upload` - Upload resume (PDF/DOCX)
- `GET /api/resume/latest` - Get latest resume

### Interviews
- `POST /api/interviews/generate-questions` - Generate questions
- `POST /api/interviews/start` - Start mock interview
- `POST /api/interviews/{id}/chat` - Send message
- `POST /api/interviews/{id}/end` - End interview & get feedback

### Dashboard
- `GET /api/dashboard/stats` - Get user statistics

---

## 🔑 Getting API Keys

### Google Gemini API
1. Go to: https://ai.google.dev/
2. Click "Get API Key"
3. Create new API key in Google Cloud Console
4. Add to `.env` as `GEMINI_API_KEY`

### OpenAI API (Optional)
1. Go to: https://platform.openai.com/
2. Sign up / login
3. Create API key
4. Add to `.env` as `OPENAI_API_KEY`

---

## 🛠 Database Schema

```
users
  - id (PK)
  - email (unique)
  - password_hash
  - name
  - target_role
  - created_at

aptitude_questions
  - id (PK)
  - text
  - options (JSON)
  - correct_answer
  - category
  - difficulty

dsa_problems
  - id (PK)
  - title
  - description
  - topic
  - difficulty
  - solution
  - time_complexity
  - space_complexity

quiz_sessions
  - id (PK)
  - user_id (FK)
  - score
  - correct_answers
  - total_questions

mock_interviews
  - id (PK)
  - user_id (FK)
  - role
  - messages (JSON)
  - feedback

resumes
  - id (PK)
  - user_id (FK)
  - file_path
  - ai_analysis (JSON)

progress
  - id (PK)
  - user_id (FK)
  - topic
  - questions_practiced
  - average_score
```

---

## 📝 Test Credentials

After running `/api/seed-data`:

```
Email: test@example.com
Password: test123
```

(Or create your own via /register)

---

## 🚀 DEPLOYMENT

### Deploy Backend (Render.com)

1. Push to GitHub
2. Go to render.com
3. Create new Web Service
4. Connect GitHub repo
5. Set environment variables
6. Deploy

### Deploy Frontend (Vercel)

```bash
npm install -g vercel
vercel login
vercel
```

### Database (PlanetScale)

1. Go to planetscale.com
2. Create MySQL database
3. Get connection string
4. Update `.env` with PlanetScale credentials

---

## 🐛 Troubleshooting

### Backend won't start
- Check MySQL is running: `mysql -u root -p`
- Verify `.env` file has correct credentials
- Clear __pycache__: `find . -type d -name __pycache__ -exec rm -r {} +`

### Frontend can't connect
- Check API URL in `.env`
- Ensure backend is running on port 8000
- Check CORS settings in backend

### API Key errors
- Verify API keys in `.env`
- Check API key has correct permissions
- Ensure API is enabled in Google Cloud / OpenAI

---

## 📚 Technology Stack

**Backend:**
- FastAPI - Web framework
- SQLAlchemy - ORM
- MySQL - Database
- PyJWT - Authentication
- Google Gemini - AI features
- Uvicorn - ASGI server

**Frontend:**
- React 18 - UI framework
- React Router - Navigation
- Axios - HTTP client
- Recharts - Charts
- Lucide React - Icons

---

## 🎯 Features Checklist

- ✅ User authentication (JWT)
- ✅ Aptitude quiz engine
- ✅ DSA problem bank with solutions
- ✅ Resume upload & AI analysis
- ✅ AI-generated interview questions
- ✅ Mock interview chatbot
- ✅ Progress tracking dashboard
- ✅ Real-time feedback

---

## 💡 Next Steps

1. Customize questions and problems
2. Add more DSA topics
3. Implement payment (for premium features)
4. Add analytics dashboard
5. Build mobile app with React Native
6. Add video recording for interviews

---

**Questions? Check API docs at `/docs` (FastAPI Swagger)**

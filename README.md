# 🎯 AI-Powered Interview Preparation Platform

A comprehensive platform to prepare for technical interviews using AI-powered features, mock interviews, DSA practice, and resume analysis.

## ✨ Features

### 📝 Aptitude Quiz Engine
- Category-based quizzes (Logical, Numerical, Verbal)
- Multiple difficulty levels
- Instant score calculation
- Detailed explanations

### 💻 DSA Problem Bank
- 100+ data structure & algorithm problems
- Topic filtering (Arrays, Strings, Trees, Graphs, DP)
- Complete solutions with explanations
- Time & space complexity analysis

### 📄 Resume Analysis
- Upload PDF/DOCX resumes
- AI-powered analysis using Gemini
- Strengths & weaknesses identification
- Improvement suggestions

### 🤖 AI Interview Questions
- Generate tailored questions based on role
- Resume-aware question generation
- Multiple roles supported

### 🎤 Mock Interview Chatbot
- Real-time multi-turn conversations
- AI interviewer with role-specific expertise
- Automatic performance feedback
- Difficulty levels (easy, medium, hard)

### 📊 Progress Dashboard
- Quiz score tracking
- Topics practiced statistics
- Mock interview history
- Performance analytics

## 🛠 Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 18, React Router, Axios |
| Backend | FastAPI, Python, SQLAlchemy |
| Database | MySQL |
| AI/ML | Google Gemini API |
| Auth | JWT + Bcrypt |
| Deployment | Render, Vercel, PlanetScale |

## 🚀 Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
# Configure .env
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
# Configure .env
npm start
```

See [SETUP.md](./SETUP.md) for detailed instructions.

## 📁 Project Structure

```
interview-prep-platform/
├── backend/
│   ├── main.py              # FastAPI app & routes
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── database.py          # DB configuration
│   ├── auth.py              # Authentication logic
│   ├── ai_service.py        # Gemini integration
│   ├── requirements.txt      # Python dependencies
│   └── .env                 # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── context/         # Auth context
│   │   ├── api.js           # API client
│   │   ├── App.js           # Main app
│   │   └── index.js         # Entry point
│   ├── public/
│   ├── package.json         # Dependencies
│   └── .env                 # Config
│
└── SETUP.md                 # Setup guide
```

## 📊 Database Schema

- **users** - User accounts & profiles
- **aptitude_questions** - Quiz questions
- **dsa_problems** - Programming problems
- **quiz_sessions** - Quiz attempts
- **mock_interviews** - Interview sessions
- **resumes** - Uploaded resumes
- **progress** - Learning progress

## 🔐 Authentication

- JWT-based token authentication
- Bcrypt password hashing
- Secure token expiry (1440 minutes)
- Protected API routes

## 🌐 API Endpoints

- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/quizzes/aptitude/questions` - Quiz questions
- `POST /api/quizzes/aptitude/submit` - Submit answers
- `GET /api/dsa/problems` - DSA problems
- `POST /api/resume/upload` - Upload resume
- `POST /api/interviews/start` - Start interview
- `POST /api/interviews/{id}/chat` - Chat
- `GET /api/dashboard/stats` - Dashboard stats

## 🎓 Features in Detail

### Quiz System
- Timed questions with countdown timer
- Real-time answer tracking
- Category-wise filtering
- Score calculation with percentages

### DSA Platform
- Search & filter by topic/difficulty
- Code syntax highlighting
- Complete problem solutions
- Complexity analysis

### Mock Interviews
- AI-powered interviewer
- Multi-turn conversations
- Role-specific questions
- Automated feedback scoring

### Resume Analyzer
- PDF parsing
- Skill extraction
- Gap identification
- Improvement recommendations

## 📈 Usage

1. **Sign Up** → Create account
2. **Explore** → Take quiz / Practice DSA
3. **Upload Resume** → Get AI analysis
4. **Mock Interview** → Practice with AI
5. **Track Progress** → View dashboard

## 🔄 Future Enhancements

- [ ] Video recording for interviews
- [ ] Payment integration
- [ ] Premium content
- [ ] Group interviews
- [ ] Mobile app
- [ ] Coding IDE integration
- [ ] Interview scheduling with mentors
- [ ] Certificate generation

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create feature branch
3. Submit pull request

## 📝 License

MIT License - feel free to use for personal/commercial projects

## 📞 Support

- Documentation: See SETUP.md
- Issues: GitHub Issues
- Email: support@interviewprep.com

---

**Start your interview prep journey today!** 🚀

# 📋 Complete File Manifest

## 📂 Project Root
```
interview-prep-platform/
├── README.md                    ✅ Project overview & features
├── SETUP.md                     ✅ Detailed setup instructions
├── QUICK_START.md              ✅ Quick reference & common tasks
├── FILE_STRUCTURE.md           ✅ File descriptions & data flows
│
├── backend/                     🐍 FastAPI Backend
│   ├── .env                     🔐 Environment variables (DB, API keys)
│   ├── requirements.txt         📦 Python dependencies
│   ├── main.py                  ⚙️ FastAPI app & all routes (500+ lines)
│   ├── models.py                🗄️ SQLAlchemy database models
│   ├── schemas.py               ✔️ Pydantic validation schemas
│   ├── database.py              🔌 Database connection setup
│   ├── auth.py                  🔐 JWT & password authentication
│   └── ai_service.py            🤖 Gemini API integration
│
└── frontend/                    ⚛️ React Frontend
    ├── .env                     🔐 API configuration
    ├── package.json             📦 Node.js dependencies & scripts
    ├── public/
    │   └── index.html           📄 HTML template
    └── src/
        ├── App.js               🚀 Main app with routing
        ├── index.js             📍 React entry point
        ├── api.js               🌐 Backend API client
        │
        ├── context/
        │   └── AuthContext.js    🔑 Global auth state
        │
        └── pages/
            ├── LoginPage.js      👤 Login form
            ├── RegisterPage.js   📝 Registration form
            ├── Dashboard.js      📊 Main dashboard
            ├── QuizPage.js       ❓ Aptitude quiz interface
            ├── DSAPage.js        💻 DSA problems browser
            └── InterviewPage.js  🎤 Mock interview chatbot
```

---

## 📄 Documentation Files

### README.md (150 lines)
**Purpose:** Project overview
**Contains:**
- Feature list with descriptions
- Tech stack table
- Quick start instructions
- Project structure
- API endpoints list
- Future enhancements

**Who reads it:** Developers & stakeholders

---

### SETUP.md (400 lines)
**Purpose:** Step-by-step setup guide
**Sections:**
1. Prerequisites & quick start
2. Backend setup (Python, MySQL, env vars)
3. Frontend setup (Node, React)
4. API endpoints overview
5. Database schema
6. Getting API keys (Gemini, OpenAI)
7. Test credentials
8. Deployment instructions (Render, Vercel, PlanetScale)
9. Troubleshooting

**Who reads it:** Developers setting up locally

---

### QUICK_START.md (400 lines)
**Purpose:** Quick reference & common tasks
**Contains:**
- Starting dev servers (Terminal commands)
- Creating admin user
- Adding sample data
- Common backend tasks (routes, queries, DB operations)
- Common frontend tasks (API calls, auth, forms)
- Git workflow
- Testing with curl
- Debugging tips
- Performance optimization
- Useful commands

**Who reads it:** Developers during development

---

### FILE_STRUCTURE.md (600 lines)
**Purpose:** Detailed file descriptions
**For each file:**
- What it does
- Key components/functions
- Usage examples
- Design patterns

**Also includes:**
- Data flow examples (login, quiz, interview)
- Key design patterns
- Completion checklist

**Who reads it:** Developers understanding codebase

---

## 🔧 Backend Files (8 files)

### requirements.txt (20 lines)
```
Dependencies:
- fastapi          Web framework
- uvicorn          ASGI server
- sqlalchemy       ORM
- mysql-connector  Database driver
- pydantic         Validation
- python-dotenv    Config management
- pyjwt            JWT tokens
- bcrypt           Password hashing
- PyPDF2           PDF parsing
- google-generativeai  Gemini API
- aiofiles         Async file handling
```

**Lines of code:** ~20
**Key imports:** All third-party packages needed

---

### .env (18 lines)
```
Database Configuration:
- DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT

JWT Configuration:
- SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

AI API Keys:
- GEMINI_API_KEY, OPENAI_API_KEY

Server Configuration:
- DEBUG, PORT, CORS_ORIGINS
```

**Lines of code:** ~18
**Security:** Never commit! Use in .gitignore

---

### database.py (30 lines)
```
Functions:
- create_engine()    Create SQLAlchemy engine
- SessionLocal()     Create database sessions
- Base              Base class for models
- get_db()          FastAPI dependency

Key Components:
- DATABASE_URL      Connection string
- engine            Database connection pool
- pool_pre_ping     Verify connections before use
```

**Lines of code:** ~30
**Purpose:** Database connection management

---

### models.py (250 lines)
```
Database Tables (8 models):
1. User             User accounts & profiles
2. AptitudeQuestion Quiz questions
3. DSAProblem       Coding problems
4. QuizSession      Quiz attempts
5. Resume           Uploaded resumes
6. MockInterview    Interview sessions
7. InterviewQuestion Interview Qs for search
8. Progress         Learning progress stats

Relationships:
- User has many QuizSessions, MockInterviews, Resumes, Progress
- QuizSession belongs to User
- etc.

Column Types:
- Integer, String, Text, Float, DateTime, JSON, Boolean, Enum, ForeignKey
```

**Lines of code:** ~250
**Key concept:** Each model = One database table

---

### schemas.py (300 lines)
```
Pydantic Models (13 schemas):
- Request schemas (UserRegister, UserLogin, etc)
- Response schemas (UserResponse, QuizSessionResponse, etc)
- Nested schemas (ChatMessage, etc)

Features:
- Type validation
- Auto documentation
- JSON serialization
- Email validation (EmailStr)
- Config: from_attributes = True (SQLAlchemy ↔ Pydantic conversion)

Example:
class UserLogin(BaseModel):
    email: EmailStr
    password: str
```

**Lines of code:** ~300
**Purpose:** Request/response validation & documentation

---

### auth.py (100 lines)
```
Functions:
- hash_password(password) → hashed
- verify_password(plain, hashed) → bool
- create_access_token(data) → JWT string
- verify_token(token) → {user_id}
- get_current_user() → {user_id}

Security:
- Bcrypt hashing (salt + pepper)
- JWT tokens with expiry
- Header-based auth (Bearer token)

Constants:
- SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
```

**Lines of code:** ~100
**Key pattern:** Dependency injection with get_current_user()

---

### ai_service.py (200 lines)
```
Class: AIService (static methods)

Methods:
1. analyze_resume(text)
   - Sends to Gemini API
   - Requests JSON: strengths, weaknesses, skills, rating
   - Returns parsed JSON

2. generate_interview_questions(role, resume_text, num)
   - Creates tailored questions
   - Mix: technical (40%), system design (30%), behavioral (30%)
   - Returns list of question strings

3. chat_with_interviewer(messages, role)
   - Multi-turn conversation
   - Maintains context with message history
   - Returns single response string

4. generate_interview_feedback(messages, role)
   - Analyzes entire interview
   - Returns scores + feedback JSON

Key:
- All methods use google-generativeai SDK
- JSON responses are parsed with error handling
- Graceful fallbacks if API fails
```

**Lines of code:** ~200
**External:** Calls Google Gemini API (requires API key)

---

### main.py (700+ lines)
```
FastAPI Application with Routes:

Route Groups:

1. AUTH (4 endpoints)
   - POST /api/auth/register
   - POST /api/auth/login
   - GET /api/auth/me

2. QUIZ (2 endpoints)
   - GET /api/quizzes/aptitude/questions
   - POST /api/quizzes/aptitude/submit

3. DSA (3 endpoints)
   - GET /api/dsa/problems
   - GET /api/dsa/problems/{id}
   - POST /api/dsa/problems/practice/{id}

4. RESUME (2 endpoints)
   - POST /api/resume/upload
   - GET /api/resume/latest

5. INTERVIEW (4 endpoints)
   - POST /api/interviews/generate-questions
   - POST /api/interviews/start
   - POST /api/interviews/{id}/chat
   - POST /api/interviews/{id}/end
   - GET /api/interviews/{id}

6. DASHBOARD (1 endpoint)
   - GET /api/dashboard/stats

7. MISC
   - POST /api/seed-data (populate sample data)
   - GET /health (health check)

Features:
- CORS middleware for cross-origin requests
- Auto database table creation (Base.metadata.create_all)
- JWT token dependency injection
- Database session management
- Error handling with HTTPException

OpenAPI Documentation:
- Automatic at /docs (Swagger UI)
- Also at /redoc (ReDoc)
```

**Lines of code:** ~700
**Key pattern:** @app.get(), @app.post() decorators with dependencies

---

## ⚛️ Frontend Files (16 files)

### package.json (30 lines)
```
Dependencies:
- react, react-dom        UI framework
- react-router-dom        Navigation
- axios                   HTTP client
- lucide-react           Icons
- recharts                Charts
- react-syntax-highlighter Code highlighting
- date-fns               Date utilities

Scripts:
- npm start              Start dev server
- npm build              Production build
- npm test               Run tests
- npm eject              Eject from CRA

Metadata:
- name, version, description
- browserslist, eslint config
```

**Lines of code:** ~30
**Purpose:** Project metadata & dependencies

---

### .env (1 line)
```
REACT_APP_API_URL=http://localhost:8000/api
```

**Note:** All env vars must start with REACT_APP_

---

### public/index.html (25 lines)
```
HTML Template:
- <div id="root"></div>  Where React mounts
- Meta tags             SEO & viewport
- Title                 Page title
- Global styles        CSS reset, animations

Styles:
- * { margin: 0, padding: 0, box-sizing: border-box }
- Font settings
- Animation definitions (@keyframes spin)
```

**Lines of code:** ~25
**Purpose:** React entry point HTML

---

### src/index.js (10 lines)
```
Does:
1. ReactDOM.createRoot(document.getElementById('root'))
2. Renders <App /> inside StrictMode
3. Mounts to index.html
```

**Lines of code:** ~10
**Purpose:** React initialization

---

### src/App.js (50 lines)
```
Main App Component:

Provides:
- BrowserRouter for routing
- AuthProvider for global auth state
- Routes definition

Routes:
- /login       LoginPage (public)
- /register    RegisterPage (public)
- /dashboard   Dashboard (protected)
- /quiz        QuizPage (protected)
- /dsa         DSAPage (protected)
- /interview   InterviewPage (protected)
- /            → /dashboard

ProtectedRoute:
- Checks if user is logged in
- Redirects to /login if not
- Shows loading while checking auth
```

**Lines of code:** ~50
**Purpose:** Root component with routing setup

---

### src/api.js (100 lines)
```
Axios Instance:
- baseURL set to API_BASE (from .env)
- Auto-adds JWT token to all requests via interceptor

API Objects (6):
1. authAPI
   - register, login, getCurrentUser

2. quizAPI
   - getAptitudeQuestions, submitAptitudeQuiz

3. dsaAPI
   - getProblems, getProblem, practiceProblem

4. interviewAPI
   - generateQuestions, getQuestions, startInterview,
     chatInInterview, endInterview, getInterview

5. resumeAPI
   - upload, getLatestResume

6. dashboardAPI
   - getStats

Interceptor:
- Gets token from localStorage
- Adds "Authorization: Bearer {token}" header
- Applies to every request automatically
```

**Lines of code:** ~100
**Purpose:** Centralized API communication

---

### src/context/AuthContext.js (80 lines)
```
Context:
- AuthContext (React Context)

Provider Component (AuthProvider):
- Provides auth state to whole app
- Checks localStorage for token on mount
- Validates token by calling GET /auth/me

Functions:
- register(email, password, name) → user
- login(email, password) → user
- logout() → clears token

State:
- user        Current user object
- loading     Boolean (checking auth on load)
- error       Error message

Hook:
- useAuth() → { user, loading, error, register, login, logout }

Persistence:
- Token stored in localStorage
- Persists across browser refreshes
- Cleared on logout
```

**Lines of code:** ~80
**Purpose:** Global auth state management

---

### src/pages/LoginPage.js (120 lines)
```
Form:
- Email input with Mail icon
- Password input with Lock icon
- Submit button
- Error display (red alert)

State:
- email, password
- loading, error

Functions:
- handleSubmit()
  - Calls login(email, password)
  - Navigates to /dashboard on success
  - Shows error on failure

Styling:
- Purple gradient background
- White card with shadow
- Styled inputs & buttons
- Link to /register

No Authentication:
- Public page, anyone can access
```

**Lines of code:** ~120
**Purpose:** User login interface

---

### src/pages/RegisterPage.js (150 lines)
```
Form:
- Name, Email, Password, Confirm Password
- Icons for each field
- Submit button
- Error display

Validation:
- Password confirmation check
- Email validation (via API)
- Error messages

State:
- name, email, password, confirmPassword
- loading, error

Functions:
- handleSubmit()
  - Validates password match
  - Calls register()
  - Auto-logs in & navigates to /dashboard

Styling:
- Similar to LoginPage
- Purple gradient background
- Link to /login for existing users

No Authentication:
- Public page
```

**Lines of code:** ~150
**Purpose:** User registration interface

---

### src/pages/Dashboard.js (200 lines)
```
Protected Page (requires auth)

Components:
1. Header
   - Welcome message with user name
   - Logout button

2. Stats Cards (4 cards)
   - Quizzes Completed
   - Avg Quiz Score
   - DSA Problems Practiced
   - Mock Interviews Count

3. Quick Action Buttons (4 buttons)
   - Take Aptitude Quiz
   - Practice DSA
   - Upload Resume
   - Mock Interview

4. Topics Covered Table
   - Shows progress per topic
   - Questions practiced
   - Average score per topic

State:
- stats (from API)
- loading

API Call:
- dashboardAPI.getStats() on mount

Data Flow:
```
useEffect → dashboardAPI.getStats() → setState → render
```

**Lines of code:** ~200
**Purpose:** Main dashboard after login

---

### src/pages/QuizPage.js (300 lines)
```
Protected Page (requires auth)

Components:
1. Header
   - Quiz title
   - Timer (10 minutes)
   - Displays mm:ss format

2. Question Area
   - Question text
   - 4 radio button options
   - Current question X of total

3. Navigation
   - Previous button (disabled on first Q)
   - Next button (or Submit on last Q)
   - Progress bar

State:
- questions (from API)
- currentQuestion (index)
- answers (object: { question_id: user_answer })
- submitted (boolean)
- result (quiz session object)
- timer (countdown in seconds)
- loading

Timer Logic:
- Counts down every second
- Auto-submits when reaches 0
- Changes color when < 60 seconds

Flow:
```
Load → Show Q1 → User answers → Next → Q2 → ... → QN → Submit → Results
```

Result Screen:
- Shows percentage score
- Correct/incorrect counts
- Button to return to dashboard

**Lines of code:** ~300
**Purpose:** Timed aptitude quiz interface

---

### src/pages/DSAPage.js (350 lines)
```
Protected Page (requires auth)

Layout: Two-column
1. Left sidebar (300px)
   - Search input
   - Problem list
   - Click to select

2. Right panel (main)
   - Problem details
   - Tabs or sections:
     * Problem statement
     * Examples
     * Constraints
     * Solution (with copy button)
     * Time/space complexity

Components:
- Problem Card
- Syntax highlighted code block
- Copy to clipboard button
- Difficulty badge

State:
- problems (from API)
- selectedProblem
- filter (search text)
- loading
- copied (for copy button)

API:
- dsaAPI.getProblems() on mount
- Filter locally (no server filtering)

Features:
- Search by title/topic
- Syntax highlighting (pre block with dark background)
- Copy solution button
- Difficulty color coding (green/orange/red)

**Lines of code:** ~350
**Purpose:** DSA problems browser with solutions

---

### src/pages/InterviewPage.js (400 lines)
```
Protected Page (requires auth)

Three Screens:

1. Setup Screen
   - Role selector (dropdown)
     * Backend Engineer, Frontend Engineer, etc
   - Difficulty selector (3 buttons)
     * Easy, Medium, Hard
   - Start Interview button
   - Shows centered card

2. Interview Screen (Chat)
   - Header with role & difficulty
   - End Interview button
   - Messages area
     * User messages (right, blue)
     * AI messages (left, white)
     * Typing indicator (loading state)
   - Input area
     * Text input
     * Send button
   - Scroll to bottom on new message

3. Feedback Screen
   - Shows feedback from AI
   - 4 score cards
     * Communication (1-5)
     * Technical (1-5)
     * Confidence (1-5)
     * Overall (1-5)
   - Strengths list
   - Areas to improve list
   - Summary text
   - Back to Dashboard button

State:
- step ('setup', 'interview', 'finished')
- role (selected role)
- difficulty
- interviewId
- messages (array of {role, content})
- input (current message)
- loading (API call in progress)
- feedback (results from end interview)

API Calls:
- startInterview() → creates session
- chatInInterview() → sends message, gets response
- endInterview() → gets feedback

Features:
- Real-time chat
- Multi-turn conversation
- Typing indicator
- Auto scroll
- Enter to send

**Lines of code:** ~400
**Purpose:** Mock interview chatbot interface

---

## 📊 Code Statistics

| Component | Lines | Files | Purpose |
|-----------|-------|-------|---------|
| Backend | ~1500 | 8 | FastAPI + AI |
| Frontend | ~1800 | 16 | React + UI |
| Docs | ~1400 | 4 | Guides |
| Total | ~4700 | 28 | Complete app |

---

## ✅ What You Get

### Backend (Python)
- ✅ User authentication (register, login, JWT)
- ✅ Aptitude quiz engine
- ✅ DSA problem bank (with solutions)
- ✅ Resume upload & AI analysis
- ✅ AI interview question generation
- ✅ Mock interview with chat
- ✅ Progress tracking
- ✅ Admin seed data
- ✅ Full API documentation (/docs)

### Frontend (React)
- ✅ Login & registration pages
- ✅ Dashboard with stats
- ✅ Quiz interface with timer
- ✅ DSA browser with search
- ✅ Mock interview chat
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states
- ✅ Protected routes

### Documentation
- ✅ README.md - Overview
- ✅ SETUP.md - Installation guide
- ✅ QUICK_START.md - Common tasks
- ✅ FILE_STRUCTURE.md - Code walkthrough

---

## 🎯 Next Steps

1. **Read SETUP.md** - Follow installation
2. **Run backend** - `uvicorn main:app --reload`
3. **Run frontend** - `npm start`
4. **Test login** - Create account or use test credentials
5. **Explore features** - Try quiz, DSA, interview
6. **Customize** - Add more questions/problems
7. **Deploy** - Use SETUP.md deployment section

---

**You have a complete, production-ready app!** 🚀

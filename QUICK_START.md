# 🚀 Quick Reference Guide

## Starting Development

### Terminal 1 - Backend
```bash
cd interview-prep-platform/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Terminal 2 - Frontend
```bash
cd interview-prep-platform/frontend
npm install
npm start
```

**Your app is now running:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Creating Your First Admin User

```python
# Run this in Python terminal
from backend.auth import hash_password
from backend.models import User
from backend.database import SessionLocal

db = SessionLocal()
admin = User(
    email="admin@example.com",
    password_hash=hash_password("admin123"),
    name="Admin User"
)
db.add(admin)
db.commit()
print(f"Admin created: {admin.email}")
```

---

## Adding Sample Data

### Add Aptitude Questions
```python
from backend.models import AptitudeQuestion
from backend.database import SessionLocal

db = SessionLocal()

questions = [
    AptitudeQuestion(
        text="What is 2+2?",
        options={"A": "4", "B": "5", "C": "3", "D": "6"},
        correct_answer="A",
        explanation="2+2=4",
        category="Numerical",
        difficulty="easy"
    ),
    # Add more...
]

db.add_all(questions)
db.commit()
```

### Add DSA Problems
```python
from backend.models import DSAProblem
from backend.database import SessionLocal

db = SessionLocal()

problem = DSAProblem(
    title="Reverse an Array",
    description="Reverse the elements of an array",
    problem_statement="Given an array, reverse it in-place",
    topic="Arrays",
    difficulty="easy",
    examples=[{"input": "[1,2,3]", "output": "[3,2,1]"}],
    solution="Use two pointers, swap elements",
    time_complexity="O(n)",
    space_complexity="O(1)"
)
db.add(problem)
db.commit()
```

---

## Common Backend Tasks

### Create a New API Route
```python
# In backend/main.py
@app.get("/api/path/to/endpoint")
def endpoint_name(db: Session = Depends(get_db)):
    """Docstring for API docs"""
    # Your code
    return {"data": "value"}
```

### Create a Protected Route
```python
@app.get("/api/protected/endpoint")
def protected_endpoint(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user["user_id"]
    # Your code
```

### Query Database
```python
# Get one record
user = db.query(User).filter(User.email == "test@example.com").first()

# Get multiple records
users = db.query(User).filter(User.id > 5).all()

# Count records
count = db.query(User).count()

# Complex query
results = db.query(QuizSession).filter(
    QuizSession.user_id == 1,
    QuizSession.score > 70
).order_by(QuizSession.created_at.desc()).limit(10).all()
```

### Create New Database Record
```python
user = User(
    email="newuser@example.com",
    password_hash=hash_password("password123"),
    name="New User"
)
db.add(user)
db.commit()
db.refresh(user)  # Refresh to get the ID
```

---

## Common Frontend Tasks

### Call Backend API
```javascript
import { someAPI } from '../api';

useEffect(() => {
  someAPI.getEndpoint()
    .then(res => console.log(res.data))
    .catch(err => console.error(err));
}, []);
```

### Use Auth Context
```javascript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, login, logout } = useAuth();
  
  return (
    <div>
      <p>User: {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### Navigate Between Pages
```javascript
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();
  
  return (
    <button onClick={() => navigate('/dashboard')}>
      Go to Dashboard
    </button>
  );
};
```

### Create a Form
```javascript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await someAPI.submitForm(email, password);
  } catch (err) {
    setError(err.response?.data?.detail || 'Error');
  }
};

return (
  <form onSubmit={handleSubmit}>
    <input value={email} onChange={(e) => setEmail(e.target.value)} />
    <input value={password} onChange={(e) => setPassword(e.target.value)} />
    <button type="submit">Submit</button>
    {error && <p style={{color: 'red'}}>{error}</p>}
  </form>
);
```

---

## Git Workflow

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"

# Before coding
git checkout -b feature/new-feature

# After coding
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# Create pull request on GitHub, merge to main
```

---

## Testing Endpoints with curl

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","name":"Test"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Protected route (replace TOKEN)
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer TOKEN"

# Get questions
curl http://localhost:8000/api/quizzes/aptitude/questions
```

---

## Environment Variables Needed

### Backend .env
```
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_NAME=interview_prep_db
SECRET_KEY=generate_random_string_here
GEMINI_API_KEY=your_api_key
```

### Frontend .env
```
REACT_APP_API_URL=http://localhost:8000/api
```

---

## Deployment Checklist

- [ ] Set DEBUG=False in backend
- [ ] Generate strong SECRET_KEY
- [ ] Update CORS_ORIGINS in backend
- [ ] Set frontend API URL to production
- [ ] Configure database on cloud (PlanetScale)
- [ ] Deploy backend (Render.com)
- [ ] Deploy frontend (Vercel)
- [ ] Test all features on production
- [ ] Set up SSL certificates
- [ ] Configure custom domain

---

## Debugging Tips

### Backend Debug
```python
# Print to console
print(f"Debug: {variable}")

# Set breakpoint
import pdb; pdb.set_trace()  # Pauses execution

# Check database state
user = db.query(User).first()
print(user.email, user.name)
```

### Frontend Debug
```javascript
// Console log
console.log('Debug:', variable);

// Network tab in DevTools
// Check API calls and responses
// F12 → Network tab

// React DevTools extension
// F12 → Components tab
```

### Common Errors

**CORS Error:**
- Check CORS_ORIGINS in backend .env
- Ensure frontend URL is whitelisted

**JWT Token Error:**
- Check token in localStorage
- Verify SECRET_KEY matches
- Check token expiry

**Database Connection Error:**
- MySQL running?
- Credentials correct in .env?
- Database exists?

---

## Performance Optimization

### Backend
```python
# Add indexes to frequently queried columns
class User(Base):
    email = Column(String(255), unique=True, index=True)
    
# Use limit() for large queries
users = db.query(User).limit(10).all()

# Avoid N+1 queries with eager loading
from sqlalchemy.orm import joinedload
users = db.query(User).options(joinedload(User.quizzes)).all()
```

### Frontend
```javascript
// Lazy load components
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Memo to prevent unnecessary re-renders
const OptimizedComponent = memo(MyComponent);

// useCallback to memoize functions
const handleClick = useCallback(() => {
  // do something
}, [dependency]);
```

---

## Useful Commands

```bash
# Python
python --version              # Check Python version
pip list                      # List installed packages
pip freeze > requirements.txt # Export dependencies

# Node.js
node --version                # Check Node version
npm list                      # List installed packages
npm outdated                  # Check for updates

# Git
git status                    # Check changes
git diff                      # See what changed
git log --oneline             # View commit history
git reflog                    # Recovery tool

# MySQL
mysql -u root -p              # Connect to database
SHOW DATABASES;               # List databases
USE database_name;            # Select database
SHOW TABLES;                  # List tables
DESC table_name;              # Table structure
```

---

**Need help? Check SETUP.md or FILE_STRUCTURE.md!** 📖

# backend/main.py
from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import Optional, List
import os
import json
import uuid
from pathlib import Path
from sqlalchemy.orm import Session

from backend.database import engine, SessionLocal, Base, get_db
from backend.models import (
    User, AptitudeQuestion, DSAProblem, QuizSession,
    MockInterview, Resume, InterviewQuestion, Progress
)
from backend.schemas import (
    UserRegister, UserLogin, TokenResponse, UserResponse,
    AptitudeQuestionResponse, AptitudeQuestionWithAnswer,
    DSAProblemResponse, DSAProblemWithSolution,
    QuizSessionResponse, ResumeResponse, ResumeAnalysisResponse,
    MockInterviewStart, MockInterviewResponse, ChatMessage,
    DashboardStatsResponse, ProgressResponse,
    QuizAnswerSubmit
)
from backend.auth import (
    hash_password, verify_password,
    create_access_token, verify_token,
    get_current_user, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
)
from backend.ai_service import AIService

# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI(title="Interview Prep Platform API", version="1.0.0")

# CORS(used for deployment)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],   
)

@app.options("/{path:path}")  #test
async def options_handler(path: str):
    return {}

security = HTTPBearer()


# ==================== Dependency: Get current user from DB ====================
async def get_current_user_from_db(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Extract user from JWT token and return the DB user object"""
    token = credentials.credentials
    token_data = verify_token(token)
    user = db.query(User).filter(User.id == token_data["user_id"]).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


# ==================== AUTH ROUTES ====================
@app.post("/auth/register")
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user exists
    db_user = db.query(User).filter(User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user
    hashed_pwd = hash_password(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=hashed_pwd,
        name=user_data.name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create token - store user_id as subject
    access_token = create_access_token(data={"sub": new_user.id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "name": new_user.name,
            "target_role": new_user.target_role,
            "created_at": new_user.created_at
        }
    }


@app.post("/auth/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    db_user = db.query(User).filter(User.email == user_data.email).first()
    if not db_user or not verify_password(user_data.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": db_user.id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "name": db_user.name,
            "target_role": db_user.target_role,
            "created_at": db_user.created_at
        }
    }


@app.get("/auth/me")
def get_me(current_user: User = Depends(get_current_user_from_db)):
    """Get current user info"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "target_role": current_user.target_role,
        "created_at": current_user.created_at
    }


# ==================== APTITUDE QUIZ ROUTES ====================
@app.get("/questions")
def get_questions(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    limit: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get aptitude questions with optional filters"""
    query = db.query(AptitudeQuestion)

    if category:
        query = query.filter(AptitudeQuestion.category == category)
    if difficulty:
        query = query.filter(AptitudeQuestion.difficulty == difficulty)
    if limit:
        query = query.limit(limit)

    questions = query.all()
    # Return without correct_answer for quiz taking
    return [
        {
            "id": q.id,
            "text": q.text,
            "options": q.options,
            "explanation": q.explanation,
            "category": q.category,
            "difficulty": q.difficulty,
            "created_at": q.created_at
        }
        for q in questions
    ]

@app.post("/quiz/aptitude/submit")
def submit_aptitude_quiz(
    quiz_data: dict,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit aptitude quiz answers and return detailed results"""
    correct_count = 0
    total = len(quiz_data)
    detailed_results = []

    for question_id, user_answer in quiz_data.items():
        question = db.query(AptitudeQuestion).filter(
            AptitudeQuestion.id == int(question_id)
        ).first()

        if question:
            is_correct = question.correct_answer == user_answer
            if is_correct:
                correct_count += 1

            detailed_results.append({
                "question_id": question.id,
                "question_text": question.text,
                "user_answer": user_answer,
                "correct_answer": question.correct_answer,
                "is_correct": is_correct,
                "explanation": question.explanation,
                "options": question.options
            })

    score = (correct_count / total * 100) if total > 0 else 0

    # Save quiz session
    session = QuizSession(
        user_id=current_user["user_id"],
        quiz_type="aptitude",
        total_questions=total,
        correct_answers=correct_count,
        score=score,
        answers=quiz_data
    )
    db.add(session)

    # Update progress
    progress = db.query(Progress).filter(
        Progress.user_id == current_user["user_id"],
        Progress.topic == "Aptitude"
    ).first()

    if progress:
        progress.questions_practiced += total
        progress.correct_answers += correct_count
        avg = (progress.correct_answers / progress.questions_practiced * 100)
        progress.average_score = avg
        progress.last_practiced = datetime.utcnow()
    else:
        progress = Progress(
            user_id=current_user["user_id"],
            topic="Aptitude",
            questions_practiced=total,
            correct_answers=correct_count,
            average_score=score,
            last_practiced=datetime.utcnow()
        )
        db.add(progress)

    db.commit()
    db.refresh(session)

    return {
        "session_id": session.id,
        "score": round(score, 1),
        "correct_answers": correct_count,
        "total_questions": total,
        "percentage": round(score, 1),
        "grade": "Excellent" if score >= 80 else "Good" if score >= 60 else "Average" if score >= 40 else "Needs Practice",
        "detailed_results": detailed_results,
        "created_at": session.created_at.isoformat()
    }

    # Save session
    session = QuizSession(
        user_id=current_user.id,
        quiz_type="aptitude",
        total_questions=total,
        correct_answers=score,
        score=percentage,
        answers=answers
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    return {
        "score": percentage,
        "correct_answers": score,
        "total_questions": total,
        "percentage": percentage,
        "session_id": session.id
    }


@app.get("/quiz/history")
def get_quiz_history(
    current_user: User = Depends(get_current_user_from_db),
    db: Session = Depends(get_db)
):
    """Get user's quiz history"""
    sessions = db.query(QuizSession).filter(
        QuizSession.user_id == current_user.id
    ).order_by(QuizSession.created_at.desc()).all()

    return [
        {
            "id": s.id,
            "quiz_type": s.quiz_type,
            "total_questions": s.total_questions,
            "correct_answers": s.correct_answers,
            "score": s.score,
            "duration_seconds": s.duration_seconds,
            "created_at": s.created_at
        }
        for s in sessions
    ]
# Add this to backend/main.py after other aptitude endpoints

@app.get("/quiz/aptitude/tests")
def get_available_tests(db: Session = Depends(get_db)):
    """Get all available aptitude tests"""
    total_questions = db.query(AptitudeQuestion).count()
    questions_per_test = 10
    num_tests = (total_questions + questions_per_test - 1) // questions_per_test
    
    tests = []
    for i in range(1, num_tests + 1):
        start_idx = (i - 1) * questions_per_test
        end_idx = start_idx + questions_per_test
        
        test_questions = db.query(AptitudeQuestion).limit(
            questions_per_test
        ).offset(start_idx).count()
        
        tests.append({
            "test_id": i,
            "test_name": f"Aptitude Test {i}",
            "total_questions": test_questions,
            "duration_minutes": 10,
            "questions_per_test": test_questions
        })
    
    return tests

@app.get("/quiz/aptitude/test/{test_id}")
def get_aptitude_test(test_id: int, db: Session = Depends(get_db)):
    """Get specific aptitude test questions"""
    questions_per_test = 10
    start_idx = (test_id - 1) * questions_per_test
    
    questions = db.query(AptitudeQuestion).limit(
        questions_per_test
    ).offset(start_idx).all()
    
    if not questions:
        raise HTTPException(status_code=404, detail="Test not found")
    
    return {
        "test_id": test_id,
        "test_name": f"Aptitude Test {test_id}",
        "duration_minutes": 10,
        "total_questions": len(questions),
        "questions": [
            {
                "id": q.id,
                "text": q.text,
                "options": q.options,
                "category": q.category,
                "difficulty": q.difficulty
            } for q in questions
        ]
    }

# ==================== DSA ROUTES ====================


@app.get("/dsa")
def get_dsa_problems(
    topic: str = None,
    difficulty: str = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get DSA problems with optional filters"""
    query = db.query(DSAProblem)

    if topic:
        query = query.filter(DSAProblem.topic == topic)
    if difficulty:
        query = query.filter(DSAProblem.difficulty == difficulty)

    problems = query.limit(limit).all()

    return [
        {
            "id": p.id,
            "title": p.title,
            "description": p.description,
            "problem_statement": p.problem_statement,
            "topic": p.topic,
            "difficulty": p.difficulty,
            "examples": p.examples,
            "solution": p.solution,
            "solution_explanation": p.solution_explanation,
            "constraints": p.constraints,
            "time_complexity": p.time_complexity,
            "space_complexity": p.space_complexity
        }
        for p in problems
    ]


#
@app.post("/dsa/problems/{problem_id}/practice")
def practice_dsa_problem(
    problem_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a DSA problem as practiced"""
    problem = db.query(DSAProblem).filter(DSAProblem.id == problem_id).first()

    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    # Update or create progress
    progress = db.query(Progress).filter(
        Progress.user_id == current_user["user_id"],
        Progress.topic == problem.topic
    ).first()

    if progress:
        progress.questions_practiced += 1
        progress.last_practiced = datetime.utcnow()
    else:
        progress = Progress(
            user_id=current_user["user_id"],
            topic=problem.topic,
            questions_practiced=1,
            correct_answers=0,
            average_score=0,
            last_practiced=datetime.utcnow()
        )
        db.add(progress)

    db.commit()

    return {
        "success": True,
        "message": f"✅ '{problem.title}' marked as practiced!",
        "topic": problem.topic,
        "questions_practiced": progress.questions_practiced
    }


@app.get("/dsa/problems/{problem_id}")
def get_dsa_problem(
    problem_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific DSA problem by ID"""
    problem = db.query(DSAProblem).filter(DSAProblem.id == problem_id).first()

    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    return {
        "id": problem.id,
        "title": problem.title,
        "description": problem.description,
        "problem_statement": problem.problem_statement,
        "topic": problem.topic,
        "difficulty": problem.difficulty,
        "examples": problem.examples,
        "solution": problem.solution,
        "solution_explanation": problem.solution_explanation,
        "constraints": problem.constraints,
        "time_complexity": problem.time_complexity,
        "space_complexity": problem.space_complexity
    }


# ==================== RESUME ROUTES ====================
@app.post("/resume/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user_from_db),
    db: Session = Depends(get_db)
):
    """Upload resume and analyze with AI"""
    # Save file
    upload_dir = Path("uploads")
    upload_dir.mkdir(exist_ok=True)

    file_path = upload_dir / f"{current_user.id}_{uuid.uuid4()}.pdf"

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # Try to extract text and analyze with AI
    try:
        # For PDF files, attempt text extraction
        resume_text = ""
        try:
            import PyPDF2
            with open(file_path, "rb") as pdf_file:
                reader = PyPDF2.PdfReader(pdf_file)
                for page in reader.pages:
                    resume_text += page.extract_text() or ""
        except Exception:
            resume_text = "Unable to extract text from resume"

        # Analyze with AI if text was extracted
        if resume_text and len(resume_text) > 50:
            ai_analysis = AIService.analyze_resume(resume_text)
        else:
            ai_analysis = {
                "strengths": ["Resume uploaded successfully"],
                "weaknesses": ["Could not extract enough text for analysis"],
                "improvements": ["Try uploading a text-based PDF (not scanned)"],
                "technical_skills": [],
                "overall_rating": 0,
                "recommendations": "Please upload a text-based PDF for full analysis"
            }
    except Exception as e:
        ai_analysis = {
            "strengths": ["Resume uploaded"],
            "weaknesses": [],
            "improvements": ["Enable AI analysis for detailed feedback"],
            "technical_skills": [],
            "overall_rating": 0
        }

    # Save resume record
    resume = Resume(
        user_id=current_user.id,
        file_path=str(file_path),
        file_name=file.filename or "resume.pdf",
        extracted_text=resume_text if 'resume_text' in dir() else "",
        ai_analysis=ai_analysis
    )
    db.add(resume)
    db.commit()

    return {
        "message": "Resume uploaded successfully",
        "analysis": ai_analysis,
        "resume_id": resume.id
    }


@app.get("/resume/analysis")
def get_resume_analysis(
    current_user: User = Depends(get_current_user_from_db),
    db: Session = Depends(get_db)
):
    """Get latest resume analysis"""
    resume = db.query(Resume).filter(
        Resume.user_id == current_user.id
    ).order_by(Resume.uploaded_at.desc()).first()

    if not resume:
        raise HTTPException(status_code=404, detail="No resume found")

    return {
        "id": resume.id,
        "file_name": resume.file_name,
        "analysis": resume.ai_analysis,
        "uploaded_at": resume.uploaded_at
    }


# ==================== MOCK INTERVIEW ROUTES ====================
@app.post("/interview/start")
def start_interview(
    req: MockInterviewStart,
    current_user: User = Depends(get_current_user_from_db),
    db: Session = Depends(get_db)
):
    """Start a new mock interview session"""
    interview = MockInterview(
        user_id=current_user.id,
        role=req.role,
        difficulty=req.difficulty,
        messages=[]
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)

    return {
        "id": interview.id,
        "role": interview.role,
        "difficulty": interview.difficulty,
        "created_at": interview.created_at
    }


@app.post("/interview/{interview_id}/chat")
def interview_chat(
    interview_id: int,
    message: dict,
    current_user: User = Depends(get_current_user_from_db),
    db: Session = Depends(get_db)
):
    """Send a message in a mock interview"""
    interview = db.query(MockInterview).filter(
        MockInterview.id == interview_id,
        MockInterview.user_id == current_user.id
    ).first()

    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    user_message = message.get("message", "")
    messages = interview.messages or []

    # Add user message
    messages.append({"role": "user", "content": user_message})

    # Generate AI response
    ai_response = AIService.chat_with_interviewer(messages, interview.role)

    # Add AI response
    messages.append({"role": "assistant", "content": ai_response})

    # Update interview — use a copy to trigger SQLAlchemy change detection
    interview.messages = list(messages)
    db.commit()

    return {
        "ai_response": ai_response,
        "message_count": len(messages)
    }


@app.post("/interview/{interview_id}/end")
def end_interview(
    interview_id: int,
    current_user: User = Depends(get_current_user_from_db),
    db: Session = Depends(get_db)
):
    """End an interview and get feedback"""
    interview = db.query(MockInterview).filter(
        MockInterview.id == interview_id,
        MockInterview.user_id == current_user.id
    ).first()

    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    messages = interview.messages or []

    # Generate feedback
    feedback = AIService.generate_interview_feedback(messages, interview.role)

    # Update interview with feedback
    interview.feedback = json.dumps(feedback) if isinstance(feedback, dict) else str(feedback)
    interview.rating = feedback.get("overall_rating", 3) if isinstance(feedback, dict) else 3
    db.commit()

    return {
        "feedback": feedback,
        "interview_id": interview.id
    }


@app.post("/interview/generate-questions")
def generate_interview_questions(
    req: dict,
    current_user: User = Depends(get_current_user_from_db),
    db: Session = Depends(get_db)
):
    """Generate interview questions using AI"""
    job_role = req.get("job_role", "Software Engineer")
    skills = req.get("skills", "")

    questions = AIService.generate_interview_questions(job_role, skills)

    return {
        "questions": questions,
        "job_role": job_role,
        "generated_at": datetime.utcnow()
    }


@app.get("/interview/history")
def get_interview_history(
    current_user: User = Depends(get_current_user_from_db),
    db: Session = Depends(get_db)
):
    """Get all mock interviews for user"""
    interviews = db.query(MockInterview).filter(
        MockInterview.user_id == current_user.id
    ).order_by(MockInterview.created_at.desc()).all()

    return [
        {
            "id": i.id,
            "role": i.role,
            "difficulty": i.difficulty,
            "message_count": len(i.messages or []),
            "rating": i.rating,
            "created_at": i.created_at
        }
        for i in interviews
    ]


# ==================== DASHBOARD ROUTES ====================
@app.get("/dashboard/stats")
def get_dashboard_stats(
    current_user: User = Depends(get_current_user_from_db),
    db: Session = Depends(get_db)
):
    """Get user's dashboard statistics"""
    quiz_sessions = db.query(QuizSession).filter(
        QuizSession.user_id == current_user.id
    ).order_by(QuizSession.created_at.desc()).all()

    mock_interviews = db.query(MockInterview).filter(
        MockInterview.user_id == current_user.id
    ).all()

    progress_records = db.query(Progress).filter(
        Progress.user_id == current_user.id
    ).all()

    # Calculate average quiz score
    avg_quiz_score = 0
    if quiz_sessions:
        avg_quiz_score = sum(s.score for s in quiz_sessions) / len(quiz_sessions)

    # Count DSA problems practiced (from progress records)
    total_dsa_practiced = sum(
        p.questions_practiced for p in progress_records
        if p.topic not in ["Aptitude", "Quiz"]
    )

    return {
        "total_quizzes": len(quiz_sessions),
        "average_quiz_score": round(avg_quiz_score, 2),
        "total_dsa_practiced": total_dsa_practiced,
        "mock_interviews_count": len(mock_interviews),
        "topics_covered": [
            {
                "id": p.id,
                "topic": p.topic,
                "questions_practiced": p.questions_practiced,
                "correct_answers": p.correct_answers,
                "average_score": p.average_score,
                "last_practiced": p.last_practiced
            }
            for p in progress_records
        ],
        "recent_quizzes": [
            {
                "id": s.id,
                "quiz_type": s.quiz_type,
                "total_questions": s.total_questions,
                "correct_answers": s.correct_answers,
                "score": s.score,
                "duration_seconds": s.duration_seconds,
                "created_at": s.created_at
            }
            for s in quiz_sessions[:5]  # Last 5 quizzes
        ]
    }


# ==================== SEED DATA ====================
@app.post("/seed-data")
def seed_data(db: Session = Depends(get_db)):
    """Seed database with sample questions"""

    # Check if data already exists
    if db.query(AptitudeQuestion).first():
        return {"message": "Data already exists"}

    # Aptitude questions with dict-style options (matching models.py schema)
    aptitude_questions = [
        AptitudeQuestion(
            text="What is the time complexity of binary search?",
            options={"A": "O(n)", "B": "O(log n)", "C": "O(n²)", "D": "O(2^n)"},
            correct_answer="B",
            explanation="Binary search divides the search space in half each step, resulting in O(log n) time complexity.",
            category="Algorithms",
            difficulty="easy"
        ),
        AptitudeQuestion(
            text="Which data structure uses LIFO?",
            options={"A": "Queue", "B": "Stack", "C": "Tree", "D": "Graph"},
            correct_answer="B",
            explanation="Stack follows Last In First Out (LIFO) principle.",
            category="Data Structures",
            difficulty="easy"
        ),
        AptitudeQuestion(
            text="What is the main advantage of using a hash table?",
            options={"A": "Fast lookup O(1)", "B": "Memory efficient", "C": "Sorted order", "D": "Easy traversal"},
            correct_answer="A",
            explanation="Hash tables provide O(1) average-case lookup time.",
            category="Data Structures",
            difficulty="medium"
        ),
        AptitudeQuestion(
            text="Which sorting algorithm has the best average-case time complexity?",
            options={"A": "Bubble Sort", "B": "Selection Sort", "C": "Merge Sort", "D": "Insertion Sort"},
            correct_answer="C",
            explanation="Merge Sort consistently achieves O(n log n) time complexity.",
            category="Algorithms",
            difficulty="medium"
        ),
        AptitudeQuestion(
            text="What is a deadlock in operating systems?",
            options={
                "A": "When a process terminates unexpectedly",
                "B": "When two or more processes wait indefinitely for each other",
                "C": "When CPU usage reaches 100%",
                "D": "When memory is full"
            },
            correct_answer="B",
            explanation="Deadlock occurs when two or more processes are blocked forever, each waiting for the other.",
            category="Operating Systems",
            difficulty="medium"
        ),
    ]

    # DSA problems with full schema
    dsa_problems = [
        DSAProblem(
            title="Two Sum",
            description="Find two numbers in an array that add up to a target.",
            problem_statement="Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. You may assume each input has exactly one solution.",
            topic="Arrays",
            difficulty="easy",
            examples=[
                {"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]"},
                {"input": "nums = [3,2,4], target = 6", "output": "[1,2]"}
            ],
            solution="def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []",
            solution_explanation="Use a hash map to store each number and its index. For each number, check if its complement exists in the map.",
            constraints="2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9",
            time_complexity="O(n)",
            space_complexity="O(n)"
        ),
        DSAProblem(
            title="Reverse String",
            description="Reverse a string in-place.",
            problem_statement="Write a function that reverses a string. The input string is given as an array of characters. You must do this by modifying the input array in-place with O(1) extra memory.",
            topic="Strings",
            difficulty="easy",
            examples=[
                {"input": "s = ['h','e','l','l','o']", "output": "['o','l','l','e','h']"},
                {"input": "s = ['H','a','n','n','a','h']", "output": "['h','a','n','n','a','H']"}
            ],
            solution="def reverseString(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        s[left], s[right] = s[right], s[left]\n        left += 1\n        right -= 1",
            solution_explanation="Use two pointers from the start and end, swap elements and move towards the center.",
            constraints="1 <= s.length <= 10^5",
            time_complexity="O(n)",
            space_complexity="O(1)"
        ),
        DSAProblem(
            title="Valid Parentheses",
            description="Determine if a string of brackets is valid.",
            problem_statement="Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type and in the correct order.",
            topic="Stacks",
            difficulty="easy",
            examples=[
                {"input": "s = '()'", "output": "true"},
                {"input": "s = '([)]'", "output": "false"}
            ],
            solution="def isValid(s):\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack",
            solution_explanation="Use a stack. Push opening brackets, pop and compare when encountering closing brackets.",
            constraints="1 <= s.length <= 10^4",
            time_complexity="O(n)",
            space_complexity="O(n)"
        ),
    ]

    db.add_all(aptitude_questions)
    db.add_all(dsa_problems)
    db.commit()

    return {"message": "Database seeded successfully"}


# ==================== HEALTH CHECK ====================
@app.get("/health")
def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

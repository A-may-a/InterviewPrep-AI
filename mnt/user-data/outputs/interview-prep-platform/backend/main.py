# backend/main.py
from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Import all modules
from backend.database import get_db, engine, Base
from backend.models import (
    User, AptitudeQuestion, DSAProblem, QuizSession, 
    Resume, MockInterview, InterviewQuestion, Progress
)
from backend.schemas import *
from backend.auth import hash_password, verify_password, create_access_token, get_current_user
from backend.ai_service import AIService
import PyPDF2

load_dotenv()

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Interview Prep Platform API", version="1.0")

# CORS middleware
origins = os.getenv("CORS_ORIGINS", "").split(",") or ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== AUTH ENDPOINTS ====================
@app.post("/api/auth/register", response_model=TokenResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        name=user_data.name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate token
    access_token = create_access_token(data={"sub": new_user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(new_user)
    }

@app.post("/api/auth/login", response_model=TokenResponse)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    user = db.query(User).filter(User.email == user_data.email).first()
    
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(user)
    }

@app.get("/api/auth/me", response_model=UserResponse)
def get_current_user_info(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user info"""
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# ==================== APTITUDE QUIZ ENDPOINTS ====================
@app.get("/api/quizzes/aptitude/questions", response_model=List[AptitudeQuestionResponse])
def get_aptitude_questions(
    category: str = None,
    difficulty: str = None,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get aptitude quiz questions"""
    query = db.query(AptitudeQuestion)
    
    if category:
        query = query.filter(AptitudeQuestion.category == category)
    if difficulty:
        query = query.filter(AptitudeQuestion.difficulty == difficulty)
    
    questions = query.limit(limit).all()
    return questions

@app.post("/api/quizzes/aptitude/submit", response_model=QuizSessionResponse)
def submit_aptitude_quiz(
    quiz_data: Dict[int, str],  # {question_id: answer}
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit aptitude quiz answers"""
    correct_count = 0
    total = len(quiz_data)
    
    for question_id, user_answer in quiz_data.items():
        question = db.query(AptitudeQuestion).filter(AptitudeQuestion.id == question_id).first()
        if question and question.correct_answer == user_answer:
            correct_count += 1
    
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
        progress.average_score = (progress.correct_answers / progress.questions_practiced * 100)
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
    
    return session

# ==================== DSA ENDPOINTS ====================
@app.get("/api/dsa/problems", response_model=List[DSAProblemResponse])
def get_dsa_problems(
    topic: str = None,
    difficulty: str = None,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get DSA problems"""
    query = db.query(DSAProblem)
    
    if topic:
        query = query.filter(DSAProblem.topic == topic)
    if difficulty:
        query = query.filter(DSAProblem.difficulty == difficulty)
    
    problems = query.limit(limit).all()
    return problems

@app.get("/api/dsa/problems/{problem_id}", response_model=DSAProblemWithSolution)
def get_dsa_problem(problem_id: int, db: Session = Depends(get_db)):
    """Get specific DSA problem with solution"""
    problem = db.query(DSAProblem).filter(DSAProblem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem

@app.post("/api/dsa/problems/practice/{problem_id}")
def practice_dsa_problem(
    problem_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark DSA problem as practiced"""
    problem = db.query(DSAProblem).filter(DSAProblem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    # Update progress
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
            last_practiced=datetime.utcnow()
        )
        db.add(progress)
    
    db.commit()
    
    return {"message": "Problem marked as practiced", "topic": problem.topic}

# ==================== RESUME ENDPOINTS ====================
@app.post("/api/resume/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload and analyze resume"""
    try:
        # Save file
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        file_path = os.path.join(upload_dir, f"{current_user['user_id']}_{file.filename}")
        
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        
        # Extract text from PDF
        extracted_text = ""
        if file.filename.endswith(".pdf"):
            with open(file_path, "rb") as pdf_file:
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                for page in pdf_reader.pages:
                    extracted_text += page.extract_text()
        
        # Analyze with AI
        ai_analysis = AIService.analyze_resume(extracted_text[:2000])
        
        # Save to DB
        resume = Resume(
            user_id=current_user["user_id"],
            file_path=file_path,
            file_name=file.filename,
            extracted_text=extracted_text,
            ai_analysis=ai_analysis
        )
        db.add(resume)
        db.commit()
        db.refresh(resume)
        
        return {
            "message": "Resume uploaded and analyzed",
            "resume": ResumeResponse.from_orm(resume),
            "analysis": ai_analysis
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/resume/latest", response_model=ResumeResponse)
def get_latest_resume(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get latest uploaded resume"""
    resume = db.query(Resume).filter(
        Resume.user_id == current_user["user_id"]
    ).order_by(Resume.uploaded_at.desc()).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="No resume found")
    
    return resume

# ==================== INTERVIEW QUESTIONS ENDPOINTS ====================
@app.post("/api/interviews/generate-questions")
def generate_interview_questions(
    request: Dict[str, str],
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate AI interview questions based on role and resume"""
    role = request.get("role", "Software Engineer")
    
    # Get user's latest resume
    resume = db.query(Resume).filter(
        Resume.user_id == current_user["user_id"]
    ).order_by(Resume.uploaded_at.desc()).first()
    
    resume_text = resume.extracted_text if resume else ""
    
    # Generate questions
    questions = AIService.generate_interview_questions(role, resume_text)
    
    # Save questions to DB
    for q_text in questions:
        question = InterviewQuestion(
            role=role,
            question_text=q_text,
            category="Generated",
            difficulty="medium"
        )
        db.add(question)
    
    db.commit()
    
    return {"role": role, "questions": questions}

@app.get("/api/interviews/questions", response_model=List[InterviewQuestionResponse])
def get_interview_questions(
    role: str = None,
    difficulty: str = None,
    db: Session = Depends(get_db)
):
    """Get interview questions"""
    query = db.query(InterviewQuestion)
    
    if role:
        query = query.filter(InterviewQuestion.role == role)
    if difficulty:
        query = query.filter(InterviewQuestion.difficulty == difficulty)
    
    return query.limit(50).all()

# ==================== MOCK INTERVIEW ENDPOINTS ====================
@app.post("/api/interviews/start", response_model=MockInterviewResponse)
def start_mock_interview(
    request: MockInterviewStart,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Start a new mock interview"""
    interview = MockInterview(
        user_id=current_user["user_id"],
        role=request.role,
        difficulty=request.difficulty,
        messages=[]
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)
    
    return interview

@app.post("/api/interviews/{interview_id}/chat")
def chat_in_interview(
    interview_id: int,
    message: Dict[str, str],
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send message in mock interview"""
    interview = db.query(MockInterview).filter(
        MockInterview.id == interview_id,
        MockInterview.user_id == current_user["user_id"]
    ).first()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    user_message = message.get("content", "")
    
    # Add user message to history
    messages = interview.messages or []
    messages.append({"role": "user", "content": user_message})
    
    # Get AI response
    ai_response = AIService.chat_with_interviewer(messages, interview.role)
    
    messages.append({"role": "assistant", "content": ai_response})
    
    interview.messages = messages
    db.commit()
    
    return {
        "interview_id": interview_id,
        "user_message": user_message,
        "ai_response": ai_response
    }

@app.post("/api/interviews/{interview_id}/end")
def end_mock_interview(
    interview_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """End interview and generate feedback"""
    interview = db.query(MockInterview).filter(
        MockInterview.id == interview_id,
        MockInterview.user_id == current_user["user_id"]
    ).first()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    # Generate feedback
    feedback = AIService.generate_interview_feedback(interview.messages, interview.role)
    
    interview.feedback = feedback.get("summary", "")
    interview.rating = feedback.get("overall_rating", 3)
    
    db.commit()
    
    return {
        "interview_id": interview_id,
        "feedback": feedback
    }

@app.get("/api/interviews/{interview_id}", response_model=MockInterviewResponse)
def get_interview(
    interview_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get interview details"""
    interview = db.query(MockInterview).filter(
        MockInterview.id == interview_id,
        MockInterview.user_id == current_user["user_id"]
    ).first()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    return interview

# ==================== DASHBOARD ENDPOINTS ====================
@app.get("/api/dashboard/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user dashboard statistics"""
    user_id = current_user["user_id"]
    
    # Quiz stats
    quizzes = db.query(QuizSession).filter(QuizSession.user_id == user_id).all()
    avg_quiz_score = sum([q.score for q in quizzes]) / len(quizzes) if quizzes else 0
    
    # DSA stats
    dsa_topics = db.query(Progress).filter(
        Progress.user_id == user_id,
        Progress.topic != "Aptitude"
    ).all()
    total_dsa = sum([p.questions_practiced for p in dsa_topics])
    
    # Mock interview stats
    interviews = db.query(MockInterview).filter(MockInterview.user_id == user_id).all()
    
    # Progress per topic
    all_progress = db.query(Progress).filter(Progress.user_id == user_id).all()
    
    return {
        "total_quizzes": len(quizzes),
        "average_quiz_score": avg_quiz_score,
        "total_dsa_practiced": total_dsa,
        "mock_interviews_count": len(interviews),
        "topics_covered": all_progress,
        "recent_quizzes": quizzes[-5:] if quizzes else []
    }

# ==================== SEED DATA ENDPOINT ====================
@app.post("/api/seed-data")
def seed_sample_data(db: Session = Depends(get_db)):
    """Seed database with sample data (for testing)"""
    
    # Sample aptitude questions
    questions = [
        AptitudeQuestion(
            text="What is 15 * 12?",
            options={"A": "180", "B": "200", "C": "150", "D": "220"},
            correct_answer="A",
            explanation="15 * 12 = 180",
            category="Numerical",
            difficulty="easy"
        ),
        AptitudeQuestion(
            text="If A = B and B = C, then A = C. This is which property?",
            options={"A": "Reflexive", "B": "Symmetric", "C": "Transitive", "D": "Equality"},
            correct_answer="C",
            explanation="This is the transitive property of equality",
            category="Logical",
            difficulty="medium"
        ),
    ]
    
    # Sample DSA problems
    dsa_problems = [
        DSAProblem(
            title="Two Sum",
            description="Find two numbers that add up to a target",
            problem_statement="Given an array of integers and a target, find two numbers that add up to the target.",
            topic="Arrays",
            difficulty="easy",
            examples=[{"input": "[2,7,11,15], target=9", "output": "[0,1]"}],
            solution="Use a hash map to store values seen so far",
            time_complexity="O(n)",
            space_complexity="O(n)"
        ),
    ]
    
    db.add_all(questions)
    db.add_all(dsa_problems)
    db.commit()
    
    return {"message": "Sample data seeded successfully"}

# Health check
@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

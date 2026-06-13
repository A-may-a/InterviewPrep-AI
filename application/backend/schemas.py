# backend/schemas.py
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional, Dict, Any

# ==================== USER SCHEMAS ====================
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    target_role: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# ==================== APTITUDE QUESTION SCHEMAS ====================
class AptitudeQuestionCreate(BaseModel):
    text: str
    options: Dict[str, str]  # {"A": "option1", "B": "option2", ...}
    correct_answer: str
    explanation: str
    category: str
    difficulty: str = "medium"

class AptitudeQuestionResponse(BaseModel):
    id: int
    text: str
    options: Dict[str, str]
    explanation: str
    category: str
    difficulty: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class AptitudeQuestionWithAnswer(AptitudeQuestionResponse):
    correct_answer: str

# ==================== DSA SCHEMAS ====================
class DSAProblemCreate(BaseModel):
    title: str
    description: str
    problem_statement: str
    topic: str
    difficulty: str = "medium"
    examples: List[Dict[str, str]]
    solution: str
    solution_explanation: Optional[str] = None
    constraints: Optional[str] = None
    time_complexity: Optional[str] = None
    space_complexity: Optional[str] = None

class DSAProblemResponse(BaseModel):
    id: int
    title: str
    description: str
    problem_statement: str
    topic: str
    difficulty: str
    examples: List[Dict[str, str]]
    constraints: Optional[str]
    time_complexity: Optional[str]
    space_complexity: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class DSAProblemWithSolution(DSAProblemResponse):
    solution: str
    solution_explanation: Optional[str]

# ==================== QUIZ SCHEMAS ====================
class QuizAnswerSubmit(BaseModel):
    question_id: int
    user_answer: str

class QuizSessionCreate(BaseModel):
    quiz_type: str
    total_questions: int = 10

class QuizSessionResponse(BaseModel):
    id: int
    quiz_type: str
    total_questions: int
    correct_answers: int
    score: float
    duration_seconds: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True

# ==================== RESUME SCHEMAS ====================
class ResumeResponse(BaseModel):
    id: int
    file_name: str
    uploaded_at: datetime
    ai_analysis: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True

class ResumeAnalysisResponse(BaseModel):
    strengths: List[str]
    weaknesses: List[str]
    improvements: List[str]
    technical_skills: List[str]
    overall_rating: float

# ==================== MOCK INTERVIEW SCHEMAS ====================
class MockInterviewStart(BaseModel):
    role: str
    difficulty: str = "medium"

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class MockInterviewResponse(BaseModel):
    id: int
    role: str
    difficulty: str
    messages: List[ChatMessage]
    rating: Optional[float]
    feedback: Optional[str]
    duration_seconds: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True

class InterviewQuestionResponse(BaseModel):
    id: int
    role: str
    question_text: str
    category: str
    difficulty: str
    
    class Config:
        from_attributes = True

# ==================== PROGRESS SCHEMAS ====================
class ProgressResponse(BaseModel):
    id: int
    topic: str
    questions_practiced: int
    correct_answers: int
    average_score: float
    last_practiced: Optional[datetime]
    
    class Config:
        from_attributes = True

class DashboardStatsResponse(BaseModel):
    total_quizzes: int
    average_quiz_score: float
    total_dsa_practiced: int
    mock_interviews_count: int
    topics_covered: List[ProgressResponse]
    recent_quizzes: List[QuizSessionResponse]

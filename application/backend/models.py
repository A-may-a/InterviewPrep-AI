# backend/models.py
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, JSON, Boolean, Enum
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import enum

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    target_role = Column(String(100), nullable=True)
    bio = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    quiz_sessions = relationship("QuizSession", back_populates="user")
    mock_interviews = relationship("MockInterview", back_populates="user")
    resumes = relationship("Resume", back_populates="user")
    progress = relationship("Progress", back_populates="user")


class AptitudeQuestion(Base):
    __tablename__ = "aptitude_questions"
    
    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)  # {"A": "...", "B": "...", "C": "...", "D": "..."}
    correct_answer = Column(String(1), nullable=False)  # A, B, C, or D
    explanation = Column(Text, nullable=True)
    category = Column(String(100), nullable=False)  # Logical, Numerical, Verbal, etc
    difficulty = Column(String(20), default="medium")  # easy, medium, hard
    created_at = Column(DateTime, default=datetime.utcnow)


class DSAProblem(Base):
    __tablename__ = "dsa_problems"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    problem_statement = Column(Text, nullable=False)
    topic = Column(String(100), nullable=False)  # Arrays, Strings, Trees, Graphs, DP, etc
    difficulty = Column(String(20), default="medium")  # easy, medium, hard
    examples = Column(JSON, nullable=False)  # [{"input": "...", "output": "..."}]
    solution = Column(Text, nullable=False)
    solution_explanation = Column(Text, nullable=True)
    constraints = Column(Text, nullable=True)
    time_complexity = Column(String(50), nullable=True)
    space_complexity = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class QuizSession(Base):
    __tablename__ = "quiz_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quiz_type = Column(String(50), nullable=False)  # aptitude, dsa_basics, etc
    total_questions = Column(Integer, default=10)
    correct_answers = Column(Integer, default=0)
    score = Column(Float, default=0.0)
    duration_seconds = Column(Integer, nullable=True)
    answers = Column(JSON, nullable=True)  # Store user's answers for review
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="quiz_sessions")


class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_name = Column(String(255), nullable=False)
    extracted_text = Column(Text, nullable=True)
    ai_analysis = Column(JSON, nullable=True)  # Strengths, weaknesses, suggestions from Gemini
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="resumes")


class MockInterview(Base):
    __tablename__ = "mock_interviews"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String(100), nullable=False)  # Backend Engineer, Frontend Engineer, etc
    difficulty = Column(String(20), default="medium")
    messages = Column(JSON, nullable=False)  # [{"role": "user", "content": "..."}, ...]
    rating = Column(Float, nullable=True)  # 1-5 star rating
    feedback = Column(Text, nullable=True)  # AI feedback on performance
    duration_seconds = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="mock_interviews")


class InterviewQuestion(Base):
    __tablename__ = "interview_questions"
    
    id = Column(Integer, primary_key=True, index=True)
    role = Column(String(100), nullable=False)
    question_text = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)  # Technical, Behavioral, System Design
    difficulty = Column(String(20), default="medium")
    sample_answer = Column(Text, nullable=True)
    keywords = Column(JSON, nullable=True)  # Key points to mention
    created_at = Column(DateTime, default=datetime.utcnow)


class Progress(Base):
    __tablename__ = "progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    topic = Column(String(100), nullable=False)  # Arrays, DSA, Aptitude, System Design, etc
    questions_practiced = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    average_score = Column(Float, default=0.0)
    last_practiced = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="progress")

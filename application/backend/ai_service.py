# backend/ai_service.py
import google.generativeai as genai
from dotenv import load_dotenv
import os
import json
from typing import List, Dict, Any

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

class AIService:
    @staticmethod
    def analyze_resume(resume_text: str) -> Dict[str, Any]:
        """Analyze resume using Gemini API"""
        try:
            model = genai.GenerativeModel('gemini-pro')
            
            prompt = f"""
            Analyze this resume and provide structured feedback in JSON format:
            
            Resume:
            {resume_text}
            
            Provide response as valid JSON with these keys:
            - strengths: list of 3-5 key strengths
            - weaknesses: list of 3-5 areas to improve
            - improvements: list of 3-5 specific suggestions
            - technical_skills: list of identified technical skills
            - overall_rating: float from 1-5
            - recommendations: string with brief overall recommendation
            
            Return ONLY valid JSON, no markdown or extra text.
            """
            
            response = model.generate_content(prompt)
            
            # Parse JSON response
            response_text = response.text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            analysis = json.loads(response_text.strip())
            return analysis
        
        except Exception as e:
            print(f"Error analyzing resume: {e}")
            return {
                "strengths": ["Unable to analyze"],
                "weaknesses": [],
                "improvements": [],
                "technical_skills": [],
                "overall_rating": 0,
                "recommendations": f"Error: {str(e)}"
            }
    
    @staticmethod
    def generate_interview_questions(role: str, resume_text: str = "", num_questions: int = 10) -> List[str]:
        """Generate tailored interview questions based on role and resume"""
        try:
            model = genai.GenerativeModel('gemini-pro')
            
            prompt = f"""
            Generate {num_questions} technical interview questions for a {role} position.
            
            Resume highlights: {resume_text[:500] if resume_text else "Not provided"}
            
            Include mix of:
            - Technical/coding questions (40%)
            - System design questions (30%)
            - Behavioral questions (30%)
            
            Return as JSON array of question strings. Example:
            ["Question 1?", "Question 2?"]
            
            Return ONLY valid JSON array, no markdown.
            """
            
            response = model.generate_content(prompt)
            
            # Parse JSON response
            response_text = response.text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            questions = json.loads(response_text.strip())
            return questions
        
        except Exception as e:
            print(f"Error generating questions: {e}")
            return ["What are your strengths?", "Why do you want this role?"]
    
    @staticmethod
    def chat_with_interviewer(messages: List[Dict[str, str]], role: str) -> str:
        """Multi-turn chat for mock interview"""
        try:
            model = genai.GenerativeModel('gemini-pro')
            
            # Format messages for Gemini
            chat_history = []
            for msg in messages[:-1]:  # All but last (which is current user message)
                role_name = "user" if msg["role"] == "user" else "model"
                chat_history.append({
                    "role": role_name,
                    "parts": [msg["content"]]
                })
            
            # Start chat session
            chat = model.start_chat(history=chat_history)
            
            user_message = messages[-1]["content"] if messages else "Start the interview"
            
            system_prompt = f"""
            You are an experienced interviewer conducting a {role} interview.
            - Ask technical and behavioral questions
            - Evaluate answers thoughtfully
            - Provide constructive feedback
            - Be professional and encouraging
            - Ask follow-up questions when needed
            - Keep responses concise (2-3 sentences)
            """
            
            response = chat.send_message(f"{system_prompt}\n\nCandidate: {user_message}")
            return response.text
        
        except Exception as e:
            print(f"Error in chat: {e}")
            return "I apologize, but I'm having trouble processing your response. Could you repeat that?"
    
    @staticmethod
    def generate_interview_feedback(messages: List[Dict[str, str]], role: str) -> Dict[str, Any]:
        """Generate feedback on mock interview performance"""
        try:
            model = genai.GenerativeModel('gemini-pro')
            
            # Compile conversation
            conversation = "\n".join([f"{msg['role'].upper()}: {msg['content']}" for msg in messages])
            
            prompt = f"""
            Analyze this {role} interview and provide feedback as JSON:
            
            Interview:
            {conversation}
            
            Provide as valid JSON:
            - communication_score: 1-5
            - technical_score: 1-5
            - confidence_score: 1-5
            - overall_rating: 1-5
            - strengths: list of 2-3 strengths shown
            - improvements: list of 2-3 areas to improve
            - summary: brief overall feedback (2-3 sentences)
            
            Return ONLY valid JSON.
            """
            
            response = model.generate_content(prompt)
            
            response_text = response.text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            feedback = json.loads(response_text.strip())
            return feedback
        
        except Exception as e:
            print(f"Error generating feedback: {e}")
            return {
                "communication_score": 3,
                "technical_score": 3,
                "confidence_score": 3,
                "overall_rating": 3,
                "strengths": ["Good effort"],
                "improvements": ["More practice needed"],
                "summary": f"Error generating feedback: {str(e)}"
            }

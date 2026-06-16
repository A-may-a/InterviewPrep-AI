# backend/ai_service.py
import os
import json
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

class AIService:

    @staticmethod
    def analyze_resume(resume_text: str) -> Dict[str, Any]:
        """Analyze resume using Gemini API"""
        try:
            import google.generativeai as genai
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-1.5-flash')

            prompt = f"""
You are an expert resume reviewer. Analyze the following resume and return ONLY a valid JSON object.

Resume Text:
{resume_text[:3000]}

Return this exact JSON structure (no markdown, no backticks, just raw JSON):
{{
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
    "improvements": ["suggestion 1", "suggestion 2", "suggestion 3"],
    "technical_skills": ["skill1", "skill2", "skill3"],
    "overall_rating": 3.5,
    "recommendations": "Overall recommendation text here"
}}
"""
            response = model.generate_content(prompt)
            text = response.text.strip()

            # Clean response
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()

            result = json.loads(text)
            return result

        except Exception as e:
            print(f"Gemini Error: {e}")
            # Return mock analysis if API fails
            return {
                "strengths": [
                    "Resume submitted successfully",
                    "Document is readable",
                    "Professional format detected"
                ],
                "weaknesses": [
                    "AI analysis unavailable - check GEMINI_API_KEY in .env",
                    "Please verify your API key is valid",
                    "Make sure google-generativeai package is installed"
                ],
                "improvements": [
                    "Add your GEMINI_API_KEY to backend/.env file",
                    "Get free API key from https://ai.google.dev/",
                    "Restart backend after adding the key"
                ],
                "technical_skills": ["Unable to extract - API key needed"],
                "overall_rating": 2.5,
                "recommendations": f"Resume uploaded but AI analysis failed. Error: {str(e)}. Please add GEMINI_API_KEY to your .env file."
            }

    @staticmethod
    def generate_interview_questions(role: str, resume_text: str = "", num_questions: int = 10) -> List[str]:
        """Generate interview questions"""
        try:
            import google.generativeai as genai
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-1.5-flash')

            prompt = f"""
Generate exactly {num_questions} interview questions for a {role} position.
Resume context: {resume_text[:500] if resume_text else "Not provided"}

Return ONLY a JSON array of strings, no markdown:
["Question 1?", "Question 2?", "Question 3?"]

Include:
- 4 technical questions about {role}
- 3 data structures/algorithms questions
- 2 system design questions
- 1 behavioral question
"""
            response = model.generate_content(prompt)
            text = response.text.strip()

            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()

            questions = json.loads(text)
            return questions[:num_questions]

        except Exception as e:
            print(f"Error generating questions: {e}")
            return [
                f"Tell me about your experience with {role} development?",
                "What is the difference between a stack and a queue?",
                "Explain time complexity and Big O notation.",
                "How would you design a URL shortening service?",
                "What is the difference between REST and GraphQL?",
                "Explain the concept of recursion with an example.",
                "What are SOLID principles?",
                "How do you handle merge conflicts in Git?",
                "Tell me about a challenging project you worked on.",
                "Where do you see yourself in 5 years?"
            ]

    @staticmethod
    def chat_with_interviewer(messages: List[Dict[str, str]], role: str) -> str:
        """Multi-turn chat for mock interview"""
        try:
            import google.generativeai as genai
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-1.5-flash')

            system_prompt = f"""You are an experienced senior interviewer conducting a {role} technical interview.
Rules:
- Ask ONE question at a time
- Evaluate the candidate's answer briefly (1 sentence)
- Then ask the next question
- Be professional, encouraging but honest
- Keep responses under 100 words
- After 5-6 exchanges, wrap up the interview"""

            # Build conversation history
            conversation = f"SYSTEM: {system_prompt}\n\n"
            for msg in messages:
                role_label = "CANDIDATE" if msg["role"] == "user" else "INTERVIEWER"
                conversation += f"{role_label}: {msg['content']}\n"
            conversation += "INTERVIEWER:"

            response = model.generate_content(conversation)
            return response.text.strip()

        except Exception as e:
            print(f"Chat error: {e}")
            fallback_questions = [
                f"Welcome! I'm your interviewer for the {role} position. Let's start - can you briefly introduce yourself and tell me about your technical background?",
                "Great! Now, can you explain the difference between an array and a linked list? When would you use each?",
                "Good. Let's discuss a scenario - how would you design a simple login system? Walk me through your approach.",
                "Interesting approach! Can you tell me about a challenging bug you fixed? What was your debugging process?",
                "Thank you for sharing that. Last question - where do you see yourself growing technically in the next 2 years?",
                "Thank you for your time! You've done well in this interview. We'll be in touch soon. Do you have any questions for me?"
            ]
            # Return question based on conversation length
            msg_count = len([m for m in messages if m["role"] == "user"])
            idx = min(msg_count, len(fallback_questions) - 1)
            return fallback_questions[idx]

    @staticmethod
    def generate_interview_feedback(messages: List[Dict[str, str]], role: str) -> Dict[str, Any]:
        """Generate feedback on mock interview performance"""
        try:
            import google.generativeai as genai
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-1.5-flash')

            conversation = "\n".join([
                f"{'Candidate' if m['role'] == 'user' else 'Interviewer'}: {m['content']}"
                for m in messages
            ])

            prompt = f"""
Analyze this {role} interview and return ONLY a JSON object (no markdown):

Interview:
{conversation[:2000]}

Return this exact JSON:
{{
    "communication_score": 4,
    "technical_score": 3,
    "confidence_score": 4,
    "overall_rating": 3.5,
    "strengths": ["strength 1", "strength 2"],
    "improvements": ["improvement 1", "improvement 2"],
    "summary": "2-3 sentence overall feedback"
}}
"""
            response = model.generate_content(prompt)
            text = response.text.strip()

            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()

            return json.loads(text)

        except Exception as e:
            print(f"Feedback error: {e}")
            # Calculate basic scores from conversation length
            user_msgs = [m for m in messages if m["role"] == "user"]
            num_answers = len(user_msgs)
            base_score = min(3 + (num_answers * 0.3), 5)

            return {
                "communication_score": round(base_score, 1),
                "technical_score": round(base_score - 0.5, 1),
                "confidence_score": round(base_score, 1),
                "overall_rating": round(base_score - 0.2, 1),
                "strengths": [
                    "Completed the interview session",
                    f"Answered {num_answers} questions",
                    "Showed initiative by practicing"
                ],
                "improvements": [
                    "Add GEMINI_API_KEY for detailed AI feedback",
                    "Practice more mock interviews",
                    "Review core technical concepts"
                ],
                "summary": f"You completed {num_answers} interview questions for the {role} position. For detailed AI feedback, please add your GEMINI_API_KEY to the backend .env file."
            }
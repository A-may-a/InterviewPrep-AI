import { useState } from "react";

const roadmap = [
  {
    phase: "Phase 1",
    title: "Foundation",
    duration: "4–6 weeks",
    color: "#00FFB2",
    icon: "🧱",
    description: "Learn the absolute basics before touching the project",
    tracks: [
      {
        name: "Frontend — React",
        icon: "⚛️",
        steps: [
          { topic: "HTML & CSS basics", detail: "Tags, flexbox, grid, responsive design", resource: "freeCodeCamp HTML/CSS" },
          { topic: "JavaScript fundamentals", detail: "Variables, functions, arrays, objects, async/await, fetch API", resource: "javascript.info" },
          { topic: "React basics", detail: "Components, props, useState, useEffect, JSX", resource: "react.dev official docs" },
          { topic: "React Router", detail: "Page navigation, protected routes", resource: "reactrouter.com" },
        ]
      },
      {
        name: "Backend — Python FastAPI",
        icon: "🐍",
        steps: [
          { topic: "Python basics", detail: "Syntax, loops, functions, classes, file I/O", resource: "python.org tutorial" },
          { topic: "FastAPI", detail: "Routes, request/response models, Pydantic, middleware", resource: "fastapi.tiangolo.com" },
          { topic: "REST API concepts", detail: "GET/POST/PUT/DELETE, status codes, JSON", resource: "restfulapi.net" },
          { topic: "Authentication", detail: "JWT tokens, OAuth2, bcrypt password hashing", resource: "FastAPI security docs" },
        ]
      },
      {
        name: "Database — MySQL",
        icon: "🗄️",
        steps: [
          { topic: "SQL fundamentals", detail: "SELECT, INSERT, UPDATE, DELETE, JOINs", resource: "sqlzoo.net or w3schools SQL" },
          { topic: "Database design", detail: "ER diagrams, normalization, primary/foreign keys", resource: "dbdiagram.io for practice" },
          { topic: "SQLAlchemy ORM", detail: "Connect Python to MySQL, models, sessions", resource: "SQLAlchemy docs" },
        ]
      }
    ]
  },
  {
    phase: "Phase 2",
    title: "Core Features",
    duration: "6–8 weeks",
    color: "#FFB800",
    icon: "⚙️",
    description: "Build the main features one by one",
    tracks: [
      {
        name: "User Auth System",
        icon: "🔐",
        steps: [
          { topic: "Register / Login API", detail: "POST /register, POST /login endpoints in FastAPI", resource: "Build it yourself!" },
          { topic: "JWT Authentication", detail: "Issue tokens on login, protect routes with dependencies", resource: "FastAPI JWT tutorial" },
          { topic: "React Auth UI", detail: "Login/Signup forms, store token in localStorage, redirect", resource: "React context for auth state" },
          { topic: "Protected Routes", detail: "Redirect unauthenticated users away from dashboard", resource: "React Router docs" },
        ]
      },
      {
        name: "Aptitude Quiz Module",
        icon: "📝",
        steps: [
          { topic: "DB schema for questions", detail: "Tables: questions, options, user_answers, quiz_sessions", resource: "Design on dbdiagram.io first" },
          { topic: "Quiz API endpoints", detail: "GET /questions, POST /submit, GET /results", resource: "FastAPI + SQLAlchemy" },
          { topic: "Quiz UI in React", detail: "Timer, multiple choice, instant feedback, score screen", resource: "React useState + useEffect" },
        ]
      },
      {
        name: "DSA Question Bank",
        icon: "💻",
        steps: [
          { topic: "DB schema for DSA", detail: "topic, difficulty, description, examples, solution", resource: "Design on dbdiagram.io" },
          { topic: "Filter/search API", detail: "GET /dsa?topic=arrays&difficulty=medium", resource: "FastAPI query params" },
          { topic: "DSA UI", detail: "Filterable list, code display with syntax highlighting", resource: "react-syntax-highlighter npm" },
        ]
      }
    ]
  },
  {
    phase: "Phase 3",
    title: "AI Integration",
    duration: "4–5 weeks",
    color: "#FF6B6B",
    icon: "🤖",
    description: "The exciting part — plug in Gemini / OpenAI",
    tracks: [
      {
        name: "Resume Analysis",
        icon: "📄",
        steps: [
          { topic: "File upload endpoint", detail: "Accept PDF/DOCX, save to server or cloud storage", resource: "FastAPI file upload docs" },
          { topic: "Extract text from resume", detail: "Use PyMuPDF or pdfminer for PDF parsing", resource: "PyMuPDF docs" },
          { topic: "Send to Gemini API", detail: "Prompt: 'Analyze this resume and list strengths, weaknesses, suggested improvements'", resource: "Google AI Studio" },
          { topic: "Display AI feedback in UI", detail: "Show structured analysis with sections", resource: "React components" },
        ]
      },
      {
        name: "AI Interview Questions Generator",
        icon: "🧠",
        steps: [
          { topic: "Build the prompt", detail: "Send job role + resume summary → get 10 tailored interview Qs", resource: "Prompt engineering guide" },
          { topic: "API endpoint", detail: "POST /generate-questions with role, skills as body", resource: "FastAPI + Gemini SDK" },
          { topic: "Display in UI", detail: "List questions with 'Practice Answer' button per question", resource: "React" },
        ]
      },
      {
        name: "Mock Interview Chatbot",
        icon: "💬",
        steps: [
          { topic: "Chat API design", detail: "POST /chat with message history array + user message", resource: "OpenAI/Gemini multi-turn chat" },
          { topic: "System prompt design", detail: "'You are a senior interviewer for [role]. Ask one question at a time, evaluate answers...'", resource: "Prompt engineering" },
          { topic: "Chat UI in React", detail: "Message bubbles, input box, typing indicator, end session button", resource: "Build from scratch or use shadcn/ui" },
          { topic: "Save chat history", detail: "Store sessions in DB for progress tracking", resource: "SQLAlchemy session model" },
        ]
      }
    ]
  },
  {
    phase: "Phase 4",
    title: "Progress & Polish",
    duration: "3–4 weeks",
    color: "#A78BFA",
    icon: "📊",
    description: "Dashboard, analytics, and making it production-ready",
    tracks: [
      {
        name: "Progress Dashboard",
        icon: "📈",
        steps: [
          { topic: "Track user activity in DB", detail: "Tables: quiz_scores, mock_interviews, topics_practiced", resource: "DB schema design" },
          { topic: "Analytics API", detail: "GET /dashboard — return quiz averages, topics covered, interview count", resource: "FastAPI + SQL aggregations" },
          { topic: "Charts in React", detail: "Use Recharts: line chart for scores over time, pie for topic coverage", resource: "recharts.org" },
        ]
      },
      {
        name: "Deployment",
        icon: "🚀",
        steps: [
          { topic: "Frontend deployment", detail: "Build React app → deploy on Vercel or Netlify (free)", resource: "vercel.com" },
          { topic: "Backend deployment", detail: "Deploy FastAPI on Render.com or Railway.app (free tier)", resource: "render.com" },
          { topic: "MySQL in cloud", detail: "PlanetScale (free tier) or Railway MySQL", resource: "planetscale.com" },
          { topic: "Environment variables", detail: "Store API keys, DB URL securely in .env files", resource: "python-dotenv" },
        ]
      }
    ]
  }
];

const techStack = [
  { name: "React", role: "Frontend UI", learn: "react.dev", color: "#61DAFB", icon: "⚛️" },
  { name: "FastAPI", role: "Backend API", learn: "fastapi.tiangolo.com", color: "#009688", icon: "⚡" },
  { name: "MySQL", role: "Database", learn: "sqlzoo.net", color: "#F29111", icon: "🗄️" },
  { name: "Gemini/OpenAI", role: "AI Features", learn: "ai.google.dev", color: "#4285F4", icon: "🤖" },
  { name: "SQLAlchemy", role: "ORM (Python↔DB)", learn: "sqlalchemy.org", color: "#D71F00", icon: "🔗" },
  { name: "JWT", role: "Authentication", learn: "jwt.io", color: "#D63AFF", icon: "🔐" },
];

const dbSchema = `users
  id, email, password_hash, name, created_at

questions (aptitude)
  id, text, options (JSON), correct_answer, category, difficulty

dsa_problems
  id, title, description, topic, difficulty, examples, solution

quiz_sessions
  id, user_id, score, total, created_at

mock_interviews
  id, user_id, role, messages (JSON), created_at

resumes
  id, user_id, file_path, ai_analysis, uploaded_at

progress
  id, user_id, topic, score, date`;

export default function Roadmap() {
  const [activePhase, setActivePhase] = useState(0);
  const [activeTrack, setActiveTrack] = useState(0);
  const [showSchema, setShowSchema] = useState(false);

  const phase = roadmap[activePhase];
  const track = phase.tracks[activeTrack] || phase.tracks[0];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0F",
      color: "#E8E8F0",
      fontFamily: "'Courier New', monospace",
      padding: "0",
      overflowX: "hidden"
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1E1E30",
        padding: "32px 40px 24px",
        background: "linear-gradient(180deg, #0D0D1A 0%, #0A0A0F 100%)"
      }}>
        <div style={{ fontSize: "11px", color: "#555", letterSpacing: "4px", marginBottom: "8px" }}>COMPLETE LEARNING ROADMAP</div>
        <h1 style={{
          fontSize: "clamp(22px, 4vw, 36px)",
          fontWeight: "800",
          margin: 0,
          background: "linear-gradient(135deg, #00FFB2, #00B8FF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1.2
        }}>
          AI Interview Preparation Platform
        </h1>
        <p style={{ color: "#666", marginTop: "8px", fontSize: "13px" }}>
          Zero to deployed — 17–23 weeks total • React + FastAPI + MySQL + Gemini
        </p>
      </div>

      <div style={{ padding: "32px 40px", maxWidth: "1100px", margin: "0 auto" }}>

        {/* Tech Stack Pills */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ fontSize: "11px", color: "#555", letterSpacing: "3px", marginBottom: "16px" }}>TECH STACK — WHAT YOU'LL USE</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {techStack.map(t => (
              <div key={t.name} style={{
                border: `1px solid ${t.color}33`,
                borderRadius: "8px",
                padding: "10px 16px",
                background: `${t.color}08`,
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <span style={{ fontSize: "16px" }}>{t.icon}</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: t.color }}>{t.name}</div>
                  <div style={{ fontSize: "11px", color: "#666" }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phase Tabs */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "11px", color: "#555", letterSpacing: "3px", marginBottom: "16px" }}>SELECT PHASE</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {roadmap.map((p, i) => (
              <button key={i} onClick={() => { setActivePhase(i); setActiveTrack(0); }} style={{
                padding: "10px 20px",
                borderRadius: "6px",
                border: `1px solid ${activePhase === i ? p.color : "#222"}`,
                background: activePhase === i ? `${p.color}15` : "transparent",
                color: activePhase === i ? p.color : "#555",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "1px",
                fontFamily: "inherit",
                transition: "all 0.15s"
              }}>
                {p.icon} {p.phase}: {p.title}
                <span style={{ marginLeft: "8px", fontSize: "10px", opacity: 0.7 }}>({p.duration})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Phase Content */}
        <div style={{
          border: `1px solid ${phase.color}25`,
          borderRadius: "12px",
          background: `${phase.color}05`,
          padding: "28px",
          marginBottom: "32px"
        }}>
          <div style={{ marginBottom: "20px" }}>
            <span style={{
              fontSize: "11px", color: phase.color, letterSpacing: "3px",
              background: `${phase.color}15`, padding: "4px 10px", borderRadius: "4px"
            }}>
              {phase.duration}
            </span>
            <h2 style={{ fontSize: "22px", margin: "12px 0 4px", color: "#fff" }}>
              {phase.icon} {phase.phase}: {phase.title}
            </h2>
            <p style={{ color: "#888", margin: 0, fontSize: "13px" }}>{phase.description}</p>
          </div>

          {/* Track Tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
            {phase.tracks.map((t, i) => (
              <button key={i} onClick={() => setActiveTrack(i)} style={{
                padding: "7px 14px",
                borderRadius: "5px",
                border: `1px solid ${activeTrack === i ? phase.color : "#2A2A3A"}`,
                background: activeTrack === i ? `${phase.color}18` : "transparent",
                color: activeTrack === i ? phase.color : "#666",
                cursor: "pointer",
                fontSize: "12px",
                fontFamily: "inherit",
                transition: "all 0.15s"
              }}>
                {t.icon} {t.name}
              </button>
            ))}
          </div>

          {/* Steps */}
          <div>
            {track.steps.map((step, i) => (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "28px 1fr auto",
                gap: "14px",
                alignItems: "start",
                padding: "14px 0",
                borderBottom: i < track.steps.length - 1 ? "1px solid #1A1A28" : "none"
              }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  border: `2px solid ${phase.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", fontWeight: "700", color: phase.color,
                  flexShrink: 0
                }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#E8E8F0", marginBottom: "3px" }}>
                    {step.topic}
                  </div>
                  <div style={{ fontSize: "12px", color: "#888", lineHeight: 1.5 }}>{step.detail}</div>
                </div>
                <div style={{
                  fontSize: "10px", color: phase.color, background: `${phase.color}10`,
                  border: `1px solid ${phase.color}25`, borderRadius: "4px",
                  padding: "4px 8px", whiteSpace: "nowrap", flexShrink: 0
                }}>
                  📚 {step.resource}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DB Schema Toggle */}
        <div style={{ marginBottom: "32px" }}>
          <button onClick={() => setShowSchema(!showSchema)} style={{
            padding: "10px 20px",
            borderRadius: "6px",
            border: "1px solid #FFB80044",
            background: showSchema ? "#FFB80012" : "transparent",
            color: "#FFB800",
            cursor: "pointer",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: "700",
            letterSpacing: "1px"
          }}>
            🗄️ {showSchema ? "HIDE" : "SHOW"} DATABASE SCHEMA (What tables you'll need)
          </button>
          {showSchema && (
            <div style={{
              marginTop: "16px",
              background: "#0D0D1A",
              border: "1px solid #FFB80022",
              borderRadius: "8px",
              padding: "20px"
            }}>
              <div style={{ fontSize: "11px", color: "#555", letterSpacing: "3px", marginBottom: "12px" }}>MYSQL TABLE OVERVIEW</div>
              <pre style={{
                fontSize: "12px",
                color: "#FFB800",
                lineHeight: "1.8",
                margin: 0,
                whiteSpace: "pre-wrap"
              }}>{dbSchema}</pre>
            </div>
          )}
        </div>

        {/* Timeline Summary */}
        <div style={{ borderTop: "1px solid #1E1E30", paddingTop: "32px" }}>
          <div style={{ fontSize: "11px", color: "#555", letterSpacing: "3px", marginBottom: "16px" }}>TOTAL TIMELINE AT A GLANCE</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            {roadmap.map((p, i) => (
              <div key={i} style={{
                padding: "16px",
                border: `1px solid ${p.color}25`,
                borderRadius: "8px",
                background: `${p.color}06`
              }}>
                <div style={{ fontSize: "20px", marginBottom: "6px" }}>{p.icon}</div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: p.color }}>{p.phase}: {p.title}</div>
                <div style={{ fontSize: "11px", color: "#666", marginTop: "4px" }}>{p.duration}</div>
                <div style={{ fontSize: "11px", color: "#888", marginTop: "6px", lineHeight: 1.5 }}>{p.description}</div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: "20px",
            padding: "16px 20px",
            background: "#00FFB210",
            border: "1px solid #00FFB230",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#00FFB2",
            lineHeight: 1.7
          }}>
            💡 <strong>Pro tip:</strong> Don't try to learn everything before building. Learn Phase 1, then start Phase 2's first feature. 
            You learn 10× faster when building something real. Make mistakes — they teach you more than tutorials.
          </div>
        </div>
      </div>
    </div>
  );
}

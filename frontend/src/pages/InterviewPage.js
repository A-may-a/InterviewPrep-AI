// frontend/src/pages/InterviewPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI } from '../api';
import { Send, Loader, ArrowLeft, StopCircle } from 'lucide-react';

export default function InterviewPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('setup');
  const [role, setRole] = useState('Backend Engineer');
  const [difficulty, setDifficulty] = useState('medium');
  const [interviewId, setInterviewId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startInterview = async () => {
    setLoading(true);
    setError('');
    try {
      // Create interview session
      const res = await interviewAPI.startInterview(role, difficulty);
      const newInterviewId = res.data.id;
      setInterviewId(newInterviewId);

      // Get opening message from AI
      const chatRes = await interviewAPI.chatInInterview(
        newInterviewId,
        'Hello, please start the interview with a greeting and first question.'
      );

      setMessages([{
        role: 'assistant',
        content: chatRes.data.ai_response
      }]);

      setStep('interview');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to start interview. Check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await interviewAPI.chatInInterview(interviewId, userMessage);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.data.ai_response
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, there was an issue. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const endInterview = async () => {
    if (messages.length < 2) {
      alert('Please have at least one exchange before ending the interview.');
      return;
    }

    setLoading(true);
    try {
      const res = await interviewAPI.endInterview(interviewId);
      setFeedback(res.data.feedback);
      setStep('finished');
    } catch (err) {
      setError('Failed to generate feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (score) => {
    if (score >= 4) return '#00c853';
    if (score >= 3) return '#ff9800';
    return '#f44336';
  };

  const getRatingLabel = (score) => {
    if (score >= 4.5) return 'Excellent';
    if (score >= 4) return 'Very Good';
    if (score >= 3) return 'Good';
    if (score >= 2) return 'Average';
    return 'Needs Improvement';
  };

  // ─── SETUP SCREEN ─────────────────────────────────────────────────────────
  if (step === 'setup') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
      }}>
        <div style={{
          background: 'white', borderRadius: '16px', padding: '40px',
          maxWidth: '500px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
        }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#667eea', fontSize: '14px', fontWeight: '600',
              display: 'flex', alignItems: 'center', gap: '4px',
              marginBottom: '24px', padding: 0
            }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎤</div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0', color: '#333' }}>
              Mock Interview
            </h1>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
              Practice with an AI interviewer. Get real feedback.
            </p>
          </div>

          {error && (
            <div style={{
              background: '#fee', border: '1px solid #fcc', color: '#c00',
              padding: '12px', borderRadius: '8px', marginBottom: '20px',
              fontSize: '14px'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Role Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block', marginBottom: '8px',
              color: '#333', fontSize: '14px', fontWeight: '600'
            }}>
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%', padding: '12px', border: '1px solid #ddd',
                borderRadius: '8px', fontSize: '14px', background: '#f9f9f9',
                boxSizing: 'border-box'
              }}
            >
              <option>Backend Engineer</option>
              <option>Frontend Engineer</option>
              <option>Full Stack Engineer</option>
              <option>Data Scientist</option>
              <option>DevOps Engineer</option>
              <option>Mobile Developer</option>
              <option>ML Engineer</option>
              <option>Software Engineer</option>
            </select>
          </div>

          {/* Difficulty Selection */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block', marginBottom: '8px',
              color: '#333', fontSize: '14px', fontWeight: '600'
            }}>
              Difficulty Level
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              {[
                { value: 'easy', label: 'Easy', desc: 'Fresher', color: '#00c853' },
                { value: 'medium', label: 'Medium', desc: '1-2 years', color: '#ff9800' },
                { value: 'hard', label: 'Hard', desc: '3+ years', color: '#f44336' }
              ].map(d => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  style={{
                    padding: '14px 10px',
                    border: `2px solid ${difficulty === d.value ? d.color : '#eee'}`,
                    background: difficulty === d.value ? `${d.color}15` : '#fff',
                    borderRadius: '10px', cursor: 'pointer',
                    textAlign: 'center', transition: 'all 0.2s'
                  }}
                >
                  <p style={{
                    margin: '0 0 2px 0', fontSize: '14px', fontWeight: '700',
                    color: difficulty === d.value ? d.color : '#666'
                  }}>
                    {d.label}
                  </p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#999' }}>{d.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div style={{
            background: '#f0f4ff', borderRadius: '10px', padding: '16px',
            marginBottom: '24px', fontSize: '13px', color: '#667eea'
          }}>
            <p style={{ margin: '0 0 6px 0', fontWeight: '700' }}>💡 Tips for best results:</p>
            <p style={{ margin: '0 0 4px 0' }}>• Answer in complete sentences</p>
            <p style={{ margin: '0 0 4px 0' }}>• Take your time to think before answering</p>
            <p style={{ margin: 0 }}>• Add GEMINI_API_KEY in .env for AI-powered questions</p>
          </div>

          <button
            onClick={startInterview}
            disabled={loading}
            style={{
              width: '100%', padding: '14px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white', border: 'none', borderRadius: '10px',
              fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            {loading ? <><Loader size={20} /> Starting...</> : '🚀 Start Interview'}
          </button>
        </div>
      </div>
    );
  }

  // ─── INTERVIEW SCREEN ──────────────────────────────────────────────────────
  if (step === 'interview') {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f7fa', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          background: 'white', borderBottom: '1px solid #eee',
          padding: '16px 24px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: '#333' }}>
              🎤 {role} Interview
            </h2>
            <p style={{ color: '#666', margin: '2px 0 0 0', fontSize: '12px' }}>
              {messages.length} messages • {difficulty} difficulty
            </p>
          </div>
          <button
            onClick={endInterview}
            disabled={loading}
            style={{
              padding: '10px 20px',
              background: '#fee', border: '1px solid #fcc',
              borderRadius: '8px', color: '#c00', fontSize: '14px',
              fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <StopCircle size={16} />
            End & Get Feedback
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>

            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎤</div>
                <p>Starting interview...</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} style={{
                marginBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  fontSize: '11px', color: '#999', marginBottom: '4px',
                  fontWeight: '600', letterSpacing: '0.5px'
                }}>
                  {msg.role === 'user' ? 'YOU' : '🤖 INTERVIEWER'}
                </div>
                <div style={{
                  maxWidth: '75%',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'white',
                  color: msg.role === 'user' ? 'white' : '#333',
                  padding: '14px 18px',
                  borderRadius: msg.role === 'user'
                    ? '16px 16px 4px 16px'
                    : '16px 16px 16px 4px',
                  fontSize: '14px', lineHeight: '1.6',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '8px',
                marginBottom: '16px'
              }}>
                <div style={{
                  background: 'white', padding: '14px 18px', borderRadius: '16px 16px 16px 4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  color: '#999', fontSize: '14px'
                }}>
                  <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Interviewer is thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div style={{
          background: 'white', borderTop: '1px solid #eee',
          padding: '16px 24px'
        }}>
          <div style={{
            maxWidth: '800px', margin: '0 auto',
            display: 'flex', gap: '12px', alignItems: 'flex-end'
          }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type your answer... (Press Enter to send, Shift+Enter for new line)"
              disabled={loading}
              rows={2}
              style={{
                flex: 1, padding: '12px 16px',
                border: '1px solid #ddd', borderRadius: '10px',
                fontSize: '14px', outline: 'none', resize: 'none',
                fontFamily: 'inherit', lineHeight: '1.5',
                background: loading ? '#f9f9f9' : '#fff'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                padding: '12px 20px',
                background: loading || !input.trim()
                  ? '#ddd'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white', border: 'none', borderRadius: '10px',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
                fontWeight: '600', fontSize: '14px', flexShrink: 0
              }}
            >
              <Send size={18} />
              Send
            </button>
          </div>
          <p style={{
            textAlign: 'center', color: '#999', fontSize: '12px',
            margin: '8px 0 0 0'
          }}>
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    );
  }

  // ─── FEEDBACK SCREEN ───────────────────────────────────────────────────────
  if (step === 'finished') {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '40px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          <div style={{
            background: 'white', borderRadius: '16px', padding: '40px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎯</div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0', color: '#333' }}>
                Interview Feedback
              </h1>
              <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                {role} • {difficulty} difficulty
              </p>
            </div>

            {feedback ? (
              <>
                {/* Score Cards */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px', marginBottom: '24px'
                }}>
                  {[
                    { label: 'Communication', score: feedback.communication_score, icon: '🗣️' },
                    { label: 'Technical', score: feedback.technical_score, icon: '💻' },
                    { label: 'Confidence', score: feedback.confidence_score, icon: '💪' },
                    { label: 'Overall Rating', score: feedback.overall_rating, icon: '⭐' }
                  ].map((item, idx) => (
                    <div key={idx} style={{
                      background: '#f9f9f9', borderRadius: '12px', padding: '20px',
                      borderLeft: `4px solid ${getRatingColor(item.score)}`,
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
                      <p style={{ color: '#666', margin: '0 0 4px 0', fontSize: '12px', fontWeight: '600' }}>
                        {item.label}
                      </p>
                      <p style={{
                        fontSize: '28px', fontWeight: '800', margin: '0 0 4px 0',
                        color: getRatingColor(item.score)
                      }}>
                        {item.score}/5
                      </p>
                      <p style={{
                        margin: 0, fontSize: '11px',
                        color: getRatingColor(item.score), fontWeight: '600'
                      }}>
                        {getRatingLabel(item.score)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Strengths */}
                {feedback.strengths && feedback.strengths.length > 0 && (
                  <div style={{
                    background: '#eaffea', border: '1px solid #c8e6c9',
                    borderRadius: '12px', padding: '20px', marginBottom: '16px'
                  }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 12px 0', color: '#2e7d32' }}>
                      ✅ Strengths
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#2e7d32' }}>
                      {feedback.strengths.map((s, i) => (
                        <li key={i} style={{ marginBottom: '6px', fontSize: '14px' }}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {feedback.improvements && feedback.improvements.length > 0 && (
                  <div style={{
                    background: '#fff3f0', border: '1px solid #ffccbc',
                    borderRadius: '12px', padding: '20px', marginBottom: '16px'
                  }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 12px 0', color: '#e64a19' }}>
                      💡 Areas to Improve
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#e64a19' }}>
                      {feedback.improvements.map((item, i) => (
                        <li key={i} style={{ marginBottom: '6px', fontSize: '14px' }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Summary */}
                {feedback.summary && (
                  <div style={{
                    background: '#f0f4ff', border: '1px solid #c5cae9',
                    borderRadius: '12px', padding: '20px', marginBottom: '24px'
                  }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 8px 0', color: '#3949ab' }}>
                      📝 Overall Summary
                    </h3>
                    <p style={{ color: '#3949ab', lineHeight: '1.6', margin: 0, fontSize: '14px' }}>
                      {feedback.summary}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                <Loader size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
                <p>Generating feedback...</p>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setStep('setup');
                  setMessages([]);
                  setInterviewId(null);
                  setFeedback(null);
                  setInput('');
                }}
                style={{
                  flex: 1, padding: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white', border: 'none', borderRadius: '10px',
                  fontWeight: '600', cursor: 'pointer', fontSize: '14px'
                }}
              >
                🔄 Try Another Interview
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  flex: 1, padding: '12px', background: '#f0f0f0',
                  color: '#333', border: 'none', borderRadius: '10px',
                  fontWeight: '600', cursor: 'pointer', fontSize: '14px'
                }}
              >
                📊 Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
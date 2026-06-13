// frontend/src/pages/InterviewPage.js
import React, { useState, useEffect, useRef } from 'react';
import { interviewAPI } from '../api';
import { Send, Loader, AlertCircle } from 'lucide-react';

export default function InterviewPage() {
  const [step, setStep] = useState('setup'); // setup, interview, finished
  const [role, setRole] = useState('Backend Engineer');
  const [difficulty, setDifficulty] = useState('medium');
  const [interviewId, setInterviewId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startInterview = async () => {
    setLoading(true);
    try {
      const res = await interviewAPI.startInterview(role, difficulty);
      setInterviewId(res.data.id);
      
      // Get initial greeting from interviewer
      const greetingRes = await interviewAPI.chatInInterview(res.data.id, 'Hello, start the interview');
      setMessages([
        {
          role: 'assistant',
          content: greetingRes.data.ai_response
        }
      ]);
      
      setStep('interview');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    
    // Add user message to UI
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage
    }]);

    setLoading(true);

    try {
      const res = await interviewAPI.chatInInterview(interviewId, userMessage);
      
      // Add AI response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.data.ai_response
      }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const endInterview = async () => {
    try {
      const res = await interviewAPI.endInterview(interviewId);
      setFeedback(res.data.feedback);
      setStep('finished');
    } catch (err) {
      console.error(err);
    }
  };

  if (step === 'setup') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '8px',
            color: '#333'
          }}>Start Mock Interview</h1>
          <p style={{
            color: '#666',
            marginBottom: '32px',
            fontSize: '14px'
          }}>Practice with an AI interviewer tailored to your role</p>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontSize: '14px',
              fontWeight: '600'
            }}>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                background: '#f9f9f9'
              }}
            >
              <option>Backend Engineer</option>
              <option>Frontend Engineer</option>
              <option>Full Stack Engineer</option>
              <option>Data Scientist</option>
              <option>DevOps Engineer</option>
              <option>Product Manager</option>
            </select>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontSize: '14px',
              fontWeight: '600'
            }}>Difficulty</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px'
            }}>
              {['easy', 'medium', 'hard'].map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  style={{
                    padding: '12px',
                    border: `2px solid ${difficulty === d ? '#667eea' : '#ddd'}`,
                    background: difficulty === d ? '#f0f4ff' : '#fff',
                    borderRadius: '8px',
                    color: difficulty === d ? '#667eea' : '#666',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startInterview}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading && <Loader size={18} />}
            {loading ? 'Starting...' : '🎤 Start Interview'}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'finished' && feedback) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f5f7fa',
        padding: '40px 20px'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '24px',
            color: '#333'
          }}>Interview Feedback</h1>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {[
              { label: 'Communication', score: feedback.communication_score },
              { label: 'Technical', score: feedback.technical_score },
              { label: 'Confidence', score: feedback.confidence_score },
              { label: 'Overall', score: feedback.overall_rating }
            ].map((item, idx) => (
              <div key={idx} style={{
                background: '#f9f9f9',
                padding: '20px',
                borderRadius: '8px',
                borderLeft: '4px solid #667eea'
              }}>
                <p style={{ color: '#666', margin: 0, fontSize: '12px', fontWeight: '600' }}>
                  {item.label}
                </p>
                <p style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  margin: '8px 0 0 0',
                  color: '#667eea'
                }}>
                  {item.score}/5
                </p>
              </div>
            ))}
          </div>

          {feedback.strengths && feedback.strengths.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '12px',
                color: '#333'
              }}>Strengths</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
                {feedback.strengths.map((s, idx) => (
                  <li key={idx} style={{ marginBottom: '8px', fontSize: '14px' }}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {feedback.improvements && feedback.improvements.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '12px',
                color: '#333'
              }}>Areas to Improve</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
                {feedback.improvements.map((imp, idx) => (
                  <li key={idx} style={{ marginBottom: '8px', fontSize: '14px' }}>{imp}</li>
                ))}
              </ul>
            </div>
          )}

          {feedback.summary && (
            <div style={{
              background: '#f0f4ff',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px',
              color: '#333',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              <p style={{ margin: 0 }}>{feedback.summary}</p>
            </div>
          )}

          <button
            onClick={() => window.location.href = '/dashboard'}
            style={{
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f7fa',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #eee',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: '#333' }}>
            Mock Interview - {role}
          </h2>
          <p style={{ color: '#666', margin: '4px 0 0 0', fontSize: '12px' }}>
            Difficulty: {difficulty}
          </p>
        </div>
        <button
          onClick={endInterview}
          style={{
            padding: '8px 16px',
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '6px',
            color: '#c00',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          End Interview
        </button>
      </div>

      {/* Chat Area */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          width: '100%'
        }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              marginBottom: '16px',
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                maxWidth: '70%',
                background: msg.role === 'user' ? '#667eea' : '#fff',
                color: msg.role === 'user' ? '#fff' : '#333',
                padding: '12px 16px',
                borderRadius: '12px',
                border: msg.role === 'user' ? 'none' : '1px solid #eee',
                fontSize: '14px',
                lineHeight: '1.5',
                boxShadow: msg.role === 'user' ? '0 2px 8px rgba(102,126,234,0.3)' : 'none'
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'flex-start'
            }}>
              <div style={{
                background: '#fff',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #eee',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                color: '#666'
              }}>
                <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div style={{
        background: 'white',
        borderTop: '1px solid #eee',
        padding: '20px',
        display: 'flex',
        gap: '12px',
        justifyContent: 'center'
      }}>
        <div style={{
          maxWidth: '900px',
          width: '100%',
          display: 'flex',
          gap: '12px'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
            placeholder="Type your answer..."
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              background: loading ? '#f9f9f9' : '#fff'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: '12px 20px',
              background: loading ? '#ddd' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

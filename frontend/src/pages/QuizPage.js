// frontend/src/pages/QuizPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI } from '../api';
import { Clock, Check, ArrowLeft, ChevronRight } from 'lucide-react';

export default function QuizPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('select'); // select | quiz | results
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingTests, setLoadingTests] = useState(true);
  const [timer, setTimer] = useState(600);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Load available tests on mount
  useEffect(() => {
    setLoadingTests(true);
    quizAPI.getAvailableTests()
      .then(res => {
        setTests(res.data);
        setLoadingTests(false);
      })
      .catch(err => {
        console.error('Failed to load tests:', err);
        setError('Failed to load tests. Please check your connection.');
        setLoadingTests(false);
      });
  }, []);

  // Submit quiz function
  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    setStep('results');

    try {
      console.log('Submitting answers:', answers);
      const res = await quizAPI.submitAptitudeQuiz(answers);
      console.log('Result:', res.data);
      setResult(res.data);
    } catch (err) {
      console.error('Submit failed:', err);
      // Show error result
      setResult({
        score: 0,
        correct_answers: 0,
        total_questions: questions.length,
        percentage: 0,
        grade: 'Error',
        detailed_results: [],
        error: err.response?.data?.detail || err.message || 'Submission failed'
      });
    } finally {
      setSubmitting(false);
    }
  }, [answers, submitting, questions.length]);

  // Timer countdown
  useEffect(() => {
    if (step !== 'quiz') return;

    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, handleSubmit]);

  const startTest = async (testId) => {
    setLoading(true);
    setError('');
    try {
      const res = await quizAPI.getAptitudeTest(testId);
      setSelectedTest(res.data);
      setQuestions(res.data.questions);
      setAnswers({});
      setCurrentQuestion(0);
      setTimer(600);
      setResult(null);
      setStep('quiz');
    } catch (err) {
      console.error('Failed to load test:', err);
      setError('Failed to load test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;

  // ─── SELECT TEST SCREEN ────────────────────────────────────────────────────
  if (step === 'select') {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'white', border: '1px solid #ddd', borderRadius: '8px',
                padding: '8px 16px', cursor: 'pointer', fontSize: '14px',
                display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600'
              }}
            >
              <ArrowLeft size={16} /> Dashboard
            </button>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: '#333' }}>
                📝 Aptitude Tests
              </h1>
              <p style={{ color: '#888', margin: '4px 0 0 0', fontSize: '14px' }}>
                10 questions per test • 10 minutes • Mixed difficulty
              </p>
            </div>
          </div>

          {error && (
            <div style={{
              background: '#fff3cd', border: '1px solid #ffc107',
              borderRadius: '8px', padding: '12px 16px', marginBottom: '20px',
              color: '#856404', fontSize: '14px'
            }}>
              ⚠️ {error}
            </div>
          )}

          {loadingTests ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
              <p style={{ color: '#666' }}>Loading available tests...</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '20px'
            }}>
              {tests.map(test => (
                <div
                  key={test.test_id}
                  style={{
                    background: 'white', borderRadius: '14px', padding: '24px',
                    border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(102,126,234,0.2)';
                    e.currentTarget.style.borderColor = '#667eea';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                    e.currentTarget.style.borderColor = '#eee';
                  }}
                >
                  {/* Test Number Badge */}
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px', fontWeight: '800', color: 'white',
                    marginBottom: '16px'
                  }}>
                    {test.test_id}
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 12px 0', color: '#333' }}>
                    {test.test_name}
                  </h3>

                  <div style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>
                    <div style={{ marginBottom: '4px' }}>📝 {test.total_questions} Questions</div>
                    <div style={{ marginBottom: '4px' }}>⏱️ {test.duration_minutes} Minutes</div>
                    <div>🎯 Mixed Difficulty</div>
                  </div>

                  <button
                    onClick={() => startTest(test.test_id)}
                    disabled={loading}
                    style={{
                      width: '100%', padding: '10px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white', border: 'none', borderRadius: '8px',
                      fontWeight: '600', cursor: 'pointer', fontSize: '14px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                  >
                    {loading ? 'Loading...' : <>Start Test <ChevronRight size={16} /></>}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── QUIZ SCREEN ───────────────────────────────────────────────────────────
  if (step === 'quiz' && questions.length > 0) {
    const currentQ = questions[currentQuestion];

    return (
      <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '24px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{
            background: 'white', borderRadius: '14px', padding: '20px 24px',
            marginBottom: '20px', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: '#333' }}>
                {selectedTest?.test_name}
              </h2>
              <p style={{ color: '#888', margin: '4px 0 0 0', fontSize: '13px' }}>
                Question {currentQuestion + 1} of {questions.length}
                {' '}• {answeredCount} answered
              </p>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: timer < 120 ? '#ffebee' : timer < 300 ? '#fff8e1' : '#f0f4ff',
              padding: '10px 18px', borderRadius: '10px',
              color: timer < 120 ? '#c62828' : timer < 300 ? '#f57c00' : '#667eea',
              fontWeight: '800', fontSize: '18px'
            }}>
              <Clock size={20} />
              {formatTime(timer)}
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{
            height: '6px', background: '#eee',
            borderRadius: '3px', marginBottom: '20px', overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              transition: 'width 0.3s', borderRadius: '3px'
            }} />
          </div>

          {/* Question Card */}
          <div style={{
            background: 'white', borderRadius: '14px', padding: '32px',
            marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            {/* Category Badge */}
            {currentQ.category && (
              <span style={{
                background: '#f0f4ff', color: '#667eea', padding: '4px 12px',
                borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                display: 'inline-block', marginBottom: '16px'
              }}>
                {currentQ.category}
              </span>
            )}

            <h3 style={{
              fontSize: '17px', fontWeight: '600', color: '#333',
              marginBottom: '24px', lineHeight: '1.6'
            }}>
              Q{currentQuestion + 1}. {currentQ.text}
            </h3>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(currentQ.options || {}).map(([key, option]) => {
                const isSelected = answers[currentQ.id] === key;
                return (
                  <label
                    key={key}
                    style={{
                      display: 'flex', alignItems: 'center', padding: '16px 20px',
                      border: `2px solid ${isSelected ? '#667eea' : '#eee'}`,
                      borderRadius: '10px', cursor: 'pointer',
                      background: isSelected ? '#f0f4ff' : '#fafafa',
                      transition: 'all 0.15s'
                    }}
                  >
                    <input
                      type="radio"
                      name={`q-${currentQ.id}`}
                      value={key}
                      checked={isSelected}
                      onChange={() => handleAnswerChange(currentQ.id, key)}
                      style={{ width: '18px', height: '18px', marginRight: '14px', cursor: 'pointer' }}
                    />
                    <span style={{
                      fontSize: '15px', color: isSelected ? '#667eea' : '#333',
                      fontWeight: isSelected ? '600' : '400'
                    }}>
                      <strong>{key}.</strong> {option}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
            <button
              onClick={() => setCurrentQuestion(q => Math.max(0, q - 1))}
              disabled={currentQuestion === 0}
              style={{
                padding: '12px 24px', background: 'white',
                border: '1px solid #ddd', borderRadius: '10px',
                fontSize: '14px', fontWeight: '600',
                cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                color: currentQuestion === 0 ? '#ccc' : '#333',
                opacity: currentQuestion === 0 ? 0.5 : 1
              }}
            >
              ← Previous
            </button>

            {/* Question dots */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', flex: 1, justifyContent: 'center' }}>
              {questions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestion(idx)}
                  style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    border: `2px solid ${currentQuestion === idx ? '#667eea' : answers[q.id] ? '#00c853' : '#ddd'}`,
                    background: currentQuestion === idx ? '#667eea' : answers[q.id] ? '#eaffea' : 'white',
                    color: currentQuestion === idx ? 'white' : answers[q.id] ? '#00c853' : '#666',
                    cursor: 'pointer', fontSize: '12px', fontWeight: '700'
                  }}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  padding: '12px 28px',
                  background: submitting ? '#ccc' : 'linear-gradient(135deg, #00c853 0%, #00a83f 100%)',
                  color: 'white', border: 'none', borderRadius: '10px',
                  fontSize: '14px', fontWeight: '700',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                {submitting ? '⏳ Submitting...' : <><Check size={18} /> Submit Test</>}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(q => q + 1)}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white', border: 'none', borderRadius: '10px',
                  fontSize: '14px', fontWeight: '700', cursor: 'pointer'
                }}
              >
                Next →
              </button>
            )}
          </div>

          {/* Submit from any page */}
          {currentQuestion !== questions.length - 1 && answeredCount > 0 && (
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  padding: '10px 24px', background: '#f0f0f0',
                  border: '1px solid #ddd', borderRadius: '8px',
                  fontSize: '13px', fontWeight: '600',
                  cursor: 'pointer', color: '#666'
                }}
              >
                Submit Now ({answeredCount}/{questions.length} answered)
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── RESULTS SCREEN ────────────────────────────────────────────────────────
  if (step === 'results') {

    // Loading state while waiting for result
    if (!result) {
      return (
        <div style={{
          minHeight: '100vh', background: '#f5f7fa',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>⏳</div>
            <h2 style={{ color: '#333', marginBottom: '8px' }}>Calculating Results...</h2>
            <p style={{ color: '#888' }}>Please wait while we grade your answers</p>
          </div>
        </div>
      );
    }

    const scoreColor = result.score >= 80 ? '#00c853' : result.score >= 60 ? '#ff9800' : '#f44336';
    const scoreEmoji = result.score >= 80 ? '🏆' : result.score >= 60 ? '👍' : result.score >= 40 ? '📚' : '💪';

    return (
      <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '40px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          {/* Error Banner */}
          {result.error && (
            <div style={{
              background: '#fff3cd', border: '1px solid #ffc107',
              borderRadius: '10px', padding: '16px', marginBottom: '20px',
              color: '#856404', fontSize: '14px'
            }}>
              ⚠️ <strong>Note:</strong> {result.error}
            </div>
          )}

          {/* Main Score Card */}
          <div style={{
            background: 'white', borderRadius: '20px', padding: '40px',
            textAlign: 'center', marginBottom: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderTop: `6px solid ${scoreColor}`
          }}>
            <div style={{ fontSize: '64px', marginBottom: '12px' }}>{scoreEmoji}</div>

            <h1 style={{ fontSize: '64px', fontWeight: '900', margin: '0 0 8px 0', color: scoreColor }}>
              {result.score}%
            </h1>

            <p style={{ fontSize: '22px', fontWeight: '700', color: scoreColor, margin: '0 0 8px 0' }}>
              {result.grade}
            </p>

            <p style={{ color: '#888', fontSize: '15px', margin: '0 0 28px 0' }}>
              {selectedTest?.test_name || 'Aptitude Test'}
            </p>

            {/* Stats */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px', marginBottom: '28px'
            }}>
              <div style={{ background: '#eaffea', padding: '20px', borderRadius: '12px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '32px', fontWeight: '800', color: '#00c853' }}>
                  {result.correct_answers}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#666', fontWeight: '600' }}>CORRECT</p>
              </div>
              <div style={{ background: '#fff0f0', padding: '20px', borderRadius: '12px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '32px', fontWeight: '800', color: '#f44336' }}>
                  {result.total_questions - result.correct_answers}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#666', fontWeight: '600' }}>WRONG</p>
              </div>
              <div style={{ background: '#f0f4ff', padding: '20px', borderRadius: '12px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '32px', fontWeight: '800', color: '#667eea' }}>
                  {result.total_questions}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#666', fontWeight: '600' }}>TOTAL</p>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  setStep('select');
                  setResult(null);
                  setSelectedTest(null);
                  setAnswers({});
                }}
                style={{
                  padding: '12px 28px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white', border: 'none', borderRadius: '10px',
                  fontSize: '15px', fontWeight: '700', cursor: 'pointer'
                }}
              >
                🔄 Try Another Test
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: '12px 28px', background: '#f0f0f0',
                  border: 'none', borderRadius: '10px', color: '#333',
                  fontSize: '15px', fontWeight: '700', cursor: 'pointer'
                }}
              >
                📊 Dashboard
              </button>
            </div>
          </div>

          {/* Detailed Review */}
          {result.detailed_results && result.detailed_results.length > 0 && (
            <div style={{
              background: 'white', borderRadius: '16px', padding: '28px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}>
              <h2 style={{
                fontSize: '20px', fontWeight: '700',
                margin: '0 0 20px 0', color: '#333'
              }}>
                📋 Question Review
              </h2>

              {result.detailed_results.map((item, idx) => (
                <div key={idx} style={{
                  padding: '20px',
                  background: item.is_correct ? '#f0fff4' : '#fff5f5',
                  border: `1px solid ${item.is_correct ? '#c6f6d5' : '#fed7d7'}`,
                  borderLeft: `5px solid ${item.is_correct ? '#00c853' : '#f44336'}`,
                  borderRadius: '10px', marginBottom: '12px'
                }}>
                  {/* Question */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'start', marginBottom: '12px'
                  }}>
                    <p style={{
                      fontSize: '14px', fontWeight: '600', color: '#333',
                      margin: 0, flex: 1, lineHeight: '1.5', paddingRight: '12px'
                    }}>
                      Q{idx + 1}. {item.question_text}
                    </p>
                    <span style={{ fontSize: '22px', flexShrink: 0 }}>
                      {item.is_correct ? '✅' : '❌'}
                    </span>
                  </div>

                  {/* Answer comparison */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                      background: item.is_correct ? '#c6f6d5' : '#fed7d7',
                      padding: '10px 14px', borderRadius: '8px', fontSize: '13px'
                    }}>
                      <strong>Your Answer:</strong>{' '}
                      {item.user_answer
                        ? `${item.user_answer}. ${item.options?.[item.user_answer] || ''}`
                        : '⚠️ Not answered'}
                    </div>
                    <div style={{
                      background: '#c6f6d5', padding: '10px 14px',
                      borderRadius: '8px', fontSize: '13px', color: '#276749'
                    }}>
                      <strong>✅ Correct:</strong>{' '}
                      {item.correct_answer}. {item.options?.[item.correct_answer] || ''}
                    </div>
                  </div>

                  {/* Explanation */}
                  {item.explanation && (
                    <div style={{
                      background: '#ebf8ff', padding: '10px 14px',
                      borderRadius: '8px', fontSize: '13px', color: '#2b6cb0'
                    }}>
                      💡 <strong>Explanation:</strong> {item.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    );
  }

  return null;
}
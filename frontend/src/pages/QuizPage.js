// frontend/src/pages/QuizPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI } from '../api';
import { Clock, Check, ArrowLeft } from 'lucide-react';

export default function QuizPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('select'); // select, quiz, results
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes
  const [result, setResult] = useState(null);

  // Fetch available tests
  useEffect(() => {
    setLoading(true);
    quizAPI.getAvailableTests()
      .then(res => {
        setTests(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Timer countdown
  useEffect(() => {
    if (step !== 'quiz' || timer <= 0) return;
    
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [step, timer]);

  const startTest = (testId) => {
    setLoading(true);
    quizAPI.getAptitudeTest(testId)
      .then(res => {
        setSelectedTest(res.data);
        setQuestions(res.data.questions);
        setAnswers({});
        setCurrentQuestion(0);
        setTimer(600);
        setStep('quiz');
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleSubmit = async () => {
    setStep('results');
    
    try {
      const res = await quizAPI.submitAptitudeQuiz(answers);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // STEP 1: SELECT TEST
  if (step === 'select') {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '40px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ marginBottom: '30px' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '8px 16px',
                background: '#f0f0f0',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px'
              }}
            >
              <ArrowLeft size={18} /> Back
            </button>
          </div>

          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '12px',
            color: '#333'
          }}>
            Aptitude Tests
          </h1>
          <p style={{ color: '#666', marginBottom: '30px', fontSize: '14px' }}>
            Choose a test and complete it in 10 minutes. Each test has 10 questions.
          </p>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading tests...</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {tests.map(test => (
                <div key={test.test_id} style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #eee',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  hover: { boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }
                }}
                onClick={() => startTest(test.test_id)}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    margin: '0 0 12px 0',
                    color: '#667eea'
                  }}>
                    {test.test_name}
                  </h3>
                  
                  <div style={{
                    display: 'grid',
                    gap: '12px',
                    marginBottom: '16px',
                    fontSize: '13px',
                    color: '#666'
                  }}>
                    <div>📝 {test.total_questions} Questions</div>
                    <div>⏱️ {test.duration_minutes} Minutes</div>
                    <div>✨ Mixed Difficulty</div>
                  </div>

                  <button style={{
                    width: '100%',
                    padding: '10px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    Start Test →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // STEP 2: TAKE QUIZ
  if (step === 'quiz' && questions.length > 0) {
    const currentQ = questions[currentQuestion];

    return (
      <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '40px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            background: 'white',
            padding: '20px',
            borderRadius: '12px'
          }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: '#333' }}>
                {selectedTest?.test_name}
              </h2>
              <p style={{ color: '#666', margin: '4px 0 0 0', fontSize: '13px' }}>
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: timer < 120 ? '#ffebee' : '#f0f4ff',
              padding: '10px 16px',
              borderRadius: '8px',
              color: timer < 120 ? '#c00' : '#667eea',
              fontWeight: '700'
            }}>
              <Clock size={18} />
              {formatTime(timer)}
            </div>
          </div>

          {/* Question */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            marginBottom: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '24px'
            }}>
              {currentQ.text}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(currentQ.options).map(([key, option]) => (
                <label key={key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  border: `2px solid ${answers[currentQ.id] === key ? '#667eea' : '#eee'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: answers[currentQ.id] === key ? '#f0f4ff' : '#fafafa',
                  transition: 'all 0.2s'
                }}>
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value={key}
                    checked={answers[currentQ.id] === key}
                    onChange={() => handleAnswerChange(currentQ.id, key)}
                    style={{
                      width: '20px',
                      height: '20px',
                      marginRight: '12px',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ fontSize: '16px', color: '#333' }}>
                    <strong>{key}.</strong> {option}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              style={{
                padding: '12px 24px',
                background: currentQuestion === 0 ? '#eee' : 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                color: currentQuestion === 0 ? '#999' : '#333'
              }}
            >
              ← Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                style={{
                  padding: '12px 32px',
                  background: 'linear-gradient(135deg, #00c853 0%, #00a83f 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Check size={18} />
                Submit Test
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Next →
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div style={{
            height: '4px',
            background: '#eee',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              transition: 'width 0.3s'
            }} />
          </div>
        </div>
      </div>
    );
  }

  // STEP 3: RESULTS
  if (step === 'results' && result) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f5f7fa',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          width: '100%',
          background: 'white',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            margin: '0 0 12px 0',
            color: result.score > 70 ? '#00c853' : '#f44336'
          }}>
            {Math.round(result.score)}%
          </h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
            You got {result.correct_answers} out of {result.total_questions} correct!
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              background: '#f0f4ff',
              padding: '20px',
              borderRadius: '8px'
            }}>
              <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>Correct Answers</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#667eea', margin: '4px 0 0 0' }}>
                {result.correct_answers}
              </p>
            </div>
            <div style={{
              background: '#fff3f0',
              padding: '20px',
              borderRadius: '8px'
            }}>
              <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>Incorrect Answers</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#f44336', margin: '4px 0 0 0' }}>
                {result.total_questions - result.correct_answers}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => {
                setStep('select');
                setSelectedTest(null);
              }}
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
              Take Another Test
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '12px 32px',
                background: '#f0f0f0',
                color: '#333',
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
      </div>
    );
  }

  return null;
}
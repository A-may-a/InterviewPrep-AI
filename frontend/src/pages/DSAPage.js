// frontend/src/pages/DSAPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dsaAPI } from '../api';
import { Copy, Check, ChevronDown, ChevronUp, BookOpen, ArrowLeft } from 'lucide-react';

export default function DSAPage() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [copied, setCopied] = useState(false);
  const [expandedSolution, setExpandedSolution] = useState(false);
  const [practiceSuccess, setPracticeSuccess] = useState(false);
  const [practiceLoading, setPracticeLoading] = useState(false);
  const [practiceError, setPracticeError] = useState('');

  const topics = [
    'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs',
    'Dynamic Programming', 'Sorting', 'Searching',
    'Stack & Queue', 'Hashing', 'Backtracking',
    'Heap', 'Matrix', 'Bit Manipulation'
  ];

  const difficulties = ['easy', 'medium', 'hard'];

  // Fetch problems when filters change
  useEffect(() => {
    setLoading(true);
    dsaAPI.getProblems(topicFilter || null, difficultyFilter || null, 200)
      .then(res => {
        setProblems(res.data);
        if (res.data.length > 0 && !selectedProblem) {
          setSelectedProblem(res.data[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [topicFilter, difficultyFilter]);

  // Reset practice status when problem changes
  useEffect(() => {
    setPracticeSuccess(false);
    setPracticeError('');
    setExpandedSolution(false);
  }, [selectedProblem?.id]);

  const filteredProblems = problems.filter(p =>
    p.title.toLowerCase().includes(filter.toLowerCase()) ||
    p.topic.toLowerCase().includes(filter.toLowerCase())
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkPracticed = async () => {
    if (practiceLoading || practiceSuccess) return;
    setPracticeLoading(true);
    setPracticeError('');

    try {
      await dsaAPI.practiceProblem(selectedProblem.id);
      setPracticeSuccess(true);
      setTimeout(() => setPracticeSuccess(false), 3000);
    } catch (err) {
      console.error('Practice error:', err);
      const msg = err.response?.data?.detail
        || err.message
        || 'Failed to mark as practiced. Please make sure you are logged in.';
      setPracticeError(msg);
    } finally {
      setPracticeLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'easy') return '#00c853';
    if (difficulty === 'medium') return '#ff9800';
    return '#f44336';
  };

  const getDifficultyBg = (difficulty) => {
    if (difficulty === 'easy') return '#eaffea';
    if (difficulty === 'medium') return '#fff8e1';
    return '#fff0f0';
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#f5f7fa',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💻</div>
          <p style={{ color: '#666', fontSize: '16px' }}>Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>

      {/* Header */}
      <div style={{
        background: 'white', borderBottom: '1px solid #eee',
        padding: '16px 24px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '16px', flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: '#f0f0f0', border: 'none', borderRadius: '8px',
              padding: '8px 14px', cursor: 'pointer', fontSize: '14px',
              display: 'flex', alignItems: 'center', gap: '6px',
              fontWeight: '600', color: '#555'
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={24} color="#667eea" />
            <h1 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: '#333' }}>
              DSA Problem Bank
            </h1>
            <span style={{
              background: '#f0f4ff', color: '#667eea',
              padding: '3px 10px', borderRadius: '20px',
              fontSize: '13px', fontWeight: '600'
            }}>
              {filteredProblems.length} problems
            </span>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="🔍 Search problems..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: '8px 14px', border: '1px solid #ddd',
                borderRadius: '8px', fontSize: '14px',
                outline: 'none', width: '180px'
              }}
            />
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              style={{
                padding: '8px 12px', border: '1px solid #ddd',
                borderRadius: '8px', fontSize: '14px',
                background: '#fff', cursor: 'pointer'
              }}
            >
              <option value="">All Topics</option>
              {topics.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              style={{
                padding: '8px 12px', border: '1px solid #ddd',
                borderRadius: '8px', fontSize: '14px',
                background: '#fff', cursor: 'pointer'
              }}
            >
              <option value="">All Levels</option>
              {difficulties.map(d => (
                <option key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '0',
        height: 'calc(100vh - 70px)'
      }}>

        {/* Sidebar */}
        <div style={{
          background: 'white',
          borderRight: '1px solid #eee',
          overflowY: 'auto',
          padding: '16px'
        }}>
          {filteredProblems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
              <p style={{ fontSize: '14px' }}>No problems found</p>
            </div>
          ) : (
            filteredProblems.map((problem, idx) => (
              <div
                key={problem.id}
                onClick={() => setSelectedProblem(problem)}
                style={{
                  padding: '12px',
                  background: selectedProblem?.id === problem.id ? '#f0f4ff' : 'transparent',
                  border: `1px solid ${selectedProblem?.id === problem.id ? '#667eea' : 'transparent'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '4px',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'start', marginBottom: '4px'
                }}>
                  <p style={{
                    fontSize: '13px', fontWeight: '600', margin: 0,
                    color: selectedProblem?.id === problem.id ? '#667eea' : '#333',
                    lineHeight: '1.3', flex: 1, paddingRight: '8px'
                  }}>
                    {idx + 1}. {problem.title}
                  </p>
                  <span style={{
                    fontSize: '10px', fontWeight: '700',
                    padding: '2px 6px', borderRadius: '4px', flexShrink: 0,
                    background: getDifficultyBg(problem.difficulty),
                    color: getDifficultyColor(problem.difficulty),
                    textTransform: 'uppercase'
                  }}>
                    {problem.difficulty}
                  </span>
                </div>
                <span style={{
                  fontSize: '11px', color: '#888',
                  background: '#f0f0f0', padding: '2px 8px', borderRadius: '10px'
                }}>
                  {problem.topic}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Problem Detail Panel */}
        {selectedProblem ? (
          <div style={{ overflowY: 'auto', padding: '32px' }}>
            <div style={{
              maxWidth: '900px', margin: '0 auto',
              background: 'white', borderRadius: '16px',
              padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}>

              {/* Title Row */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'start', marginBottom: '20px'
              }}>
                <h1 style={{ fontSize: '26px', fontWeight: '800', margin: 0, color: '#333', flex: 1 }}>
                  {selectedProblem.title}
                </h1>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginLeft: '16px' }}>
                  <span style={{
                    background: '#f0f4ff', color: '#667eea',
                    padding: '6px 14px', borderRadius: '20px',
                    fontSize: '13px', fontWeight: '600'
                  }}>
                    {selectedProblem.topic}
                  </span>
                  <span style={{
                    background: getDifficultyBg(selectedProblem.difficulty),
                    color: getDifficultyColor(selectedProblem.difficulty),
                    padding: '6px 14px', borderRadius: '20px',
                    fontSize: '13px', fontWeight: '700',
                    textTransform: 'uppercase'
                  }}>
                    {selectedProblem.difficulty}
                  </span>
                </div>
              </div>

              {/* Problem Statement */}
              <div style={{
                background: '#f9f9f9', borderRadius: '10px',
                padding: '20px', marginBottom: '24px'
              }}>
                <h3 style={{
                  fontSize: '15px', fontWeight: '700',
                  color: '#333', margin: '0 0 10px 0'
                }}>
                  📝 Problem Statement
                </h3>
                <p style={{ color: '#555', lineHeight: '1.7', fontSize: '14px', margin: 0 }}>
                  {selectedProblem.problem_statement}
                </p>
              </div>

              {/* Description */}
              {selectedProblem.description && selectedProblem.description !== selectedProblem.problem_statement && (
                <div style={{
                  borderLeft: '4px solid #667eea',
                  paddingLeft: '16px', marginBottom: '24px'
                }}>
                  <p style={{ color: '#666', lineHeight: '1.6', fontSize: '14px', margin: 0 }}>
                    {selectedProblem.description}
                  </p>
                </div>
              )}

              {/* Examples */}
              {selectedProblem.examples && selectedProblem.examples.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#333', marginBottom: '12px' }}>
                    📋 Examples
                  </h3>
                  {selectedProblem.examples.map((ex, idx) => (
                    <div key={idx} style={{
                      background: '#1e1e1e', borderRadius: '8px',
                      padding: '16px', marginBottom: '10px',
                      fontFamily: 'monospace', fontSize: '13px'
                    }}>
                      <p style={{ color: '#9cdcfe', margin: '0 0 6px 0' }}>
                        <span style={{ color: '#569cd6' }}>Input:</span> {ex.input}
                      </p>
                      <p style={{ color: '#4ec9b0', margin: 0 }}>
                        <span style={{ color: '#569cd6' }}>Output:</span> {ex.output}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Constraints */}
              {selectedProblem.constraints && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#333', marginBottom: '10px' }}>
                    ⚠️ Constraints
                  </h3>
                  <div style={{
                    background: '#fff8e1', border: '1px solid #ffe082',
                    borderRadius: '8px', padding: '14px'
                  }}>
                    <pre style={{
                      margin: 0, fontSize: '13px',
                      color: '#795548', whiteSpace: 'pre-wrap',
                      fontFamily: 'monospace', lineHeight: '1.6'
                    }}>
                      {selectedProblem.constraints}
                    </pre>
                  </div>
                </div>
              )}

              {/* Complexity */}
              {(selectedProblem.time_complexity || selectedProblem.space_complexity) && (
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: '12px', marginBottom: '24px'
                }}>
                  {selectedProblem.time_complexity && (
                    <div style={{
                      background: '#f0f4ff', borderRadius: '10px',
                      padding: '16px', textAlign: 'center'
                    }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#888', fontWeight: '600' }}>
                        ⏱️ TIME COMPLEXITY
                      </p>
                      <p style={{
                        margin: 0, fontSize: '20px', fontWeight: '800',
                        color: '#667eea', fontFamily: 'monospace'
                      }}>
                        {selectedProblem.time_complexity}
                      </p>
                    </div>
                  )}
                  {selectedProblem.space_complexity && (
                    <div style={{
                      background: '#fff0f0', borderRadius: '10px',
                      padding: '16px', textAlign: 'center'
                    }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#888', fontWeight: '600' }}>
                        💾 SPACE COMPLEXITY
                      </p>
                      <p style={{
                        margin: 0, fontSize: '20px', fontWeight: '800',
                        color: '#f44336', fontFamily: 'monospace'
                      }}>
                        {selectedProblem.space_complexity}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Solution - Collapsible */}
              <div style={{
                border: '1px solid #eee', borderRadius: '12px',
                overflow: 'hidden', marginBottom: '24px'
              }}>
                <div
                  onClick={() => setExpandedSolution(!expandedSolution)}
                  style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', padding: '16px 20px',
                    background: expandedSolution ? '#1e1e1e' : '#f5f5f5',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  <span style={{
                    fontSize: '15px', fontWeight: '700',
                    color: expandedSolution ? '#fff' : '#333',
                    display: 'flex', alignItems: 'center', gap: '8px'
                  }}>
                    💡 View Solution
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {expandedSolution && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(selectedProblem.solution);
                        }}
                        style={{
                          padding: '6px 12px',
                          background: copied ? '#00c853' : '#667eea',
                          color: 'white', border: 'none',
                          borderRadius: '6px', fontSize: '12px',
                          fontWeight: '600', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '4px'
                        }}
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    )}
                    {expandedSolution
                      ? <ChevronUp size={20} color="#fff" />
                      : <ChevronDown size={20} color="#666" />
                    }
                  </div>
                </div>

                {expandedSolution && (
                  <>
                    <pre style={{
                      margin: 0, padding: '20px',
                      background: '#1e1e1e', color: '#d4d4d4',
                      fontSize: '13px', fontFamily: 'monospace',
                      overflow: 'auto', lineHeight: '1.6',
                      maxHeight: '400px'
                    }}>
                      {selectedProblem.solution}
                    </pre>

                    {selectedProblem.solution_explanation && (
                      <div style={{
                        padding: '16px 20px',
                        background: '#f0f4ff',
                        borderTop: '1px solid #eee'
                      }}>
                        <p style={{
                          margin: 0, fontSize: '13px',
                          color: '#3949ab', lineHeight: '1.6'
                        }}>
                          <strong>💬 Explanation:</strong> {selectedProblem.solution_explanation}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Mark as Practiced Button */}
              <div>
                {practiceSuccess && (
                  <div style={{
                    background: '#eaffea', border: '1px solid #c8e6c9',
                    borderRadius: '8px', padding: '12px 16px', marginBottom: '12px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    color: '#2e7d32', fontSize: '14px', fontWeight: '600'
                  }}>
                    ✅ Marked as practiced! Great work, keep it up!
                  </div>
                )}

                {practiceError && (
                  <div style={{
                    background: '#fff3f0', border: '1px solid #ffccbc',
                    borderRadius: '8px', padding: '12px 16px', marginBottom: '12px',
                    color: '#e64a19', fontSize: '14px'
                  }}>
                    ❌ {practiceError}
                  </div>
                )}

                <button
                  onClick={handleMarkPracticed}
                  disabled={practiceLoading || practiceSuccess}
                  style={{
                    width: '100%', padding: '14px',
                    background: practiceSuccess
                      ? '#00c853'
                      : practiceLoading
                      ? '#ccc'
                      : 'linear-gradient(135deg, #00c853 0%, #00a83f 100%)',
                    color: 'white', border: 'none',
                    borderRadius: '10px', fontSize: '16px', fontWeight: '700',
                    cursor: practiceLoading || practiceSuccess ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  {practiceLoading
                    ? '⏳ Saving...'
                    : practiceSuccess
                    ? '✅ Practiced!'
                    : '✅ Mark as Practiced'
                  }
                </button>
              </div>

            </div>
          </div>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#999'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>👈</div>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#666' }}>
                Select a problem to start
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
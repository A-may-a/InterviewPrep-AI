// frontend/src/pages/DSAPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dsaAPI } from '../api';
import { Copy, Check, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

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

  const topics = ['Arrays', 'Strings', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting', 'Searching'];
  const difficulties = ['easy', 'medium', 'hard'];

  useEffect(() => {
    dsaAPI.getProblems(topicFilter || null, difficultyFilter || null, 100)
      .then(res => {
        setProblems(res.data);
        if (res.data.length > 0) {
          setSelectedProblem(res.data[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [topicFilter, difficultyFilter]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading problems...</div>;
  }

  const filteredProblems = problems.filter(p =>
    p.title.toLowerCase().includes(filter.toLowerCase()) ||
    p.topic.toLowerCase().includes(filter.toLowerCase())
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'easy') return '#00c853';
    if (difficulty === 'medium') return '#ff9800';
    return '#f44336';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #eee',
        padding: '20px 40px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            margin: '0 0 20px 0',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <BookOpen size={32} style={{ color: '#667eea' }} />
            DSA Problem Bank
          </h1>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: '12px'
          }}>
            <input
              type="text"
              placeholder="Search problems..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />

            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                background: '#fff'
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
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                background: '#fff'
              }}
            >
              <option value="">All Levels</option>
              {difficulties.map(d => (
                <option key={d} value={d} style={{ textTransform: 'capitalize' }}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>

            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '10px 20px',
                background: '#f0f0f0',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '30px',
        padding: '40px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Sidebar - Problem List */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          height: 'fit-content',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '700',
            marginBottom: '16px',
            color: '#333'
          }}>
            Problems ({filteredProblems.length})
          </h3>

          {filteredProblems.length === 0 ? (
            <p style={{ color: '#999', fontSize: '14px' }}>No problems found</p>
          ) : (
            filteredProblems.map(problem => (
              <div
                key={problem.id}
                onClick={() => setSelectedProblem(problem)}
                style={{
                  padding: '12px',
                  background: selectedProblem?.id === problem.id ? '#f0f4ff' : '#fafafa',
                  border: `1px solid ${selectedProblem?.id === problem.id ? '#667eea' : '#eee'}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginBottom: '8px',
                  transition: 'all 0.2s'
                }}
              >
                <p style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  margin: 0,
                  color: selectedProblem?.id === problem.id ? '#667eea' : '#333',
                  marginBottom: '4px'
                }}>
                  {problem.title}
                </p>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  fontSize: '11px'
                }}>
                  <span style={{
                    background: '#f0f0f0',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    color: '#666'
                  }}>
                    {problem.topic}
                  </span>
                  <span style={{
                    background: '#f0f0f0',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    color: getDifficultyColor(problem.difficulty)
                  }}>
                    {problem.difficulty}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Main Content - Problem Details */}
        {selectedProblem ? (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            {/* Title & Badges */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '12px'
              }}>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  margin: 0,
                  color: '#333'
                }}>
                  {selectedProblem.title}
                </h1>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{
                    background: '#f0f4ff',
                    color: '#667eea',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {selectedProblem.topic}
                  </span>
                  <span style={{
                    background: getDifficultyColor(selectedProblem.difficulty) + '20',
                    color: getDifficultyColor(selectedProblem.difficulty),
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {selectedProblem.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{
              borderTop: '1px solid #eee',
              paddingTop: '24px',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '12px',
                color: '#333'
              }}>
                📝 Problem Statement
              </h3>
              <p style={{
                color: '#555',
                lineHeight: '1.6',
                fontSize: '14px'
              }}>
                {selectedProblem.problem_statement}
              </p>
            </div>

            {/* Description */}
            {selectedProblem.description && (
              <div style={{
                background: '#f9f9f9',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                <p style={{
                  color: '#666',
                  lineHeight: '1.6',
                  fontSize: '14px',
                  margin: 0
                }}>
                  {selectedProblem.description}
                </p>
              </div>
            )}

            {/* Examples */}
            {selectedProblem.examples && selectedProblem.examples.length > 0 && (
              <div style={{
                borderTop: '1px solid #eee',
                paddingTop: '24px',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: '#333'
                }}>
                  📋 Examples
                </h3>
                {selectedProblem.examples.map((ex, idx) => (
                  <div key={idx} style={{
                    background: '#f9f9f9',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '12px',
                    fontSize: '13px',
                    fontFamily: 'monospace'
                  }}>
                    <p style={{ margin: 0, fontWeight: '600', color: '#333' }}>Example {idx + 1}:</p>
                    <p style={{ margin: '4px 0', color: '#666' }}>Input: {ex.input}</p>
                    <p style={{ margin: '4px 0', color: '#00c853' }}>Output: {ex.output}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Constraints */}
            {selectedProblem.constraints && (
              <div style={{
                borderTop: '1px solid #eee',
                paddingTop: '24px',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: '#333'
                }}>
                  ⚠️ Constraints
                </h3>
                <pre style={{
                  background: '#f9f9f9',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#666',
                  whiteSpace: 'pre-wrap',
                  margin: 0
                }}>
                  {selectedProblem.constraints}
                </pre>
              </div>
            )}

            {/* Solution */}
            <div style={{
              borderTop: '1px solid #eee',
              paddingTop: '24px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  margin: 0,
                  color: '#333',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onClick={() => setExpandedSolution(!expandedSolution)}>
                  💡 Solution
                  {expandedSolution ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </h3>
                <button
                  onClick={() => copyToClipboard(selectedProblem.solution)}
                  style={{
                    padding: '6px 12px',
                    background: copied ? '#00c853' : '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              {expandedSolution && (
                <>
                  <pre style={{
                    background: '#1e1e1e',
                    color: '#d4d4d4',
                    padding: '16px',
                    borderRadius: '6px',
                    overflow: 'auto',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    marginBottom: '16px'
                  }}>
                    {selectedProblem.solution}
                  </pre>

                  {selectedProblem.solution_explanation && (
                    <div style={{
                      background: '#f0f4ff',
                      padding: '16px',
                      borderRadius: '6px',
                      marginBottom: '16px'
                    }}>
                      <p style={{
                        color: '#333',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        margin: 0
                      }}>
                        <strong>Explanation:</strong> {selectedProblem.solution_explanation}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Complexity */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginTop: '24px',
              paddingTop: '24px',
              borderTop: '1px solid #eee'
            }}>
              <div style={{
                background: '#f9f9f9',
                padding: '16px',
                borderRadius: '8px'
              }}>
                <p style={{
                  fontSize: '12px',
                  color: '#666',
                  margin: 0,
                  fontWeight: '600'
                }}>
                  ⏱️ Time Complexity
                </p>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  margin: '4px 0 0 0',
                  color: '#667eea',
                  fontFamily: 'monospace'
                }}>
                  {selectedProblem.time_complexity}
                </p>
              </div>
              <div style={{
                background: '#f9f9f9',
                padding: '16px',
                borderRadius: '8px'
              }}>
                <p style={{
                  fontSize: '12px',
                  color: '#666',
                  margin: 0,
                  fontWeight: '600'
                }}>
                  💾 Space Complexity
                </p>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  margin: '4px 0 0 0',
                  color: '#f44336',
                  fontFamily: 'monospace'
                }}>
                  {selectedProblem.space_complexity}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => dsaAPI.practiceProblem(selectedProblem.id).then(() => alert('Problem marked as practiced!'))}
              style={{
                width: '100%',
                marginTop: '24px',
                padding: '12px',
                background: 'linear-gradient(135deg, #00c853 0%, #00a83f 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              ✅ Mark as Practiced
            </button>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            color: '#999'
          }}>
            Select a problem to view details
          </div>
        )}
      </div>
    </div>
  );
}
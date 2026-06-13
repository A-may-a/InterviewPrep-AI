// frontend/src/pages/DSAPage.js
import React, { useState, useEffect } from 'react';
import { dsaAPI } from '../api';
import { ChevronRight, Copy, Check } from 'lucide-react';

export default function DSAPage() {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    dsaAPI.getProblems(null, null, 20)
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
  }, []);

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

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '40px 20px' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '30px'
      }}>
        {/* Sidebar */}
        <div>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '700',
              marginBottom: '16px',
              color: '#333'
            }}>Problems</h2>

            <input
              type="text"
              placeholder="Search..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />

            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {filteredProblems.map(problem => (
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
                    color: selectedProblem?.id === problem.id ? '#667eea' : '#333'
                  }}>
                    {problem.title}
                  </p>
                  <p style={{
                    fontSize: '11px',
                    color: '#999',
                    margin: '4px 0 0 0'
                  }}>
                    {problem.topic} • {problem.difficulty}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        {selectedProblem && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
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
                <div style={{
                  display: 'flex',
                  gap: '8px'
                }}>
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
                    background: selectedProblem.difficulty === 'easy' ? '#eaffea' : 
                             selectedProblem.difficulty === 'medium' ? '#fff3f0' : '#ffe0e0',
                    color: selectedProblem.difficulty === 'easy' ? '#00c853' :
                           selectedProblem.difficulty === 'medium' ? '#f44336' : '#d32f2f',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {selectedProblem.difficulty.toUpperCase()}
                  </span>
                </div>
              </div>
              <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
                {selectedProblem.topic} • Difficulty: {selectedProblem.difficulty}
              </p>
            </div>

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
              }}>Problem Statement</h3>
              <p style={{
                color: '#555',
                lineHeight: '1.6',
                fontSize: '14px'
              }}>
                {selectedProblem.problem_statement}
              </p>
            </div>

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
                }}>Examples</h3>
                {selectedProblem.examples.map((ex, idx) => (
                  <div key={idx} style={{
                    background: '#f9f9f9',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '8px',
                    fontSize: '13px',
                    fontFamily: 'monospace'
                  }}>
                    <p style={{ margin: 0, fontWeight: '600', color: '#333' }}>Input:</p>
                    <p style={{ margin: '4px 0 0 0', color: '#666' }}>{ex.input}</p>
                    <p style={{ margin: '8px 0 0 0', fontWeight: '600', color: '#333' }}>Output:</p>
                    <p style={{ margin: '4px 0 0 0', color: '#666' }}>{ex.output}</p>
                  </div>
                ))}
              </div>
            )}

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
                }}>Constraints</h3>
                <p style={{
                  color: '#555',
                  lineHeight: '1.6',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace'
                }}>
                  {selectedProblem.constraints}
                </p>
              </div>
            )}

            <div style={{
              borderTop: '1px solid #eee',
              paddingTop: '24px',
              marginBottom: '24px'
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
                  color: '#333'
                }}>Solution</h3>
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
              <pre style={{
                background: '#1e1e1e',
                color: '#d4d4d4',
                padding: '16px',
                borderRadius: '6px',
                overflow: 'auto',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}>
                {selectedProblem.solution}
              </pre>
            </div>

            {selectedProblem.time_complexity && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                borderTop: '1px solid #eee',
                paddingTop: '24px'
              }}>
                <div>
                  <p style={{
                    fontSize: '12px',
                    color: '#666',
                    margin: 0,
                    fontWeight: '600'
                  }}>Time Complexity</p>
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
                <div>
                  <p style={{
                    fontSize: '12px',
                    color: '#666',
                    margin: 0,
                    fontWeight: '600'
                  }}>Space Complexity</p>
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}

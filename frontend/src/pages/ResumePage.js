// frontend/src/pages/ResumePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI } from '../api';
import { Upload, Download, AlertCircle, CheckCircle, Loader, ArrowLeft } from 'lucide-react';

export default function ResumePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('upload');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [latestResume, setLatestResume] = useState(null);

  useEffect(() => {
    resumeAPI.getLatestResume()
      .then(res => setLatestResume(res.data))
      .catch(() => console.log('No resume uploaded yet'));
  }, []);

  const handleDragEnter = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDragOver  = (e) => { e.preventDefault(); };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) setFile(e.dataTransfer.files[0]);
  };

  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) { setError('Please select a file'); return; }

    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowed.includes(file.type)) {
      setError('Only PDF and DOC/DOCX files are supported');
      return;
    }

    setLoading(true);
    setError('');
    setStep('analyzing');

    try {
      const res = await resumeAPI.upload(file);
      setAnalysis(res.data.analysis);
      setLatestResume(res.data.resume);
      setStep('results');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze resume');
      setStep('upload');
    } finally {
      setLoading(false);
    }
  };

  // ─── STEP 1: UPLOAD ───────────────────────────────────────────────────────
  if (step === 'upload') {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '40px 20px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>

          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '8px 16px', background: '#f0f0f0', border: 'none',
              borderRadius: '6px', cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: '8px', fontSize: '14px', marginBottom: '30px'
            }}
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </button>

          <div style={{
            background: 'white', borderRadius: '12px', padding: '40px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px', color: '#333' }}>
              📄 Upload Your Resume
            </h1>
            <p style={{ color: '#666', marginBottom: '30px', fontSize: '14px' }}>
              Get AI-powered feedback on your resume. We analyze strengths,
              weaknesses, and provide improvement suggestions.
            </p>

            {/* Error */}
            {error && (
              <div style={{
                background: '#fee', border: '1px solid #fcc', color: '#c00',
                padding: '12px', borderRadius: '8px', marginBottom: '20px',
                display: 'flex', gap: '10px', fontSize: '14px'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            {/* Drag & Drop */}
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${isDragging ? '#667eea' : '#ddd'}`,
                borderRadius: '12px', padding: '40px 20px', textAlign: 'center',
                background: isDragging ? '#f0f4ff' : '#fafafa',
                transition: 'all 0.2s', marginBottom: '20px', cursor: 'pointer'
              }}
            >
              <Upload size={48} style={{ color: '#667eea', margin: '0 auto 12px', display: 'block' }} />
              <p style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 6px 0', color: '#333' }}>
                {isDragging ? 'Drop your resume here' : 'Drag your resume here'}
              </p>
              <p style={{ fontSize: '14px', color: '#666', margin: '0 0 16px 0' }}>or</p>
              <label style={{
                display: 'inline-block', padding: '10px 20px', background: '#667eea',
                color: 'white', borderRadius: '6px', cursor: 'pointer',
                fontWeight: '600', fontSize: '14px'
              }}>
                Choose File
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx"
                  style={{ display: 'none' }}
                />
              </label>
              <p style={{ fontSize: '12px', color: '#999', margin: '16px 0 0 0' }}>
                Supported: PDF, DOC, DOCX (Max 5MB)
              </p>
            </div>

            {/* Selected File */}
            {file && (
              <div style={{
                background: '#eaffea', border: '1px solid #c8e6c9', borderRadius: '8px',
                padding: '12px', marginBottom: '20px', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center', fontSize: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00c853' }}>
                  <CheckCircle size={18} />
                  {file.name}
                </div>
                <button
                  onClick={() => setFile(null)}
                  style={{
                    background: 'transparent', border: 'none', color: '#00c853',
                    cursor: 'pointer', fontSize: '14px', fontWeight: '600'
                  }}
                >
                  Change
                </button>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              style={{
                width: '100%', padding: '12px',
                background: file && !loading
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : '#ccc',
                color: 'white', border: 'none', borderRadius: '8px',
                fontSize: '16px', fontWeight: '600',
                cursor: file && !loading ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              {loading ? (
                <>
                  <Loader size={18} />
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload & Analyze
                </>
              )}
            </button>

            {/* Previous Resume */}
            {latestResume && (
              <div style={{ marginTop: '30px', paddingTop: '30px', borderTop: '1px solid #eee' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: '#333' }}>
                  📋 Previous Upload
                </h3>
                <div style={{
                  background: '#f9f9f9', padding: '16px', borderRadius: '8px',
                  fontSize: '14px', color: '#666'
                }}>
                  <p style={{ margin: '0 0 4px 0' }}>
                    <strong>{latestResume.file_name}</strong>
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                    Uploaded: {new Date(latestResume.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP 2: ANALYZING ────────────────────────────────────────────────────
  if (step === 'analyzing') {
    return (
      <div style={{
        minHeight: '100vh', background: '#f5f7fa',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
      }}>
        <div style={{
          textAlign: 'center', background: 'white', borderRadius: '12px',
          padding: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <Loader size={48} style={{ color: '#667eea', margin: '0 auto 20px', display: 'block' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#333', marginBottom: '8px' }}>
            Analyzing Your Resume
          </h2>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Our AI is reviewing your resume and providing personalized feedback...
          </p>
        </div>
      </div>
    );
  }

  // ─── STEP 3: RESULTS ──────────────────────────────────────────────────────
  if (step === 'results' && analysis) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '40px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          <button
            onClick={() => setStep('upload')}
            style={{
              padding: '8px 16px', background: '#f0f0f0', border: 'none',
              borderRadius: '6px', cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: '8px', fontSize: '14px', marginBottom: '30px'
            }}
          >
            <ArrowLeft size={18} /> Upload Another Resume
          </button>

          <div style={{
            background: 'white', borderRadius: '12px',
            padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px', color: '#333' }}>
              📊 Resume Analysis Results
            </h1>

            {/* Overall Rating */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white', padding: '24px', borderRadius: '12px',
              marginBottom: '24px', textAlign: 'center'
            }}>
              <p style={{ fontSize: '12px', margin: 0, opacity: 0.9 }}>Overall Rating</p>
              <p style={{ fontSize: '48px', fontWeight: '700', margin: '8px 0 0 0' }}>
                {Math.round(analysis.overall_rating * 2) / 2}/5 ⭐
              </p>
            </div>

            {/* Strengths */}
            {analysis.strengths && analysis.strengths.length > 0 && (
              <div style={{
                background: '#eaffea', border: '1px solid #c8e6c9',
                borderRadius: '12px', padding: '20px', marginBottom: '20px'
              }}>
                <h3 style={{
                  fontSize: '16px', fontWeight: '700', margin: '0 0 12px 0',
                  color: '#00c853', display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  ✅ Strengths
                </h3>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#2e7d32' }}>
                  {analysis.strengths.map((s, i) => (
                    <li key={i} style={{ marginBottom: '8px', fontSize: '14px' }}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses */}
            {analysis.weaknesses && analysis.weaknesses.length > 0 && (
              <div style={{
                background: '#fff3f0', border: '1px solid #ffcccc',
                borderRadius: '12px', padding: '20px', marginBottom: '20px'
              }}>
                <h3 style={{
                  fontSize: '16px', fontWeight: '700', margin: '0 0 12px 0',
                  color: '#f44336', display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  ⚠️ Areas to Improve
                </h3>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#c62828' }}>
                  {analysis.weaknesses.map((w, i) => (
                    <li key={i} style={{ marginBottom: '8px', fontSize: '14px' }}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {analysis.improvements && analysis.improvements.length > 0 && (
              <div style={{
                background: '#e3f2fd', border: '1px solid #bbdefb',
                borderRadius: '12px', padding: '20px', marginBottom: '20px'
              }}>
                <h3 style={{
                  fontSize: '16px', fontWeight: '700', margin: '0 0 12px 0',
                  color: '#1565c0', display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  💡 Suggestions
                </h3>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#0d47a1' }}>
                  {analysis.improvements.map((imp, i) => (
                    <li key={i} style={{ marginBottom: '8px', fontSize: '14px' }}>{imp}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technical Skills */}
            {analysis.technical_skills && analysis.technical_skills.length > 0 && (
              <div style={{
                background: '#f3e5f5', border: '1px solid #e1bee7',
                borderRadius: '12px', padding: '20px', marginBottom: '20px'
              }}>
                <h3 style={{
                  fontSize: '16px', fontWeight: '700', margin: '0 0 12px 0', color: '#6a1b9a'
                }}>
                  🛠️ Identified Technical Skills
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {analysis.technical_skills.map((skill, i) => (
                    <span key={i} style={{
                      background: '#ce93d8', color: 'white', padding: '6px 12px',
                      borderRadius: '20px', fontSize: '13px', fontWeight: '600'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations && (
              <div style={{
                background: '#fff8e1', border: '1px solid #ffe082',
                borderRadius: '12px', padding: '20px'
              }}>
                <h3 style={{
                  fontSize: '16px', fontWeight: '700', margin: '0 0 12px 0', color: '#f57c00'
                }}>
                  📝 Summary
                </h3>
                <p style={{ color: '#e65100', lineHeight: '1.6', margin: 0, fontSize: '14px' }}>
                  {analysis.recommendations}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  flex: 1, padding: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white', border: 'none', borderRadius: '8px',
                  fontWeight: '600', cursor: 'pointer'
                }}
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => window.print()}
                style={{
                  flex: 1, padding: '12px', background: '#f0f0f0', color: '#333',
                  border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                <Download size={18} /> Save Report
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return null;
}
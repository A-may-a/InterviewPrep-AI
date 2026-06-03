// frontend/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BookOpen, BarChart3, MessageSquare, LogOut } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    dashboardAPI.getStats()
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading || !stats) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  }

  const statsCards = [
    {
      icon: BookOpen,
      label: 'Quizzes Completed',
      value: stats.total_quizzes,
      color: '#667eea'
    },
    {
      icon: BarChart3,
      label: 'Avg Quiz Score',
      value: `${Math.round(stats.average_quiz_score)}%`,
      color: '#764ba2'
    },
    {
      icon: BookOpen,
      label: 'DSA Problems',
      value: stats.total_dsa_practiced,
      color: '#f093fb'
    },
    {
      icon: MessageSquare,
      label: 'Mock Interviews',
      value: stats.mock_interviews_count,
      color: '#4facfe'
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #eee',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0, color: '#333' }}>
            Welcome, {user?.name}! 🚀
          </h1>
          <p style={{ color: '#666', margin: '4px 0 0 0', fontSize: '14px' }}>
            Track your interview prep progress
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '6px',
            color: '#c00',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div style={{ padding: '40px' }}>
        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {statsCards.map((card, idx) => (
            <div key={idx} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              border: `2px solid ${card.color}22`,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: `${card.color}22`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <card.icon size={20} color={card.color} />
                </div>
                <p style={{
                  color: '#666',
                  fontSize: '12px',
                  margin: 0,
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }}>
                  {card.label}
                </p>
              </div>
              <h3 style={{
                fontSize: '32px',
                fontWeight: '700',
                margin: 0,
                color: card.color
              }}>
                {card.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Quick Action Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <button
            onClick={() => navigate('/quiz')}
            style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
          >
            📝 Take Aptitude Quiz
          </button>
          <button
            onClick={() => navigate('/dsa')}
            style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            💻 Practice DSA
          </button>
          <button
            onClick={() => navigate('/resume')}
            style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📄 Upload Resume
          </button>
          <button
            onClick={() => navigate('/interview')}
            style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: '#333',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🎤 Mock Interview
          </button>
        </div>

        {/* Topics Progress */}
        {stats.topics_covered && stats.topics_covered.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '40px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#333' }}>
              Topics Covered
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              {stats.topics_covered.map((topic, idx) => (
                <div key={idx} style={{
                  background: '#f9f9f9',
                  borderRadius: '8px',
                  padding: '16px',
                  borderLeft: '4px solid #667eea'
                }}>
                  <p style={{ margin: 0, fontWeight: '600', color: '#333' }}>{topic.topic}</p>
                  <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '12px' }}>
                    {topic.questions_practiced} questions • {Math.round(topic.average_score)}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

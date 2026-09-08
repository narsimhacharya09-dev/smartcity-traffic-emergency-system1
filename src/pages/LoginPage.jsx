import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Cloud, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import CloudCanvas from '../components/CloudCanvas';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="auth-page">
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="auth-split-wrapper">
          {/* Left Visual Branding Panel */}
          <div className="auth-split-visual">
            <CloudCanvas particleCount={30} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div className="brand-icon-wrapper" style={{ width: '48px', height: '48px', marginBottom: '1.5rem' }}>
                <Cloud size={24} />
              </div>
              <h2 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                Think. Build. Innovate.
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Access student dashboard, workshop resources, hackathon badges, and project repositories.
              </p>
            </div>
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan-bright)', fontSize: '0.875rem', fontWeight: 600 }}>
              <Sparkles size={16} /> Anurag University • Hyderabad
            </div>
          </div>

          {/* Right Login Form */}
          <div className="auth-split-content">
            <div className="form-header">
              <h1 className="form-title">Welcome Back</h1>
              <p className="form-subtitle">Enter your credentials to access your ThinkCloud account</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label"><Mail size={14} /> University Email</label>
                <div className="input-wrapper">
                  <Mail size={16} className="input-icon" />
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="student@anurag.edu.in" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}><Lock size={14} /> Password</label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Reset link sent to your registered university email.'); }} className="form-link" style={{ fontSize: '0.8rem' }}>
                    Forgot Password?
                  </a>
                </div>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1.5rem' }}>
                Login <ArrowRight size={18} />
              </button>
            </form>

            <p className="form-footer-text">
              Don't have an account? <Link to="/register" className="form-link">Register</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal Notification */}
      {submitted && (
        <div className="toast-overlay" onClick={() => navigate('/')}>
          <div className="toast-card" onClick={(e) => e.stopPropagation()}>
            <div className="toast-icon">
              <CheckCircle size={38} />
            </div>
            <h3 className="toast-title">Login Successful! ☁️</h3>
            <p className="toast-msg">
              Welcome back to <strong>ThinkCloud Club</strong>! You have logged in as <strong>{email}</strong>.
            </p>
            <button onClick={() => navigate('/')} className="btn btn-primary btn-block">
              Go to Home Page <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Hash, BookOpen, Calendar, Lock, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    studentId: '',
    branch: 'CSE',
    year: '2nd Year',
    section: 'A',
    password: '',
    confirmPassword: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your password.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="auth-page">
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="glass-card form-container" style={{ padding: '3rem 2.5rem' }}>
          <div className="form-header" style={{ textAlign: 'center' }}>
            <div className="brand-icon-wrapper" style={{ width: '48px', height: '48px', margin: '0 auto 1rem auto' }}>
              <Sparkles size={24} />
            </div>
            <h1 className="form-title">Join ThinkCloud</h1>
            <p className="form-subtitle">Create your student membership account at Anurag University</p>
          </div>

          {errorMsg && (
            <div style={{
              padding: '0.85rem 1rem',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 'var(--radius-md)',
              color: '#f87171',
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid-2">
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label"><User size={14} /> Full Name</label>
                <div className="input-wrapper">
                  <User size={16} className="input-icon" />
                  <input 
                    type="text" 
                    name="fullName"
                    className="form-input" 
                    placeholder="John Doe" 
                    value={formData.fullName}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

              {/* University Email */}
              <div className="form-group">
                <label className="form-label"><Mail size={14} /> University Email</label>
                <div className="input-wrapper">
                  <Mail size={16} className="input-icon" />
                  <input 
                    type="email" 
                    name="email"
                    className="form-input" 
                    placeholder="student@anurag.edu.in" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="form-grid-2">
              {/* Phone Number */}
              <div className="form-group">
                <label className="form-label"><Phone size={14} /> Phone Number</label>
                <div className="input-wrapper">
                  <Phone size={16} className="input-icon" />
                  <input 
                    type="tel" 
                    name="phone"
                    className="form-input" 
                    placeholder="+91 98765 43210" 
                    value={formData.phone}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

              {/* Student ID */}
              <div className="form-group">
                <label className="form-label"><Hash size={14} /> Student ID / Roll No</label>
                <div className="input-wrapper">
                  <Hash size={16} className="input-icon" />
                  <input 
                    type="text" 
                    name="studentId"
                    className="form-input" 
                    placeholder="e.g. 22H61A0501" 
                    value={formData.studentId}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="form-grid-2">
              {/* Branch */}
              <div className="form-group">
                <label className="form-label"><BookOpen size={14} /> Branch</label>
                <select name="branch" className="form-select input-no-icon" value={formData.branch} onChange={handleChange}>
                  <option value="CSE">CSE (Computer Science & Eng.)</option>
                  <option value="AI & DS">AI & Data Science</option>
                  <option value="IT">Information Technology</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="Mechanical">Mechanical Eng.</option>
                  <option value="Civil">Civil Eng.</option>
                </select>
              </div>

              {/* Year & Section */}
              <div className="form-grid-2" style={{ marginBottom: 0 }}>
                <div className="form-group">
                  <label className="form-label"><Calendar size={14} /> Year</label>
                  <select name="year" className="form-select input-no-icon" value={formData.year} onChange={handleChange}>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Section</label>
                  <select name="section" className="form-select input-no-icon" value={formData.section} onChange={handleChange}>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                    <option value="E">Section E</option>
                    <option value="F">Section F</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-grid-2">
              {/* Password */}
              <div className="form-group">
                <label className="form-label"><Lock size={14} /> Password</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input 
                    type="password" 
                    name="password"
                    className="form-input" 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label className="form-label"><Lock size={14} /> Confirm Password</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input 
                    type="password" 
                    name="confirmPassword"
                    className="form-input" 
                    placeholder="••••••••" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1rem' }}>
              Create Account <ArrowRight size={18} />
            </button>
          </form>

          <p className="form-footer-text">
            Already have an account? <Link to="/login" className="form-link">Login</Link>
          </p>
        </div>
      </div>

      {/* Success Modal Notification */}
      {submitted && (
        <div className="toast-overlay" onClick={() => navigate('/login')}>
          <div className="toast-card" onClick={(e) => e.stopPropagation()}>
            <div className="toast-icon">
              <CheckCircle size={38} />
            </div>
            <h3 className="toast-title">Account Created! 🚀</h3>
            <p className="toast-msg">
              Welcome to <strong>ThinkCloud Club</strong>! Your registration is complete. You can now log into your member portal.
            </p>
            <button onClick={() => navigate('/login')} className="btn btn-primary btn-block">
              Proceed to Login <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

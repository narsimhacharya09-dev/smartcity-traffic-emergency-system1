import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle, ArrowRight } from 'lucide-react';

export default function EventModal({ event, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');

  if (!event) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="toast-overlay" onClick={onClose}>
      <div className="toast-card" style={{ maxWidth: '520px', textAlign: 'left' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <span className="event-category-tag" style={{ position: 'static' }}>{event.category || 'Featured Event'}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {!submitted ? (
          <>
            <h3 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.75rem' }}>{event.title}</h3>
            <div className="event-meta" style={{ marginBottom: '1.25rem' }}>
              <span className="meta-item"><Calendar size={15} /> {event.date}</span>
              <span className="meta-item"><Clock size={15} /> {event.time}</span>
              <span className="meta-item"><MapPin size={15} /> {event.venue}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1.5rem' }}>
              {event.description}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input input-no-icon" 
                  placeholder="Enter your name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">University Email</label>
                <input 
                  type="email" 
                  className="form-input input-no-icon" 
                  placeholder="student@anurag.edu.in" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Student Roll No / ID</label>
                <input 
                  type="text" 
                  className="form-input input-no-icon" 
                  placeholder="e.g., 22H61A0501" 
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required 
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Confirm Registration <ArrowRight size={16} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div className="toast-icon">
              <CheckCircle size={36} />
            </div>
            <h3 className="toast-title">Registration Confirmed! 🎉</h3>
            <p className="toast-msg">
              You are successfully registered for <strong>{event.title}</strong>. A confirmation email has been sent to <strong>{email}</strong>.
            </p>
            <button onClick={onClose} className="btn btn-secondary btn-block">
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

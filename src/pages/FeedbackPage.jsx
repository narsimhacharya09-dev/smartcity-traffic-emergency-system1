import React, { useState } from 'react';
import { User, Mail, Star, MessageSquare, CheckCircle, Sparkles, Send } from 'lucide-react';

export default function FeedbackPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('Cloud Computing Workshop');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
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
            <h1 className="form-title">We Value Your Feedback</h1>
            <p className="form-subtitle">Help us improve ThinkCloud workshops, hackathons, and activities at Anurag University</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid-2">
              {/* Name */}
              <div className="form-group">
                <label className="form-label"><User size={14} /> Full Name</label>
                <div className="input-wrapper">
                  <User size={16} className="input-icon" />
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="John Doe" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label"><Mail size={14} /> Email Address</label>
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
            </div>

            {/* Select Event/Activity */}
            <div className="form-group">
              <label className="form-label">Select Event / Activity</label>
              <select 
                className="form-select input-no-icon"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
              >
                <option value="ThinkCloud Induction 2026">ThinkCloud Induction 2026</option>
                <option value="Cloud Computing Workshop">Cloud Computing Workshop</option>
                <option value="AI & Cloud Hackathon">AI & Cloud Hackathon 2026</option>
                <option value="Build with Cloud">Build with Cloud Showcase</option>
                <option value="General Club Feedback">General Club Feedback</option>
              </select>
            </div>

            {/* Star Rating Widget */}
            <div className="form-group">
              <label className="form-label">Rate Your Experience</label>
              <div className="star-rating-box">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${(hoverRating || rating) >= star ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star size={32} fill={(hoverRating || rating) >= star ? '#fbbf24' : 'transparent'} />
                  </button>
                ))}
                <span style={{ marginLeft: '1rem', color: 'var(--accent-cyan-bright)', fontWeight: 700, fontSize: '1rem' }}>
                  {rating} / 5 Stars
                </span>
              </div>
            </div>

            {/* Feedback Message */}
            <div className="form-group">
              <label className="form-label"><MessageSquare size={14} /> Feedback Message</label>
              <textarea 
                className="form-textarea input-no-icon" 
                placeholder="Share your thoughts, what went well, or ideas for future sessions..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1rem' }}>
              Submit Feedback <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal Notification */}
      {submitted && (
        <div className="toast-overlay" onClick={() => setSubmitted(false)}>
          <div className="toast-card" onClick={(e) => e.stopPropagation()}>
            <div className="toast-icon">
              <CheckCircle size={38} />
            </div>
            <h3 className="toast-title">Thank you for your feedback! 🌟</h3>
            <p className="toast-msg">
              Your feedback for <strong>{selectedEvent}</strong> has been received! We appreciate your insights to make ThinkCloud even better.
            </p>
            <button 
              onClick={() => {
                setSubmitted(false);
                setName('');
                setEmail('');
                setMessage('');
              }} 
              className="btn btn-primary btn-block"
            >
              Submit Another Response
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

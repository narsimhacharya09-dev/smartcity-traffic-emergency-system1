import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Cloud, Instagram, Linkedin, Github, Youtube, ArrowUp } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/' + sectionId);
      setTimeout(() => {
        const el = document.getElementById(sectionId.replace('#', ''));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div className="brand-icon-wrapper" style={{ width: '38px', height: '38px' }}>
                <Cloud size={20} />
              </div>
              <div>
                <h3 className="footer-brand-title">ThinkCloud Club</h3>
              </div>
            </div>
            <p className="footer-university">Anurag University, Hyderabad</p>
            <p className="footer-description">
              Empowering students to explore cloud computing, emerging technologies, innovation, and real-world projects.
            </p>
            <div className="social-links">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="YouTube">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="footer-column-title">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li>
                <button onClick={() => handleNavClick('#about')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#vision')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  Our Vision
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#activities')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  Activities
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('#events')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  Events
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Portals */}
          <div>
            <h4 className="footer-column-title">Portal</h4>
            <ul className="footer-links">
              <li><Link to="/register" className="footer-link">Join ThinkCloud</Link></li>
              <li><Link to="/login" className="footer-link">Member Login</Link></li>
              <li><Link to="/feedback" className="footer-link">Give Feedback</Link></li>
              <li><a href="#stats" onClick={(e) => { e.preventDefault(); handleNavClick('#stats'); }} className="footer-link">Club Impact</a></li>
            </ul>
          </div>

          {/* Column 4: Motto & Campus */}
          <div>
            <h4 className="footer-column-title">Tagline</h4>
            <p style={{ color: 'var(--accent-cyan-bright)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', fontStyle: 'italic' }}>
              "Think. Build. Innovate. Cloud."
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Anurag University, Venkatapur, Ghatkesar, Medchal-Malkajgiri district, Hyderabad, Telangana 500088.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © 2026 ThinkCloud Club, Anurag University. All Rights Reserved.
          </div>
          <button 
            onClick={scrollToTop}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-glass)',
              color: 'var(--accent-cyan-bright)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Back to top <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}

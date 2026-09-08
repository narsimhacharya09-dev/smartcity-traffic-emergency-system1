import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Cloud, Menu, X, ArrowRight, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleNavClick = (sectionId) => {
    setMobileOpen(false);
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

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          {/* Left Side Branding */}
          <Link to="/" className="navbar-brand">
            <div className="brand-icon-wrapper">
              <Cloud size={24} />
            </div>
            <div className="brand-text">
              <span className="brand-title">
                ThinkCloud
              </span>
              <span className="brand-subtitle">Anurag University</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="nav-links">
            <li>
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <button 
                onClick={() => handleNavClick('#about')} 
                className="nav-link" 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                About
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavClick('#vision')} 
                className="nav-link" 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Vision
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavClick('#activities')} 
                className="nav-link" 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Activities
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavClick('#events')} 
                className="nav-link" 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Events
              </button>
            </li>
            <li>
              <Link to="/feedback" className={`nav-link ${isActive('/feedback') ? 'active' : ''}`}>
                Feedback
              </Link>
            </li>
            <li>
              <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className={`nav-link ${isActive('/register') ? 'active' : ''}`}>
                Register
              </Link>
            </li>
          </ul>

          {/* Right Action Button & Mobile Toggle */}
          <div className="navbar-actions">
            <Link to="/register" className="btn btn-primary btn-sm btn-nav">
              Join ThinkCloud <ArrowRight size={16} />
            </Link>
            <button 
              className="mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div className={`mobile-menu-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)}>
        <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-header">
            <div className="brand-text">
              <span className="brand-title">☁ ThinkCloud</span>
              <span className="brand-subtitle">Anurag University</span>
            </div>
            <button className="mobile-toggle" onClick={() => setMobileOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <ul className="mobile-nav-links">
            <li>
              <Link to="/" className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <button onClick={() => handleNavClick('#about')} className="mobile-nav-link" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}>
                About
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('#vision')} className="mobile-nav-link" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}>
                Vision
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('#activities')} className="mobile-nav-link" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}>
                Activities
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('#events')} className="mobile-nav-link" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}>
                Events
              </button>
            </li>
            <li>
              <Link to="/feedback" className={`mobile-nav-link ${isActive('/feedback') ? 'active' : ''}`}>
                Feedback
              </Link>
            </li>
            <li>
              <Link to="/login" className={`mobile-nav-link ${isActive('/login') ? 'active' : ''}`}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className={`mobile-nav-link ${isActive('/register') ? 'active' : ''}`}>
                Register
              </Link>
            </li>
          </ul>

          <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
            <Link to="/register" className="btn btn-primary btn-block">
              Join ThinkCloud <Sparkles size={16} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

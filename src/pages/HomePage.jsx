import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Cloud, Sparkles, ArrowRight, BookOpen, Hammer, Lightbulb, Users, 
  Target, Rocket, CheckCircle, Code, Cpu, Gamepad2, Brain, HelpCircle, 
  Wrench, Mic, Calendar, Clock, MapPin, Award, ChevronRight 
} from 'lucide-react';
import CloudCanvas from '../components/CloudCanvas';
import StatsSection from '../components/StatsSection';
import EventModal from '../components/EventModal';

const activitiesData = [
  { id: 1, title: '☁ Cloud Workshops', desc: 'Hands-on introduction to cloud computing and cloud platforms.', icon: Cloud, badge: 'Popular' },
  { id: 2, title: '💻 Technical Workshops', desc: 'Learn modern technologies through practical sessions.', icon: Code, badge: 'Hands-on' },
  { id: 3, title: '🚀 Hackathons', desc: 'Solve problems and build innovative solutions under time limits.', icon: Rocket, badge: 'Competitive' },
  { id: 4, title: '🎮 Game Development', desc: 'Explore Unity and interactive technology projects.', icon: Gamepad2, badge: 'Creative' },
  { id: 5, title: '🤖 AI & Emerging Tech', desc: 'Discover AI, automation, and next-gen emerging technologies.', icon: Brain, badge: 'Trending' },
  { id: 6, title: '🧠 Technical Quizzes', desc: 'Fun competitions to test technical knowledge and skills.', icon: HelpCircle, badge: 'Interactive' },
  { id: 7, title: '🔧 Hands-on Projects', desc: 'Build real-world projects as a collaborative team.', icon: Wrench, badge: 'Portfolio' },
  { id: 8, title: '🎤 Guest Sessions', desc: 'Interact with industry professionals and technical experts.', icon: Mic, badge: 'Networking' }
];

const eventsData = [
  {
    id: 'e1',
    title: 'ThinkCloud Induction 2026',
    date: 'August 28, 2026',
    time: '10:00 AM - 01:00 PM',
    venue: 'Auditorium 1, Anurag University',
    category: 'Induction',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    description: 'Welcome orientation for all incoming club members. Discover our roadmap, project teams, and yearly activities.'
  },
  {
    id: 'e2',
    title: 'Cloud Computing Workshop',
    date: 'September 12, 2026',
    time: '02:00 PM - 05:00 PM',
    venue: 'CSE Lab 4, Block B',
    category: 'Workshop',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    description: 'Master cloud architecture basics, virtual machines, serverless functions, and container deployments.'
  },
  {
    id: 'e3',
    title: 'AI & Cloud Hackathon 2026',
    date: 'October 05, 2026',
    time: '09:00 AM (24 Hours)',
    venue: 'Innovation Hub, Anurag University',
    category: 'Hackathon',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    description: 'Build futuristic AI-driven cloud applications in 24 hours. Win exciting prizes, mentorship, and certificates.'
  },
  {
    id: 'e4',
    title: 'Build with Cloud',
    date: 'November 18, 2026',
    time: '11:00 AM - 03:00 PM',
    venue: 'Seminar Hall 2',
    category: 'Project Showcase',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    description: 'Hands-on session showcasing student-built cloud infrastructure and web projects evaluated by mentors.'
  }
];

const benefitsData = [
  'Learn emerging technologies from scratch',
  'Build real projects for your engineering portfolio',
  'Participate in national hackathons & coding leagues',
  'Improve analytical & problem-solving skills',
  'Work with a vibrant technical student community',
  'Gain practical experience beyond textbooks',
  'Attend exclusive workshops & expert masterclasses',
  'Develop essential teamwork & leadership capabilities'
];

export default function HomePage() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <main>
      {/* 1. HERO SECTION */}
      <section className="hero-section" id="home">
        <div className="container hero-grid">
          <div>
            <div className="hero-badge animated-float">
              <Sparkles size={16} /> Anurag University • Official Technical Club
            </div>
            <h1 className="hero-title">
              THINK<span className="gradient-text">CLOUD</span>
            </h1>
            <h2 className="hero-subheading">
              Think. Build. Innovate. Cloud.
            </h2>
            <p className="hero-description">
              Empowering students to explore cloud computing, emerging technologies, innovation, and real-world projects at Anurag University, Hyderabad.
            </p>
            <div className="hero-cta">
              <Link to="/register" className="btn btn-primary">
                Join ThinkCloud <ArrowRight size={18} />
              </Link>
              <a href="#activities" className="btn btn-secondary">
                Explore Activities
              </a>
            </div>
          </div>

          {/* Futuristic Cloud / Network Visual */}
          <div className="hero-visual-wrapper">
            <CloudCanvas particleCount={55} />
            <div className="glass-card animated-float" style={{
              position: 'absolute',
              bottom: '10%',
              left: '5%',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              maxWidth: '240px',
              border: '1px solid var(--accent-cyan)'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Cloud size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cloud Innovation</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>AWS • Azure • GCP</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section className="section" id="about">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">
              <BookOpen size={16} /> About Us
            </span>
            <h2 className="section-title">About ThinkCloud</h2>
            <p className="section-description">
              ThinkCloud is a technical club at Anurag University, Hyderabad, created to provide students with opportunities to learn, experiment, build, and innovate using modern technologies.
            </p>
          </div>

          <div className="cards-grid-4">
            {/* Learn */}
            <div className="glass-card feature-card">
              <div className="card-icon-box">
                <BookOpen size={26} />
              </div>
              <h3 className="card-title">Learn</h3>
              <p className="card-text">
                Explore cloud computing, DevOps, serverless architectures, and emerging technologies through structured learning.
              </p>
            </div>

            {/* Build */}
            <div className="glass-card feature-card">
              <div className="card-icon-box">
                <Hammer size={26} />
              </div>
              <h3 className="card-title">Build</h3>
              <p className="card-text">
                Work on hands-on technical challenges and build scalable real-world projects in collaborative teams.
              </p>
            </div>

            {/* Innovate */}
            <div className="glass-card feature-card">
              <div className="card-icon-box">
                <Lightbulb size={26} />
              </div>
              <h3 className="card-title">Innovate</h3>
              <p className="card-text">
                Turn creative ideas into practical, high-impact cloud solutions that solve real industry problems.
              </p>
            </div>

            {/* Connect */}
            <div className="glass-card feature-card">
              <div className="card-icon-box">
                <Users size={26} />
              </div>
              <h3 className="card-title">Connect</h3>
              <p className="card-text">
                Collaborate with passionate students, expert faculty mentors, and experienced industry leaders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VISION SECTION */}
      <section className="section" id="vision">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">
              <Target size={16} /> Our Roadmap
            </span>
            <h2 className="section-title">Our Vision</h2>
          </div>

          <div className="vision-banner">
            <p className="vision-quote">
              "To build a community of innovators who learn, experiment, and create solutions using cloud and emerging technologies."
            </p>
          </div>

          <div className="cards-grid-4">
            <div className="glass-card">
              <div className="card-icon-box">
                <BookOpen size={24} />
              </div>
              <h3 className="card-title" style={{ fontSize: '1.2rem' }}>Practical Learning</h3>
              <p className="card-text">Learn technology by building real projects rather than passive reading.</p>
            </div>

            <div className="glass-card">
              <div className="card-icon-box">
                <Lightbulb size={24} />
              </div>
              <h3 className="card-title" style={{ fontSize: '1.2rem' }}>Innovation</h3>
              <p className="card-text">Encourage students to experiment boldly with original ideas.</p>
            </div>

            <div className="glass-card">
              <div className="card-icon-box">
                <Users size={24} />
              </div>
              <h3 className="card-title" style={{ fontSize: '1.2rem' }}>Collaboration</h3>
              <p className="card-text">Build a strong, inclusive technical community across all university branches.</p>
            </div>

            <div className="glass-card">
              <div className="card-icon-box">
                <Award size={24} />
              </div>
              <h3 className="card-title" style={{ fontSize: '1.2rem' }}>Industry Readiness</h3>
              <p className="card-text">Develop industry-relevant skills demanded by top technology companies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ACTIVITIES SECTION */}
      <section className="section" id="activities">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">
              <Rocket size={16} /> Club Initiatives
            </span>
            <h2 className="section-title">What We Do</h2>
            <p className="section-description">
              Discover our wide range of interactive events, technical sessions, and hands-on developer tracks.
            </p>
          </div>

          <div className="cards-grid-4">
            {activitiesData.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="glass-card feature-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div className="card-icon-box" style={{ marginBottom: 0 }}>
                      <Icon size={24} />
                    </div>
                    <span className="event-category-tag" style={{ position: 'static' }}>{item.badge}</span>
                  </div>
                  <h3 className="card-title" style={{ fontSize: '1.2rem' }}>{item.title}</h3>
                  <p className="card-text">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. EVENTS SECTION */}
      <section className="section" id="events">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">
              <Calendar size={16} /> Upcoming Schedule
            </span>
            <h2 className="section-title">Club Events</h2>
            <p className="section-description">
              Join our flagship inductions, hackathons, and hands-on technical workshops.
            </p>
          </div>

          <div className="cards-grid-2" style={{ marginBottom: '3rem' }}>
            {eventsData.map((evt) => (
              <div key={evt.id} className="glass-card event-card">
                <div className="event-image-wrapper">
                  <img src={evt.image} alt={evt.title} className="event-image" />
                  <span className="event-category-tag">{evt.category}</span>
                </div>
                <div className="event-content">
                  <h3 className="event-title">{evt.title}</h3>
                  <div className="event-meta">
                    <span className="meta-item"><Calendar size={14} /> {evt.date}</span>
                    <span className="meta-item"><Clock size={14} /> {evt.time}</span>
                    <span className="meta-item"><MapPin size={14} /> {evt.venue}</span>
                  </div>
                  <p className="event-description">{evt.description}</p>
                  <div className="event-footer">
                    <button 
                      onClick={() => setSelectedEvent(evt)} 
                      className="btn btn-primary btn-sm btn-block"
                    >
                      Register Now <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/register" className="btn btn-secondary">
              View All Events & Join <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. WHY JOIN THINKCLOUD SECTION */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">
              <Sparkles size={16} /> Member Advantages
            </span>
            <h2 className="section-title">Why Join ThinkCloud?</h2>
          </div>

          <div className="benefits-grid">
            {benefitsData.map((benefit, idx) => (
              <div key={idx} className="glass-card benefit-card">
                <div className="benefit-icon">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h4 className="benefit-title">Benefit {idx + 1}</h4>
                  <p className="card-text" style={{ fontSize: '0.9rem' }}>{benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. STATISTICS SECTION */}
      <StatsSection />

      {/* Quick Event Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </main>
  );
}

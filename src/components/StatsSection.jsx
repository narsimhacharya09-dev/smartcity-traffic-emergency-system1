import React, { useEffect, useState, useRef } from 'react';
import { Users, Calendar, Rocket, Cpu } from 'lucide-react';

const statsData = [
  { id: 1, target: 500, suffix: '+', label: 'Students Engaged', icon: Users },
  { id: 2, target: 20, suffix: '+', label: 'Events Organized', icon: Calendar },
  { id: 3, target: 15, suffix: '+', label: 'Hands-on Projects', icon: Rocket },
  { id: 4, target: 10, suffix: '+', label: 'Technical Workshops', icon: Cpu }
];

export default function StatsSection() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState(statsData.map(() => 0));
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const duration = 2000; // 2 seconds
    const steps = 50;
    const stepTime = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setCounts(
        statsData.map((item) => Math.min(item.target, Math.floor(item.target * progress)))
      );

      if (step >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [hasAnimated]);

  return (
    <section className="section" ref={sectionRef} id="stats">
      <div className="container">
        <div className="stats-grid">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="glass-card stat-card">
                <div style={{ display: 'inline-flex', marginBottom: '1rem', color: 'var(--accent-cyan-bright)' }}>
                  <Icon size={32} />
                </div>
                <div className="stat-number">
                  {counts[index]}
                  {stat.suffix}
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

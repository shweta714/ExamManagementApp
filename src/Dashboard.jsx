import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';

const GreetingSection = ({ userName, readyMessage }) => (
  <div className="greeting-section" aria-label="Welcome and daily status">
    <div className="greeting-text">
      <h1>Hello, {userName}!</h1>
      <p className="ready-text">{readyMessage}</p>
    </div>
    <div className="daily-task-icon" aria-hidden>🎧</div>
  </div>
);

export default function StudentDashboard({ user = { name: 'John' }, onLogout }) {
  const [expanded, setExpanded] = useState(false); 
  const [active, setActive] = useState('home');

  useEffect(() => {
    function onResize() {
      if (window.innerWidth > 100) {
        setExpanded(false); 
      }
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const NavItem = ({ id, icon, label }) => (
    <button
      className={`nav-btn ${active === id ? 'active' : ''}`}
      onClick={() => setActive(id)}
      title={label}
      aria-current={active === id}
    >
      <span className="nav-ico" aria-hidden>{icon}</span>
      {expanded && <span className="nav-label">{label}</span>} 
      {expanded && active === id && <span className="active-rail" aria-hidden />}
      {!expanded && active === id && <span className="active-dot" aria-hidden />}
    </button>
  );

  const userName = user.name || 'simran sharma';
  const userBadgeText = userName.split(' ').map(n => n[0] || '').join('').toUpperCase().slice(0, 2) || 'SS';

  return (
    <div className="dashboard-wrapper">
      <aside
        className={`left-accent ${expanded ? 'expanded' : 'collapsed'}`} 
        aria-label="Primary navigation"
      >
        <div className="accent-top">
          <div className="accent-bar" />
        </div>

        <nav className="accent-nav" role="navigation" aria-label="Dashboard">
          <NavItem id="home" icon="🏠" label="Home" />
          <NavItem id="profile" icon="👤" label="Profile" />
          <NavItem id="exams" icon="📋" label="Exam Panel" />
          <NavItem id="resources" icon="📚" label="Resources" />
          <NavItem id="settings" icon="⚙️" label="Settings" />
        </nav>

        <div className="accent-bottom">
          <button
            className="accent-expand"
            onClick={() => setExpanded(v => !v)}
            aria-pressed={expanded}
            aria-label="Toggle sidebar"
          >
            {expanded ? '‹' : '›'}
          </button>
        </div>
      </aside>

      <div className="content-area">
        <main className="main-grid" role="main">
          <div className="main-content-left">
            <GreetingSection 
              userName={userName} 
              readyMessage="Ready for your day?" 
            />

            <section className="cards-grid" aria-label="Dashboard cards">
              <article className="card next-exam-card" aria-label="Next exam">
                <div className="streak next-exam-streak"></div>
                <div className="card-inner-content">
                  <h3>Next Exam</h3>
                  <p>Database Systems (DDMS) - 3 Days Left</p>
                  <div className="progress-bar-container" aria-hidden>
                    <div className="progress-bar dbms-progress" style={{ width: '40%' }} />
                  </div>
                </div>
              </article>

              <article className="card courses-card" aria-label="Courses">
                <div className="streak courses-streak"></div>
                <div className="card-inner-content">
                  <h3>Courses</h3>
                  <div className="course-small-container">
                    <div className="course-icon">DS</div>
                    <div className="course-details">
                      <div className="course-title">IoT</div>
                      <div className="course-attempts">No recent attempts</div>
                    </div>
                    <div className="completion-percent">100%</div>
                  </div>
                </div>
              </article>

              <article className="card seating-card" aria-label="Seating plan">
                <div className="streak seating-streak"></div>
                <div className="card-inner-content">
                  <h3>Seating Plan</h3>
                  <p>No reserved seat found for upcoming exams.</p>
                </div>
              </article>

              <article className="card timetable-card" aria-label="Timetable">
                <div className="streak timetable-streak"></div>
                <div className="card-inner-content">
                  <h3>Timetable</h3>
                  <table className="timetable">
                    <tbody>
                      <tr><td>Mon</td><td>AI</td><td>9:00</td></tr>
                      <tr><td>Tue</td><td>DBMS</td><td>11:00</td></tr>
                    </tbody>
                  </table>
                </div>
              </article>
            </section>
          </div>

          <div className="main-content-right">
            <aside className="card pinned-updates" aria-label="Important updates">
              <h3>Important Updates</h3>
              <ul className="updates-list">
                <li>🎧 New Seating Updates Posted</li>
                <li>📢 Final Exam Schedule Released</li>
              </ul>
            </aside>
            <div className="floating-bot" aria-hidden>🤖</div>
          </div>
        </main>
      </div>
    </div>
  );
}
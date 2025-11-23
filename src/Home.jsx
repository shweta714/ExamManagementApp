import React, { useRef, useState, useEffect } from 'react';

export default function Home({ onGetStarted, onOpenAssistant, onSignUpRequested }) {
  const feedbackRef = useRef(null);
  const nameRef = useRef(null);
  const [showFeedbackSection, setShowFeedbackSection] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [showGetStartedOptions, setShowGetStartedOptions] = useState(false);
  useEffect(() => {
    function handleHash() {
      if (window.location.hash === '#feedback') {
        const el = document.querySelector('.feedback-cta');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (window.location.hash === '#about') {
        const el = document.getElementById('about');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    handleHash();
    window.addEventListener('hashchange', handleHash);

    function onKey(e) {
      if (e.key === 'Escape' && showFeedbackSection) {
        closeFeedbackSection();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('keydown', onKey);
    };
   
  }, []);

  
  function openFeedbackSection() {
    setShowFeedbackSection(true);
    setTimeout(() => {
      if (feedbackRef.current) {
        feedbackRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const first = nameRef.current;
        if (first) first.focus();
      }
    }, 90);
  }
  function closeFeedbackSection() {
    setShowFeedbackSection(false);
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  function validateEmail(addr) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr);
  }

  function submitFeedback(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill all fields');
      return;
    }
    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    
    console.info('Feedback submitted', { name, email, message });
    setSent(true);
    setError('');
    setTimeout(() => {
      setSent(false);
      setName(''); setEmail(''); setMessage('');
      setShowFeedbackSection(false);
    }, 1200);
  }

  return (
    <section className="home">
      <div className="hero">
        <div className="hero-left">
          <h1 className="hero-title">Campus 360</h1>
          <p className="hero-sub">Smarter Exams, Smarter Campus.</p>
          <p className="hero-desc">
            Manage exams, schedules, results, notifications, and more for students and faculty.
            Experience seamless exam administration and performance tracking.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button className="btn hero-cta" onClick={() => setShowGetStartedOptions(true)}>Get Started</button>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-card-illustration">Campus 360</div>
        </div>
      </div>

      <div className="about" id="about">
        <div className="about-inner">
          <h2>About Campus360</h2>
          <p className="about-desc">
            Campus360 is a complete Examination Management System designed to simplify academic administration.
            Manage exams, quizzes, notifications, seating arrangements, and results all in one place.
          </p>

          {}
          <div className="features-grid-two">
            <div className="feature-card">
              <h3>Quizzes</h3>
              <p>Create and manage quizzes with automatic grading and instant feedback for students.</p>
            </div>
            <div className="feature-card">
              <h3>Exam Timer</h3>
              <p>Integrated countdown timer ensures smooth exam conduction without delays.</p>
            </div>
            <div className="feature-card">
              <h3>Seating Arrangement</h3>
              <p>Automatically generate seating charts to avoid clashes and maintain spacing.</p>
            </div>
            <div className="feature-card">
              <h3>Notifications</h3>
              <p>Send alerts and reminders to students and faculty instantly about schedules or updates.</p>
            </div>

            {}
            <div className="feature-card results-card">
              <h3>Results &amp; Analytics</h3>
              <p>Track performance, generate reports, and analyze trends to improve outcomes.</p>
            </div>
          </div>
        </div>
      </div>

      {}
      <section className="feedback-cta-wrap">
        <div className={`feedback-cta ${showFeedbackSection ? 'open' : 'closed'}`} aria-live="polite">
          <h2 className="feedback-cta-title">Share Your Feedback</h2>
          <p className="muted feedback-cta-sub">We value your suggestions to improve Campus360!</p>

          {}
          {showFeedbackSection && (
            <button
              className="feedback-close btn-ghost"
              aria-label="Close feedback"
              onClick={closeFeedbackSection}
            >
              ✕
            </button>
          )}

          <div style={{ marginTop: 12 }}>
            {!showFeedbackSection ? (
              <button className="btn hero-feedback" onClick={openFeedbackSection}>Give Feedback</button>
            ) : (
              <div id="feedback" ref={feedbackRef}>
                <form className="feedback-form" onSubmit={submitFeedback}>
                  <input
                    ref={nameRef}
                    placeholder="Your Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    aria-label="Name"
                  />
                  <input
                    placeholder="Your Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    aria-label="Email"
                    type="email"
                  />
                  <textarea
                    placeholder="Your Feedback"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={5}
                    aria-label="Feedback"
                  />
                  {error && <div className="error">{error}</div>}
                  {sent ? (
                    <div className="feedback-sent">Thanks! Your feedback has been sent.</div>
                  ) : (
                    <button className="btn submit-gradient" type="submit">Submit Feedback</button>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {}
      {/* Get Started chooser modal */}
      {showGetStartedOptions && (
        <div className="getstarted-modal" role="dialog" aria-modal="true">
          <div className="getstarted-card">
            <button className="modal-close btn-ghost" onClick={() => setShowGetStartedOptions(false)}>✕</button>
            <h2 className="getstarted-title">WELCOME TO Campus360</h2>
            <div className="getstarted-actions">
              <button
                className="btn getstarted-login"
                onClick={() => { setShowGetStartedOptions(false); onGetStarted && onGetStarted(); }}
              >
                Login
              </button>
              <button
                className="btn getstarted-signup"
                onClick={() => { setShowGetStartedOptions(false); if (onSignUpRequested) onSignUpRequested(); }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="site-footer">
        <div className="footer-inner">
          {}
          <button className="nav-link" onClick={() => { if (onOpenAssistant) onOpenAssistant(); }}>
            Help
          </button>

          {}
          <button
            className="nav-link"
            onClick={() => window.location.href = 'mailto:support@campus360.example?subject=Campus360%20Support'}
          >
            Contact
          </button>

          <div>© {new Date().getFullYear()} Campus360. All rights reserved.</div>
        </div>
      </footer>
    </section>
  );
}

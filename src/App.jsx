import React, { useState } from 'react';
import Home from './Home';
import Login from './Login';
import Dashboard from './Dashboard';
import Assistant from './Assistant';
import Signup from './Signup'; // add import
import ForgotPassword from './ForgotPassword'; // new import

export default function App() {
  const [route, setRoute] = useState('home'); 
  const [user, setUser] = useState(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  function openAssistant() {
    setAssistantOpen(true);
  }
  function closeAssistant() {
    setAssistantOpen(false);
  }

  function handleLogin(username) {
    setUser({ username });
    setRoute('dashboard');
  }
  function handleLogout() {
    setUser(null);
    setRoute('home');
  }

  
  function goToSection(id) {
    setRoute('home');

    if (id === 'home') {
      
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
      return;
    }
    window.location.hash = `#${id}`;

    let attempts = 0;
    const maxAttempts = 30;
    const tryScroll = () => {
      attempts += 1;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const focusable = el.querySelector('input, textarea, button, select, [tabindex]');
        if (focusable) focusable.focus();
        return;
      }
      if (attempts < maxAttempts) {
        setTimeout(tryScroll, 100);
      }
    };

    
    setTimeout(tryScroll, 120);
  }

  // NEW: navigate to signup page
  function openSignup() { setRoute('signup'); }
  function openForgot() { setRoute('forgot'); } // new

  return (
    <>
      <nav className="top-nav">
        <div className="nav-left">Campus360</div>
        <div className="nav-right">
          <button className="nav-link" onClick={() => goToSection('home')}>Home</button>
          <button className="nav-link" onClick={() => goToSection('about')}>About</button>
          <button className="nav-link" onClick={() => goToSection('feedback')}>Feedback</button>

          {user ? (
            <>
              <button className="nav-link" onClick={() => setRoute('dashboard')}>Dashboard</button>
              <button className="nav-cta" onClick={handleLogout}>Logout</button>
            </>
          ) : null}
        </div>
      </nav>

      <main>
        {route === 'home' && (
          <Home onGetStarted={() => setRoute('login')} onOpenAssistant={openAssistant} onSignUpRequested={openSignup} />
        )}
        {route === 'login' && (
          <Login onLogin={handleLogin} onCancel={() => setRoute('home')} onSignUpRequested={openSignup} onForgotRequested={openForgot} />
        )}
        {route === 'signup' && <Signup onSignupSuccess={() => setRoute('login')} onCancel={() => setRoute('home')} onLoginRequested={() => setRoute('login')} />}
        {route === 'forgot' && <ForgotPassword onDone={() => setRoute('login')} onCancel={() => setRoute('login')} />}
        {route === 'dashboard' && user && <Dashboard user={user} />}
      </main>

      {}
      {assistantOpen && <Assistant onClose={closeAssistant} />}
    </>
  );
}

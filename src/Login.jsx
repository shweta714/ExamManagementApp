import React, { useState } from 'react';
import './auth.css';

export default function Login({ onLogin, onCancel, onSignUpRequested, onForgotRequested }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');

  function submit(e) {
    e.preventDefault();
    if (!username.trim()) return setError('Username required');
    if (password.length < 3) return setError('Password must be at least 3 characters');
    setError('');
    onLogin(username.trim());
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="avatar">C360</div>

        <h2 className="login-title">Login</h2>
        <p className="login-sub">Welcome to a smarter campus experience!</p>

        <div className="role-toggle" role="tablist" aria-label="Role selector">
          <button
            type="button"
            className={`role-btn ${role === 'student' ? 'active' : ''}`}
            onClick={() => setRole('student')}
          >
            <span className="emoji">👩‍🎓</span>
            <span>Student</span>
          </button>
          <button
            type="button"
            className={`role-btn ${role === 'faculty' ? 'active' : ''}`}
            onClick={() => setRole('faculty')}
          >
            <span className="emoji">🧑‍🏫</span>
            <span>Faculty</span>
          </button>
        </div>

        <form className="login-form" onSubmit={submit} aria-labelledby="login-title">
          <label className="field-label">Username or Email</label>
          <input
            className="input"
            placeholder="Enter your username or email"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <label className="field-label">Password</label>
          <input
            className="input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {error && <div className="error">{error}</div>}

          <button className="btn login-submit" type="submit">Login</button>
        </form>

        <div className="login-links">
          <button type="button" className="link" onClick={() => { if (onForgotRequested) onForgotRequested(); }}>Forgot Password?</button>
          <button type="button" className="link" onClick={() => { if (onSignUpRequested) onSignUpRequested(); }}>Sign up</button>
        </div>

        <button className="modal-cancel btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

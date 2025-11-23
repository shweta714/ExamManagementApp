import React, { useState, useMemo } from 'react';
import './signup.css';

export default function Signup({ onSignupSuccess, onCancel, onLoginRequested }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const pwChecks = useMemo(() => ({
    minLength: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }), [password]);

  function validateEmail(addr) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !username.trim() || !password || !confirm) {
      setError('Please fill all fields');
      return;
    }
    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email');
      return;
    }
    if (!Object.values(pwChecks).every(Boolean)) {
      setError('Password does not meet requirements');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setSending(true);
    setTimeout(() => {
      setSending(false);
      if (onSignupSuccess) onSignupSuccess({ username, email, fullName });
    }, 900);
  }

  return (
    <div className="signup-page">
      <div className="signup-card" role="dialog" aria-modal="true" aria-label="Create account">
        <button className="modal-close btn-ghost" onClick={() => onCancel && onCancel()}>✕</button>

        <div className="signup-top">
          <div className="signup-logo">Campus360</div>
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-sub">Join Campus 360 today</p>
        </div>

        <button className="signup-google" type="button" onClick={() => console.info('Google signup')}>
          <span className="g-icon">G</span> Sign up with Google
        </button>

        <div className="signup-or"><span></span><span>or</span><span></span></div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label className="label">Full Name</label>
          <input className="input" value={fullName} onChange={e => setFullName(e.target.value)} />

          <label className="label">Email</label>
          <input className="input" value={email} onChange={e => setEmail(e.target.value)} />

          <label className="label">Username</label>
          <input className="input" value={username} onChange={e => setUsername(e.target.value)} />

          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} />

          <div className="pw-requirements">
            <strong>Password must contain:</strong>
            <ul>
              <li className={pwChecks.minLength ? 'ok' : ''}>At least 8 characters</li>
              <li className={pwChecks.upper ? 'ok' : ''}>One uppercase letter</li>
              <li className={pwChecks.number ? 'ok' : ''}>One number</li>
              <li className={pwChecks.special ? 'ok' : ''}>One special character</li>
            </ul>
          </div>

          <label className="label">Confirm Password</label>
          <input className="input" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />

          {error && <div className="form-error">{error}</div>}

          <button className="btn create-account" type="submit" disabled={sending}>
            {sending ? 'Creating…' : 'Create Account'}
          </button>

          <div className="signup-footer">
            Already have an account?{" "}
            <button
              type="button"
              className="link"
              onClick={() => { if (onLoginRequested) onLoginRequested(); }}
            >
              Login here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

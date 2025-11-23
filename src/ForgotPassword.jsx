import React, { useState } from 'react';
import './auth.css';
import { generateResetCode, findUser, verifyResetCode, setPasswordFor, consumeResetCode } from './authStore';

export default function ForgotPassword({ onDone, onCancel }) {
  const [mode, setMode] = useState('request'); // 'request' | 'verify'
  const [identifier, setIdentifier] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  function requestCode(e) {
    e && e.preventDefault();
    setError(''); setMessage('');
    if (!identifier.trim()) { setError('Enter username or email'); return; }
    const u = findUser(identifier.trim());
    if (u) {
      const c = generateResetCode(u.email);
      console.info('Simulated reset code (demo):', u.email, c);
    }
    setMessage('If an account exists, a reset code has been sent to the registered email (simulated).');
    setMode('verify');
  }

  function verifyAndSet(e) {
    e && e.preventDefault();
    setError(''); setMessage('');
    if (!code.trim() || !newPassword) { setError('Enter code and new password'); return; }
    const u = findUser(identifier.trim());
    if (!u || !verifyResetCode(u.email, code.trim())) { setError('Invalid code or expired'); return; }
    setPasswordFor(u.username || u.email, newPassword);
    consumeResetCode(u.email);
    setMessage('Password updated. You can now log in.');
    setTimeout(() => { if (onDone) onDone(); }, 900);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Reset Password</h2>
        <p className="login-sub">Enter your username or email to receive a reset code.</p>

        {mode === 'request' ? (
          <form onSubmit={requestCode} className="login-form">
            <label className="field-label">Username or Email</label>
            <input className="input" value={identifier} onChange={e => setIdentifier(e.target.value)} />
            {error && <div className="error">{error}</div>}
            <button className="btn login-submit" type="submit">Send reset code</button>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
              <button type="button" className="btn-ghost" onClick={() => onCancel && onCancel()}>Cancel</button>
              <button type="button" className="btn-ghost" onClick={() => setMode('verify')}>I have a code</button>
            </div>
            {message && <div className="muted" style={{ marginTop: 10 }}>{message}</div>}
          </form>
        ) : (
          <form onSubmit={verifyAndSet} className="login-form">
            <label className="field-label">Username or Email</label>
            <input className="input" value={identifier} onChange={e => setIdentifier(e.target.value)} />
            <label className="field-label">Reset Code</label>
            <input className="input" value={code} onChange={e => setCode(e.target.value)} />
            <label className="field-label">New Password</label>
            <input className="input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            {error && <div className="error">{error}</div>}
            <button className="btn login-submit" type="submit">Update Password</button>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
              <button type="button" className="btn-ghost" onClick={() => { setMode('request'); setError(''); setMessage(''); }}>Back</button>
              <button type="button" className="btn-ghost" onClick={() => onCancel && onCancel()}>Cancel</button>
            </div>
            {message && <div className="muted" style={{ marginTop: 10 }}>{message}</div>}
          </form>
        )}
      </div>
    </div>
  );
}

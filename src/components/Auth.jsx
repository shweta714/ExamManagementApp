import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDB, saveDB } from '../db'
import { hashPassword } from './utils'

export default function Auth({ onLogin }){
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSignup(){
    const db = getDB()
    if (db.users.find(u=>u.email===email)) { setError('Email already registered'); return }
    const h = await hashPassword(password)
    const user = { id: 'u'+Date.now(), name, email, passwordHash:h, roll:'-', department:'-', year:'1', settings:{darkMode:false} }
    db.users.push(user)
    saveDB(db)
    onLogin(user)
  }

  async function handleLogin(){
    const db = getDB()
    const user = db.users.find(u=>u.email===email)
    if (!user) { setError('No account with that email'); return }
    const h = await hashPassword(password)
    if (h !== user.passwordHash) { setError('Invalid credentials'); return }
    onLogin(user)
  }

  return (
    <div className="auth container">
      <div className="auth-box">
        <h2>{mode==='login' ? 'Student Login' : 'Create account'}</h2>
        {error && <div className="error">{error}</div>}
        {mode==='signup' && (
          <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
        )}
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="auth-actions">
          {mode==='login' ? (
            <>
              <button onClick={handleLogin} className="btn">Login</button>
              <button onClick={()=>{setMode('signup'); setError(null)}} className="link">Create account</button>
            </>
          ) : (
            <>
              <button onClick={handleSignup} className="btn">Sign up</button>
              <button onClick={()=>{setMode('login'); setError(null)}} className="link">Back to login</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

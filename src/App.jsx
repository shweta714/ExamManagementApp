import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Intro from './components/Intro'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import db, { getDB, setCurrentUser, getCurrentUser } from './db'

export default function App(){
  const [user, setUser] = useState(getCurrentUser())
  const navigate = useNavigate()

  useEffect(()=>{
    setUser(getCurrentUser())
  },[])

  function handleLogin(userObj){
    setCurrentUser(userObj)
    setUser(userObj)
    navigate('/dashboard')
  }
  function handleLogout(){
    setCurrentUser(null)
    setUser(null)
    navigate('/auth')
  }

  return (
    <Routes>
      <Route path='/' element={<Intro />} />
      <Route path='/auth' element={<Auth onLogin={handleLogin} />} />
      <Route path='/dashboard/*' element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to='/auth' />} />
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  )
}

import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Home from './Home'
import Exams from './Exams'
import ExamPanel from './ExamPanel'
import Profile from './Profile'
import Settings from './Settings'
import Timetable from './Timetable'
import Notifications from './Notifications'
import { getDB, saveDB, setCurrentUser } from '../db'

export default function Dashboard({ user, onLogout }){
  const [db, setDb] = useState(getDB())
  const navigate = useNavigate()

  useEffect(()=>{
    // sync DB when changed externally
    function handler(){ setDb(getDB()) }
    window.addEventListener('storage', handler)
    return ()=> window.removeEventListener('storage', handler)
  },[])

  function updateUser(updated){
    const d = getDB()
    const idx = d.users.findIndex(u=>u.id===updated.id)
    if (idx>=0) d.users[idx]=updated
    saveDB(d)
    setCurrentUser(updated)
  }

  return (
    <div className={`dashboard ${user.settings?.darkMode ? 'dark' : ''}`}>
      <Sidebar user={user} onLogout={onLogout} />
      <main className="main-area">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="exams" element={<Exams />} />
          <Route path="exams/:examId" element={<ExamPanel user={user} />} />
          <Route path="profile" element={<Profile user={user} onUpdate={updateUser} />} />
          <Route path="settings" element={<Settings user={user} onUpdate={updateUser} />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="*" element={<Home user={user} />} />
        </Routes>
      </main>
    </div>
  )
}

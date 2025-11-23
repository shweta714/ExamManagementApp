import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Sidebar({ user, onLogout }){
  const navigate = useNavigate()
  return (
    <aside className="sidebar">
      <div className="brand"><h2>Campus360</h2></div>
      <div className="user-mini">
        <div className="avatar">{user.name[0]}</div>
        <div>
          <div className="name">{user.name}</div>
          <div className="small">{user.department} • {user.year} year</div>
        </div>
      </div>
      <nav className="nav">
        <NavLink to="/dashboard/" end>Home</NavLink>
        <NavLink to="/dashboard/exams">Exams</NavLink>
        <NavLink to="/dashboard/timetable">Timetable</NavLink>
        <NavLink to="/dashboard/notifications">Notifications</NavLink>
        <NavLink to="/dashboard/profile">Profile</NavLink>
        <NavLink to="/dashboard/settings">Settings</NavLink>
      </nav>
      <div className="side-footer">
        <button className="btn" onClick={()=>{ onLogout(); navigate('/auth') }}>Logout</button>
      </div>
    </aside>
  )
}

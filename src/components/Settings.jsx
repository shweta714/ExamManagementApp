import React from 'react'
import { getDB, saveDB, setCurrentUser } from '../db'

export default function Settings({ user, onUpdate }){
  function toggleDark(){
    const d = getDB()
    const u = d.users.find(uu=>uu.id===user.id)
    if (!u) return
    u.settings = u.settings||{}
    u.settings.darkMode = !u.settings.darkMode
    saveDB(d)
    setCurrentUser(u)
    onUpdate(u)
  }

  return (
    <div className="page settings">
      <h2>Settings</h2>
      <div className="card">
        <div className="row-between">
          <div>
            <strong>Dark mode</strong>
            <div className="muted">Toggle UI dark theme</div>
          </div>
          <div>
            <button className="btn" onClick={toggleDark}>{user.settings?.darkMode ? 'Disable' : 'Enable'}</button>
          </div>
        </div>
      </div>
      <div className="card">
        <h3>Security</h3>
        <p>This demo stores data locally. For production, integrate secure server authentication and encryption.</p>
      </div>
    </div>
  )
}

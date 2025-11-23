import React from 'react'
import { getDB, saveDB } from '../db'

export default function Notifications(){
  const db = getDB()
  function markRead(id){
    const n = db.notifications.find(nn=>nn.id===id)
    if (n) { n.read=true; saveDB(db); window.location.reload() }
  }
  return (
    <div className="page notifications">
      <h2>Notifications</h2>
      {db.notifications.map(n=> (
        <div className={`card ${n.read? 'read' : ''}`} key={n.id}>
          <div className="row-between">
            <div>
              <strong>{n.title}</strong>
              <div className="muted">{new Date(n.date).toLocaleString()}</div>
              <p>{n.message}</p>
            </div>
            {!n.read && <button className="btn" onClick={()=>markRead(n.id)}>Mark read</button>}
          </div>
        </div>
      ))}
    </div>
  )
}

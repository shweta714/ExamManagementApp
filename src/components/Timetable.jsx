import React from 'react'
import { getDB } from '../db'

export default function Timetable(){
  const db = getDB()
  return (
    <div className="page timetable">
      <h2>Timetable</h2>
      {db.timetable.map(t=> (
        <div className="card" key={t.id}>
          <div><strong>{t.title}</strong></div>
          <div className="muted">{new Date(t.date).toLocaleString()}</div>
        </div>
      ))}
    </div>
  )
}

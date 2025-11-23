import React from 'react'
import { Link } from 'react-router-dom'
import { getDB } from '../db'

export default function Exams(){
  const db = getDB()
  const now = new Date()
  return (
    <div className="page exams">
      <h2>Exams</h2>
      {db.exams.map(ex=> {
        const start = new Date(ex.startTime)
        const end = new Date(ex.endTime)
        const status = now < start ? 'Scheduled' : (now > end ? 'Ended' : 'Ongoing')
        return (
          <div className="card" key={ex.id}>
            <div className="row-between">
              <div>
                <h4>{ex.title}</h4>
                <div className="muted">{new Date(ex.startTime).toLocaleString()} - {new Date(ex.endTime).toLocaleTimeString()}</div>
              </div>
              <div className="col-right">
                <div className={`badge ${status.toLowerCase()}`}>{status}</div>
                <Link to={`/dashboard/exams/${ex.id}`} className="btn small">Open</Link>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

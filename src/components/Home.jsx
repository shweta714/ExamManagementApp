import React from 'react'
import { getDB } from '../db'
import { Link } from 'react-router-dom'

export default function Home({ user }){
  const db = getDB()
  const recent = db.courses.find(c=>c.recent) || db.courses[0]
  const upcoming = db.timetable.slice(0,3)

  return (
    <div className="page home">
      <h2>Welcome, {user.name}</h2>
      <section className="card">
        <h3>Recent course</h3>
        {recent ? (
          <div>
            <strong>{recent.title}</strong>
            <p>Keep going — finish modules to perform better in exams.</p>
          </div>
        ) : (
          <div>
            <p>Looks like you haven't started any course yet. Start now and score high!</p>
            <Link to="/dashboard/exams" className="btn">View Exams</Link>
          </div>
        )}
      </section>

      <section className="card">
        <h3>Upcoming</h3>
        {upcoming.length ? upcoming.map(t=> (
          <div key={t.id} className="small-row">
            <div>{t.title}</div>
            <div className="muted">{new Date(t.date).toLocaleString()}</div>
          </div>
        )) : <p>No upcoming exams.</p>}
      </section>
    </div>
  )
}

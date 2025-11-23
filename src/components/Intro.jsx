import React from 'react'
import { Link } from 'react-router-dom'

export default function Intro(){
  return (
    <div className="intro container">
      <h1>Campus360</h1>
      <p>Exam management platform demo — attempt exams, view timetable, results and notifications.</p>
      <div className="intro-cards">
        <div className="card">
          <h3>About</h3>
          <p>Designed to manage exams and provide students a professional dashboard.</p>
        </div>
        <div className="card">
          <h3>Feedback</h3>
          <p>We welcome your suggestions. Use the app and test features.</p>
        </div>
      </div>
      <div className="cta">
        <Link to="/auth" className="btn">Get started (Login / Signup)</Link>
      </div>
    </div>
  )
}

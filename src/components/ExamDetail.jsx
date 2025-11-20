import React from 'react'

export default function ExamDetail({ exam }) {
  if (!exam) return (
    <div className="card">
      <h2>Exam Details</h2>
      <p>Select an exam to see details.</p>
    </div>
  )

  return (
    <div className="card">
      <h2>{exam.title}</h2>
      <p><strong>Date:</strong> {exam.date}</p>
      <p><strong>Duration:</strong> {exam.duration} minutes</p>
      {exam.description && <p><strong>Description:</strong> {exam.description}</p>}
    </div>
  )
}

import React from 'react'

export default function ExamList({ exams, onSelect, onDelete }) {
  if (!exams || exams.length === 0) return <div className="card">No exams yet</div>

  return (
    <div className="card">
      <h2>Exams</h2>
      <ul className="exam-list">
        {exams.map(exam => (
          <li key={exam.id} className="exam-item">
            <div onClick={() => onSelect(exam)} className="exam-info">
              <strong>{exam.title}</strong>
              <span>{exam.date} • {exam.duration} min</span>
            </div>
            <button className="btn danger" onClick={() => onDelete(exam.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

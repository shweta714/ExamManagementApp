import React, { useState } from 'react'
import ExamList from './components/ExamList'
import ExamForm from './components/ExamForm'
import ExamDetail from './components/ExamDetail'

const sampleExams = [
  { id: 1, title: 'Math Final', date: '2025-12-10', duration: 120, description: 'Algebra, calculus' },
  { id: 2, title: 'Physics Midterm', date: '2025-11-30', duration: 90, description: 'Mechanics and waves' }
]

export default function App() {
  const [exams, setExams] = useState(sampleExams)
  const [selected, setSelected] = useState(null)

  function addExam(exam) {
    const id = exams.length ? Math.max(...exams.map(e => e.id)) + 1 : 1
    setExams(prev => [...prev, { ...exam, id }])
  }

  function deleteExam(id) {
    setExams(prev => prev.filter(e => e.id !== id))
    if (selected && selected.id === id) setSelected(null)
  }

  return (
    <div className="app">
      <header>
        <h1>Exam Management</h1>
      </header>
      <main>
        <section className="left">
          <ExamForm onAdd={addExam} />
          <ExamList exams={exams} onSelect={setSelected} onDelete={deleteExam} />
        </section>
        <section className="right">
          <ExamDetail exam={selected} />
        </section>
      </main>
      <footer>Built with React + Vite</footer>
    </div>
  )
}

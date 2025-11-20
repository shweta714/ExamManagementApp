import React, { useState } from 'react'

export default function ExamForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [duration, setDuration] = useState(60)
  const [description, setDescription] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!title || !date) return
    onAdd({ title, date, duration: Number(duration), description })
    setTitle('')
    setDate('')
    setDuration(60)
    setDescription('')
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>Add Exam</h2>
      <label>
        Title
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Biology Final" />
      </label>
      <label>
        Date
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </label>
      <label>
        Duration (minutes)
        <input type="number" value={duration} onChange={e => setDuration(e.target.value)} min={10} />
      </label>
      <label>
        Description
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
      </label>
      <div className="actions">
        <button className="btn primary" type="submit">Add</button>
      </div>
    </form>
  )
}

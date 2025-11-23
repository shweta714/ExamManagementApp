import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDB, saveDB } from '../db'

export default function ExamPanel({ user }){
  const { examId } = useParams()
  const navigate = useNavigate()
  const [exam, setExam] = useState(null)
  const [db, setDb] = useState(getDB())
  const [started, setStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [answers, setAnswers] = useState({})
  const [tabSwitchCount, setTabSwitchCount] = useState(0)
  const tabSwitchRef = useRef(0)
  const timerRef = useRef(null)

  useEffect(()=>{
    const d = getDB()
    const ex = d.exams.find(e=>e.id===examId)
    setExam(ex)
  },[examId])

  useEffect(()=>{
    function onVisibility(){
      if (document.hidden && started){
        tabSwitchRef.current += 1
        setTabSwitchCount(tabSwitchRef.current)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('blur', onVisibility)
    return ()=>{
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('blur', onVisibility)
    }
  },[started])

  function canStart(){
    if (!exam) return false
    const now = new Date()
    const start = new Date(exam.startTime)
    const end = new Date(exam.endTime)
    return now >= start && now <= end
  }

  function begin(){
    if (!canStart()) return alert('Exam not accessible yet or already ended')
    const duration = exam.durationMinutes*60
    setTimeLeft(duration)
    setStarted(true)
    // start countdown
    timerRef.current = setInterval(()=>{
      setTimeLeft(t=>{
        if (t<=1){ clearInterval(timerRef.current); submit('auto') }
        return t-1
      })
    },1000)
    // request full screen for stricter environment
    if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(()=>{})
  }

  function choose(qid, idx){ setAnswers(a=>({...a, [qid]: idx})) }

  function submit(mode='manual'){
    clearInterval(timerRef.current)
    // score
    const qs = exam.questions
    let correct=0, total=0, score=0
    qs.forEach(q=>{
      total += q.marks
     if (answers[q.id] == q.answer){ correct++; score += q.marks }
    })
    const attempt = {
      id: 'a'+Date.now(), examId: exam.id, userId: user.id, date: new Date().toISOString(), answers, score, total, correct, tabSwitchCount, flagged: tabSwitchCount>3, mode
    }
    const d = getDB()
    d.attempts.push(attempt)
    saveDB(d)
    alert(`Submitted. Score: ${score}/${total}${attempt.flagged? '\nNote: flagged for multiple tab switches' : ''}`)
    // exit fullscreen if any
    if (document.fullscreenElement) document.exitFullscreen().catch(()=>{})
    navigate('/dashboard/exams')
  }

  if (!exam) return <div className="page"><p>Exam not found</p></div>

  return (
    <div className="page exam-panel">
      <h2>{exam.title}</h2>
      <div className="muted">Duration: {exam.durationMinutes} minutes</div>
      <div className="card">
        <h3>Instructions</h3>
        <ul>
          <li>Do not switch tabs. Multiple switches may be flagged.</li>
          <li>Keep camera / invigilation enabled if available (demo: not implemented).</li>
          <li>Once submitted, you can review answers and score.</li>
        </ul>
      </div>

      {!started ? (
        <div>
          <button className="btn" onClick={begin} disabled={!canStart()}>Request access & Start Exam</button>
          {!canStart() && <div className="muted">Exam not started yet. Starts at {new Date(exam.startTime).toLocaleString()}</div>}
        </div>
      ) : (
        <div>
          <div className="muted">Time left: {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')} | Tab switches: {tabSwitchCount}</div>
          {exam.questions.map(q=> (
            <div key={q.id} className="card question">
              <div><strong>{q.text}</strong></div>
              <div className="options">
                {q.options.map((opt,i)=> (
                  <label key={i} className={answers[q.id]===i ? 'selected' : ''}>
                    <input type="radio" name={q.id} checked={answers[q.id]===i} onChange={()=>choose(q.id,i)} /> {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="exam-actions">
            <button className="btn danger" onClick={()=>submit('manual')}>Submit Exam</button>
          </div>
        </div>
      )}
    </div>
  )
}

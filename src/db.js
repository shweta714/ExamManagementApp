// Local DB util using localStorage; stores a JSON object under 'campus360_db'
// This file also supports optional server-backed persistence at /api/db.
const DB_KEY = 'campus360_db'
const CURRENT_USER_KEY = 'campus360_currentUser'

function nowISO() { return new Date().toISOString(); }

const sampleDB = {
  users: [
    {
      id: 'u1',
      name: 'Test Student',
      email: 'student@example.com',
      // password is stored as hashed text (for demo); default password: password123
      passwordHash: null,
      roll: 'CS-001',
      department: 'Computer Science',
      year: '3',
      settings: { darkMode: false }
    }
  ],
  courses: [
    {id:'c1', title:'Data Structures', recent: true},
    {id:'c2', title:'Database Systems', recent: false}
  ],
  exams: [
    {
      id: 'e1',
      title: 'DS Midterm',
      courseId: 'c1',
      startTime: null, // set to ISO when initialized
      endTime: null,
      durationMinutes: 20,
      questions: [
        {id:'q1', text:'What is a stack?', options:['LIFO structure','FIFO structure','Tree','Graph'], answer:0, marks:5},
        {id:'q2', text:'Big-O of binary search?', options:['O(n)','O(log n)','O(n log n)','O(1)'], answer:1, marks:5}
      ],
      seating: {room:'A201', seatMap: [['u1','u2'],['u3','u4']]} 
    }
  ],
  timetable: [
    {id:'t1', title:'DS Midterm', date: null, examId:'e1'}
  ],
  notifications: [
    {id:'n1', title:'Welcome', message:'Welcome to Campus360 demo!', date: nowISO(), read:false}
  ],
  attempts: []
}

export function getDB() {
  let raw = localStorage.getItem(DB_KEY)
  if (!raw) {
    // initialize sample DB with times near now
    const db = JSON.parse(JSON.stringify(sampleDB))
    const start = new Date(Date.now() + 60*1000) // starts in 1 minute
    const end = new Date(start.getTime() + db.exams[0].durationMinutes*60*1000)
    db.exams[0].startTime = start.toISOString()
    db.exams[0].endTime = end.toISOString()
    db.timetable[0].date = start.toISOString()
    db.users[0].passwordHash = null
    localStorage.setItem(DB_KEY, JSON.stringify(db))
    return db
  }
  try { return JSON.parse(raw) } catch (e) { console.error('Invalid DB JSON', e); localStorage.removeItem(DB_KEY); return getDB(); }
}

export function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
  // attempt to persist server-side if API is available
  try {
    fetch('/api/db', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(db) }).catch(()=>{})
  } catch(e){}
}

export function getCurrentUser() {
  const raw = localStorage.getItem(CURRENT_USER_KEY)
  return raw ? JSON.parse(raw) : null
}

export function setCurrentUser(user) {
  if (user) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(CURRENT_USER_KEY)
}

// Try to sync DB from server on demand. If server not available, does nothing.
export async function syncFromServer(){
  try {
    const ping = await fetch('/api/ping')
    if (!ping.ok) return false
    const res = await fetch('/api/db')
    if (!res.ok) return false
    const obj = await res.json()
    // if server DB exists, write into localStorage for client use
    localStorage.setItem(DB_KEY, JSON.stringify(obj))
    return true
  } catch (e){
    return false
  }
}

export default { getDB, saveDB, getCurrentUser, setCurrentUser, syncFromServer }

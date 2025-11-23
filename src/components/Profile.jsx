import React, { useState } from 'react'

export default function Profile({ user, onUpdate }){
  const [name, setName] = useState(user.name)
  const [department, setDepartment] = useState(user.department)
  const [year, setYear] = useState(user.year)

  function save(){
    const updated = {...user, name, department, year}
    onUpdate(updated)
    alert('Profile updated')
  }

  return (
    <div className="page profile">
      <h2>Profile</h2>
      <div className="card">
        <label>Full name<input value={name} onChange={e=>setName(e.target.value)} /></label>
        <label>Department<input value={department} onChange={e=>setDepartment(e.target.value)} /></label>
        <label>Year<input value={year} onChange={e=>setYear(e.target.value)} /></label>
        <div className="actions"><button className="btn" onClick={save}>Save</button></div>
      </div>
    </div>
  )
}

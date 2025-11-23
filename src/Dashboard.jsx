import React from 'react';

function Stat({ label, value }) {
  return (
    <div className="stat">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function Dashboard({ user }) {
  // demo static data (replace with API/GraphQL later)
  const stats = [
    { label: 'Active Exams', value: 5 },
    { label: 'Students', value: 128 },
    { label: 'Pending Results', value: 14 },
    { label: 'Invigilation Slots', value: 8 },
  ];
  const upcoming = [
    { id: 1, name: 'Math 101', date: '2025-12-01', time: '10:00 AM' },
    { id: 2, name: 'Physics 201', date: '2025-12-03', time: '02:00 PM' },
    { id: 3, name: 'Chemistry Lab', date: '2025-12-05', time: '09:00 AM' },
  ];

  return (
    <section className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Welcome, {user?.username}</h1>
          <p className="muted">Overview of exams and system activity</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn">Create Exam</button>
        </div>
      </header>

      <div className="dashboard-stats">
        {stats.map(s => <Stat key={s.label} {...s} />)}
      </div>

      <div className="dashboard-grid">
        <div className="card upcoming">
          <h2>Upcoming Exams</h2>
          <ul className="exam-list">
            {upcoming.map(e => (
              <li key={e.id} className="exam-item">
                <div>
                  <div className="exam-name">{e.name}</div>
                  <div className="exam-meta">{e.date} • {e.time}</div>
                </div>
                <button className="btn-ghost">Details</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="card quick-actions">
          <h2>Quick Actions</h2>
          <button className="btn full">Add Student</button>
          <button className="btn full">Schedule Exam</button>
          <button className="btn full">Export Results</button>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import './StudentDashboard.css'; // Import the CSS file

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Thin Vertical Navigation Bar (Leftmost element) */}
      <div className="vertical-nav"></div>

      {/* Main Content Area */}
      <div className="main-content">
        <header className="dashboard-header">
          <div className="user-profile">
            <div className="avatar">SS</div>
            <div>
              <div className="username">simran sharma</div>
              <div className="portal-type">Student portal</div>
            </div>
          </div>
          <div className="header-actions">
            <button className="settings-btn">Settings</button>
            <button className="logout-btn">Logout</button>
          </div>
        </header>

        {/* The main grid of cards */}
        <div className="card-grid">
          {/* Top-left: Greeting */}
          <div className="greeting-card">
            <h1>Hello, simran sharma!</h1>
            <p>Ready for your day?</p>
            <span className="headphone-icon">🎧</span>
          </div>

          {/* Top-right: Important Updates */}
          <div className="updates-card card">
            <h3>Important Updates</h3>
            <div className="update-item">
              <span>🔔</span> New Seating Updates Posted
            </div>
            <div className="update-item">
              <span>📄</span> Final Exam Schedule Released
            </div>
            {/* The circular floating button/avatar (optional) */}
            <div className="floating-bot">🤖</div>
          </div>

          {/* Middle-left: Next Exam Card */}
          <div className="next-exam-card card">
            <h2>Next Exam</h2>
            <div className="exam-details">
              Database Systems (DDMS) - **3 Days** Left
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: '50%' }}></div>
            </div>
          </div>

          {/* Middle-right: Courses Card */}
          <div className="courses-card card">
            <h2>Courses</h2>
            <div className="course-item">
              <div className="course-icon">DS</div>
              <div className="course-info">
                <div className="course-name">IoT</div>
                <div className="course-progress">
                  No recent attempts
                  <span className="attempt-count">10</span>
                </div>
              </div>
              <div className="completion-percent">100%</div>
            </div>
          </div>

          {/* Bottom-left: Seating Plan Card */}
          <div className="seating-card card">
            <h2>Seating Plan</h2>
            <p>No reserved seat found for upcoming exams.</p>
          </div>

          {/* Bottom-right: Timetable Card */}
          <div className="timetable-card card">
            <h2>Timetable</h2>
            <table>
              <tbody>
                <tr>
                  <td>Mon</td>
                  <td>AI</td>
                  <td>9:00</td>
                </tr>
                <tr>
                  <td>Tue</td>
                  <td>DBMS</td>
                  <td>11:00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
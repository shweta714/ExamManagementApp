# Campus360 (Demo)

Lightweight demo of an exam management app using React + Vite and storing data in localStorage as JSON.

Features:
- Intro page with about/feedback
- Login / Signup (localStorage, password hashed via Web Crypto)
- Dashboard with Home, Exams, Timetable, Notifications, Profile, Settings
- Dark mode toggle saved to user settings
- Exams list and exam panel with strict features: timed exam, tab-switch counting, fullscreen request
- Attempts and results stored in local DB (localStorage)

Quick start (Windows PowerShell):

```powershell
cd "d:\Campus360(Exam managemnet app)"
npm install
npm run dev
```

Open the URL shown by Vite (usually http://localhost:5173).

Demo credentials: `student@example.com` (if initial DB prompts), default password is `password123` in the sample but you may sign up.

Notes:
- This is a local demo. For production, implement server-side authentication, HTTPS, and secure DB storage with proper invigilation features.

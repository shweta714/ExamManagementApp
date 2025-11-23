const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, 'data.json');
const OUT_DIR = path.join(__dirname, '..', 'dist_static');

function readData() {
  try { return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8')); } catch { return {}; }
}

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function renderTemplate(title, body) {
  return `<!doctype html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${title}</title></head><body>
  <main>
  <h1>${title}</h1>
  ${body}
  </main>
</body></html>`;
}

function generate() {
  ensureDir(OUT_DIR);
  const data = readData();


  const students = (data.users || []).map(u => `<li><a href="./students/${u.username}.html">${u.username}</a> (${u.role})</li>`).join('');
  const courses = [];
  if (data.studentData) {
    Object.values(data.studentData).forEach(sd => {
      (sd.courses || []).forEach(c => { if (!courses.find(x=>x.code===c.code)) courses.push(c); });
    });
  }
  const courseList = courses.map(c => `<li><a href="./courses/${c.code}.html">${c.title} (${c.code})</a></li>`).join('');
  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), renderTemplate('Campus360 - Static', `<h2>Students</h2><ul>${students}</ul><h2>Courses</h2><ul>${courseList}</ul>`), 'utf8');

  const studentsDir = path.join(OUT_DIR, 'students');
  ensureDir(studentsDir);
  for (const username of Object.keys(data.studentData || {})) {
    const sd = data.studentData[username];
    const courseHtml = (sd.courses || []).map(c => `<li>${c.title} (${c.code}) - ${c.progress}%</li>`).join('');
    const quizHtml = Object.keys(sd.quizzes || {}).map(course => `<h4>${course}</h4><ul>` + (sd.quizzes[course]||[]).map(q=>`<li>${q.title}</li>`).join('') + `</ul>`).join('');
    const body = `<p>Static student page for <strong>${username}</strong></p><h3>Courses</h3><ul>${courseHtml}</ul><h3>Quizzes</h3>${quizHtml}`;
    ensureDir(path.join(studentsDir));
    fs.writeFileSync(path.join(studentsDir, `${username}.html`), renderTemplate(`Student: ${username}`, body), 'utf8');
  }
  const coursesDir = path.join(OUT_DIR, 'courses');
  ensureDir(coursesDir);
  const allCourses = {};
  for (const sd of Object.values(data.studentData || {})) {
    (sd.courses || []).forEach(c => allCourses[c.code] = c);
  }
  for (const code of Object.keys(allCourses)) {
    const c = allCourses[code];
    const quizzes = [];
    for (const [u, sd] of Object.entries(data.studentData || {})) {
      const qlist = (sd.quizzes && sd.quizzes[code]) || [];
      qlist.forEach(q => quizzes.push({ course: code, title: q.title }));
    }
    const quizHtml = quizzes.length ? `<ul>${quizzes.map(q=>`<li>${q.title}</li>`).join('')}</ul>` : '<div>No practice quizzes</div>';
    fs.writeFileSync(path.join(coursesDir, `${code}.html`), renderTemplate(`Course: ${c.title}`, `<p>Instructor: ${c.instructor || 'TBD'}</p><h3>Quizzes</h3>${quizHtml}`), 'utf8');
  }

  console.log('Static site generated at', OUT_DIR);
}

generate();

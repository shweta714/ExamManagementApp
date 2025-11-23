import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import { schema, root } from './graphql.js';
import bcrypt from 'bcryptjs';

const DATA_PATH = path.join(process.cwd(), 'server', 'data.json');

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  } catch (e) {
    return { users: [], feedback: [], resets: {}, dashboards: {}, studentData: {} };
  }
}
function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}
function norm(s = '') { return String(s).trim().toLowerCase(); }

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('<h1>Campus360 API</h1><p>Use /api/* endpoints or /graphql for GraphQL.</p>');
});

function sendJson(res, status, payload) { res.status(status).json(payload); }
function sendError(res, status, code, message) { sendJson(res, status, { ok: false, error: code, message }); }

app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password, fullName, role } = req.body || {};
    if (!username || !email || !password) return sendError(res, 400, 'missing_fields', 'username, email and password are required');
    if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string') return sendError(res, 400, 'invalid_types', 'username/email/password must be strings');
    if (username.trim().length < 3) return sendError(res, 400, 'invalid_username', 'username must be at least 3 characters');
    if (password.length < 6) return sendError(res, 400, 'weak_password', 'password must be at least 6 characters');

    const data = readData();
    const nUser = norm(username), nEmail = norm(email);
    if (data.users.find(u => u._username === nUser || u._email === nEmail)) {
      return sendError(res, 409, 'user_exists', 'A user with that username or email already exists');
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = {
      id: Date.now(),
      username: username.trim(),
      email: email.trim(),
      password: hashed,
      fullName: fullName ? fullName.trim() : '',
      role: role || 'student',
      _username: nUser,
      _email: nEmail
    };
    data.users.push(user);

    data.studentData = data.studentData || {};
    data.dashboards = data.dashboards || {};
    if (!data.studentData[nUser]) {
      data.studentData[nUser] = { courses: [], quizzes: {}, seating: { reserved: false, options: [] } };
      data.dashboards[nUser] = { greeting: `Hello, ${user.username}!`, upcomingExams: [], courses: [], seatingPlan: { reserved: false }, timetable: [], important: [] };
    }
    writeData(data);
    return sendJson(res, 201, { ok: true, user: { username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error('signup error', err);
    return sendError(res, 500, 'server_error', 'Internal server error');
  }
});
app.post('/api/login', async (req, res) => {
  try {
    const { identifier, password } = req.body || {};
    if (!identifier || !password) return sendError(res, 400, 'missing_fields', 'identifier and password are required');
    const data = readData();
    const id = norm(identifier);
    const user = data.users.find(u => u._username === id || u._email === id);
    if (!user) return sendError(res, 401, 'invalid_credentials', 'Invalid username/email or password');

   
    const isHashed = typeof user.password === 'string' && user.password.startsWith('$2');
    let ok = false;
    if (isHashed) {
      ok = await bcrypt.compare(password, user.password);
    } else {
     
      if (user.password === password) {
        ok = true;
        const newHash = await bcrypt.hash(password, 10);
        user.password = newHash;
        writeData(data);
      }
    }
    if (!ok) return sendError(res, 401, 'invalid_credentials', 'Invalid username/email or password');

    return sendJson(res, 200, { ok: true, user: { username: user.username, email: user.email, role: user.role || 'student' } });
  } catch (err) {
    console.error('login error', err);
    return sendError(res, 500, 'server_error', 'Internal server error');
  }
});
app.post('/api/feedback', (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !message) return sendError(res, 400, 'missing_fields', 'name and message are required');
    const data = readData();
    data.feedback.push({ id: Date.now(), name: String(name).trim(), email: email ? String(email).trim() : '', message: String(message).trim(), createdAt: new Date().toISOString() });
    writeData(data);
    return sendJson(res, 201, { ok: true });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'server_error', 'Internal server error');
  }
});
app.post('/api/reset/request', (req, res) => {
  try {
    const { identifier } = req.body || {};
    if (!identifier) return sendError(res, 400, 'missing_fields', 'identifier is required');
    const data = readData();
    const id = norm(identifier);
    const user = data.users.find(u => u._username === id || u._email === id);
    if (user) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      data.resets = data.resets || {};
      data.resets[user._email] = { code, expires: Date.now() + 10 * 60 * 1000 };
      writeData(data);
      console.info('Simulated reset code for', user.email, code);
    }
    return sendJson(res, 200, { ok: true, message: 'If an account exists, a reset code has been sent.' });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'server_error', 'Internal server error');
  }
});
app.post('/api/reset/confirm', async (req, res) => {
  try {
    const { identifier, code, newPassword } = req.body || {};
    if (!identifier || !code || !newPassword) return sendError(res, 400, 'missing_fields', 'identifier, code and newPassword are required');
    if (newPassword.length < 6) return sendError(res, 400, 'weak_password', 'password must be at least 6 characters');
    const data = readData();
    const id = norm(identifier);
    const user = data.users.find(u => u._username === id || u._email === id);
    if (!user) return sendError(res, 400, 'invalid_code_or_user', 'Invalid code or user');
    const entry = (data.resets || {})[user._email];
    if (!entry || String(entry.code) !== String(code).trim() || Date.now() > entry.expires) {
      if (entry && Date.now() > entry.expires) { delete data.resets[user._email]; writeData(data); }
      return sendError(res, 400, 'invalid_code_or_expired', 'Invalid or expired code');
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    delete data.resets[user._email];
    writeData(data);
    return sendJson(res, 200, { ok: true });
  } catch (err) {
    console.error('reset confirm error', err);
    return sendError(res, 500, 'server_error', 'Internal server error');
  }
});

app.get('/api/dashboard', (req, res) => {
  try {
    const username = String(req.query.username || '').trim().toLowerCase();
    if (!username) return sendError(res, 400, 'missing_username', 'username query param is required');
    const data = readData();
    const dash = (data.dashboards && data.dashboards[username]) || null;
    if (!dash) {
      return sendJson(res, 200, { ok: true, dashboard: {
        greeting: `Hello, ${username}!`,
        upcomingExams: [],
        courses: [],
        seatingPlan: { reserved: false, details: null },
        timetable: [],
        important: []
      }});
    }
    return sendJson(res, 200, { ok: true, dashboard: dash });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'server_error', 'Internal server error');
  }
});

app.get('/api/student/courses', (req, res) => {
  try {
    const username = String(req.query.username || '').trim().toLowerCase();
    if (!username) return sendError(res, 400, 'missing_username', 'username query param is required');
    const data = readData();
    const sd = data.studentData && data.studentData[username];
    const courses = (sd && sd.courses) || [];
    return sendJson(res, 200, { ok: true, courses });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'server_error', 'Internal server error');
  }
});

app.get('/api/student/quizzes', (req, res) => {
  try {
    const username = String(req.query.username || '').trim().toLowerCase();
    const course = String(req.query.course || '').trim();
    if (!username || !course) return sendError(res, 400, 'missing_params', 'username and course are required');
    const data = readData();
    const sd = data.studentData && data.studentData[username];
    const quizzes = (sd && sd.quizzes && sd.quizzes[course]) || [];
    const payload = quizzes.map(q => ({
      id: q.id,
      title: q.title,
      timeLimit: q.timeLimit,
      questions: q.questions.map(qq => ({ id: qq.id, text: qq.text, options: qq.options }))
    }));
    return sendJson(res, 200, { ok: true, quizzes: payload });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'server_error', 'Internal server error');
  }
});

app.get('/api/student/seating', (req, res) => {
  try {
    const username = String(req.query.username || '').trim().toLowerCase();
    if (!username) return sendError(res, 400, 'missing_username', 'username query param is required');
    const data = readData();
    const sd = data.studentData && data.studentData[username];
    const seating = (sd && sd.seating) || { reserved: false, options: [] };
    return sendJson(res, 200, { ok: true, seating });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'server_error', 'Internal server error');
  }
});

app.post('/api/student/seating/reserve', (req, res) => {
  try {
    const { username, examId, location } = req.body || {};
    if (!username || !examId || !location) return sendError(res, 400, 'missing_fields', 'username, examId and location are required');
    const data = readData();
    const sd = data.studentData && data.studentData[username];
    if (!sd) return sendError(res, 404, 'student_not_found', 'student not found');
    sd.seating.reserved = true;
    sd.seating.details = { examId, location, reservedAt: new Date().toISOString() };
    writeData(data);
    return sendJson(res, 200, { ok: true, seating: sd.seating });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'server_error', 'Internal server error');
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API server listening on http://localhost:${PORT}`));

const USERS_KEY = 'campus360_users';
const RESETS_KEY = 'campus360_resets';

function norm(s = '') { return String(s).trim().toLowerCase(); }

function loadUsers() { try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; } }
function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

function loadResets() { try { return JSON.parse(localStorage.getItem(RESETS_KEY) || '{}'); } catch { return {}; } }
function saveResets(m) { localStorage.setItem(RESETS_KEY, JSON.stringify(m)); }

export function createUser({ username, email, password, fullName }) {
	const users = loadUsers();
	const _u = norm(username), _e = norm(email);
	if (users.find(x => x._username === _u || x._email === _e)) return { ok: false, reason: 'exists' };
	const user = { id: Date.now(), username, email, password, fullName, _username: _u, _email: _e };
	users.push(user); saveUsers(users); return { ok: true, user };
}

export function findUser(identifier) {
	const users = loadUsers(); const id = norm(identifier);
	return users.find(u => u._username === id || u._email === id) || null;
}

export function setPasswordFor(identifier, newPassword) {
	const users = loadUsers(); const id = norm(identifier);
	const i = users.findIndex(u => u._username === id || u._email === id);
	if (i === -1) return false;
	users[i].password = newPassword; saveUsers(users); return true;
}

export function generateResetCode(email) {
	const e = norm(email);
	const code = Math.floor(100000 + Math.random() * 900000).toString();
	const map = loadResets(); map[e] = { code, expires: Date.now() + 10 * 60 * 1000 }; saveResets(map);
	return code;
}

export function verifyResetCode(email, code) {
	const e = norm(email); const map = loadResets(); const entry = map[e];
	if (!entry) return false;
	if (Date.now() > entry.expires) { delete map[e]; saveResets(map); return false; }
	return String(entry.code) === String(code).trim();
}

export function consumeResetCode(email) {
	const e = norm(email); const map = loadResets(); if (map[e]) { delete map[e]; saveResets(map); }
}

# Campus360 API (local demo)

Base URL: http://localhost:4000

All responses are JSON. Successful responses contain `{ ok: true, ... }`. Errors return `{ ok: false, error: 'code', message: 'human readable' }`.

Endpoints

- POST /api/signup
  - Body: { username, email, password, fullName?, role? }
  - Success: 201 { ok: true, user: { username, email, role } }
  - Errors: 400 missing_fields, 409 user_exists

- POST /api/login
  - Body: { identifier (username or email), password }
  - Success: 200 { ok: true, user: { username, email, role } }
  - Errors: 400 missing_fields, 401 invalid_credentials

- POST /api/feedback
  - Body: { name, email?, message }
  - Success: 201 { ok: true }
  - Errors: 400 missing_fields, invalid_message

- POST /api/reset/request
  - Body: { identifier }
  - Success: 200 { ok: true, message: 'If an account exists, a reset code has been sent.' }
  - Notes: For demo the server logs the reset code to console.

- POST /api/reset/confirm
  - Body: { identifier, code, newPassword }
  - Success: 200 { ok: true }
  - Errors: 400 missing_fields, invalid_code_or_expired

Data store: server/data.json (demo persistence). Replace with a real DB for production.

Security: This demo uses plain passwords and a JSON file. For production use hashed passwords, rate limiting, real email delivery and HTTPS.

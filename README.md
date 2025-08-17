# Udyam Step 1 & 2 — Fullstack (React + Node.js)

A minimal clone of the first two steps of the Udyam registration (Aadhaar + OTP, then PAN), per assignment. 
- Frontend: React (Vite)
- Backend: Node.js (Express + sqlite3)
- OTP: Server-generated, 6 digits, expires (default 5 min), returned in response when `ALLOW_DEV_OTP=true` for local testing.

## Quick Start

### 1) Backend
```bash
cd server
cp .env.example .env  # (already present by default)
npm i
npm run dev
```
Backend runs at http://localhost:4000

### 2) Frontend
```bash
cd client
npm i
npm run dev
```
Frontend runs at http://localhost:5173

> Change `VITE_API_URL` in `client/.env` if your backend URL differs.

## Endpoints
- `POST /api/otp/request` `{ aadhaar }` => issues OTP (simulated SMS); returns `dev_otp` in development
- `POST /api/otp/verify` `{ aadhaar, code }` => verifies OTP and creates applicant row; returns `applicantId`
- `POST /api/step2` `{ applicantId, pan, name, pin }` => validates PAN and persists form
- `GET  /api/pin/:pin` => returns `{ state, city }` for known demo PINs

## Validation Rules
- Aadhaar: 12 digits
- PAN: `^[A-Z]{5}[0-9]{4}[A-Z]$`

## Notes
- sqlite DB file is created at `server/data.db` automatically.
- OTP attempts are limited; OTP expires based on `OTP_TTL_SECONDS`.
- For production, disable `ALLOW_DEV_OTP` and integrate real SMS/OTP service.

## License
MIT

import { get, run } from '../lib/db.js';

const TTL = Number(process.env.OTP_TTL_SECONDS || 300);
const ALLOW_DEV_OTP = String(process.env.ALLOW_DEV_OTP || 'false') === 'true';

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function requestOtp(aadhaar) {
  const code = generateOtp();
  const expires = Math.floor(Date.now() / 1000) + TTL;
  await run(`INSERT INTO otps (aadhaar, code, expires_at, attempts)
            VALUES (?, ?, ?, 0)
            ON CONFLICT(aadhaar) DO UPDATE SET code=excluded.code, expires_at=excluded.expires_at, attempts=0`, 
            [aadhaar, code, expires]);
  const payload = { ok: true, message: 'OTP sent to registered mobile (simulated)' };
  if (process.env.NODE_ENV !== 'production') {
  payload.dev_otp = code; // Always send OTP in dev
}
  console.log(`OTP for ${aadhaar} is ${code} (expires in ${TTL} seconds)`);
  return payload;
  
}

export async function verifyOtp(aadhaar, code) {
  const row = await get(`SELECT code, expires_at, attempts FROM otps WHERE aadhaar=?`, [aadhaar]);
  if (!row) return { ok: false, error: 'OTP not requested' };
  if (row.attempts >= 5) return { ok: false, error: 'Too many attempts. Please request a new OTP.' };
  if (row.expires_at < Math.floor(Date.now() / 1000)) return { ok: false, error: 'OTP expired' };
  if (row.code !== code) {
    await run(`UPDATE otps SET attempts = attempts + 1 WHERE aadhaar=?`, [aadhaar]);
    return { ok: false, error: 'Incorrect OTP' };
  }
  // success -> delete otp
  await run(`DELETE FROM otps WHERE aadhaar=?`, [aadhaar]);
  return { ok: true };
}

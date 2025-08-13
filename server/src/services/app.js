import { get, run } from '../lib/db.js';

export async function upsertApplicant({ aadhaar }) {
 
  const existing = await get(`SELECT * FROM applicants WHERE aadhaar=?`, [aadhaar]);
  if (existing) return existing;
  const res = await run(`INSERT INTO applicants (aadhaar) VALUES (?)`, [aadhaar]);
  return await get(`SELECT * FROM applicants WHERE id=?`, [res.lastID]);
}

export async function saveStep2({ applicantId, pan, name, pin, state, city }) {
  await run(`UPDATE applicants SET pan=?, name=?, pin=?, state=?, city=?, updated_at=datetime('now') WHERE id=?`, 
    [pan, name, pin, state, city, applicantId]);
  const row = await get(`SELECT * FROM applicants WHERE id=?`, [applicantId]);
  return row;
}

// Minimal PIN -> state/city map (for demo). Replace with an external API in production.
const PIN_MAP = {
  "110001": { state: "Delhi", city: "New Delhi" },
  "400001": { state: "Maharashtra", city: "Mumbai" },
  "560001": { state: "Karnataka", city: "Bengaluru" },
  "700001": { state: "West Bengal", city: "Kolkata" },
  "122001": { state: "Haryana", city: "Gurugram" }
};

export function getPinMeta(pin) {
  if (!pin || !/^\d{6}$/.test(String(pin))) return { state: "", city: "" };
  return PIN_MAP[String(pin)] || { state: "", city: "" };
}

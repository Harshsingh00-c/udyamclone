export function validateAadhaar(aadhaar) {
  const s = String(aadhaar || '').trim();
  if (!/^\d{12}$/.test(s)) return { ok: false, error: 'Aadhaar must be 12 digits' };
  return { ok: true };
}

export function validatePan(pan) {
  const s = String(pan || '').trim().toUpperCase();
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(s)) return { ok: false, error: 'Invalid PAN format (AAAAA9999A)' };
  return { ok: true };
}

import { Router } from 'express';
import { requestOtp, verifyOtp } from './services/otp.js';
import { saveStep2, upsertApplicant, getPinMeta } from './services/app.js';
import { validateAadhaar, validatePan } from './services/validation.js';

export const router = Router();

// OTP flow
router.post('/otp/request', async (req, res) => {
  try {
    const { aadhaar } = req.body || {};
    const v = validateAadhaar(aadhaar);
    if (!v.ok) return res.status(400).json({ error: v.error });

   const result = await requestOtp(aadhaar);
return res.json(result);

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal error' });
  }
});

router.post('/otp/verify', async (req, res) => {
  try {
    const { aadhaar, code } = req.body || {};
    const v = validateAadhaar(aadhaar);
    if (!v.ok) return res.status(400).json({ error: v.error });
    if (!code || !/^\d{6}$/.test(String(code))) return res.status(400).json({ error: 'Invalid OTP' });

    const result = await verifyOtp(aadhaar, String(code));
    if (!result.ok) return res.status(400).json(result);
    // create / update applicant row after OTP verified
    const applicant = await upsertApplicant({ aadhaar });
    return res.json({ ok: true, applicantId: applicant.id });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// Step 2: PAN validation + persist
router.post('/step2', async (req, res) => {
  try {
    const { applicantId, pan, name, pin } = req.body || {};
    if (!(applicantId > 0)) return res.status(400).json({ error: 'Missing applicantId' });
    const pv = validatePan(pan);
    if (!pv.ok) return res.status(400).json({ error: pv.error });

    const pinMeta = getPinMeta(pin);
    const saved = await saveStep2({ applicantId, pan: pan.toUpperCase(), name, pin, state: pinMeta.state, city: pinMeta.city });
    return res.json({ ok: true, saved });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// Utility: PIN to meta
router.get('/pin/:pin', (req, res) => {
  const { pin } = req.params;
  const meta = getPinMeta(pin);
  if (!meta) return res.status(404).json({ error: 'PIN not found' });
  res.json(meta);
});

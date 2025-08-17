import React, { useState, useRef } from "react";

import axios from "axios";
import { validateAadhaar, validatePan } from "./validation.js";
import myImage from "./asset/image.png";
import videoPoster from "./asset/udyam.svg";
import myVideo from "./asset/udyam.mp4";


const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function App() {
  const [step, setStep] = useState(1);
  const [aadhaar, setAadhaar] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [applicantId, setApplicantId] = useState(null);
  const [pan, setPan] = useState("");
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [consent, setConsent] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);


const navItemStyle = {
  color: 'white',
  textDecoration: 'none',
  opacity: 0.85,
  paddingBottom: '4px',
  borderBottom: '3px solid transparent',
  transition: 'border-color 0.2s ease',
  cursor: 'pointer'
};

const dropdownContainerStyle = {
  position: 'absolute',
  top: '100%',
  left: 0,
  background: 'white',
  color: '#1a237e',
  minWidth: '260px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  borderRadius: '4px',
  zIndex: 1000
};

const dropdownItem = {
  display: 'block',
  padding: '10px 16px',
  color: '#1a237e',
  textDecoration: 'none',
  fontSize: '15px',
  borderBottom: '1px solid #eee',
  cursor: 'pointer'
};


  const step2Ref = useRef(null);

  // Additional fields for Step 2
  const [orgType, setOrgType] = useState("");
  const [dob, setDob] = useState("");
  const [panConsent, setPanConsent] = useState(false);

  async function handleRequestOtp(e) {
    e.preventDefault();
    setMsg("");
    setErr("");
    const v = validateAadhaar(aadhaar);
    if (!v.ok) return setErr(v.error);
    try {
      const { data } = await axios.post(`${API}/otp/request`, { aadhaar });
      setOtpRequested(true);
      setMsg("OTP sent (simulated). Check console or dev field.");
      if (data.dev_otp) {
        setDevOtp(data.dev_otp);
        console.log("Dev OTP:", data.dev_otp);
      }
    } catch (e) {
      setErr(e.response?.data?.error || "Failed to request OTP");
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setMsg("");
    setErr("");
    if (!/^\d{6}$/.test(otp)) return setErr("Enter 6-digit OTP");
    try {
      const { data } = await axios.post(`${API}/otp/verify`, {
        aadhaar,
        code: otp,
      });
      console.log("OTP verify response:", data);

      setApplicantId(data.applicantId);
      setMsg("OTP verified");
      setStep(2);
      setTimeout(() => {
        if (step2Ref.current) {
          step2Ref.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    } catch (e) {
      console.error("OTP verify error:", e.response?.data || e);
      setErr(e.response?.data?.error || e.response?.data || "Invalid OTP");
      return;
    }
  }

  async function lookupPin(value) {
    setPin(value);
    if (/^\d{6}$/.test(value)) {
      try {
        const { data } = await axios.get(`${API}/pin/${value}`);
        setState(data.state || "");
        setCity(data.city || "");
      } catch (_e) {
       
      }
    }
  }

  async function handleSubmitStep2(e) {
    e.preventDefault();
    setMsg("");
    setErr("");
    const pv = validatePan(pan);
    if (!pv.ok) return setErr(pv.error);
    try {
      const { data } = await axios.post(`${API}/step2`, {
        applicantId,
        pan,
        name,
        pin,
      });
      setMsg("Submitted successfully. You can close this window.");
    } catch (e) {
      setErr(e.response?.data?.error || "Submit failed");
    }
  }

  return (
    <>
    <style>
{`
  @keyframes blinkStar {
    0%   { color: red; }
    33%  { color: yellow; }
    66%  { color: blue; }
    100% { color: red; }
  }
  .new-badge {
    display: inline-block;
    font-weight: bold;
    animation: blinkStar 1s infinite;
  }
  .new-badge::before {
    content: "★ ";
  }
`}
</style>

      {/* Top Banner and Navigation */}
      <div
        style={{
          background: "#4636c4",
          color: "white",
          padding: 0,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
          }}
        >
          {/* Logo  */}
          <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <a href="https://udyamregistration.gov.in/Government-India/Ministry-MSME-registration.htm"
  target="_blank"
  rel="noopener noreferrer">
            <img
              src={myImage}
              alt="India Emblem"
              style={{ height: 40, marginRight: 18, cursor: 'pointer' }}
            /> </a>
            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 200,
                  lineHeight: 1.1,
                  letterSpacing: 0.5,
                }}
              >
                <span
                  style={{
                    fontFamily: "Mangal, Arial, sans-serif",
                    fontWeight: 300,
                    fontSize: 20,
                  }}
                >
                  सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय
                </span>
                <br />
                Ministry of Micro, Small & Medium Enterprises
              </div>
            </div>
          </div>
          {/* Navigation */}
       
        <nav style={{ display: 'flex', gap: 32, fontSize: 17, fontWeight: 500 }}>
  {/* Home */}
  <a
    href="https://udyamregistration.gov.in/Government-India/Ministry-MSME-registration.htm"
    style={navItemStyle}
    onMouseEnter={e => e.target.style.textDecoration = 'underline'}
    onMouseLeave={e => e.target.style.textDecoration = 'none'}
  >
    Home
  </a>

  {/* NIC Code */}
  <a
    href="https://udyamregistration.gov.in/docs/NIC-code-for-MSME-classification-definition.pdf"
    target="_blank"
    rel="noopener noreferrer"
    style={navItemStyle}
    onMouseEnter={e => e.target.style.textDecoration = 'underline'}
    onMouseLeave={e => e.target.style.textDecoration = 'none'}
  >
    NIC Code
  </a>

  {/* Useful Documents */}
  <div
    style={{ position: 'relative' }}
    onMouseEnter={() => setOpenMenu('useful')}
    onMouseLeave={() => setOpenMenu(null)}
  >
    <div style={{ ...navItemStyle, borderBottomColor: openMenu === 'useful' ? 'white' : 'transparent' }}>
      Useful Documents <span style={{ fontSize: 13 }}>▼</span>
    </div>
    {openMenu === 'useful' && (
      <div style={dropdownContainerStyle}>
        <a href="https://udyamregistration.gov.in/msme-registration-process/free-government-portal.html" style={dropdownItem}>Important</a>
        <a href="https://udyamregistration.gov.in/docs/Benefits_of_UR.pdf" style={dropdownItem}>Udyam Registration Benefits <span className="new-badge">NEW</span>
</a>
        <a href="https://udyamregistration.gov.in/micro,small,medium-industry,service-manufacturing,enterprise-units/ministry.htm" style={dropdownItem}>Site Highlights</a>
        <a href="https://udyamregistration.gov.in/msme-registration-notification/circulars-orders.htm" style={dropdownItem}>Circulars & Orders</a>
        <a href="https://udyamregistration.gov.in/docs/UdyamApplication.pdf" style={dropdownItem}>Udyam Registration Sample form</a>
        <a href="#" style={dropdownItem}>Udyam Registration Bulletin <span className="new-badge">NEW</span>
</a>
        <a href="https://udyamregistration.gov.in/docs/Udyam_Metadata.pdf" style={dropdownItem}>Metadata Compliance</a>
      </div>
    )}
  </div>

  {/* Print / Verify */}
  <div
    style={{ position: 'relative' }}
    onMouseEnter={() => setOpenMenu('print')}
    onMouseLeave={() => setOpenMenu(null)}
  >
    <div style={{ ...navItemStyle, borderBottomColor: openMenu === 'print' ? 'white' : 'transparent' }}>
      Print / Verify <span style={{ fontSize: 13 }}>▼</span>
    </div>
    {openMenu === 'print' && (
      <div style={dropdownContainerStyle}>
        <a href="#" style={dropdownItem}>Print Udyam Certificate</a>
        <a href="#" style={dropdownItem}>Verify Udyam Registration Number <span className="new-badge">NEW</span>
</a>
        <a href="https://udyamregistration.gov.in/Udyam_Login.aspx" style={dropdownItem}>Print UAM Certificate</a>
        <a href="https://udyamregistration.gov.in/Udyam_Verify.aspx" style={dropdownItem}>Print UAM Application</a>
        <a href="https://udyamregistration.gov.in/UA/UA_VerifyUAM.aspx" style={dropdownItem}>Verify Udyog Aadhaar</a>
        <a href="https://udyamregistration.gov.in/UAM-convert-udyam-msme-free-registration.htm" style={dropdownItem}>Forgot Udyam/UAM No.</a>
      </div>
    )}
  </div>

  {/* Update Details */}
    <div
    style={{ position: 'relative' }}
    onMouseEnter={() => setOpenMenu('update')}
    onMouseLeave={() => setOpenMenu(null)}
  >
    <div style={{ ...navItemStyle, borderBottomColor: openMenu === 'update' ? 'white' : 'transparent' }}>
      Update Details <span style={{ fontSize: 13 }}>▼</span>
    </div>
    {openMenu === 'update' && (
      <div style={dropdownContainerStyle}>
        <a href="https://udyamregistration.gov.in/Udyam_Login.aspx" style={dropdownItem}>Update/Cancel Udyam Registration <span className="new-badge">NEW</span></a>
      </div>
    )}
  </div>

  {/* Login */}
  <div
    style={{ position: 'relative' }}
    onMouseEnter={() => setOpenMenu('login')}
    onMouseLeave={() => setOpenMenu(null)}
  >
    <div style={{ ...navItemStyle, borderBottomColor: openMenu === 'login' ? 'white' : 'transparent' }}>
      Login <span style={{ fontSize: 13 }}>▼</span>
    </div>
    {openMenu === 'login' && (
      <div style={dropdownContainerStyle}>
        <a href="https://udyamregistration.gov.in/Udyam_Login.aspx" style={dropdownItem}>Udyam Login</a>
        <a href="https://udyamregistration.gov.in/Udyam_EFC_Login.aspx" style={dropdownItem}>Admin Login <span className="new-badge">NEW</span>
</a>
        <a href="https://udyamregistration.gov.in/Udyam_Officer_Login.aspx" style={dropdownItem}>Other Login Option</a>
      </div>
    )}
  </div>
</nav>


        </div>
      </div>
      {/* Subtitle */}
      <div
        style={{
          background: "#f4f8fb",
          padding: "24px 0 18px 0",
          textAlign: "center",
          fontSize: 32,
          color: "#23235a",
          fontWeight: 400,
          letterSpacing: 0.5,
        }}
      >
        UDYAM REGISTRATION FORM{" "}
        <span style={{ fontWeight: 300, fontSize: 28 }}>
          - For New Enterprise who are not Registered yet as MSME
        </span>
      </div>

      {/* Main Form Container */}
      <div
        className="container"
        style={{
          marginTop: 32,
          width: "90%",
          maxWidth: 1400,
          padding: "0 24px",
        }}
      >
        <div
          className="card"
          style={{
            padding: 0,
            borderRadius: 10,
            overflow: "hidden",
            border: "1.5px solid #1976d2",
            boxShadow: "0 4px 24px rgba(25, 118, 210, 0.08)",
          }}
        >
          {/* Blue Section Title Bar */}
          <div
            style={{
              background: "#1976d2",
              color: "white",
              padding: "16px 24px",
              fontWeight: 600,
              fontSize: 20,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            Aadhaar Verification With OTP
          </div>
          <div style={{ padding: "28px 24px 18px 24px" }}>
            {/* Aadhaar/Name 2-column grid */}
            <form
              className="row row-2"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 18,
                marginBottom: 0,
              }}
              onSubmit={(e) => e.preventDefault()}
            >
              <div style={{ gridColumn: 1 }}>
                <label style={{ fontWeight: 700, fontSize: 16 }}>
                  1. Aadhaar Number/{" "}
                  <span style={{ fontWeight: 400 }}>आधार संख्या</span>
                </label>
                <input
                  inputMode="numeric"
                  maxLength={12}
                  placeholder="Enter Aadhaar Number"
                  value={aadhaar}
                  onChange={(e) =>
                    setAadhaar(e.target.value.replace(/\D/g, ""))
                  }
                  style={{ fontSize: 18, marginTop: 4 }}
                />
              </div>
              <div style={{ gridColumn: 2 }}>
                <label style={{ fontWeight: 700, fontSize: 16 }}>
                  2. Name of Entrepreneur/{" "}
                  <span style={{ fontWeight: 400 }}>उद्यमी का नाम</span>
                </label>
                <input
                  placeholder="Name as per Aadhaar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ fontSize: 18, marginTop: 4 }}
                />
              </div>
            </form>
            {/* Info bullet points */}
            <ul
              style={{
                margin: "18px 0 0 0",
                paddingLeft: 22,
                color: "#222",
                fontSize: 15,
                lineHeight: 1.7,
              }}
            >
              <li>Aadhaar number shall be required for Udyam Registration.</li>
              <li>
                The Aadhaar number shall be of the proprietor in the case of a
                proprietorship firm, of the managing partner in the case of a
                partnership firm and of a karta in the case of a Hindu Undivided
                Family (HUF).
              </li>
              <li>
                In case of a Company or a Limited Liability Partnership or a
                Cooperative Society or a Society or a Trust, the organisation or
                its authorised signatory shall provide its GSTIN(As per
                applicability of CGST Act 2017 and as notified by the ministry
                of MSME) and PAN along with its Aadhaar number.
              </li>
            </ul>
            {/* Consent */}
            <div
              style={{
                marginTop: 16,
                color: "#222",
                display: "flex",
                alignItems: "center",
                gap: 8,
                maxWidth: 1400,
              }}
            >
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                id="consent-checkbox"
                style={{
                  width: 18,
                  height: 18,
                  accentColor: "#1976d2",
                  marginTop: 2,
                }}
              />
              <label
                htmlFor="consent-checkbox"
                style={{
                  userSelect: "none",
                  cursor: "pointer",
                  fontSize: 17,
                  lineHeight: 1.5,
                  fontWeight: 400,
                  flex: 1,
                }}
              >
                I, the holder of the above Aadhaar, hereby give my consent to
                Ministry of MSME, Government of India, for using my Aadhaar
                number as alloted by UIDAI for Udyam Registration. NIC /
                Ministry of MSME, Government of India, have informed me that my
                aadhaar data will not be stored/shared. / मैं, आधार धारक, इस
                प्रकार उद्यम पंजीकरण के लिए यूआईडीएआई के साथ अपने आधार संख्या का
                उपयोग करने के लिए सूचित करता/करती हूँ। मंत्रालय, भारत सरकार ने
                मुझे सूचित किया है कि मेरा आधार डेटा संरक्षित / साझा नहीं किया
                जाएगा।
              </label>
            </div>

            {/* Step 1: OTP */}
            {step === 1 && (
              <form
                className="row"
                style={{ marginTop: 18 }}
                onSubmit={(e) => e.preventDefault()}
              >
                {!otpRequested ? (
                  <button
                    className="btn"
                    style={{ width: 240, fontSize: 16, marginTop: 10 }}
                    onClick={handleRequestOtp}
                    disabled={!consent}
                  >
                    Validate &amp; Generate OTP
                  </button>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      marginTop: 10,
                    }}
                  >
                    <div>
                      <label style={{ fontWeight: 500 }}>Enter OTP</label>
                      <input
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, ""))
                        }
                        style={{ fontSize: 18, marginTop: 4, width: 180 }}
                      />
                    
                    </div>
                    <button
                      className="btn"
                      style={{ width: 140, fontSize: 16 }}
                      onClick={handleVerifyOtp}
                    >
                      Verify OTP
                    </button>
                  </div>
                )}
                {msg && (
                  <div className="ok">
                    {typeof msg === "string"
                      ? msg
                      : msg && msg.error
                      ? msg.error
                      : ""}
                  </div>
                )}
                {err && (
                  <div className="error">
                    {typeof err === "string"
                      ? err
                      : err && err.error
                      ? err.error
                      : ""}
                  </div>
                )}
              </form>
            )}

            {/* Step 2: PAN Verification */}
            {step === 2 && (
              <form
                className="row row-2"
                ref={step2Ref} // <-- added
                style={{
                  marginTop: 18,
                  background: "#fff",
                  borderRadius: 8,
                  border: "1.5px solid #43a047",
                  boxShadow: "0 2px 8px rgba(67,160,71,0.08)",
                  padding: 0,
                }}
                onSubmit={handleSubmitStep2}
              >
                <div
                  style={{
                    background: "#43a047",
                    color: "white",
                    padding: "16px 24px",
                    fontWeight: 600,
                    fontSize: 20,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    width: "100%",
                  }}
                >
                  PAN Verification
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 18,
                    padding: "24px",
                  }}
                >
                  <div>
                    <label style={{ fontWeight: 700 }}>
                      3. Type of Organisation /{" "}
                      <span style={{ fontWeight: 400 }}>संगठन के प्रकार</span>
                    </label>
                    <select
                      style={{
                        width: "100%",
                        fontSize: 16,
                        marginTop: 4,
                        padding: "8px 10px",
                        borderRadius: 4,
                        border: "1px solid #bbb",
                      }}
                      required
                      value={orgType}
                      onChange={(e) => setOrgType(e.target.value)}
                    >
                      <option value="">
                        Type of Organisation / संगठन के प्रकार
                      </option>
                      <option value="proprietorship">Proprietorship</option>
                      <option value="partnership">Partnership</option>
                      <option value="company">Company</option>
                      <option value="llp">LLP</option>
                      <option value="society">Society</option>
                      <option value="trust">Trust</option>
                      <option value="huf">HUF</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontWeight: 700 }}>
                      4.1 PAN/ <span style={{ fontWeight: 400 }}>पैन</span>
                    </label>
                    <input
                      placeholder="ENTER PAN NUMBER"
                      value={pan}
                      onChange={(e) => setPan(e.target.value.toUpperCase())}
                      style={{ width: "100%", fontSize: 16, marginTop: 4 }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700 }}>
                      4.1.1 Name of PAN Holder /{" "}
                      <span style={{ fontWeight: 400 }}>पैन धारक का नाम</span>
                    </label>
                    <input
                      placeholder="Name as per PAN"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ width: "100%", fontSize: 16, marginTop: 4 }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700 }}>
                      4.1.2 DOB or DOI as per PAN /{" "}
                      <span style={{ fontWeight: 400 }}>
                        पैन के अनुसार जन्म तिथि या निगमन तिथि
                      </span>
                    </label>
                    <input
                      placeholder="DD/MM/YYYY"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      style={{ width: "100%", fontSize: 16, marginTop: 4 }}
                      required
                    />
                  </div>
                </div>
                {/* Consent and Button */}
                <div style={{ padding: "0 24px 24px 24px", width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 16,
                    }}
                  >
                    <input
                      type="checkbox"
                      id="pan-consent"
                      checked={panConsent}
                      onChange={(e) => setPanConsent(e.target.checked)}
                      style={{
                        width: 18,
                        height: 18,
                        accentColor: "#1976d2",
                        marginTop: 2,
                      }}
                      required
                    />
                    <label
                      htmlFor="pan-consent"
                      style={{
                        userSelect: "none",
                        cursor: "pointer",
                        fontSize: 15,
                        lineHeight: 1.5,
                        fontWeight: 400,
                        flex: 1,
                      }}
                    >
                      I, the holder of the above PAN, hereby give my consent to
                      Ministry of MSME, Government of India, for using my data/
                      information available in the Income Tax Returns filed by
                      me, and also the same available in the GST Returns and
                      also from other Government organizations, for MSME
                      classification and other official purposes, in pursuance
                      of the MSMED Act, 2006.
                    </label>
                  </div>
                  <button
                    className="btn"
                    type="submit"
                    style={{
                      background: "#1976d2",
                      color: "white",
                      fontWeight: 500,
                      fontSize: 17,
                      minWidth: 140,
                      borderRadius: 4,
                      marginTop: 4,
                    }}
                  >
                    PAN Validate
                  </button>
                  {msg && <div className="ok">{msg}</div>}
                  {err && <div className="error">{err}</div>}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div
        style={{
          background: "linear-gradient(120deg, #23235a 60%, #2b267a 100%)",
          color: "white",
          marginTop: 64,
          padding: "48px 0 0 0",
          fontFamily: "Roboto, Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "0 24px 32px 24px",
          }}
        >
          {/* Left: Info */}
          <div style={{ flex: 1, minWidth: 260, marginBottom: 32 }}>
            <div
              style={{
                fontSize: 30,
                fontWeight: 400,
                marginBottom: 18,
                letterSpacing: 0.5,
              }}
            >
              UDYAM REGISTRATION
            </div>
            <div style={{ fontSize: 17, marginBottom: 8 }}>
              Ministry of MSME
              <br />
              Udyog bhawan - New Delhi
            </div>
            <div style={{ fontSize: 17, marginBottom: 8 }}>
              <b>Email:</b> champions@gov.in
            </div>
            <div style={{ fontSize: 17, marginBottom: 8 }}>
              <b>Contact Us</b>
            </div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>
              For Grievances / Problems
            </div>
          </div>
          {/* Center: Services */}
          <div style={{ flex: 1, minWidth: 260, marginBottom: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18 }}>
              Our Services
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontSize: 17,
                lineHeight: 2,
              }}
            >
              <li>› CHAMPIONS</li>
              <li>› MSME Samadhaan</li>
              <li>› MSME Sambandh</li>
              <li>› MSME Dashboard</li>
              <li>› Entrepreneurship Skill Development Programme (ESDP)</li>
            </ul>
          </div>
          {/* Right: Video */}
          <div
            style={{ flex: 1, minWidth: 320, maxWidth: 400, marginBottom: 32 }}
          >
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18 }}>
              Video
            </div>
            <div
              style={{
                background: "#11194a",
                borderRadius: 8,
                padding: 8,
                boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
              }}
            >
              <video
                width="100%"
                height="180"
                controls
                poster={videoPoster}
                style={{ borderRadius: 6, background: "#222" }}
              >
                <source src={myVideo} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid #4a4a8a",
            margin: "0 24px",
            padding: "18px 0 0 0",
            fontSize: 15,
            color: "#e0e0e0",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 15 }}>
            © Copyright <b>Udyam Registration</b>. All Rights Reserved, Website
            Content Managed by Ministry of Micro Small and Medium Enterprises,
            GoI
            <br />
            Website hosted & managed by National Informatics Centre, Ministry of
            Communications and IT, Government of India
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <span
              style={{
                display: "inline-block",
                width: 36,
                height: 36,
                background: "#35357a",
                borderRadius: "50%",
                textAlign: "center",
                lineHeight: "36px",
                fontSize: 22,
                color: "white",
              }}
            >
              ✗
            </span>
            <span
              style={{
                display: "inline-block",
                width: 36,
                height: 36,
                background: "#35357a",
                borderRadius: "50%",
                textAlign: "center",
                lineHeight: "36px",
                fontSize: 22,
                color: "white",
              }}
            >
              ⓕ
            </span>
            <span
              style={{
                display: "inline-block",
                width: 36,
                height: 36,
                background: "#35357a",
                borderRadius: "50%",
                textAlign: "center",
                lineHeight: "36px",
                fontSize: 22,
                color: "white",
              }}
            >
              ⓘ
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

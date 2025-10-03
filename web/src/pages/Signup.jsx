import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { isValidEmail, isValidPassword } from '../utils/validation';
import { FiMail, FiLock, FiUserPlus, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

function PasswordField({
  label = 'Password',
  name,
  value,
  onChange,
  placeholder = '••••••••',
  pending,
  reveal,
  setReveal,
  autoComplete = 'new-password',
  minLength = 6,
  ariaInvalid = false,
}) {
  return (
    <div className="field">
      <FiLock className="icon" aria-hidden />
      <input
        type={reveal ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        minLength={minLength}
        autoComplete={autoComplete}
        aria-invalid={ariaInvalid || undefined}
      />
      <button
        type="button"
        className="trail"
        onClick={() => !pending && setReveal((s) => !s)}
        aria-label={reveal ? 'Hide password' : 'Show password'}
        title={reveal ? 'Hide password' : 'Show password'}
        disabled={pending}
      >
        {reveal ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
}

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [pending, setPending] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (pending) return; // guard double-submits

    setErr('');
    setOk('');

    const eClean = email.trim().toLowerCase();
    if (!isValidEmail(eClean)) return setErr('Please enter a valid email.');
    if (!isValidPassword(pw)) return setErr('Password must be at least 6 characters.');
    if (pw !== pw2) return setErr('Passwords do not match.');

    setPending(true);
    try {
      await api.register(eClean, pw);
      await api.login(eClean, pw);
      setOk('Account created. Redirecting…');
      navigate('/welcome', { replace: true });
    } catch (e) {
      // Keep generic to avoid account enumeration hints
      setErr(e?.message || 'Sign up failed. Please try again.');
    } finally {
      setPending(false);
    }
  }, [pending, email, pw, pw2, navigate]);

  const passwordsMismatch = pw && pw2 && pw !== pw2;

  return (
    <div className="page">
      <form className="card" onSubmit={onSubmit} noValidate>
        <div className="card-head">
          <div className="badge">AS</div>
          <div>
            <h1>Create account</h1>
            <div className="sub">Join and access your dashboard</div>
          </div>
        </div>

        {/* Email */}
        <div className="field">
          <FiMail className="icon" aria-hidden />
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            aria-invalid={!!err && !isValidEmail(email)}
          />
        </div>

        {/* Password */}
        <PasswordField
          label="Password"
          name="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          pending={pending}
          reveal={showPw}
          setReveal={setShowPw}
          autoComplete="new-password"
          ariaInvalid={!!err && !isValidPassword(pw)}
        />

        {/* Confirm Password */}
        <PasswordField
          label="Confirm password"
          name="confirmPassword"
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
          pending={pending}
          reveal={showPw2}
          setReveal={setShowPw2}
          placeholder="Confirm password"
          autoComplete="new-password"
          ariaInvalid={passwordsMismatch}
        />

        {/* Alerts */}
        {err && (
          <div className="alert" role="alert" aria-live="assertive">
            <FiAlertCircle style={{ marginTop: 2 }} />
            <div>{err}</div>
          </div>
        )}
        {!err && ok && (
          <div className="alert ok" role="status" aria-live="polite">
            <FiUserPlus style={{ marginTop: 2 }} />
            <div>{ok}</div>
          </div>
        )}

        {/* Submit */}
        <button className="btn" type="submit" disabled={pending}>
          {pending ? <AiOutlineLoading3Quarters className="spin" /> : <FiUserPlus />}
          {pending ? 'Creating…' : 'Create account'}
        </button>

        <p className="sub" style={{ textAlign: 'center', marginTop: '.8rem' }}>
          Already have an account? <Link className="link" to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

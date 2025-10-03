import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { isValidEmail, isValidPassword } from '../utils/validation';
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

function PasswordField({
  name,
  value,
  onChange,
  pending,
  reveal,
  setReveal,
  placeholder = '••••••••',
  autoComplete = 'current-password',
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

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('secret123');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (pending) return;

    setError('');

    const eClean = email.trim().toLowerCase();
    if (!isValidEmail(eClean)) return setError('Please enter a valid email.');
    if (!isValidPassword(password)) return setError('Password must be at least 6 characters.');

    setPending(true);
    try {
      await login(eClean, password);
      navigate('/welcome', { replace: true });
    } catch (err) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setPending(false);
    }
  }, [pending, email, password, login, navigate]);

  return (
    <div className="page">
      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="card-head">
          <div className="badge">AS</div>
          <div>
            <h1>Authentication System</h1>
            <div className="sub">Login to continue to your dashboard</div>
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
            aria-invalid={!!error && !isValidEmail(email)}
          />
        </div>

        {/* Password */}
        <PasswordField
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          pending={pending}
          reveal={showPw}
          setReveal={setShowPw}
          autoComplete="current-password"
          ariaInvalid={!!error && !isValidPassword(password)}
        />

        {/* Error */}
        {error && (
          <div className="alert" role="alert" aria-live="assertive">
            <FiAlertCircle style={{ marginTop: 2 }} />
            <div>{error}</div>
          </div>
        )}

        {/* Submit */}
        <button className="btn" type="submit" disabled={pending}>
          {pending ? <AiOutlineLoading3Quarters className="spin" /> : <FiLogIn />}
          {pending ? 'Signing in…' : 'Login'}
        </button>

        <p className="sub" style={{ textAlign: 'center', marginTop: '.75rem' }}>
          Don’t have an account? <Link className="link" to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

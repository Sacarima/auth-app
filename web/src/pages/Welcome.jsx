import { useAuth } from '../context/AuthProvider';
import { FiLogOut, FiMail } from 'react-icons/fi';

function initialFromEmail(email='') {
  const ch = email.trim()[0] || 'U';
  return ch.toUpperCase();
}

export default function Welcome() {
  const { user, logout } = useAuth();
  const initial = initialFromEmail(user?.email || '');

  async function handleLogout() {
    try {
      await logout();
      window.location.assign('/login');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="page">
      <div className="card">
        <div className="card-head">
          <div className="avatar">{initial}</div>
          <div>
            <h1>Hello, {user?.email}</h1>
            <div className="sub">You’re securely signed in</div>
          </div>
        </div>

        <div className="row">
          <span className="tag"><FiMail /> {user?.email}</span>
        </div>

        <button className="btn outline" onClick={handleLogout} style={{ marginTop: '1.25rem' }}>
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );
}

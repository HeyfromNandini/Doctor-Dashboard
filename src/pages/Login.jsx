import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    login(email, password);
    navigate('/today', { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">
            <Stethoscope size={40} strokeWidth={1.75} aria-hidden />
          </div>
          <h1>Clinic Portal</h1>
          <p>Doctor Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            <span className="label-text">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@clinic.com"
              autoComplete="email"
              required
            />
          </label>
          <label>
            <span className="label-text">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>
          <button type="submit" className="btn-primary btn-block">Login</button>
          <button type="button" className="btn-link btn-forgot">Forgot Password</button>
        </form>
      </div>
    </div>
  );
}

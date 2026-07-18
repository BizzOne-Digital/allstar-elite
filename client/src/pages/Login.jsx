import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { IconMail, IconLock, IconArrowRight } from '../components/ui/Icons';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb--1" />
        <div className="auth-orb auth-orb--2" />
      </div>
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/logo.png" alt="AllStar Elite" className="auth-logo-img" />
        </div>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-sub">Sign in to your account to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="form-input-wrap">
              <IconMail size={16} className="form-icon" />
              <input
                type="email" className="form-input form-input--icon"
                placeholder="you@email.com" required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-wrap">
              <IconLock size={16} className="form-icon" />
              <input
                type="password" className="form-input form-input--icon"
                placeholder="Your password" required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              />
            </div>
          </div>
          <div className="auth-row">
            <label className="auth-remember">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
          </div>
          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : <>Sign In <IconArrowRight size={18} /></>}
          </button>
        </form>

        <div className="auth-switch">
          Don&apos;t have an account? <Link to="/register" className="auth-link">Create one free</Link>
        </div>
        <div className="auth-back">
          <Link to="/">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}

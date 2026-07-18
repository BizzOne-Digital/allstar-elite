import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { IconLock, IconArrowRight } from '../components/ui/Icons';
import './Auth.css';

export default function ResetPassword() {
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match.');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password: form.password });
      toast.success('Password reset! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset link expired or invalid.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg"><div className="auth-orb auth-orb--1" /><div className="auth-orb auth-orb--2" /></div>
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/logo.png" alt="AllStar Elite" className="auth-logo-img" />
        </div>
        <h1 className="auth-title">Reset Password</h1>
        <p className="auth-sub">Choose a new password for your account.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <div className="form-input-wrap">
              <IconLock size={16} className="form-icon" />
              <input type="password" className="form-input form-input--icon" placeholder="Min. 6 characters" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="form-input-wrap">
              <IconLock size={16} className="form-icon" />
              <input type="password" className="form-input form-input--icon" placeholder="Repeat password" required value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Resetting...' : <>Reset Password <IconArrowRight size={18}/></>}
          </button>
        </form>
        <div className="auth-switch"><Link to="/login" className="auth-link">Back to Login</Link></div>
      </div>
    </div>
  );
}

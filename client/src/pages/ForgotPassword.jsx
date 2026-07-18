import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { IconMail, IconArrowRight } from '../components/ui/Icons';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg"><div className="auth-orb auth-orb--1" /><div className="auth-orb auth-orb--2" /></div>
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/logo.png" alt="AllStar Elite" className="auth-logo-img" />
        </div>
        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <IconMail size={28} style={{ color: 'white' }} />
            </div>
            <h2 className="auth-title">Check your inbox</h2>
            <p style={{ color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: 24 }}>We sent a reset link to <strong>{email}</strong>. Check your spam folder if you don't see it.</p>
            <Link to="/login" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Back to Login</Link>
          </div>
        ) : (
          <>
            <h1 className="auth-title">Forgot Password</h1>
            <p className="auth-sub">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="form-input-wrap">
                  <IconMail size={16} className="form-icon" />
                  <input type="email" className="form-input form-input--icon" placeholder="you@email.com" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                {loading ? 'Sending...' : <>Send Reset Link <IconArrowRight size={18}/></>}
              </button>
            </form>
            <div className="auth-switch">
              Remember your password? <Link to="/login" className="auth-link">Sign in</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

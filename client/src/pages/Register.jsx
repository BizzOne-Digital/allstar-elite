import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { IconUser, IconMail, IconLock, IconArrowRight, IconCheck } from '../components/ui/Icons';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match.');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      toast.success('Account created! Welcome to AllStar Elite.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const perks = ['Free artist profile', 'Built-in music player', 'Fan notification system', 'Upgrade anytime'];

  return (
    <div className="auth-page auth-page--register">
      <div className="auth-bg">
        <div className="auth-orb auth-orb--1" />
        <div className="auth-orb auth-orb--2" />
      </div>
      <div className="auth-card auth-card--wide">
        <div className="auth-card__left">
          <div className="auth-logo">
            <img src="/logo.png" alt="AllStar Elite" className="auth-logo-img" />
          </div>
          <h2>Start your music journey today</h2>
          <p>Join thousands of independent artists distributing and monetizing their music globally.</p>
          <ul className="auth-perks">
            {perks.map(p => (
              <li key={p}><IconCheck size={16} style={{ color: 'var(--orange)', flexShrink: 0 }} /> {p}</li>
            ))}
          </ul>
          <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80" alt="Music Studio" className="auth-promo-img" />
        </div>

        <div className="auth-card__right">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-sub">Free forever. Upgrade when you're ready.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="form-input-wrap">
                <IconUser size={16} className="form-icon" />
                <input type="text" className="form-input form-input--icon" placeholder="Your artist name" required
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="form-input-wrap">
                <IconMail size={16} className="form-icon" />
                <input type="email" className="form-input form-input--icon" placeholder="you@email.com" required
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-wrap">
                <IconLock size={16} className="form-icon" />
                <input type="password" className="form-input form-input--icon" placeholder="Min. 6 characters" required
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="form-input-wrap">
                <IconLock size={16} className="form-icon" />
                <input type="password" className="form-input form-input--icon" placeholder="Repeat password" required
                  value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} />
              </div>
            </div>

            <p style={{ fontSize: '.78rem', color: 'var(--gray-400)', marginBottom: 16 }}>
              By creating an account, you agree to our <a href="#" style={{ color: 'var(--orange)' }}>Terms</a> and <a href="#" style={{ color: 'var(--orange)' }}>Privacy Policy</a>.
            </p>
            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? 'Creating Account...' : <>Create Free Account <IconArrowRight size={18} /></>}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

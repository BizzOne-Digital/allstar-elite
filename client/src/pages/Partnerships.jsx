import { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import useReveal from '../hooks/useReveal';
import { IconCrown, IconTrendingUp, IconUsers, IconCheck, IconArrowRight } from '../components/ui/Icons';
import './Partnerships.css';

export default function Partnerships() {
  useReveal();
  const [form, setForm] = useState({ brandName: '', contactName: '', email: '', phone: '', budget: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/brand-inquiries', form);
      setSent(true);
      toast.success('Inquiry sent! We\'ll be in touch soon.');
    } catch {
      toast.error('Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="partnerships-page page-enter">
      {/* Hero */}
      <div className="partnerships-hero">
        <div className="partnerships-hero__bg" />
        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <div className="section-label" style={{ margin: '0 auto 16px' }}><IconCrown size={14}/> Brand Partnerships</div>
          <h1 className="section-title">Partner with independent <span className="grad-text">artists</span></h1>
          <p className="section-sub" style={{ margin: '16px auto 0' }}>
            Connect with rising artists on AllStar Elite for sponsorships, brand deals, and collaborations.
          </p>
        </div>
      </div>

      <div className="container partnerships-body">
        {/* How it works */}
        <div className="partnerships-steps reveal-stagger reveal">
          <div className="partnerships-step">
            <IconUsers size={24} style={{ color: 'var(--orange)' }} />
            <h3>Tell us what you need</h3>
            <p>Submit your brand details and campaign goals below.</p>
          </div>
          <div className="partnerships-step">
            <IconTrendingUp size={24} style={{ color: 'var(--orange)' }} />
            <h3>We match you with artists</h3>
            <p>Our team reviews artist stats — streams, listeners, followers — to find the right fit.</p>
          </div>
          <div className="partnerships-step">
            <IconCheck size={24} style={{ color: 'var(--orange)' }} />
            <h3>We connect you directly</h3>
            <p>We introduce you to the artist and help coordinate the partnership.</p>
          </div>
        </div>

        {/* Form */}
        <div className="partnerships-form-wrap reveal">
          {sent ? (
            <div className="dash-empty">
              <IconCheck size={40} style={{ color: 'var(--orange)' }} />
              <h3>Thanks for reaching out!</h3>
              <p>Our team will review your inquiry and get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="settings-form" style={{ maxWidth: 640 }}>
              <div className="settings-form__row">
                <div className="form-group">
                  <label className="form-label">Brand Name</label>
                  <input className="form-input" required value={form.brandName} onChange={e => setForm(f => ({ ...f, brandName: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Name</label>
                  <input className="form-input" required value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} />
                </div>
              </div>
              <div className="settings-form__row">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone (optional)</label>
                  <input className="form-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Estimated Budget (optional)</label>
                <input className="form-input" placeholder="e.g. $1,000 - $5,000" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Tell us about your campaign</label>
                <textarea className="form-input" rows={5} required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="What are you looking for in an artist partnership?" />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Sending...' : <>Submit Inquiry <IconArrowRight size={16}/></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

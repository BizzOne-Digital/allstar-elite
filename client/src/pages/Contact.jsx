import { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { IconMail, IconPhone, IconMapPin, IconArrowRight, IconCheck } from '../components/ui/Icons';
import useReveal from '../hooks/useReveal';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  useReveal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      setSent(true);
      toast.success('Message sent! We\'ll reply within 24 hours.');
    } catch { toast.error('Failed to send. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="contact-page page-enter">
      {/* Header */}
      <div className="contact-hero">
        <div className="contact-hero__bg" />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div className="section-label" style={{ margin: '0 auto 16px' }}><IconMail size={14}/> Get in Touch</div>
          <h1 className="section-title">We&apos;d love to <span className="grad-text">hear from you</span></h1>
          <p className="section-sub" style={{ margin: '0 auto' }}>Have a question? Ready to get started? Our team is here to help.</p>
        </div>
      </div>

      <div className="container contact-body">
        {/* Info Cards */}
        <div className="contact-info reveal-stagger reveal">
          {[
            { icon: <IconMail size={22}/>, label: 'Email Us', value: 'info@allstarelite.com', href: 'mailto:info@allstarelite.com' },
            { icon: <IconPhone size={22}/>, label: 'Call Us', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
            { icon: <IconMapPin size={22}/>, label: 'Visit Us', value: 'Los Angeles, CA', href: null },
          ].map((c, i) => (
            <div className="contact-info-card" key={i}>
              <div className="contact-info-card__icon">{c.icon}</div>
              <div>
                <strong>{c.label}</strong>
                {c.href ? <a href={c.href}>{c.value}</a> : <span>{c.value}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="contact-form-wrap">
          {sent ? (
            <div className="contact-success">
              <div className="contact-success__icon"><IconCheck size={32}/></div>
              <h2>Message Sent!</h2>
              <p>Thank you for reaching out. We typically respond within 24 hours on business days.</p>
              <button className="btn btn-outline" onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                Send Another
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <h2>Send a Message</h2>
              <div className="contact-form__row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select className="form-select" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                  <option value="">Select a topic...</option>
                  <option>Distribution Inquiry</option>
                  <option>Subscription & Billing</option>
                  <option>Technical Support</option>
                  <option>Partnership</option>
                  <option>General Question</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-input" rows={5} required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us how we can help..." />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                {loading ? 'Sending...' : <> Send Message <IconArrowRight size={18}/></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

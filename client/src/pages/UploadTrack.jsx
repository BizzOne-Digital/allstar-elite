import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { IconUpload, IconCrown, IconArrowRight, IconMusic } from '../components/ui/Icons';

export default function UploadTrack() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isSubscriber = !!user?.subscriptionTier && user.subscriptionTier !== 'free';

  const [form, setForm] = useState({ title: '', genre: '', subscriberOnly: false });
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isSubscriber) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div className="dash-locked" style={{ maxWidth: 480, margin: '0 auto' }}>
          <IconCrown size={32} style={{ color: 'var(--gold)' }} />
          <h3>Distribution requires a paid plan</h3>
          <p>Upgrade to Monthly or Yearly to start uploading and distributing your music.</p>
          <Link to="/pricing" className="btn btn-primary">View Plans <IconArrowRight size={16}/></Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audioFile) return toast.error('Please select an audio file.');

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('genre', form.genre);
      fd.append('subscriberOnly', form.subscriberOnly);
      fd.append('audio', audioFile);

      await api.post('/songs', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Track uploaded! It will appear in "My Music" as a draft until you publish it.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '48px 24px', maxWidth: 640 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <IconMusic size={22} style={{ color: 'var(--orange)' }} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>Upload a Track</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Track Title</label>
          <input
            className="form-input"
            required
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Midnight Drive"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Genre</label>
          <input
            className="form-input"
            value={form.genre}
            onChange={e => setForm(f => ({ ...f, genre: e.target.value }))}
            placeholder="e.g. Hip-Hop, Pop, R&B"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Audio File</label>
          <input
            type="file"
            accept="audio/*"
            required
            className="form-input"
            style={{ padding: '10px' }}
            onChange={e => setAudioFile(e.target.files[0])}
          />
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            id="subscriberOnly"
            checked={form.subscriberOnly}
            onChange={e => setForm(f => ({ ...f, subscriberOnly: e.target.checked }))}
          />
          <label htmlFor="subscriberOnly" style={{ fontSize: '.9rem' }}>Make this an exclusive subscriber-only track</label>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Uploading…' : <>Upload Track <IconUpload size={16}/></>}
        </button>
      </form>
    </div>
  );
}

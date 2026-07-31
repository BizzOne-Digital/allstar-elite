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

  const [form, setForm] = useState({
    title: '', genre: '', subscriberOnly: false,
    isrc: '', iswc: '',
    isPreSave: false, releaseDate: '', previewSeconds: 46,
  });
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
      if (form.isrc) fd.append('isrc', form.isrc);
      if (form.iswc) fd.append('iswc', form.iswc);
      fd.append('isPreSave', form.isPreSave);
      if (form.isPreSave) {
        if (form.releaseDate) fd.append('releaseDate', form.releaseDate);
        fd.append('previewSeconds', form.previewSeconds);
      }
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">ISRC (optional)</label>
            <input className="form-input" value={form.isrc} onChange={e => setForm(f => ({ ...f, isrc: e.target.value }))} placeholder="e.g. US-ABC-25-12345" />
          </div>
          <div className="form-group">
            <label className="form-label">ISWC (optional)</label>
            <input className="form-input" value={form.iswc} onChange={e => setForm(f => ({ ...f, iswc: e.target.value }))} placeholder="e.g. T-123456789-0" />
          </div>
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            id="isPreSave"
            checked={form.isPreSave}
            onChange={e => setForm(f => ({ ...f, isPreSave: e.target.checked }))}
          />
          <label htmlFor="isPreSave" style={{ fontSize: '.9rem' }}>This is an upcoming release — enable pre-save</label>
        </div>

        {form.isPreSave && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Release Date</label>
              <input type="date" className="form-input" required value={form.releaseDate} onChange={e => setForm(f => ({ ...f, releaseDate: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Preview Length (seconds)</label>
              <input type="number" min="10" max="90" className="form-input" value={form.previewSeconds} onChange={e => setForm(f => ({ ...f, previewSeconds: e.target.value }))} />
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Uploading…' : <>Upload Track <IconUpload size={16}/></>}
        </button>
      </form>
    </div>
  );
}

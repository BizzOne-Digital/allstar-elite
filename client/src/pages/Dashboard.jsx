import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  IconMusic, IconDollar, IconTrendingUp, IconUsers, IconCrown, IconSettings,
  IconUpload, IconBell, IconArrowRight, IconPlay, IconEdit, IconEye, IconVideo, IconCheck,
} from '../components/ui/Icons';
import './Dashboard.css';

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [songs, setSongs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get('/users/me').then(r => updateUser(r.data.user)).catch(() => {});
    api.get('/songs/mine').then(r => setSongs(r.data.songs || [])).catch(() => {});
    api.get('/orders/mine').then(r => setOrders(r.data.orders || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const youtubeResult = params.get('youtube');
    if (youtubeResult === 'connected') {
      toast.success('YouTube channel connected!');
      setActiveTab('videos');
      window.history.replaceState({}, '', '/dashboard');
    } else if (youtubeResult === 'error') {
      toast.error('Could not connect YouTube. Please try again.');
      setActiveTab('videos');
      window.history.replaceState({}, '', '/dashboard');
    }
  }, []);

  const isSubscriber = !!user?.subscriptionTier && user.subscriptionTier !== 'free';

  const handleTogglePublish = async (song) => {
    const newStatus = song.status === 'published' ? 'draft' : 'published';
    try {
      const res = await api.put(`/songs/${song._id}`, { status: newStatus });
      setSongs(prev => prev.map(s => s._id === song._id ? res.data.song : s));
      toast.success(newStatus === 'published' ? 'Track published!' : 'Track unpublished.');
    } catch {
      toast.error('Could not update track status.');
    }
  };

  return (
    <div className="dashboard page-enter">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar__user">
          <div className="dash-avatar">
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} />
              : <span>{user?.name?.[0]?.toUpperCase()}</span>
            }
          </div>
          <div>
            <strong>{user?.name}</strong>
            <span className={`badge badge-${isSubscriber ? 'gold' : 'gray'}`}>
              {isSubscriber ? <><IconCrown size={11}/> {user.subscriptionTier}</> : 'Free'}
            </span>
            {user?.id && (
              <Link to={`/artist/${user.id}`} style={{ display: 'block', fontSize: '.78rem', color: 'var(--orange)', marginTop: 4 }}>
                View Public Profile →
              </Link>
            )}
          </div>
        </div>

        <nav className="dash-nav">
          {[
            { id: 'overview', label: 'Overview', icon: <IconTrendingUp size={17}/> },
            { id: 'music', label: 'My Music', icon: <IconMusic size={17}/> },
            { id: 'videos', label: 'Videos', icon: <IconVideo size={17}/> },
            { id: 'orders', label: 'My Orders', icon: <IconDollar size={17}/> },
            { id: 'settings', label: 'Settings', icon: <IconSettings size={17}/> },
          ].map(t => (
            <button key={t.id} className={`dash-nav__item${activeTab === t.id ? ' active' : ''}`} onClick={() => setActiveTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </nav>

        {!isSubscriber && (
          <div className="dash-upgrade">
            <IconCrown size={20} style={{ color: 'var(--gold)' }} />
            <strong>Go Pro</strong>
            <p>Distribute your music to 150+ platforms and keep 85% revenue.</p>
            <Link to="/pricing" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: '.85rem' }}>
              Upgrade Now
            </Link>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="dash-main">
        <div className="dash-header">
          <div>
            <h1>Welcome back, <span className="grad-text">{user?.name?.split(' ')[0]}</span></h1>
            <p>Manage your music, orders, and account from here.</p>
          </div>
          {activeTab === 'music' && (
            <Link to="/dashboard/upload" className="btn btn-primary">
              <IconUpload size={16}/> Upload Track
            </Link>
          )}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="dash-stats">
              {[
                { label: 'Total Streams', value: '—', icon: <IconPlay size={20}/>, color: '#F5A623' },
                { label: 'Total Earnings', value: '$0.00', icon: <IconDollar size={20}/>, color: '#E8732A' },
                { label: 'Tracks Uploaded', value: songs.length, icon: <IconMusic size={20}/>, color: '#D94F1E' },
                { label: 'Followers', value: user?.followers?.length || 0, icon: <IconUsers size={20}/>, color: '#F5A623' },
              ].map((s, i) => (
                <div className="dash-stat-card" key={i}>
                  <div className="dash-stat-card__icon" style={{ background: `${s.color}18`, color: s.color }}>
                    {s.icon}
                  </div>
                  <div>
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="dash-section-title">Recent Tracks</div>
            {songs.length === 0 ? (
              <div className="dash-empty">
                <IconMusic size={40} style={{ color: 'var(--gray-300)' }} />
                <h3>No tracks yet</h3>
                <p>Upload your first track to get started.</p>
                {isSubscriber ? (
                  <button className="btn btn-primary" onClick={() => setActiveTab('music')}>Upload Now</button>
                ) : (
                  <Link to="/pricing" className="btn btn-primary">Upgrade to Upload</Link>
                )}
              </div>
            ) : (
              <div className="dash-track-list">
                {songs.slice(0, 5).map(s => (
                  <div className="dash-track" key={s._id}>
                    <div className="dash-track__img">
                      <img src={s.coverUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&q=80'} alt={s.title} />
                    </div>
                    <div className="dash-track__info">
                      <strong>{s.title}</strong>
                      <small>{s.genre} • {s.plays || 0} plays</small>
                    </div>
                    <div className="dash-track__actions">
                      <button className="icon-btn"><IconEdit size={15}/></button>
                      <button className="icon-btn"><IconEye size={15}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Music Tab */}
        {activeTab === 'music' && (
          <div>
            {!isSubscriber && (
              <div className="dash-locked">
                <IconCrown size={32} style={{ color: 'var(--gold)' }} />
                <h3>Distribution requires a paid plan</h3>
                <p>Upgrade to Monthly or Yearly to start distributing your music globally.</p>
                <Link to="/pricing" className="btn btn-primary">View Plans <IconArrowRight size={16}/></Link>
              </div>
            )}
            {isSubscriber && (
              <>
                <div className="dash-section-title">Uploaded Tracks ({songs.length})</div>
                {songs.length === 0 ? (
                  <div className="dash-empty">
                    <IconMusic size={40} style={{ color: 'var(--gray-300)' }} />
                    <p>No tracks uploaded yet.</p>
                    <Link to="/dashboard/upload" className="btn btn-primary">Upload Now</Link>
                  </div>
                ) : (
                  <div className="dash-track-list">
                    {songs.map(s => (
                      <div className="dash-track" key={s._id}>
                        <div className="dash-track__img">
                          <img src={s.coverUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&q=80'} alt={s.title} />
                        </div>
                        <div className="dash-track__info">
                          <strong>{s.title}</strong>
                          <small>{s.genre} • {s.plays || 0} plays • {s.status === 'published' ? '✓ Published' : s.status === 'draft' ? 'Draft' : 'Archived'}</small>
                        </div>
                        <div className="dash-track__actions">
                          <button
                            className="btn btn-outline"
                            style={{ padding: '6px 14px', fontSize: '.78rem' }}
                            onClick={() => handleTogglePublish(s)}
                          >
                            {s.status === 'published' ? 'Unpublish' : 'Publish'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <VideosTab isSubscriber={isSubscriber} />
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="dash-section-title">Order History</div>
            {orders.length === 0 ? (
              <div className="dash-empty">
                <IconDollar size={40} style={{ color: 'var(--gray-300)' }} />
                <p>You haven't placed any orders yet.</p>
                <Link to="/shop" className="btn btn-primary">Browse Shop</Link>
              </div>
            ) : (
              <div className="dash-orders">
                {orders.map(o => (
                  <div className="dash-order" key={o._id}>
                    <div>
                      <strong>Order #{o._id.slice(-6).toUpperCase()}</strong>
                      <small>{new Date(o.createdAt).toLocaleDateString()}</small>
                    </div>
                    <span>${o.total?.toFixed(2)}</span>
                    <span className={`badge badge-${o.status === 'delivered' ? 'green' : 'gold'}`}>{o.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="dash-settings">
            <div className="dash-section-title">Account Settings</div>
            <SettingsForm user={user} updateUser={updateUser} />
          </div>
        )}
      </main>
    </div>
  );
}

function SettingsForm({ user, updateUser }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    artistName: user?.artistName || '',
    genre: user?.genre || '',
    bio: user?.bio || '',
    social: {
      instagram: user?.social?.instagram || '',
      twitter:   user?.social?.twitter || '',
      youtube:   user?.social?.youtube || '',
      spotify:   user?.social?.spotify || '',
    },
  });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/users/profile', form);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    }
    finally { setSaving(false); }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const res = await api.post('/users/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser({ ...user, avatar: res.data.avatar });
      toast.success('Profile picture updated!');
    } catch {
      toast.error('Could not upload picture.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="settings-form">
      <div className="form-group">
        <label className="form-label">Profile Picture</label>
        <div className="settings-avatar-row">
          <div className="dash-avatar" style={{ width: 64, height: 64, fontSize: '1.4rem' }}>
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} />
              : <span>{user?.name?.[0]?.toUpperCase()}</span>
            }
          </div>
          <input type="file" accept="image/*" className="form-input" style={{ padding: '10px' }} onChange={handleAvatarChange} disabled={uploadingAvatar} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Display Name</label>
        <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      </div>
      <div className="settings-form__row">
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" className="form-input" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 555 123 4567" />
        </div>
      </div>
      <div className="settings-form__row">
        <div className="form-group">
          <label className="form-label">Artist Name</label>
          <input className="form-input" value={form.artistName} onChange={e => setForm(f => ({ ...f, artistName: e.target.value }))} placeholder="Shown on your public profile" />
        </div>
        <div className="form-group">
          <label className="form-label">Genre</label>
          <input className="form-input" value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))} placeholder="e.g. Hip-Hop, Pop" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Bio</label>
        <textarea className="form-input" rows={4} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell your fans about yourself..." />
      </div>

      <div className="dash-section-title" style={{ marginTop: 8 }}>Social Links</div>
      <div className="settings-form__row">
        <div className="form-group">
          <label className="form-label">Instagram</label>
          <input className="form-input" value={form.social.instagram} onChange={e => setForm(f => ({ ...f, social: { ...f.social, instagram: e.target.value } }))} placeholder="https://instagram.com/you" />
        </div>
        <div className="form-group">
          <label className="form-label">Twitter / X</label>
          <input className="form-input" value={form.social.twitter} onChange={e => setForm(f => ({ ...f, social: { ...f.social, twitter: e.target.value } }))} placeholder="https://twitter.com/you" />
        </div>
        <div className="form-group">
          <label className="form-label">YouTube</label>
          <input className="form-input" value={form.social.youtube} onChange={e => setForm(f => ({ ...f, social: { ...f.social, youtube: e.target.value } }))} placeholder="https://youtube.com/@you" />
        </div>
        <div className="form-group">
          <label className="form-label">Spotify</label>
          <input className="form-input" value={form.social.spotify} onChange={e => setForm(f => ({ ...f, social: { ...f.social, spotify: e.target.value } }))} placeholder="https://open.spotify.com/artist/..." />
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}

function VideosTab({ isSubscriber }) {
  const [ytStatus, setYtStatus] = useState({ connected: false, channelTitle: null });
  const [connecting, setConnecting] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', isExclusive: true, syncToYoutube: false });
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get('/youtube/status').then(r => setYtStatus(r.data)).catch(() => {});
  }, []);

  const handleConnectYoutube = async () => {
    setConnecting(true);
    try {
      const res = await api.get('/youtube/connect');
      window.location.href = res.data.url;
    } catch {
      toast.error('Could not start YouTube connection.');
      setConnecting(false);
    }
  };

  const handleDisconnectYoutube = async () => {
    try {
      await api.delete('/youtube/disconnect');
      setYtStatus({ connected: false, channelTitle: null });
      toast.success('YouTube disconnected.');
    } catch {
      toast.error('Something went wrong.');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile) return toast.error('Please select a video file.');

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('isExclusive', form.isExclusive);
      fd.append('video', videoFile);

      const res = await api.post('/videos', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Video uploaded!');

      if (form.syncToYoutube && ytStatus.connected) {
        toast('Syncing to YouTube — this can take a minute...', { icon: '⏳' });
        try {
          await api.post('/youtube/upload-from-url', {
            videoUrl: res.data.video.videoUrl,
            title: form.title,
            description: form.description,
          });
          toast.success('Synced to YouTube!');
        } catch {
          toast.error('Video uploaded, but YouTube sync failed.');
        }
      }

      setForm({ title: '', description: '', isExclusive: true, syncToYoutube: false });
      setVideoFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  if (!isSubscriber) {
    return (
      <div className="dash-locked">
        <IconCrown size={32} style={{ color: 'var(--gold)' }} />
        <h3>Video uploads require a paid plan</h3>
        <p>Upgrade to Monthly or Yearly to upload exclusive videos and sync them to YouTube.</p>
        <Link to="/pricing" className="btn btn-primary">View Plans <IconArrowRight size={16}/></Link>
      </div>
    );
  }

  return (
    <div>
      <div className="dash-section-title">YouTube Sync</div>
      <div className="settings-form" style={{ maxWidth: 560, marginBottom: 32 }}>
        {ytStatus.connected ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <IconCheck size={20} style={{ color: 'var(--orange)' }} />
              <div>
                <strong style={{ display: 'block' }}>Connected</strong>
                <span style={{ fontSize: '.85rem', color: 'var(--gray-400)' }}>{ytStatus.channelTitle}</span>
              </div>
            </div>
            <button className="btn btn-outline" onClick={handleDisconnectYoutube}>Disconnect</button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ margin: 0, fontSize: '.9rem', color: 'var(--gray-500)' }}>
              Connect your YouTube channel to automatically sync videos you upload here.
            </p>
            <button className="btn btn-primary" onClick={handleConnectYoutube} disabled={connecting}>
              {connecting ? 'Redirecting…' : 'Connect YouTube'}
            </button>
          </div>
        )}
      </div>

      <div className="dash-section-title">Upload a Video</div>
      <form onSubmit={handleUpload} className="settings-form" style={{ maxWidth: 560 }}>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input className="form-input" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Video File</label>
          <input type="file" accept="video/*" required className="form-input" style={{ padding: '10px' }} onChange={e => setVideoFile(e.target.files[0])} />
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" id="isExclusive" checked={form.isExclusive} onChange={e => setForm(f => ({ ...f, isExclusive: e.target.checked }))} />
          <label htmlFor="isExclusive" style={{ fontSize: '.9rem' }}>Subscriber-only exclusive video</label>
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            id="syncToYoutube"
            checked={form.syncToYoutube}
            disabled={!ytStatus.connected}
            onChange={e => setForm(f => ({ ...f, syncToYoutube: e.target.checked }))}
          />
          <label htmlFor="syncToYoutube" style={{ fontSize: '.9rem' }}>
            Also upload to my YouTube channel {!ytStatus.connected && '(connect YouTube above first)'}
          </label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={uploading}>
          {uploading ? 'Uploading…' : <>Upload Video <IconUpload size={16}/></>}
        </button>
      </form>
    </div>
  );
}

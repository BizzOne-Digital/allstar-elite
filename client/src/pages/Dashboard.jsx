import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  IconMusic, IconDollar, IconTrendingUp, IconUsers, IconCrown, IconSettings,
  IconUpload, IconBell, IconArrowRight, IconPlay, IconEdit, IconEye
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
          </div>
        </div>

        <nav className="dash-nav">
          {[
            { id: 'overview', label: 'Overview', icon: <IconTrendingUp size={17}/> },
            { id: 'music', label: 'My Music', icon: <IconMusic size={17}/> },
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
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/users/profile', form);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch { toast.error('Update failed.'); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSave} className="settings-form">
      <div className="form-group">
        <label className="form-label">Display Name</label>
        <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      </div>
      <div className="form-group">
        <label className="form-label">Bio</label>
        <textarea className="form-input" rows={4} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell your fans about yourself..." />
      </div>
      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { setSiteSettings, DEFAULT_SETTINGS } from '../../hooks/useSiteSettings';
import {
  IconUsers, IconMusic, IconPackage, IconDollar, IconVideo, IconBarChart,
  IconSettings, IconUpload, IconTrash, IconEdit, IconEye, IconCheck, IconX,
  IconCrown, IconBell, IconTrendingUp,
} from '../../components/ui/Icons';
import './AdminPanel.css';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: <IconBarChart size={17}/> },
  { id: 'analytics', label: 'Analytics', icon: <IconTrendingUp size={17}/> },
  { id: 'songs', label: 'Songs', icon: <IconMusic size={17}/> },
  { id: 'products', label: 'Products', icon: <IconPackage size={17}/> },
  { id: 'blog', label: 'Blog', icon: <IconEdit size={17}/> },
  { id: 'partnerships', label: 'Partnerships', icon: <IconCrown size={17}/> },
  { id: 'orders', label: 'Orders', icon: <IconDollar size={17}/> },
  { id: 'users', label: 'Users', icon: <IconUsers size={17}/> },
  { id: 'videos', label: 'Videos', icon: <IconVideo size={17}/> },
  { id: 'upload', label: 'Upload', icon: <IconUpload size={17}/> },
  { id: 'settings', label: 'Settings', icon: <IconSettings size={17}/> },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [songs, setSongs] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [videos, setVideos] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {});
    api.get('/admin/users').then(r => setUsers(r.data.users || [])).catch(() => {});
    api.get('/songs/admin/all').then(r => setSongs(r.data.songs || [])).catch(() => {});
    api.get('/products').then(r => setProducts(r.data.products || [])).catch(() => {});
    api.get('/orders').then(r => setOrders(r.data.orders || [])).catch(() => {});
    api.get('/videos').then(r => setVideos(r.data.videos || [])).catch(() => {});
    api.get('/blog').then(r => setBlogs(r.data.posts || [])).catch(() => {});
    api.get('/brand-inquiries').then(r => setInquiries(r.data.inquiries || [])).catch(() => {});
  }, []);

  const handleDeleteSong = async (id) => {
    if (!confirm('Delete this song?')) return;
    try { await api.delete(`/songs/${id}`); setSongs(s => s.filter(x => x._id !== id)); toast.success('Song deleted.'); }
    catch { toast.error('Failed to delete.'); }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); setProducts(s => s.filter(x => x._id !== id)); toast.success('Product deleted.'); }
    catch { toast.error('Failed to delete.'); }
  };

  const handleSaveProduct = async (id, formData) => {
    try {
      const res = await api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProducts(p => p.map(x => x._id === id ? res.data.product : x));
      toast.success('Product updated.');
      setEditingProduct(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm('Delete this blog post?')) return;
    try { await api.delete(`/blog/${id}`); setBlogs(b => b.filter(x => x._id !== id)); toast.success('Post deleted.'); }
    catch { toast.error('Failed to delete.'); }
  };

  const handleSaveBlog = async (id, formData) => {
    try {
      const res = await api.put(`/blog/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setBlogs(b => b.map(x => x._id === id ? res.data.post : x));
      toast.success('Post updated.');
      setEditingBlog(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    }
  };

  const handleInquiryStatus = async (id, status) => {
    try {
      await api.put(`/brand-inquiries/${id}`, { status });
      setInquiries(i => i.map(x => x._id === id ? { ...x, status } : x));
      toast.success('Inquiry updated.');
    } catch { toast.error('Update failed.'); }
  };

  const handleDeleteInquiry = async (id) => {
    if (!confirm('Delete this inquiry?')) return;
    try { await api.delete(`/brand-inquiries/${id}`); setInquiries(i => i.filter(x => x._id !== id)); toast.success('Inquiry deleted.'); }
    catch { toast.error('Failed to delete.'); }
  };

  const handleOrderStatus = async (id, status) => {
    try { await api.put(`/orders/${id}/status`, { status }); setOrders(o => o.map(x => x._id === id ? { ...x, status } : x)); toast.success('Order updated.'); }
    catch { toast.error('Update failed.'); }
  };

  return (
    <div className="admin">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <img src="/logo.png" alt="AllStar Elite" className="admin-logo-img" />
          <span>ADMIN</span>
        </div>
        <nav className="admin-nav">
          {TABS.map(t => (
            <button key={t.id} className={`admin-nav__item${activeTab === t.id ? ' active' : ''}`} onClick={() => setActiveTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
        <a href="/" className="admin-nav__back">← Back to site</a>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h2>{TABS.find(t => t.id === activeTab)?.label}</h2>
          <span className="badge badge-gold"><IconCrown size={11}/> Admin</span>
        </div>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="admin-stats">
              {[
                { label: 'Total Users', value: stats.users || 0, icon: <IconUsers size={22}/>, color: '#F5A623' },
                { label: 'Total Songs', value: stats.songs || 0, icon: <IconMusic size={22}/>, color: '#E8732A' },
                { label: 'Total Orders', value: stats.orders || 0, icon: <IconPackage size={22}/>, color: '#D94F1E' },
                { label: 'Revenue', value: `$${(stats.revenue || 0).toFixed(2)}`, icon: <IconDollar size={22}/>, color: '#F5A623' },
                { label: 'Subscribers', value: stats.subscribers || 0, icon: <IconCrown size={22}/>, color: '#E8732A' },
                { label: 'Videos', value: stats.videos || 0, icon: <IconVideo size={22}/>, color: '#D94F1E' },
              ].map((s, i) => (
                <div className="admin-stat" key={i}>
                  <div className="admin-stat__icon" style={{ background: `${s.color}18`, color: s.color }}>{s.icon}</div>
                  <div>
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="admin-section-title">Recent Users</div>
            <AdminTable
              cols={['Name', 'Email', 'Plan', 'Joined']}
              rows={users.slice(0, 8).map(u => [
                u.name, u.email,
                <span className={`badge badge-${!u.subscriptionTier || u.subscriptionTier === 'free' ? 'gray' : 'gold'}`}>{u.subscriptionTier || 'free'}</span>,
                new Date(u.createdAt).toLocaleDateString()
              ])}
            />
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === 'analytics' && (
          <div>
            <div className="admin-section-title">Best-Selling Products</div>
            <AdminTable
              cols={['Product', 'Price', 'Units Sold', 'Revenue', 'Stock Left', 'Status']}
              rows={[...products]
                .sort((a, b) => (b.sold || 0) - (a.sold || 0))
                .map(p => [
                  p.name,
                  `$${p.price?.toFixed ? p.price.toFixed(2) : p.price}`,
                  p.sold || 0,
                  `$${((p.sold || 0) * (p.price || 0)).toFixed(2)}`,
                  p.stock,
                  p.sold > 0
                    ? <span className="badge badge-green">Selling</span>
                    : <span className="badge badge-gray">No sales yet</span>,
                ])}
            />

            <div className="admin-section-title" style={{ marginTop: 32 }}>Products Needing Attention</div>
            <p style={{ fontSize: '.85rem', color: 'var(--gray-400)', marginTop: -10, marginBottom: 16 }}>
              High stock, zero (or very low) sales — consider a discount, better photos, or replacing these.
            </p>
            <AdminTable
              cols={['Product', 'Price', 'Units Sold', 'Stock Left']}
              rows={[...products]
                .filter(p => p.stock > 0)
                .sort((a, b) => (a.sold || 0) - (b.sold || 0) || b.stock - a.stock)
                .slice(0, 5)
                .map(p => [
                  p.name,
                  `$${p.price?.toFixed ? p.price.toFixed(2) : p.price}`,
                  p.sold || 0,
                  p.stock,
                ])}
            />

            <div className="admin-section-title" style={{ marginTop: 32 }}>Top Songs by Streams</div>
            <AdminTable
              cols={['Song', 'Artist', 'Streams', 'Listeners', 'Status']}
              rows={[...songs]
                .sort((a, b) => (b.plays || 0) - (a.plays || 0))
                .slice(0, 10)
                .map(s => [
                  s.title,
                  s.artist?.artistName || s.artist?.name || s.artistName || '—',
                  s.plays || 0,
                  s.listeners?.length || 0,
                  <span className={`badge badge-${s.status === 'published' ? 'green' : 'gray'}`}>{s.status}</span>,
                ])}
            />
          </div>
        )}

        {/* SONGS */}
        {activeTab === 'songs' && (
          <div>
            <AdminTable
              cols={['Cover', 'Title', 'Artist', 'Genre', 'Plays', 'Status', 'Actions']}
              rows={songs.map(s => [
                <img src={s.coverUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&q=80'} style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} alt="" />,
                s.title, s.artist?.artistName || s.artist?.name || s.artistName || '—', s.genre || '—', s.plays || 0,
                <span className={`badge badge-${s.status === 'published' ? 'green' : 'gray'}`}>{s.status}</span>,
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="icon-btn-admin" title="Delete" onClick={() => handleDeleteSong(s._id)}><IconTrash size={14}/></button>
                </div>
              ])}
            />
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === 'products' && (
          <div>
            <div className="admin-toolbar">
              <button className="btn btn-primary" style={{ padding: '9px 20px', fontSize: '.85rem' }} onClick={() => setActiveTab('upload')}>
                <IconUpload size={15}/> Add Product
              </button>
            </div>
            <AdminTable
              cols={['Image', 'Name', 'Category', 'Price', 'Stock', 'Actions']}
              rows={products.map(p => [
                <img src={p.images?.[0]?.url || ''} style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} alt="" />,
                p.name, p.category, `$${p.price}`, p.stock,
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="icon-btn-admin" title="Edit" onClick={() => setEditingProduct(p)}><IconEdit size={14}/></button>
                  <button className="icon-btn-admin" title="Delete" onClick={() => handleDeleteProduct(p._id)}><IconTrash size={14}/></button>
                </div>
              ])}
            />
          </div>
        )}

        {editingProduct && (
          <EditProductModal
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={handleSaveProduct}
          />
        )}

        {/* BLOG */}
        {activeTab === 'blog' && (
          <div>
            <div className="admin-toolbar">
              <button className="btn btn-primary" style={{ padding: '9px 20px', fontSize: '.85rem' }} onClick={() => setActiveTab('upload')}>
                <IconUpload size={15}/> New Post
              </button>
            </div>
            <AdminTable
              cols={['Cover', 'Title', 'Category', 'Published', 'Date', 'Actions']}
              rows={blogs.map(b => [
                <img src={b.coverImage?.url || ''} style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} alt="" />,
                b.title, b.category,
                <span className={`badge badge-${b.isPublished ? 'green' : 'gray'}`}>{b.isPublished ? 'Yes' : 'Draft'}</span>,
                new Date(b.createdAt).toLocaleDateString(),
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="icon-btn-admin" title="Edit" onClick={() => setEditingBlog(b)}><IconEdit size={14}/></button>
                  <button className="icon-btn-admin" title="Delete" onClick={() => handleDeleteBlog(b._id)}><IconTrash size={14}/></button>
                </div>
              ])}
            />
          </div>
        )}

        {/* PARTNERSHIPS */}
        {activeTab === 'partnerships' && (
          <AdminTable
            cols={['Brand', 'Contact', 'Email', 'Budget', 'Status', 'Date', 'Actions']}
            rows={inquiries.map(inq => [
              <span title={inq.message}>{inq.brandName}</span>, inq.contactName, inq.email, inq.budget || '—',
              <select className="form-select" style={{ fontSize: '.78rem', padding: '4px 8px', width: 110 }} value={inq.status}
                onChange={e => handleInquiryStatus(inq._id, e.target.value)}>
                {['new', 'contacted', 'closed'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>,
              new Date(inq.createdAt).toLocaleDateString(),
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="icon-btn-admin" title="Delete" onClick={() => handleDeleteInquiry(inq._id)}><IconTrash size={14}/></button>
              </div>
            ])}
          />
        )}

        {editingBlog && (
          <EditBlogModal
            post={editingBlog}
            onClose={() => setEditingBlog(null)}
            onSave={handleSaveBlog}
          />
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <AdminTable
            cols={['Order ID', 'User', 'Total', 'Status', 'Date', 'Actions']}
            rows={orders.map(o => [
              `#${o._id.slice(-6).toUpperCase()}`,
              o.user?.name || '—',
              `$${o.total?.toFixed(2)}`,
              <span className={`badge badge-${o.status === 'delivered' ? 'green' : o.status === 'cancelled' ? 'red' : 'gold'}`}>{o.status}</span>,
              new Date(o.createdAt).toLocaleDateString(),
              <select className="form-select" style={{ fontSize: '.78rem', padding: '4px 8px', width: 120 }} value={o.status}
                onChange={e => handleOrderStatus(o._id, e.target.value)}>
                {['pending','processing','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            ])}
          />
        )}

        {/* USERS */}
        {activeTab === 'users' && (
          <AdminTable
            cols={['Name', 'Email', 'Role', 'Plan', 'Followers', 'Joined']}
            rows={users.map(u => [
              u.name, u.email,
              <span className={`badge badge-${u.role === 'admin' ? 'red' : 'gray'}`}>{u.role}</span>,
              <span className={`badge badge-${!u.subscriptionTier || u.subscriptionTier === 'free' ? 'gray' : 'gold'}`}>{u.subscriptionTier || 'free'}</span>,
              u.followers?.length || 0,
              new Date(u.createdAt).toLocaleDateString()
            ])}
          />
        )}

        {/* VIDEOS */}
        {activeTab === 'videos' && (
          <AdminTable
            cols={['Thumbnail', 'Title', 'Access', 'Views', 'Actions']}
            rows={videos.map(v => [
              <img src={v.thumbnail || ''} style={{ width: 60, height: 40, borderRadius: 6, objectFit: 'cover' }} alt="" />,
              v.title,
              <span className={`badge badge-${v.isExclusive ? 'gold' : 'gray'}`}>{v.isExclusive ? 'Exclusive' : 'Public'}</span>,
              v.views || 0,
              <button className="icon-btn-admin"><IconTrash size={14}/></button>
            ])}
          />
        )}

        {/* UPLOAD */}
        {activeTab === 'upload' && (
          <UploadForm onDone={(type) => setActiveTab(type === 'blog' ? 'blog' : type === 'song' ? 'songs' : 'products')} onBlogCreated={(post) => setBlogs(b => [post, ...b])} />
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && <SettingsPanel />}
      </main>
    </div>
  );
}

function EditProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState({
    name: product.name || '',
    price: product.price ?? '',
    category: product.category || 'apparel',
    stock: product.stock ?? '',
    description: product.description || '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(product.images?.[0]?.url || '');
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('price', Number(form.price));
    fd.append('category', form.category);
    fd.append('stock', Number(form.stock));
    fd.append('description', form.description);
    if (image) fd.append('images', image);
    await onSave(product._id, fd);
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-card__header">
          <h3>Edit Product</h3>
          <button className="icon-btn-admin" onClick={onClose}><IconX size={16}/></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input type="number" step="0.01" className="form-input" required value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Stock</label>
              <input type="number" className="form-input" required value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              <option value="apparel">Apparel</option>
              <option value="accessories">Accessories</option>
              <option value="music">Music</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Product Image</label>
            {preview && (
              <img src={preview} alt="Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }} />
            )}
            <input type="file" accept="image/*" className="form-input" style={{ padding: '10px' }} onChange={handleImageChange} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditBlogModal({ post, onClose, onSave }) {
  const [form, setForm] = useState({
    title: post.title || '',
    excerpt: post.excerpt || '',
    content: post.content || '',
    category: post.category || 'Tips & Strategy',
    readTime: post.readTime || '5 min read',
    isPublished: post.isPublished !== false,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(post.coverImage?.url || '');
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('excerpt', form.excerpt);
    fd.append('content', form.content);
    fd.append('category', form.category);
    fd.append('readTime', form.readTime);
    fd.append('isPublished', form.isPublished);
    if (image) fd.append('image', image);
    await onSave(post._id, fd);
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-card__header">
          <h3>Edit Blog Post</h3>
          <button className="icon-btn-admin" onClick={onClose}><IconX size={16}/></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="Tips & Strategy">Tips & Strategy</option>
                <option value="Education">Education</option>
                <option value="Monetization">Monetization</option>
                <option value="Merchandise">Merchandise</option>
                <option value="Rights">Rights</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Read Time</label>
              <input className="form-input" value={form.readTime} onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Excerpt</label>
            <textarea className="form-input" rows={2} required value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea className="form-input" rows={8} required value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Cover Image</label>
            {preview && (
              <img src={preview} alt="Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }} />
            )}
            <input type="file" accept="image/*" className="form-input" style={{ padding: '10px' }} onChange={handleImageChange} />
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" id="isPublished" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} />
            <label htmlFor="isPublished" style={{ fontSize: '.9rem' }}>Published (visible on site)</label>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SettingsPanel() {
  const { user, updateUser } = useAuth();
  const [site, setSite] = useState(DEFAULT_SETTINGS);
  const [account, setAccount] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState('');

  useEffect(() => {
    api.get('/settings')
      .then(r => setSite(s => ({ ...s, ...r.data.settings, social: { ...s.social, ...r.data.settings?.social } })))
      .catch(() => toast.error('Could not load website settings.'));
    api.get('/users/me').then(r => {
      const u = r.data.user;
      setAccount({ name: u.name || '', email: u.email || '', phone: u.phone || '' });
    }).catch(() => {});
  }, []);

  const saveSite = async (e) => {
    e.preventDefault();
    setSaving('site');
    try {
      const { contactEmail, contactPhone, address, social } = site;
      const res = await api.put('/settings', { contactEmail, contactPhone, address, social });
      setSiteSettings(res.data.settings);
      toast.success('Website contact info updated.');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed.'); }
    finally { setSaving(''); }
  };

  const saveAccount = async (e) => {
    e.preventDefault();
    setSaving('account');
    try {
      const res = await api.put('/users/profile', account);
      updateUser(res.data.user);
      toast.success('Account details updated.');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed.'); }
    finally { setSaving(''); }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pwd.newPassword.length < 6) return toast.error('New password must be at least 6 characters.');
    if (pwd.newPassword !== pwd.confirm) return toast.error('New passwords do not match.');
    setSaving('pwd');
    try {
      const res = await api.put('/auth/update-password', { currentPassword: pwd.currentPassword, newPassword: pwd.newPassword });
      if (res.data.token) localStorage.setItem('ae_token', res.data.token);
      setPwd({ currentPassword: '', newPassword: '', confirm: '' });
      toast.success('Password changed.');
    } catch (err) { toast.error(err.response?.data?.message || 'Password change failed.'); }
    finally { setSaving(''); }
  };

  const setSocial = (k, v) => setSite(s => ({ ...s, social: { ...s.social, [k]: v } }));
  const hint = { fontSize: '.85rem', color: 'var(--gray-400)', marginTop: -8, marginBottom: 18 };
  const twoCol = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };

  return (
    <div style={{ display: 'grid', gap: 28 }}>
      <form className="upload-form" onSubmit={saveSite}>
        <div className="admin-section-title">Website Contact Info</div>
        <p style={hint}>Shown in the footer, Contact page and legal pages.</p>
        <div className="form-group">
          <label className="form-label">Contact Email</label>
          <input type="email" className="form-input" required value={site.contactEmail} onChange={e => setSite(s => ({ ...s, contactEmail: e.target.value }))} />
        </div>
        <div style={twoCol}>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-input" value={site.contactPhone} onChange={e => setSite(s => ({ ...s, contactPhone: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Location / Address</label>
            <input className="form-input" value={site.address} onChange={e => setSite(s => ({ ...s, address: e.target.value }))} />
          </div>
        </div>
        <div style={twoCol}>
          {[['instagram', 'Instagram URL'], ['facebook', 'Facebook URL'], ['youtube', 'YouTube URL'], ['twitter', 'X / Twitter URL']].map(([k, label]) => (
            <div className="form-group" key={k}>
              <label className="form-label">{label}</label>
              <input type="url" className="form-input" value={site.social[k]} onChange={e => setSocial(k, e.target.value)} placeholder="https://" />
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving === 'site'}>{saving === 'site' ? 'Saving...' : 'Save Contact Info'}</button>
      </form>

      <form className="upload-form" onSubmit={saveAccount}>
        <div className="admin-section-title">Admin Account</div>
        <p style={hint}>This email is the one you use to log in to the admin panel.</p>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input className="form-input" required value={account.name} onChange={e => setAccount(a => ({ ...a, name: e.target.value }))} />
        </div>
        <div style={twoCol}>
          <div className="form-group">
            <label className="form-label">Login Email</label>
            <input type="email" className="form-input" required value={account.email} onChange={e => setAccount(a => ({ ...a, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" value={account.phone} onChange={e => setAccount(a => ({ ...a, phone: e.target.value }))} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving === 'account'}>{saving === 'account' ? 'Saving...' : 'Save Account'}</button>
      </form>

      <form className="upload-form" onSubmit={savePassword}>
        <div className="admin-section-title">Change Password</div>
        <div className="form-group">
          <label className="form-label">Current Password</label>
          <input type="password" className="form-input" required autoComplete="current-password" value={pwd.currentPassword} onChange={e => setPwd(p => ({ ...p, currentPassword: e.target.value }))} />
        </div>
        <div style={twoCol}>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" className="form-input" required autoComplete="new-password" value={pwd.newPassword} onChange={e => setPwd(p => ({ ...p, newPassword: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input type="password" className="form-input" required autoComplete="new-password" value={pwd.confirm} onChange={e => setPwd(p => ({ ...p, confirm: e.target.value }))} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving === 'pwd'}>{saving === 'pwd' ? 'Saving...' : 'Change Password'}</button>
      </form>
    </div>
  );
}

function AdminTable({ cols, rows }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>{cols.map(c => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={cols.length} style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-400)' }}>No data found</td></tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function UploadForm({ onDone, onBlogCreated }) {
  const [type, setType] = useState('product');
  const [form, setForm] = useState({ name: '', price: '', category: 'apparel', stock: '', description: '', excerpt: '', content: '', readTime: '5 min read' });
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      if (type === 'blog') {
        fd.append('title', form.name);
        fd.append('excerpt', form.excerpt);
        fd.append('content', form.content);
        fd.append('category', form.category || 'Tips & Strategy');
        fd.append('readTime', form.readTime || '5 min read');
        if (files.image) fd.append('image', files.image);

        const res = await api.post('/blog', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Blog post published!');
        onBlogCreated?.(res.data.post);
        onDone('blog');
        return;
      }

      Object.entries(form).forEach(([k, v]) => {
        if (v === '' || v === null || v === undefined) return;
        const key = type === 'song' && k === 'category' ? 'genre' : k;
        fd.append(key, v);
      });
      if (files.image) fd.append(type === 'product' ? 'images' : 'image', files.image);
      if (files.audio) fd.append('audio', files.audio);

      if (type === 'product') {
        await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product added!');
      } else {
        await api.post('/songs', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Song uploaded!');
      }
      onDone(type);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="upload-form">
      <div className="upload-form__tabs">
        <button className={type === 'product' ? 'active' : ''} onClick={() => { setType('product'); setForm(f => ({ ...f, category: 'apparel' })); }}>Product</button>
        <button className={type === 'song' ? 'active' : ''} onClick={() => { setType('song'); setForm(f => ({ ...f, category: '' })); }}>Song</button>
        <button className={type === 'blog' ? 'active' : ''} onClick={() => { setType('blog'); setForm(f => ({ ...f, category: 'Tips & Strategy' })); }}>Blog</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">{type === 'product' ? 'Product' : type === 'song' ? 'Song' : 'Post'} {type === 'blog' ? 'Title' : 'Name'}</label>
          <input className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        {type === 'blog' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  <option value="Tips & Strategy">Tips & Strategy</option>
                  <option value="Education">Education</option>
                  <option value="Monetization">Monetization</option>
                  <option value="Merchandise">Merchandise</option>
                  <option value="Rights">Rights</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Read Time</label>
                <input className="form-input" value={form.readTime} onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))} placeholder="e.g. 5 min read" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Excerpt</label>
              <textarea className="form-input" rows={2} required value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Short summary shown on the blog list" />
            </div>
            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea className="form-input" rows={8} required value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Full article content" />
            </div>
            <div className="form-group">
              <label className="form-label">Cover Image</label>
              <input type="file" accept="image/*" onChange={e => setFiles(f => ({ ...f, image: e.target.files[0] }))} className="form-input" style={{ padding: '10px' }} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
          </>
        )}
        {type === 'product' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Price ($)</label>
                <input type="number" step="0.01" className="form-input" required value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock</label>
                <input type="number" className="form-input" required value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="">Select category</option>
                <option value="apparel">Apparel</option>
                <option value="accessories">Accessories</option>
                <option value="music">Music</option>
                <option value="other">Other</option>
              </select>
            </div>
          </>
        )}
        {type === 'song' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Genre</label>
              <input className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Artist</label>
              <input className="form-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
          </div>
        )}
        {type !== 'blog' && (
          <>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Image / Cover (Cloudinary)</label>
              <input type="file" accept="image/*" onChange={e => setFiles(f => ({ ...f, image: e.target.files[0] }))} className="form-input" style={{ padding: '10px' }} />
            </div>
            {type === 'song' && (
              <div className="form-group">
                <label className="form-label">Audio File</label>
                <input type="file" accept="audio/*" onChange={e => setFiles(f => ({ ...f, audio: e.target.files[0] }))} className="form-input" style={{ padding: '10px' }} />
              </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Uploading...' : `Upload ${type === 'product' ? 'Product' : 'Song'}`}
            </button>
          </>
        )}
      </form>
    </div>
  );
}

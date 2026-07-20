import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import useReveal from '../hooks/useReveal';
import { IconSearch, IconUsers, IconMusic, IconArrowRight, IconCrown } from '../components/ui/Icons';
import './Artists.css';

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/users/artists').then(r => setArtists(r.data.artists || [])).catch(() => setArtists([])).finally(() => setLoading(false));
  }, []);

  useReveal([loading]);

  const filtered = artists.filter(a =>
    (a.artistName || a.name).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="artists-page page-enter">
      <div className="artists-hero">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-label" style={{ margin: '0 auto 16px' }}><IconUsers size={14}/> Discover Artists</div>
          <h1 className="section-title">Find your <span className="grad-text">next favorite artist</span></h1>
          <p className="section-sub" style={{ margin: '16px auto 0' }}>Browse independent artists on AllStar Elite and check out their music.</p>

          <div className="artists-search">
            <IconSearch size={16} />
            <input
              type="text"
              placeholder="Search artists by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container artists-body">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray-400)' }}>Loading artists…</div>
        ) : filtered.length === 0 ? (
          <div className="dash-empty">
            <IconUsers size={40} style={{ color: 'var(--gray-300)' }} />
            <h3>No artists found</h3>
            <p>Try a different search.</p>
          </div>
        ) : (
          <div className="artists-grid reveal-stagger reveal">
            {filtered.map(a => (
              <Link to={`/artist/${a._id}`} className="artist-card" key={a._id}>
                <div className="artist-card__avatar">
                  {a.avatar ? <img src={a.avatar} alt={a.name} /> : <span>{a.name?.[0]?.toUpperCase()}</span>}
                </div>
                <h3>{a.artistName || a.name}</h3>
                {a.genre && <span className="badge badge-gold">{a.genre}</span>}
                {a.bio && <p>{a.bio}</p>}
                <div className="artist-card__meta">
                  <IconUsers size={13}/> {a.followers?.length || 0} followers
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Explore More CTA */}
      <div className="artists-cta">
        <div className="artists-cta__bg" />
        <div className="container artists-cta__inner reveal reveal--scale">
          <IconMusic size={32} style={{ color: 'var(--orange)' }} />
          <h2>Explore more music &amp; merch</h2>
          <p>Check out the latest tracks and official merchandise from artists on AllStar Elite.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-primary">
              Browse Music <IconArrowRight size={18}/>
            </Link>
            <Link to="/shop" className="btn btn-outline">
              Visit Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

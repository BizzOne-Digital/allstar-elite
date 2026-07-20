import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import useReveal from '../hooks/useReveal';
import {
  IconPlay, IconMusic, IconUsers, IconHeadphones, IconTrendingUp,
  IconTwitter, IconInstagram, IconYoutube,
} from '../components/ui/Icons';
import './ArtistProfile.css';

export default function ArtistProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/users/${id}/profile`)
      .then(r => {
        setData(r.data);
        setFollowing(r.data.artist.followers?.includes(user?.id));
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  useReveal([loading]);

  const handleFollow = async () => {
    if (!user) return toast.error('Please log in to follow artists.');
    try {
      const res = await api.post(`/users/${id}/follow`);
      setFollowing(res.data.following);
      setData(d => ({ ...d, stats: { ...d.stats, followerCount: res.data.followerCount } }));
    } catch {
      toast.error('Something went wrong.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '120px 0', color: 'var(--gray-400)' }}>Loading profile…</div>;
  }

  if (!data) {
    return <div style={{ textAlign: 'center', padding: '120px 0' }}><h3>Artist not found</h3></div>;
  }

  const { artist, stats, topSongs } = data;

  return (
    <div className="artist-profile page-enter">
      {/* Header */}
      <div className="artist-hero">
        <div className="artist-hero__bg" />
        <div className="container artist-hero__inner">
          <div className="artist-avatar">
            {artist.avatar
              ? <img src={artist.avatar} alt={artist.name} />
              : <span>{artist.name?.[0]?.toUpperCase()}</span>
            }
          </div>
          <h1>{artist.artistName || artist.name}</h1>
          {artist.genre && <span className="badge badge-gold">{artist.genre}</span>}
          {artist.bio && <p className="artist-bio">{artist.bio}</p>}

          {artist.social && (
            <div className="artist-socials">
              {artist.social.twitter && <a href={artist.social.twitter} target="_blank" rel="noreferrer"><IconTwitter size={18}/></a>}
              {artist.social.instagram && <a href={artist.social.instagram} target="_blank" rel="noreferrer"><IconInstagram size={18}/></a>}
              {artist.social.youtube && <a href={artist.social.youtube} target="_blank" rel="noreferrer"><IconYoutube size={18}/></a>}
              {artist.social.spotify && <a href={artist.social.spotify} target="_blank" rel="noreferrer"><IconMusic size={18}/></a>}
            </div>
          )}

          {user?.id !== artist._id && (
            <button className={`btn ${following ? 'btn-outline' : 'btn-primary'}`} onClick={handleFollow} style={{ marginTop: 20 }}>
              {following ? 'Following' : 'Follow Artist'}
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="container">
        <div className="artist-stats reveal-stagger reveal">
          <div className="artist-stat">
            <IconHeadphones size={22} style={{ color: 'var(--orange)' }} />
            <strong>{stats.totalStreams.toLocaleString()}</strong>
            <span>Total Streams</span>
          </div>
          <div className="artist-stat">
            <IconTrendingUp size={22} style={{ color: 'var(--orange)' }} />
            <strong>{stats.listenerCount.toLocaleString()}</strong>
            <span>Listeners</span>
          </div>
          <div className="artist-stat">
            <IconMusic size={22} style={{ color: 'var(--orange)' }} />
            <strong>{stats.songCount}</strong>
            <span>Songs</span>
          </div>
          <div className="artist-stat">
            <IconUsers size={22} style={{ color: 'var(--orange)' }} />
            <strong>{stats.followerCount.toLocaleString()}</strong>
            <span>Followers</span>
          </div>
        </div>

        {/* Top Songs */}
        <div className="artist-section-title">Top Songs</div>
        {topSongs.length === 0 ? (
          <div className="dash-empty">
            <IconMusic size={40} style={{ color: 'var(--gray-300)' }} />
            <p>No published songs yet.</p>
          </div>
        ) : (
          <div className="player-list reveal-stagger reveal">
            {topSongs.map((s, i) => (
              <div className="player-track" key={s._id}>
                <div className="player-track__num">{i + 1}</div>
                <div className="player-track__art">
                  <img src={s.coverUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&q=80'} alt={s.title} />
                </div>
                <div className="player-track__info">
                  <span>{s.title}</span>
                  <small>{s.genre || 'AllStar Elite Artist'}</small>
                </div>
                <div className="player-track__dur">{(s.plays || 0).toLocaleString()} streams</div>
                <button className="player-track__btn" disabled>
                  <IconPlay size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

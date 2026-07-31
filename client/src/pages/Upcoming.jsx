import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import useReveal from '../hooks/useReveal';
import { IconPlay, IconPause, IconBell, IconCheck, IconMusic } from '../components/ui/Icons';
import './Upcoming.css';

export default function Upcoming() {
  const { user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  const audioRef = useRef(new Audio());
  const timeoutRef = useRef(null);

  useEffect(() => {
    api.get('/songs/upcoming').then(r => setSongs(r.data.songs || [])).catch(() => setSongs([])).finally(() => setLoading(false));
    return () => { audioRef.current.pause(); clearTimeout(timeoutRef.current); };
  }, []);

  useReveal([loading]);

  const playPreview = (song) => {
    clearTimeout(timeoutRef.current);
    if (playingId === song._id) {
      audioRef.current.pause();
      setPlayingId(null);
      return;
    }
    audioRef.current.src = song.audioUrl;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setPlayingId(song._id);

    timeoutRef.current = setTimeout(() => {
      audioRef.current.pause();
      setPlayingId(null);
    }, (song.previewSeconds || 46) * 1000);
  };

  const handlePreSave = async (song) => {
    if (!user) return toast.error('Please log in to pre-save this track.');
    try {
      const res = await api.post(`/songs/${song._id}/presave`);
      setSongs(prev => prev.map(s => s._id === song._id ? { ...s, preSaves: new Array(res.data.count) } : s));
      toast.success('Pre-saved! You\'ll be notified when it drops.');
    } catch {
      toast.error('Could not pre-save. Please try again.');
    }
  };

  return (
    <div className="upcoming-page page-enter">
      <div className="upcoming-hero">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-label" style={{ margin: '0 auto 16px' }}><IconBell size={14}/> Coming Soon</div>
          <h1 className="section-title">Pre-save the <span className="grad-text">next drop</span></h1>
          <p className="section-sub" style={{ margin: '16px auto 0' }}>
            Get a sneak peek and be the first to know when these tracks go live.
          </p>
        </div>
      </div>

      <div className="container upcoming-body">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray-400)' }}>Loading…</div>
        ) : songs.length === 0 ? (
          <div className="dash-empty">
            <IconMusic size={40} style={{ color: 'var(--gray-300)' }} />
            <h3>No upcoming releases right now</h3>
            <p>Check back soon for new pre-save campaigns.</p>
          </div>
        ) : (
          <div className="upcoming-list reveal-stagger reveal">
            {songs.map(s => (
              <div className="upcoming-card" key={s._id}>
                <div className="upcoming-card__art">
                  <img src={s.coverUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80'} alt={s.title} />
                  <button className="upcoming-card__play" onClick={() => playPreview(s)}>
                    {playingId === s._id ? <IconPause size={18}/> : <IconPlay size={18}/>}
                  </button>
                </div>
                <div className="upcoming-card__info">
                  <h3>{s.title}</h3>
                  <span>{s.artist?.artistName || s.artist?.name || 'AllStar Elite Artist'}</span>
                  <small>Releases {new Date(s.releaseDate).toLocaleDateString()} • {s.previewSeconds || 46}s preview</small>
                </div>
                <button className="btn btn-primary" onClick={() => handlePreSave(s)}>
                  <IconCheck size={16}/> Pre-Save
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import useReveal from '../hooks/useReveal';
import {
  IconMusic, IconPlay, IconPause, IconGlobe, IconTrendingUp, IconShield,
  IconCheck, IconArrowRight, IconStar, IconHeadphones, IconVideo, IconBell,
  IconDollar, IconChevronDown, IconSoundwave
} from '../components/ui/Icons';
import './Home.css';

const HERO_STATS = [
  { label: 'Platforms', value: '150+' },
  { label: 'Artists', value: '10K+' },
  { label: 'Revenue Share', value: '85%' },
  { label: 'Countries', value: '180+' },
];

const SERVICES = [
  {
    icon: <IconGlobe size={28} />,
    title: 'Global Distribution',
    desc: 'Get your music on Spotify, Apple Music, Amazon, YouTube Music, and 150+ platforms worldwide within 24–48 hours.',
    color: '#F5A623'
  },
  {
    icon: <IconTrendingUp size={28} />,
    title: 'Revenue Tracking',
    desc: 'Real-time royalty dashboard. See exactly what you earn from every stream, every country, every platform.',
    color: '#E8732A'
  },
  {
    icon: <IconShield size={28} />,
    title: 'Rights Protection',
    desc: 'We protect your music with content ID and takedown services. Your art, your rights — always.',
    color: '#D94F1E'
  },
  {
    icon: <IconVideo size={28} />,
    title: 'Exclusive Videos',
    desc: 'Upload subscriber-only content and earn directly from your most dedicated fans.',
    color: '#F5A623'
  },
  {
    icon: <IconHeadphones size={28} />,
    title: 'Built-in Player',
    desc: 'Showcase your catalog with our custom-branded music player embedded right on your profile.',
    color: '#E8732A'
  },
  {
    icon: <IconBell size={28} />,
    title: 'Fan Notifications',
    desc: 'Push notifications to your fanbase the moment you drop new music, merch, or exclusive content.',
    color: '#D94F1E'
  },
];

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    tag: null,
    desc: 'Get started with no commitment.',
    color: 'var(--gray-800)',
    features: ['Fan profile page', 'Built-in music player', 'Basic fan notifications', '30% revenue share', 'No distribution'],
    disabled: ['Music distribution', 'Exclusive videos', 'Merchandise shop'],
    cta: 'Create Free Account',
    link: '/register',
    outline: true,
  },
  {
    name: 'Monthly',
    price: '$15',
    period: '/song/month',
    tag: 'Most Popular',
    desc: 'Full distribution and fan monetization.',
    color: 'var(--orange)',
    features: ['Everything in Free', 'Distribute to 150+ platforms', '15% revenue share', 'Exclusive subscriber videos', 'Merchandise shop access', 'Priority support', 'Fan notifications'],
    disabled: [],
    cta: 'Start Monthly Plan',
    link: '/register?plan=monthly',
    outline: false,
  },
  {
    name: 'Yearly',
    price: '$60',
    period: '/song/year',
    tag: 'Best Value',
    desc: 'Save big with an annual commitment.',
    color: 'var(--gold)',
    features: ['Everything in Monthly', 'Save vs monthly billing', 'Priority queue distribution', 'Dedicated account manager', 'Advanced analytics', 'Early feature access'],
    disabled: [],
    cta: 'Start Yearly Plan',
    link: '/register?plan=yearly',
    outline: false,
  },
];

const FAQS = [
  { q: 'How long does distribution take?', a: 'Most platforms go live within 24–48 hours. Some platforms like Spotify and Apple Music can take up to 5 business days for first-time releases.' },
  { q: 'Do I keep my rights?', a: 'Absolutely. You retain 100% ownership of your music. AllStar Elite only acts as your distribution partner — we never claim ownership.' },
  { q: 'Can I cancel anytime?', a: 'Yes. Monthly plans can be cancelled at any time. Your music stays live until the end of the billing period.' },
  { q: 'How do I get paid?', a: 'Royalties are collected from all platforms and paid out monthly to your account. We support bank transfer, PayPal, and Stripe.' },
  { q: 'What is the revenue share?', a: 'Free accounts are charged 30% on any earnings. Monthly and Yearly subscribers only pay 15%. You keep the rest.' },
];

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [playing, setPlaying] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [audio] = useState(() => new Audio());

  useEffect(() => {
    api.get('/songs?limit=5').then(r => setSongs(r.data.songs || [])).catch(() => {});
    return () => { audio.pause(); };
  }, []);

  useReveal([songs.length]);

  const playPause = (song) => {
    if (!song.audioUrl) return;
    if (playing === song._id) {
      audio.pause(); setPlaying(null);
    } else {
      audio.src = song.audioUrl; audio.play();
      setPlaying(song._id);
    }
  };

  return (
    <div className="home page-enter">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__orb hero__orb--3" />
          <div className="hero__grid" />
        </div>

        <div className="container hero__inner">
          <div className="hero__content">
            <div className="section-label">
              <IconSoundwave size={14} />
              Music Distribution Platform
            </div>
            <h1 className="hero__title">
              Ain&apos;t Nobody<br />
              <span className="grad-text">Else Like Me</span>
            </h1>
            <p className="hero__sub">
              Distribute your music to 150+ platforms worldwide, sell merchandise, and connect with fans — all from one powerful dashboard.
            </p>
            <div className="hero__actions">
              <Link to="/register" className="btn btn-primary">
                Start For Free <IconArrowRight size={18} />
              </Link>
              <Link to="/services" className="btn btn-outline">
                How It Works
              </Link>
            </div>
            <div className="hero__stats">
              {HERO_STATS.map(s => (
                <div key={s.label} className="hero__stat">
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__card hero__card--player">
              <div className="hero__player-art">
                <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80" alt="Now Playing" />
                <div className="hero__player-overlay">
                  <div className="soundbar">
                    <span/><span/><span/><span/><span/>
                  </div>
                </div>
              </div>
              <div className="hero__player-info">
                <span className="badge badge-gold">Now Playing</span>
                <h3>Latest Drop</h3>
                <p>AllStar Elite Artist</p>
                <div className="hero__player-bar">
                  <div className="hero__player-progress" />
                </div>
              </div>
            </div>
            <div className="hero__card hero__card--stat">
              <IconTrendingUp size={20} style={{ color: 'var(--orange)' }} />
              <strong>+247%</strong>
              <span>Streams this month</span>
            </div>
            <div className="hero__card hero__card--platforms">
              <p>Distributed to</p>
              <strong>150+</strong>
              <span>platforms</span>
            </div>
          </div>
        </div>

        <div className="hero__scroll">
          <span>Scroll to explore</span>
          <IconChevronDown size={16} />
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="section services">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-label"><IconMusic size={14} /> What We Offer</div>
            <h2 className="section-title">Everything an artist <span className="grad-text">needs to grow</span></h2>
            <p className="section-sub">One platform. Complete control. From studio to streaming — we handle the rest.</p>
          </div>
          <div className="services__grid reveal-stagger reveal">
            {SERVICES.map((s, i) => (
              <div className="services__card" key={i}>
                <div className="services__icon" style={{ background: `${s.color}18`, color: s.color }}>
                  {s.icon}
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MUSIC PLAYER ── */}
      <section className="section player-section">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-label"><IconHeadphones size={14} /> Featured Tracks</div>
            <h2 className="section-title">Listen to our <span className="grad-text">artists</span></h2>
          </div>

          <div className="player-list reveal-stagger reveal">
            {songs.length === 0 ? (
              [...Array(3)].map((_, i) => (
                <div className="player-track player-track--demo" key={i}>
                  <div className="player-track__num">{i + 1}</div>
                  <div className="player-track__art">
                    <img src={`https://images.unsplash.com/photo-${['1511671782779-c97d3d27a1d4','1493225457124-a3eb161ffa5f','1514320291840-2e0a9bf2a9ae'][i]}?w=80&q=80`} alt="track" />
                  </div>
                  <div className="player-track__info">
                    <span>Sample Track {i + 1}</span>
                    <small>AllStar Elite Artist</small>
                  </div>
                  <div className="player-track__dur">3:4{i}</div>
                  <button className="player-track__btn" disabled>
                    <IconPlay size={16} />
                  </button>
                </div>
              ))
            ) : songs.map((s, i) => (
              <div className={`player-track${playing === s._id ? ' playing' : ''}`} key={s._id}>
                <div className="player-track__num">{i + 1}</div>
                <div className="player-track__art">
                  <img src={s.coverUrl || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&q=80`} alt={s.title} />
                </div>
                <div className="player-track__info">
                  <span>{s.title}</span>
                  {s.artist?._id ? (
                    <Link to={`/artist/${s.artist._id}`} onClick={e => e.stopPropagation()}>
                      <small>{s.artist?.artistName || s.artist?.name}</small>
                    </Link>
                  ) : (
                    <small>{s.artistName || 'AllStar Elite Artist'}</small>
                  )}
                </div>
                <div className="player-track__dur">{s.duration || '—'}</div>
                <button className="player-track__btn" onClick={() => playPause(s)}>
                  {playing === s._id ? <IconPause size={16} /> : <IconPlay size={16} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section how-it-works">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-label"><IconArrowRight size={14} /> Simple Process</div>
            <h2 className="section-title">Get live in <span className="grad-text">3 simple steps</span></h2>
          </div>
          <div className="steps reveal-stagger reveal">
            <div className="step">
              <div className="step__num">01</div>
              <h3>Create Your Account</h3>
              <p>Sign up free in under 2 minutes. No credit card required to get started.</p>
            </div>
            <div className="step__connector" />
            <div className="step">
              <div className="step__num">02</div>
              <h3>Upload Your Music</h3>
              <p>Upload your tracks, set your release date, and we handle the distribution.</p>
            </div>
            <div className="step__connector" />
            <div className="step">
              <div className="step__num">03</div>
              <h3>Get Paid</h3>
              <p>Earn royalties from 150+ platforms. Track everything in your dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MERCH BANNER ── */}
      <section className="merch-banner">
        <div className="container merch-banner__inner">
          <img src="/img1.png" alt="Merchandise" className="merch-banner__img reveal reveal--left" />
          <div className="merch-banner__content reveal reveal--right">
            <div className="section-label"><IconShield size={14} /> Official Merch</div>
            <h2 className="section-title">Sell your <span className="grad-text">merchandise</span><br/>to fans worldwide</h2>
            <p>Set up your branded shop in minutes. We handle fulfillment — you collect the revenue.</p>
            <Link to="/shop" className="btn btn-primary" style={{ marginTop: 24 }}>
              Browse Shop <IconArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="section pricing-section">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-label"><IconDollar size={14} /> Transparent Pricing</div>
            <h2 className="section-title">Simple, fair <span className="grad-text">pricing</span></h2>
            <p className="section-sub">No hidden fees. No surprises. Start free and upgrade when you're ready.</p>
          </div>
          <div className="pricing-grid reveal-stagger reveal">
            {PLANS.map((plan, i) => (
              <div className={`pricing-card${i === 1 ? ' pricing-card--featured' : ''}`} key={plan.name}>
                {plan.tag && <div className="pricing-card__tag">{plan.tag}</div>}
                <div className="pricing-card__header">
                  <h3>{plan.name}</h3>
                  <div className="pricing-card__price">
                    <span className="pricing-card__amount">{plan.price}</span>
                    <span className="pricing-card__period">{plan.period}</span>
                  </div>
                  <p>{plan.desc}</p>
                </div>
                <ul className="pricing-card__features">
                  {plan.features.map(f => (
                    <li key={f}>
                      <IconCheck size={16} style={{ color: 'var(--orange)', flexShrink: 0 }} /> {f}
                    </li>
                  ))}
                  {plan.disabled.map(f => (
                    <li key={f} className="disabled">
                      <IconCheck size={16} style={{ opacity: 0.3, flexShrink: 0 }} /> {f}
                    </li>
                  ))}
                </ul>
                <Link to={plan.link} className={`btn ${plan.outline ? 'btn-outline' : 'btn-primary'}`} style={{ width: '100%', justifyContent: 'center' }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section testimonials">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-label"><IconStar size={14} /> Artist Reviews</div>
            <h2 className="section-title">What our <span className="grad-text">artists say</span></h2>
          </div>
          <div className="testimonials__grid reveal-stagger reveal">
            {[
              { name: 'Marcus J.', role: 'R&B Artist', text: 'AllStar Elite got my first album on Spotify within 48 hours. The dashboard is clean and the revenue reports are crystal clear.', rating: 5, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80' },
              { name: 'Simone R.', role: 'Hip-Hop Producer', text: 'I switched from another distributor and the difference is night and day. Better revenue share, better support, better platform.', rating: 5, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80' },
              { name: 'Devon T.', role: 'Indie Artist', text: 'The exclusive video feature is a game changer. My subscribers pay monthly and I finally have a steady income from my music.', rating: 5, img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&q=80' },
            ].map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-card__stars">
                  {[...Array(t.rating)].map((_, j) => <IconStar key={j} size={14} filled style={{ color: 'var(--gold)' }} />)}
                </div>
                <p>"{t.text}"</p>
                <div className="testimonial-card__author">
                  <img src={t.img} alt={t.name} />
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section faq-section">
        <div className="container faq-inner">
          <div className="section-header reveal">
            <div className="section-label">FAQ</div>
            <h2 className="section-title">Common <span className="grad-text">questions</span></h2>
          </div>
          <div className="faq-list reveal">
            {FAQS.map((f, i) => (
              <div className={`faq-item${openFaq === i ? ' open' : ''}`} key={i}>
                <button className="faq-item__q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {f.q}
                  <IconChevronDown size={18} className={openFaq === i ? 'rotated' : ''} />
                </button>
                {openFaq === i && <div className="faq-item__a">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <div className="container cta-banner__inner reveal reveal--scale">
          <div className="soundbar" style={{ justifyContent: 'center', height: 36 }}>
            <span/><span/><span/><span/><span/>
          </div>
          <h2>Ready to take your music global?</h2>
          <p>Join 10,000+ independent artists who trust AllStar Elite for their distribution.</p>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '16px 40px' }}>
            Get Started Free <IconArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { IconGlobe, IconTrendingUp, IconShield, IconVideo, IconHeadphones, IconBell, IconArrowRight, IconCheck } from '../components/ui/Icons';
import useReveal from '../hooks/useReveal';
import './Services.css';

const SERVICES = [
  {
    icon: <IconGlobe size={32}/>,
    title: 'Global Music Distribution',
    desc: 'Get your music live on Spotify, Apple Music, Amazon Music, YouTube Music, Tidal, Deezer, and 140+ more platforms — all from one simple upload. We handle the technical delivery, metadata, and ISRC/UPC codes.',
    features: ['150+ streaming platforms', 'Distribution in 24–48 hours', 'Automatic ISRC & UPC codes', 'Scheduled release dates', 'Simultaneous global launch'],
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
  },
  {
    icon: <IconTrendingUp size={32}/>,
    title: 'Royalty & Analytics Dashboard',
    desc: 'Know exactly where your money comes from. Our real-time dashboard shows per-stream earnings, per-country breakdowns, platform-by-platform performance, and trend data.',
    features: ['Real-time royalty tracking', 'Country-by-country breakdown', 'Platform performance data', 'Monthly payment reports', 'Export to CSV'],
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
  },
  {
    icon: <IconVideo size={32}/>,
    title: 'Exclusive Subscriber Videos',
    desc: 'Upload behind-the-scenes content, early releases, studio sessions, and exclusive videos that only paying subscribers can access. Create a new recurring revenue stream from your most loyal fans.',
    features: ['Subscriber-only content', 'Monthly fan subscriptions', 'Custom video pricing', 'HD video support', 'Fan engagement metrics'],
    img: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80',
  },
  {
    icon: <IconShield size={32}/>,
    title: 'Rights & Content Protection',
    desc: 'Your music, your rights — always. We register your content with Content ID to detect and monetize unauthorized uses. You stay the legal owner of everything you create.',
    features: ['YouTube Content ID', 'Automatic takedown requests', '100% rights retention', 'Licensing management', 'Dispute resolution support'],
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80',
  },
];

export default function Services() {
  useReveal();
  return (
    <div className="services-page page-enter">
      {/* Hero */}
      <div className="services-hero">
        <div className="services-hero__bg" />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div className="section-label" style={{ margin: '0 auto 16px' }}>What We Do</div>
          <h1 className="section-title">Everything your music career <span className="grad-text">needs</span></h1>
          <p className="section-sub" style={{ margin: '0 auto 32px' }}>From distribution to monetization — one platform, complete control.</p>
          <Link to="/register" className="btn btn-primary">Start For Free <IconArrowRight size={18}/></Link>
        </div>
      </div>

      {/* Service Sections */}
      <div className="services-body">
        {SERVICES.map((s, i) => (
          <div className={`service-section${i % 2 === 1 ? ' service-section--alt' : ''}`} key={i}>
            <div className="container service-section__inner">
              <div className={`service-section__img reveal ${i % 2 === 1 ? 'reveal--right' : 'reveal--left'}`}>
                <img src={s.img} alt={s.title} />
                <div className="service-section__icon">{s.icon}</div>
              </div>
              <div className={`service-section__content reveal ${i % 2 === 1 ? 'reveal--left' : 'reveal--right'}`}>
                <h2>{s.title}</h2>
                <p>{s.desc}</p>
                <ul className="service-features">
                  {s.features.map(f => (
                    <li key={f}><IconCheck size={15} style={{ color: 'var(--orange)', flexShrink: 0 }} /> {f}</li>
                  ))}
                </ul>
                <Link to="/pricing" className="btn btn-outline" style={{ marginTop: 24 }}>
                  View Pricing <IconArrowRight size={16}/>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

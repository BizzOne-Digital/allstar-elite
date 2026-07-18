import { Link } from 'react-router-dom';
import { IconArrowRight, IconMusic, IconStar, IconUsers, IconGlobe, IconShield, IconDollar, IconHeadphones, IconTrendingUp } from '../components/ui/Icons';
import useReveal from '../hooks/useReveal';
import './About.css';

const WHY_US = [
  { icon: <IconShield size={24}/>, title: 'No Long-Term Contracts', desc: 'Stay because you want to, not because you\'re locked in. Cancel or switch plans anytime.' },
  { icon: <IconDollar size={24}/>, title: 'Fastest Payouts', desc: 'Royalties paid out monthly, straight to your bank account, PayPal, or Stripe — no waiting around.' },
  { icon: <IconHeadphones size={24}/>, title: '24/7 Artist Support', desc: 'Real humans, real fast responses. We\'re here whenever you need help, day or night.' },
  { icon: <IconTrendingUp size={24}/>, title: 'Transparent Analytics', desc: 'See exactly what you earn, from where, and when — no black-box reporting, ever.' },
];

const VALUES = [
  { icon: <IconMusic size={24}/>, title: 'Artist First', desc: 'Every decision starts with what\'s best for the artist. Your success is our mission.' },
  { icon: <IconStar size={24}/>, title: 'Excellence', desc: 'We don\'t settle for good enough. We set a higher standard in everything we do.' },
  { icon: <IconUsers size={24}/>, title: 'Community', desc: 'Building a network of independent artists who support and elevate each other.' },
  { icon: <IconGlobe size={24}/>, title: 'Global Reach', desc: 'Music has no borders. We connect artists with fans on every continent.' },
];

export default function About() {
  useReveal();
  return (
    <div className="about-page page-enter">
      {/* Hero */}
      <div className="about-hero">
        <div className="about-hero__bg" />
        <div className="container about-hero__inner">
          <div>
            <div className="section-label">Our Story</div>
            <h1 className="section-title">Built by artists, <span className="grad-text">for artists</span></h1>
            <p className="section-sub">AllStar Elite was born out of frustration with the traditional music industry. We believe independent artists deserve the same tools, reach, and support as major label artists — without giving up their rights or most of their revenue.</p>
            <Link to="/register" className="btn btn-primary" style={{ marginTop: 28 }}>
              Join the Movement <IconArrowRight size={18}/>
            </Link>
          </div>
          <div className="about-hero__img reveal reveal--right">
            <img src="/about.png" alt="Music Studio" />
          </div>
        </div>
      </div>

      {/* Mission */}
      <section className="about-mission">
        <div className="container about-mission__inner">
          <div className="about-mission__text">
            <div className="section-label">Our Mission</div>
            <h2 className="section-title">Ain&apos;t Nobody <span className="grad-text">Else Like Me</span></h2>
            <p>This isn't just a tagline — it's a mindset. Every artist who joins AllStar Elite is unique. Our platform is built to amplify what makes you different, not mold you into a formula.</p>
            <p style={{ marginTop: 16 }}>We provide the infrastructure so you can focus on what you do best: create.</p>
          </div>
          <div className="about-stats reveal-stagger reveal">
            {[
              { value: '10K+', label: 'Artists on Platform' },
              { value: '150+', label: 'Distribution Platforms' },
              { value: '180+', label: 'Countries Reached' },
              { value: '85%', label: 'Revenue to Artists' },
            ].map((s, i) => (
              <div className="about-stat" key={i}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="container">
          <div className="section-header reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label" style={{ margin: '0 auto 12px' }}>What We Stand For</div>
            <h2 className="section-title">Our <span className="grad-text">core values</span></h2>
          </div>
          <div className="values-grid reveal-stagger reveal">
            {VALUES.map((v, i) => (
              <div className="value-card" key={i}>
                <div className="value-card__icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="about-team">
        <div className="container">
          <div className="section-header reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label" style={{ margin: '0 auto 12px' }}>Why Artists Choose Us</div>
            <h2 className="section-title">Built different, <span className="grad-text">for a reason</span></h2>
          </div>
          <div className="values-grid reveal-stagger reveal">
            {WHY_US.map((v, i) => (
              <div className="value-card" key={i}>
                <div className="value-card__icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container reveal reveal--scale" style={{ textAlign: 'center' }}>
          <h2 className="section-title" style={{ color: 'white' }}>Ready to join <span className="grad-text">AllStar Elite</span>?</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 32 }}>Start free. No credit card. No commitment. Just your music, finally going global.</p>
          <Link to="/register" className="btn" style={{ background: 'white', color: 'var(--orange)', padding: '16px 40px', fontSize: '1.05rem' }}>
            Create Your Free Account <IconArrowRight size={18}/>
          </Link>
        </div>
      </section>
    </div>
  );
}

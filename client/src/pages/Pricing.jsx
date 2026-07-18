import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { IconCheck, IconArrowRight, IconDollar, IconShield, IconGlobe, IconCrown } from '../components/ui/Icons';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import useReveal from '../hooks/useReveal';
import './Pricing.css';

const PLANS = [
  {
    name: 'Free',
    price: 0,
    period: '',
    sub: 'No credit card needed',
    tag: null,
    features: [
      { text: 'Artist profile page', ok: true },
      { text: 'Built-in music player', ok: true },
      { text: 'Fan notification system', ok: true },
      { text: '30% revenue share', ok: true },
      { text: 'Music distribution', ok: false },
      { text: 'Exclusive videos', ok: false },
      { text: 'Merchandise shop', ok: false },
    ],
    cta: 'Start Free',
    link: '/register',
    tier: 'free',
    highlight: false,
  },
  {
    name: 'Monthly',
    price: 15,
    period: '/song/month',
    sub: 'Full distribution, cancel anytime',
    tag: 'Most Popular',
    features: [
      { text: 'Everything in Free', ok: true },
      { text: 'Distribution to 150+ platforms', ok: true },
      { text: '15% revenue share (keep 85%)', ok: true },
      { text: 'Exclusive subscriber videos', ok: true },
      { text: 'Merchandise shop access', ok: true },
      { text: 'Priority support', ok: true },
      { text: 'Advanced fan analytics', ok: true },
    ],
    cta: 'Start Monthly',
    link: '/register?plan=monthly',
    tier: 'monthly',
    highlight: true,
  },
  {
    name: 'Yearly',
    price: 60,
    period: '/song/year',
    sub: 'Best value — save vs monthly',
    tag: 'Best Value',
    features: [
      { text: 'Everything in Monthly', ok: true },
      { text: 'Save significantly vs monthly', ok: true },
      { text: 'Priority queue distribution', ok: true },
      { text: 'Dedicated account manager', ok: true },
      { text: 'Advanced analytics suite', ok: true },
      { text: 'Early feature access', ok: true },
      { text: 'Quarterly strategy call', ok: true },
    ],
    cta: 'Start Yearly',
    link: '/register?plan=yearly',
    tier: 'yearly',
    highlight: false,
  },
];

const COMPARE = [
  { feature: 'Artist Profile Page', free: true, monthly: true, yearly: true },
  { feature: 'Music Player', free: true, monthly: true, yearly: true },
  { feature: 'Fan Notifications', free: true, monthly: true, yearly: true },
  { feature: 'Revenue Share', free: '70%', monthly: '85%', yearly: '85%' },
  { feature: 'Music Distribution', free: false, monthly: '150+ platforms', yearly: '150+ platforms' },
  { feature: 'Exclusive Videos', free: false, monthly: true, yearly: true },
  { feature: 'Merchandise Shop', free: false, monthly: true, yearly: true },
  { feature: 'Priority Support', free: false, monthly: true, yearly: true },
  { feature: 'Account Manager', free: false, monthly: false, yearly: true },
  { feature: 'Strategy Calls', free: false, monthly: false, yearly: 'Quarterly' },
];

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(null);
  useReveal();

  const Tick = ({ val }) => {
    if (val === true) return <IconCheck size={18} style={{ color: 'var(--orange)' }} />;
    if (val === false) return <span style={{ color: 'var(--gray-300)' }}>—</span>;
    return <span style={{ color: 'var(--orange)', fontWeight: 700, fontSize: '.85rem' }}>{val}</span>;
  };

  const handlePlanClick = async (plan) => {
    if (!user) return navigate(plan.link);
    if (plan.tier === 'free' || plan.tier === user.subscriptionTier) return navigate('/dashboard');

    setCheckingOut(plan.tier);
    try {
      const res = await api.post('/subscribe/checkout', { plan: plan.tier });
      window.location.href = res.data.sessionUrl;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not start checkout. Please try again.');
      setCheckingOut(null);
    }
  };

  return (
    <div className="pricing-page page-enter">
      {/* Hero */}
      <div className="pricing-hero">
        <div className="pricing-hero__bg" />
        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <div className="section-label" style={{ margin: '0 auto 16px' }}><IconDollar size={14}/> Transparent Pricing</div>
          <h1 className="section-title">Simple plans for every artist</h1>
          <p className="section-sub" style={{ margin: '0 auto' }}>Start free. Upgrade when you're ready. No hidden fees, ever.</p>
        </div>
      </div>

      {/* Plans */}
      <div className="container pricing-plans reveal-stagger reveal">
        {PLANS.map((plan, i) => (
          <div className={`pricing-plan${plan.highlight ? ' pricing-plan--featured' : ''}`} key={plan.name}>
            {plan.tag && <div className="pricing-plan__tag">{plan.tag}</div>}
            <div className="pricing-plan__header">
              <h2>{plan.name}</h2>
              <div className="pricing-plan__price">
                <span className="pricing-plan__amount">${plan.price}</span>
                <span className="pricing-plan__period">{plan.period}</span>
              </div>
              <p>{plan.sub}</p>
            </div>
            <ul className="pricing-plan__features">
              {plan.features.map(f => (
                <li key={f.text} className={f.ok ? '' : 'off'}>
                  {f.ok
                    ? <IconCheck size={16} style={{ color: 'var(--orange)', flexShrink: 0 }} />
                    : <span style={{ width: 16, height: 16, display: 'inline-block', flexShrink: 0 }} />
                  }
                  {f.text}
                </li>
              ))}
            </ul>
            <button
              className={`btn ${plan.highlight ? 'btn-primary' : 'btn-outline'}`}
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={checkingOut === plan.tier}
              onClick={() => handlePlanClick(plan)}
            >
              {checkingOut === plan.tier
                ? 'Redirecting…'
                : <>{user && plan.tier !== 'free' && plan.tier !== user.subscriptionTier ? `Upgrade to ${plan.name}` : plan.cta} <IconArrowRight size={16}/></>
              }
            </button>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="container pricing-compare">
        <h2 className="section-title reveal" style={{ textAlign: 'center', marginTop: 100, marginBottom: 40 }}>Full <span className="grad-text">feature comparison</span></h2>
        <div className="compare-table-wrap reveal">
          <table className="compare-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Free</th>
                <th className="featured-col">Monthly</th>
                <th>Yearly</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((row, i) => (
                <tr key={i}>
                  <td>{row.feature}</td>
                  <td style={{ textAlign: 'center' }}><Tick val={row.free}/></td>
                  <td style={{ textAlign: 'center' }} className="featured-col"><Tick val={row.monthly}/></td>
                  <td style={{ textAlign: 'center' }}><Tick val={row.yearly}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trust Section */}
      <div className="pricing-trust">
        <div className="container pricing-trust__inner reveal-stagger reveal">
          {[
            { icon: <IconShield size={24}/>, title: 'No Hidden Fees', desc: 'The price you see is the price you pay. No setup fees, no cancellation fees.' },
            { icon: <IconGlobe size={24}/>, title: 'Cancel Anytime', desc: 'Monthly plans can be cancelled at any time. No long-term commitments.' },
            { icon: <IconCrown size={24}/>, title: 'You Own Your Music', desc: 'We are your distribution partner, not your label. 100% of your rights stay with you.' },
          ].map((t, i) => (
            <div className="trust-card" key={i}>
              <div className="trust-card__icon">{t.icon}</div>
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

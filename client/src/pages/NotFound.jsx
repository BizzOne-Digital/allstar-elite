import { Link } from 'react-router-dom';
import { IconArrowRight } from '../components/ui/Icons';

export default function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 24px' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '8rem', lineHeight: 1, background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>404</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', letterSpacing: 1, color: 'var(--dark)', margin: '12px 0 10px' }}>Page Not Found</h1>
      <p style={{ color: 'var(--gray-400)', maxWidth: 360, marginBottom: 32 }}>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary">Back to Home <IconArrowRight size={18}/></Link>
    </div>
  );
}

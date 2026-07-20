import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { IconMenu, IconX, IconCart, IconUser, IconLogout, IconSettings } from '../ui/Icons';
import './Navbar.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/artists', label: 'Artists' },
    { to: '/services', label: 'Services' },
    { to: '/shop', label: 'Shop' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <img src="/logo.png" alt="AllStar Elite" className="navbar__logo-img" />
        </Link>

        {/* Desktop Links */}
        <ul className="navbar__links">
          {navLinks.map(l => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => isActive ? 'active' : ''}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="navbar__actions">
          <Link to="/shop" className="navbar__cart">
            <IconCart size={20} />
            {count > 0 && <span className="navbar__cart-badge">{count}</span>}
          </Link>

          {user ? (
            <div className="navbar__user" onMouseLeave={() => setDropOpen(false)}>
              <button className="navbar__avatar" onClick={() => setDropOpen(d => !d)}>
                {user.avatar
                  ? <img src={user.avatar} alt={user.name} />
                  : <span>{user.name?.[0]?.toUpperCase()}</span>
                }
              </button>
              {dropOpen && (
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-header">
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                  <Link to="/dashboard" onClick={() => setDropOpen(false)}>
                    <IconUser size={15} /> Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setDropOpen(false)}>
                      <IconSettings size={15} /> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout}>
                    <IconLogout size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar__auth">
              <Link to="/login" className="btn btn-outline" style={{ padding: '9px 22px', fontSize: '.88rem' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '9px 22px', fontSize: '.88rem' }}>Join Free</Link>
            </div>
          )}

          <button className="navbar__hamburger" onClick={() => setOpen(o => !o)}>
            {open ? <IconX size={22} /> : <IconMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="navbar__mobile">
          {navLinks.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <div className="navbar__mobile-auth">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>Dashboard</Link>
                <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Join Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

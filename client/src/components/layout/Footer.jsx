import { Link } from 'react-router-dom';
import { IconTwitter, IconInstagram, IconYoutube, IconFacebook, IconMail, IconPhone, IconMapPin } from '../ui/Icons';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <img src="/logo.png" alt="AllStar Elite" className="footer__logo-img" />
            </div>
            <p>Empowering independent artists with world-class music distribution, merchandise, and fan engagement tools.</p>
            <div className="footer__socials">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><IconTwitter size={18}/></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><IconInstagram size={18}/></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><IconYoutube size={18}/></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><IconFacebook size={18}/></a>
            </div>
          </div>

          {/* Company */}
          <div className="footer__col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/about">Our Team</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer__col">
            <h4>Services</h4>
            <ul>
              <li><Link to="/services">Distribution</Link></li>
              <li><Link to="/services">Merchandise</Link></li>
              <li><Link to="/services">Exclusive Videos</Link></li>
              <li><Link to="/partnerships">Brand Partnerships</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4>Contact</h4>
            <ul className="footer__contact">
              <li>
                <IconMail size={15}/>
                <a href="mailto:info@allstarelite.com">info@allstarelite.com</a>
              </li>
              <li>
                <IconPhone size={15}/>
                <a href="tel:+15551234567">+1 (555) 123-4567</a>
              </li>
              <li>
                <IconMapPin size={15}/>
                <span>Los Angeles, CA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} AllStar Elite. All rights reserved.</p>
          <div className="footer__legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

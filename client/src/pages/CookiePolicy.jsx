import useSiteSettings from '../hooks/useSiteSettings';
import './Legal.css';

export default function CookiePolicy() {
  const site = useSiteSettings();
  return (
    <div className="legal-page page-enter container">
      <h1>Cookie Policy</h1>
      <p className="legal-updated">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <p>
        This Cookie Policy explains how AllStar Elite uses cookies and similar technologies on our website.
      </p>

      <h2>1. What Are Cookies</h2>
      <p>
        Cookies are small text files stored on your device that help websites remember information about your visit,
        such as your login session and preferences.
      </p>

      <h2>2. How We Use Cookies</h2>
      <ul>
        <li><strong>Essential cookies:</strong> Keep you logged in and remember items in your shopping cart</li>
        <li><strong>Preference cookies:</strong> Remember settings like your selected view or filters</li>
        <li><strong>Analytics cookies:</strong> Help us understand how the platform is used, so we can improve it</li>
      </ul>

      <h2>3. Managing Cookies</h2>
      <p>
        Most browsers let you control or disable cookies through their settings. Please note that disabling
        essential cookies may prevent parts of the platform (like staying logged in) from working properly.
      </p>

      <h2>4. Changes to This Policy</h2>
      <p>
        We may update this Cookie Policy from time to time to reflect changes in our practices.
      </p>

      <h2>5. Contact</h2>
      <p>
        Questions about our use of cookies? Reach out at <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>
    </div>
  );
}

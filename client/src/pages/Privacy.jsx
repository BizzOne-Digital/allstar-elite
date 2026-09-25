import useSiteSettings from '../hooks/useSiteSettings';
import './Legal.css';

export default function Privacy() {
  const site = useSiteSettings();
  return (
    <div className="legal-page page-enter container">
      <h1>Privacy Policy</h1>
      <p className="legal-updated">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <p>
        This Privacy Policy explains how AllStar Elite ("we", "us", "our") collects, uses, and protects your
        information when you use our platform.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>Account details: name, email address, password (encrypted), profile info you provide</li>
        <li>Payment information, processed securely via Stripe — we do not store your card details</li>
        <li>Content you upload: music, videos, cover art, bio, and social links</li>
        <li>Usage data: songs played, pages visited, and general interaction with the platform</li>
        <li>Order details for merchandise purchases, including shipping address</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To provide and maintain your account and the services you sign up for</li>
        <li>To process payments, subscriptions, and merchandise orders</li>
        <li>To distribute your music to streaming platforms (for paid plans)</li>
        <li>To send account-related emails (order confirmations, password resets, updates)</li>
        <li>To improve the platform and understand how it's used</li>
      </ul>

      <h2>3. Sharing Your Information</h2>
      <p>
        We do not sell your personal information. We share data only with service providers necessary to run the
        platform — such as Stripe (payments), Cloudinary (media hosting), and streaming/distribution partners —
        and only to the extent required to provide our services.
      </p>

      <h2>4. Data Security</h2>
      <p>
        Passwords are encrypted, and we use industry-standard practices to protect your data. No method of
        transmission or storage is 100% secure, but we work to safeguard your information against unauthorized access.
      </p>

      <h2>5. Your Rights</h2>
      <p>
        You can access, update, or delete your account information at any time from your Dashboard settings, or by
        contacting us. You may also request a copy of the data we hold about you.
      </p>

      <h2>6. Cookies</h2>
      <p>
        We use cookies and similar technologies to keep you logged in and understand site usage. See our{' '}
        <a href="/cookies">Cookie Policy</a> for details.
      </p>

      <h2>7. Children's Privacy</h2>
      <p>
        AllStar Elite is not intended for individuals under the age of 13, and we do not knowingly collect
        information from children under 13.
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We'll notify users of significant changes where
        appropriate.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about this policy? Reach out at <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>
    </div>
  );
}

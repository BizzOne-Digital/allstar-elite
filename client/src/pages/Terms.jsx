import useSiteSettings from '../hooks/useSiteSettings';
import './Legal.css';

export default function Terms() {
  const site = useSiteSettings();
  return (
    <div className="legal-page page-enter container">
      <h1>Terms of Service</h1>
      <p className="legal-updated">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <p>
        These Terms of Service ("Terms") govern your access to and use of AllStar Elite (the "Platform"),
        operated by AllStar Elite ("we", "us", "our"). By creating an account or using the Platform, you agree to these Terms.
      </p>

      <h2>1. Your Account</h2>
      <p>
        You must provide accurate information when creating an account and are responsible for keeping your login
        credentials secure. You are responsible for all activity that occurs under your account.
      </p>

      <h2>2. Music Distribution &amp; Ownership</h2>
      <p>
        You retain 100% ownership of the music, videos, and content you upload. By uploading content, you grant
        AllStar Elite a limited, non-exclusive license to distribute, stream, and display that content to fulfil
        the services you've signed up for (e.g. distribution to streaming platforms, hosting on your artist profile).
      </p>
      <p>
        You confirm that you own or have the necessary rights to any content you upload, and that it does not
        infringe on the rights of any third party.
      </p>

      <h2>3. Subscriptions &amp; Payments</h2>
      <p>
        Paid plans (Monthly, Yearly) are billed on a recurring basis until cancelled. You can cancel at any time
        from your dashboard; access continues until the end of the current billing period. Fees are non-refundable
        except where required by law.
      </p>

      <h2>4. Revenue Share</h2>
      <p>
        Revenue share percentages for each plan are outlined on our Pricing page and are subject to change with
        reasonable notice. Payouts to artists are handled according to the terms communicated at the time of your
        agreement with us.
      </p>

      <h2>5. Merchandise Orders</h2>
      <p>
        Orders placed through the Shop are subject to product availability. Prices, shipping estimates, and taxes
        are displayed at checkout. Refunds and exchanges are handled on a case-by-case basis.
      </p>

      <h2>6. Prohibited Conduct</h2>
      <ul>
        <li>Uploading content you do not own or have rights to distribute</li>
        <li>Attempting to manipulate streaming or sales numbers artificially</li>
        <li>Using the Platform for any unlawful purpose</li>
        <li>Interfering with the security or normal operation of the Platform</li>
      </ul>

      <h2>7. Termination</h2>
      <p>
        We may suspend or terminate accounts that violate these Terms. You may close your account at any time by
        contacting our support team.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        The Platform is provided "as is." We are not liable for indirect, incidental, or consequential damages
        arising from your use of the Platform, to the fullest extent permitted by law.
      </p>

      <h2>9. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of the Platform after changes take effect
        constitutes acceptance of the updated Terms.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about these Terms? Reach out at <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>
    </div>
  );
}

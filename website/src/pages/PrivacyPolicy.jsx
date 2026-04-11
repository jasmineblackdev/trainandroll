import React from 'react'
import { Shield } from 'lucide-react'

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '36px' }}>
    <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#1e293b' }}>{title}</h2>
    <div style={{ fontSize: '15px', color: '#475569', lineHeight: '1.7' }}>{children}</div>
  </div>
)

const PrivacyPolicy = () => (
  <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
    {/* Hero */}
    <div style={{ background: 'linear-gradient(135deg, #1e40af, #2563eb)', color: 'white', padding: '64px 0 48px' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <Shield size={36} />
          <h1 style={{ fontSize: '38px', fontWeight: '800' }}>Privacy Policy</h1>
        </div>
        <p style={{ fontSize: '16px', opacity: 0.85, maxWidth: '560px' }}>
          DriveWell is built on a foundation of privacy and trust. Here's exactly how we handle your data.
        </p>
        <p style={{ fontSize: '13px', opacity: 0.65, marginTop: '12px' }}>Last updated: March 27, 2026</p>
      </div>
    </div>

    <div className="container" style={{ maxWidth: '780px', padding: '56px 24px' }}>
      <Section title="1. Information We Collect">
        <p style={{ marginBottom: '10px' }}>We collect information you provide directly, including:</p>
        <ul style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '6px' }}>Account registration data (name, email, CDL number, date of birth)</li>
          <li style={{ marginBottom: '6px' }}>Health metrics you log (blood pressure, weight, glucose, BMI)</li>
          <li style={{ marginBottom: '6px' }}>Daily check-in responses (sleep quality, energy, stress level)</li>
          <li style={{ marginBottom: '6px' }}>Workout activity and engagement data</li>
          <li style={{ marginBottom: '6px' }}>DOT physical dates and history</li>
          <li>Device information and app usage analytics</li>
        </ul>
      </Section>

      <Section title="2. How We Use Your Information">
        <p style={{ marginBottom: '10px' }}>Your data is used to:</p>
        <ul style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '6px' }}>Calculate your DOT Readiness Score and personalized risk assessment</li>
          <li style={{ marginBottom: '6px' }}>Power fleet wellness dashboards (anonymized and aggregated only)</li>
          <li style={{ marginBottom: '6px' }}>Send DOT physical reminders and wellness notifications</li>
          <li style={{ marginBottom: '6px' }}>Improve our workout recommendations</li>
          <li>Generate compliance reports for fleet managers and insurance carriers</li>
        </ul>
        <p style={{ marginTop: '14px' }}>
          <strong>We never sell your personal health data to third parties.</strong> Fleet managers see only
          anonymized, aggregated data unless you explicitly consent to more disclosure.
        </p>
      </Section>

      <Section title="3. HIPAA Compliance">
        <p style={{ marginBottom: '10px' }}>
          DriveWell treats driver health information as Protected Health Information (PHI) under HIPAA guidelines.
          Specifically:
        </p>
        <ul style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '6px' }}>All PHI is encrypted at rest (AES-256) and in transit (TLS 1.3)</li>
          <li style={{ marginBottom: '6px' }}>Fleet admins see first name + last initial only, never full identifying information alongside health metrics</li>
          <li style={{ marginBottom: '6px' }}>Access logs are maintained for all PHI access</li>
          <li>You may request a full copy or deletion of your PHI at any time</li>
        </ul>
      </Section>

      <Section title="4. Data Sharing">
        <p style={{ marginBottom: '10px' }}>We share data only in the following circumstances:</p>
        <ul style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '6px' }}><strong>Fleet managers:</strong> Anonymized wellness summaries for your enrolled fleet</li>
          <li style={{ marginBottom: '6px' }}><strong>Insurance carriers:</strong> Aggregated fleet compliance reports, only when you generate and share them manually</li>
          <li style={{ marginBottom: '6px' }}><strong>Service providers:</strong> Infrastructure vendors (AWS, Stripe) under strict data processing agreements</li>
          <li><strong>Legal requirements:</strong> When required by law or to protect safety</li>
        </ul>
      </Section>

      <Section title="5. Data Retention">
        <p>
          We retain your account data for the duration of your subscription plus 90 days after cancellation.
          Health metrics are retained for 3 years to support longitudinal DOT compliance history.
          You may request earlier deletion at any time through the app's Privacy &amp; Data settings or by emailing
          privacy@drivewell.app.
        </p>
      </Section>

      <Section title="6. Your Rights">
        <p style={{ marginBottom: '10px' }}>You have the right to:</p>
        <ul style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '6px' }}>Access a copy of all data we hold about you</li>
          <li style={{ marginBottom: '6px' }}>Correct inaccurate information</li>
          <li style={{ marginBottom: '6px' }}>Request deletion of your account and data</li>
          <li style={{ marginBottom: '6px' }}>Opt out of analytics and marketing communications</li>
          <li>Lodge a complaint with your state's data protection authority</li>
        </ul>
        <p style={{ marginTop: '14px' }}>
          Exercise any of these rights by visiting <strong>Settings → Privacy &amp; Data</strong> in the app,
          or emailing <a href="mailto:privacy@drivewell.app" style={{ color: '#2563eb' }}>privacy@drivewell.app</a>.
        </p>
      </Section>

      <Section title="7. Cookies & Analytics">
        <p>
          Our website uses minimal first-party cookies for session management and anonymous usage analytics
          (page views, feature engagement). We do not use third-party advertising trackers or sell browsing data.
          You can opt out of analytics in your browser settings.
        </p>
      </Section>

      <Section title="8. Contact">
        <p>
          For privacy questions or requests, contact our Data Privacy Officer at{' '}
          <a href="mailto:privacy@drivewell.app" style={{ color: '#2563eb' }}>privacy@drivewell.app</a> or by mail at:
          DriveWell Inc., 123 Fleet Way, Suite 400, Austin, TX 78701.
        </p>
      </Section>
    </div>
  </div>
)

export default PrivacyPolicy

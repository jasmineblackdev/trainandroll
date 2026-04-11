import React from 'react'
import { FileText } from 'lucide-react'

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '36px' }}>
    <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#1e293b' }}>{title}</h2>
    <div style={{ fontSize: '15px', color: '#475569', lineHeight: '1.7' }}>{children}</div>
  </div>
)

const TermsOfService = () => (
  <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
    <div style={{ background: 'linear-gradient(135deg, #1e40af, #2563eb)', color: 'white', padding: '64px 0 48px' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <FileText size={36} />
          <h1 style={{ fontSize: '38px', fontWeight: '800' }}>Terms of Service</h1>
        </div>
        <p style={{ fontSize: '16px', opacity: 0.85, maxWidth: '560px' }}>
          By using DriveWell, you agree to these terms. Please read them carefully.
        </p>
        <p style={{ fontSize: '13px', opacity: 0.65, marginTop: '12px' }}>Last updated: March 27, 2026</p>
      </div>
    </div>

    <div className="container" style={{ maxWidth: '780px', padding: '56px 24px' }}>
      <Section title="1. Acceptance of Terms">
        <p>
          By accessing or using DriveWell ("Service"), you agree to be bound by these Terms of Service and
          our Privacy Policy. If you do not agree, you may not use the Service. These terms apply to drivers,
          fleet administrators, and all other users.
        </p>
      </Section>

      <Section title="2. Description of Service">
        <p>
          DriveWell provides a health and DOT compliance platform for commercial drivers and fleet operators,
          including: DOT Readiness Scoring, health metric tracking, workout programs, daily check-ins,
          fleet risk dashboards, and compliance reporting tools.
        </p>
        <p style={{ marginTop: '10px', padding: '12px 16px', background: '#fef9c3', borderRadius: '8px', fontSize: '14px', color: '#92400e' }}>
          <strong>Medical Disclaimer:</strong> DriveWell is a wellness and compliance tracking tool, not a
          medical device or healthcare provider. Nothing in the Service constitutes medical advice. Always
          consult a licensed physician for medical decisions.
        </p>
      </Section>

      <Section title="3. Accounts">
        <ul style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '6px' }}>You must provide accurate information and keep it current</li>
          <li style={{ marginBottom: '6px' }}>You are responsible for maintaining the confidentiality of your credentials</li>
          <li style={{ marginBottom: '6px' }}>You must be at least 18 years old to create an account</li>
          <li>Fleet administrators represent that they have authorization to enroll drivers in their organization</li>
        </ul>
      </Section>

      <Section title="4. Subscriptions & Billing">
        <p style={{ marginBottom: '10px' }}>
          Paid plans are billed monthly or annually as selected. All fees are non-refundable except as
          required by law or as described in our Refund Policy.
        </p>
        <ul style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '6px' }}>Free trials are 14 days; no credit card required</li>
          <li style={{ marginBottom: '6px' }}>Subscriptions auto-renew unless cancelled before the renewal date</li>
          <li>We reserve the right to change pricing with 30 days' notice to active subscribers</li>
        </ul>
      </Section>

      <Section title="5. Acceptable Use">
        <p style={{ marginBottom: '10px' }}>You agree not to:</p>
        <ul style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '6px' }}>Submit false health data to manipulate compliance scores</li>
          <li style={{ marginBottom: '6px' }}>Use the Service to harass or discriminate against drivers</li>
          <li style={{ marginBottom: '6px' }}>Reverse engineer, scrape, or attempt to extract our data or algorithms</li>
          <li style={{ marginBottom: '6px' }}>Share your credentials with others or create accounts on behalf of others without consent</li>
          <li>Use the Service in violation of applicable FMCSA, DOT, or HIPAA regulations</li>
        </ul>
      </Section>

      <Section title="6. Data Ownership">
        <p>
          Drivers own their personal health data. Fleet administrators own their fleet configuration and company
          data. DriveWell retains a license to process and display this data to provide the Service. We do not
          claim ownership of your content.
        </p>
      </Section>

      <Section title="7. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, DriveWell's liability for any claim arising from use of
          the Service is limited to the amount you paid in the 12 months preceding the claim. DriveWell is
          not liable for indirect, incidental, or consequential damages, including lost profits or data loss.
        </p>
      </Section>

      <Section title="8. Termination">
        <p>
          You may cancel your subscription at any time through Account Settings. DriveWell may suspend or
          terminate accounts that violate these Terms. Upon termination, your data will be retained per
          our Privacy Policy and then deleted.
        </p>
      </Section>

      <Section title="9. Governing Law">
        <p>
          These Terms are governed by the laws of the State of Texas. Disputes shall be resolved by binding
          arbitration in Austin, Texas, except that either party may seek injunctive relief in court.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          Questions about these Terms? Contact us at{' '}
          <a href="mailto:legal@drivewell.app" style={{ color: '#2563eb' }}>legal@drivewell.app</a>.
        </p>
      </Section>
    </div>
  </div>
)

export default TermsOfService

import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => (
  <footer style={{ background: '#0f172a', color: 'white', padding: '60px 0 32px' }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', marginBottom: '48px' }}>
        {/* Brand */}
        <div>
          <div style={{ marginBottom: '14px' }}>
            <img src="/logo.png" alt="Train&Roll" style={{ height: '40px', width: 'auto' }} />
          </div>
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
            The health & DOT compliance platform built for CDL drivers and the fleets that depend on them.
          </p>
        </div>

        {/* Product */}
        <div>
          <p style={{ fontWeight: '700', fontSize: '14px', marginBottom: '14px', color: '#e2e8f0' }}>Product</p>
          {[['For Drivers', '/drivers'], ['For Fleets', '/fleets'], ['For Trainers', '/trainers'], ['Pilot Program', '/pilot'], ['Pricing', '/pricing']].map(([l, p]) => (
            <Link key={p} to={p} style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>{l}</Link>
          ))}
        </div>

        {/* Features */}
        <div>
          <p style={{ fontWeight: '700', fontSize: '14px', marginBottom: '14px', color: '#e2e8f0' }}>Features</p>
          {['DOT Readiness Score', 'Workout Library', 'Nutrition Tracking', 'Sleep Health', 'Fleet Dashboard', 'Insurance Reports'].map(f => (
            <p key={f} style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>{f}</p>
          ))}
        </div>

        {/* Company */}
        <div>
          <p style={{ fontWeight: '700', fontSize: '14px', marginBottom: '14px', color: '#e2e8f0' }}>Company</p>
          {[['Contact Us', '/contact'], ['Privacy Policy', '/privacy'], ['Terms of Service', '/terms']].map(([l, p]) => (
            <Link key={p} to={p} style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>{l}</Link>
          ))}
          {['Blog', 'Careers'].map(f => (
            <p key={f} style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>{f}</p>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid #1e293b', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ fontSize: '13px', color: '#64748b' }}>© {new Date().getFullYear()} Train&Roll. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/privacy" style={{ fontSize: '13px', color: '#64748b' }}>Privacy Policy</Link>
          <Link to="/terms"   style={{ fontSize: '13px', color: '#64748b' }}>Terms of Service</Link>
          <Link to="/contact" style={{ fontSize: '13px', color: '#64748b' }}>Contact</Link>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer

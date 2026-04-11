import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const links = [
  { to: '/drivers',  label: 'For Drivers'  },
  { to: '/fleets',   label: 'For Fleets'   },
  { to: '/trainers', label: 'For Trainers' },
  { to: '/pilot',    label: 'Pilot'        },
  { to: '/pricing',  label: 'Pricing'      },
  { to: '/contact',  label: 'Contact'      },
]

const Nav = () => {
  const [open, setOpen] = useState(false)
  const loc = useLocation()

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #f3f4f6',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: '64px', justifyContent: 'space-between' }}>
        {/* Brand */}
        <Link to="/">
          <img src="/logo.png" alt="Train&Roll" style={{ height: '40px', width: 'auto' }} />
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', gap: '4px', alignItems: 'center' }} className="desktop-nav">
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              padding: '8px 16px', borderRadius: '8px', fontSize: '15px',
              fontWeight: loc.pathname === l.to ? '600' : '400',
              color: loc.pathname === l.to ? '#2563eb' : '#374151',
              background: loc.pathname === l.to ? '#eff6ff' : 'transparent',
            }}>
              {l.label}
            </Link>
          ))}
          <div style={{ width: '1px', height: '24px', background: '#e5e7eb', margin: '0 8px' }} />
          <a href="#" style={{
            padding: '9px 20px', borderRadius: '8px', fontSize: '15px', fontWeight: '600',
            color: '#374151', background: '#f3f4f6',
          }}>
            Log In
          </a>
          <Link to="/drivers" className="btn-primary" style={{ padding: '9px 20px', fontSize: '15px' }}>
            Download App
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }} className="mobile-menu-btn">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{ padding: '16px 24px 24px', borderTop: '1px solid #f3f4f6', background: 'white' }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} style={{
              display: 'block', padding: '12px 0', fontSize: '16px',
              fontWeight: '500', borderBottom: '1px solid #f3f4f6',
              color: loc.pathname === l.to ? '#2563eb' : '#374151',
            }}>
              {l.label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <a href="#" className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '11px' }}>Log In</a>
            <Link to="/drivers" className="btn-primary" onClick={() => setOpen(false)} style={{ flex: 1, justifyContent: 'center', padding: '11px' }}>Download</Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  )
}

export default Nav

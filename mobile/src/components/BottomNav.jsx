import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Home,
  Dumbbell,
  Utensils,
  ClipboardCheck,
  MoreHorizontal,
  X,
  Moon,
  Activity,
  TrendingUp,
  Bell,
  MapPin,
  Users,
  Brain,
  HeartPulse,
  Watch,
  Trophy,
  User,
  Zap,
  Shield,
  HelpCircle,
  Settings,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const primaryNav = [
  { path: '/',         icon: Home,           label: 'Home'      },
  { path: '/workouts', icon: Dumbbell,       label: 'Workouts'  },
  { path: '/nutrition',icon: Utensils,       label: 'Nutrition' },
  { path: '/checkin',  icon: ClipboardCheck, label: 'Check-In'  },
]

const moreNav = [
  { path: '/sleep-health',    icon: Moon,        label: 'Sleep Health'    },
  { path: '/health-history',  icon: Activity,    label: 'Health History'  },
  { path: '/progress',        icon: TrendingUp,  label: 'Progress'        },
  { path: '/dot-reminders',   icon: Bell,        label: 'DOT Reminders'   },
  { path: '/locations',       icon: MapPin,      label: 'Locations'       },
  { path: '/trainers',        icon: Users,       label: 'Find a Trainer'  },
  { path: '/mental-wellness', icon: Brain,       label: 'Mental Wellness' },
  { path: '/telehealth',      icon: HeartPulse,  label: 'Telehealth'      },
  { path: '/wearables',       icon: Watch,       label: 'Wearables'       },
  { path: '/achievements',    icon: Trophy,      label: 'Achievements'    },
  { path: '/profile',         icon: User,        label: 'Profile'         },
  { path: '/pricing',         icon: Zap,         label: 'Upgrade to Pro'  },
  { path: '/privacy',         icon: Shield,      label: 'Privacy & Data'  },
  { path: '/help',            icon: HelpCircle,  label: 'Help & Support'  },
  { path: '/settings',        icon: Settings,    label: 'Settings'        },
]

const BottomNav = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [open, setOpen] = useState(false)

  const moreActive = moreNav.some(n => n.path === location.pathname)

  const handleMoreLink = (path) => {
    setOpen(false)
    navigate(path)
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            zIndex: 299,
          }}
        />
      )}

      {/* Slide-up More drawer */}
      <div style={{
        position: 'fixed',
        bottom: open ? 0 : '-100%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        background: 'white',
        borderRadius: '20px 20px 0 0',
        zIndex: 300,
        transition: 'bottom 0.3s cubic-bezier(0.4,0,0.2,1)',
        maxHeight: '80vh',
        overflowY: 'auto',
        paddingBottom: '80px',
      }}>
        {/* Drawer header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 20px 12px',
          borderBottom: '1px solid #f3f4f6',
          position: 'sticky', top: 0, background: 'white', zIndex: 1,
        }}>
          <div>
            <p style={{ fontWeight: '700', fontSize: '17px' }}>Menu</p>
            {user && (
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                {user.firstName} {user.lastName}
              </p>
            )}
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={16} color="#374151" />
          </button>
        </div>

        {/* Grid of nav items */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          padding: '16px',
        }}>
          {moreNav.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path
            return (
              <button
                key={path}
                onClick={() => handleMoreLink(path)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: '6px', padding: '14px 8px', borderRadius: '12px',
                  border: 'none', cursor: 'pointer', textAlign: 'center',
                  background: active ? '#eff6ff' : '#f9fafb',
                  color: active ? '#2563eb' : '#374151',
                }}
              >
                <Icon size={22} />
                <span style={{ fontSize: '11px', fontWeight: '500', lineHeight: '1.3' }}>{label}</span>
              </button>
            )
          })}
        </div>

        {/* Sign out */}
        <div style={{ padding: '0 16px 16px' }}>
          <button
            onClick={() => { setOpen(false); logout() }}
            style={{
              width: '100%', padding: '13px', background: '#fef2f2', color: '#ef4444',
              border: '1px solid #fecaca', borderRadius: '12px', fontSize: '14px',
              fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px',
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Bottom nav bar */}
      <nav className="bottom-nav">
        {primaryNav.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`bottom-nav-item ${location.pathname === path ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span className="bottom-nav-label">{label}</span>
          </Link>
        ))}

        <button
          onClick={() => setOpen(o => !o)}
          className={`bottom-nav-item ${moreActive ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <MoreHorizontal size={20} />
          <span className="bottom-nav-label">More</span>
        </button>
      </nav>
    </>
  )
}

export default BottomNav

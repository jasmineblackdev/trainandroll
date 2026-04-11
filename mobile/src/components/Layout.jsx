import React from 'react'
import BottomNav from './BottomNav'
import SidebarNav from './SidebarNav'

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      {/* Sidebar — visible on desktop only (CSS controls visibility) */}
      <SidebarNav />

      {/* Main content */}
      <main className="main-content">
        {children}
      </main>

      {/* Bottom nav — visible on mobile/iPad only (CSS controls visibility) */}
      <BottomNav />
    </div>
  )
}

export default Layout

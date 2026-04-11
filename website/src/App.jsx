import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import PricingPage from './pages/PricingPage'
import ForFleets from './pages/ForFleets'
import ForDrivers from './pages/ForDrivers'
import ForTrainers from './pages/ForTrainers'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Contact from './pages/Contact'
import PilotProgram from './pages/PilotProgram'
import './index.css'

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/"         element={<Home />}          />
        <Route path="/pricing"  element={<PricingPage />}   />
        <Route path="/fleets"   element={<ForFleets />}     />
        <Route path="/drivers"  element={<ForDrivers />}    />
        <Route path="/trainers" element={<ForTrainers />}   />
        <Route path="/privacy"  element={<PrivacyPolicy />} />
        <Route path="/terms"    element={<TermsOfService />} />
        <Route path="/contact"  element={<Contact />}       />
        <Route path="/pilot"    element={<PilotProgram />}  />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App

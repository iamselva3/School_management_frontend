import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import StudentLogin from './components/StudentLogin'
import StudentRegister from './components/StudentRegister'
import StudentDashboard from './components/StudentDashboard'
import StudentPrivateRoute from './components/StudentPrivateRoute'
import PendingApprovals from './components/PendingApprovals'
import { ThemeProvider } from './context/ThemeContext'

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, rotateY: 15, scale: 0.95, y: 20 }}
    animate={{ opacity: 1, rotateY: 0, scale: 1, y: 0 }}
    exit={{ opacity: 0, rotateY: -15, scale: 1.05, y: -20 }}
    transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
    style={{ transformOrigin: 'center center' }}
  >
    {children}
  </motion.div>
)

const AnimatedRoutes = () => {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Admin Routes */}
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
          <Route path="/admin/pending" element={<PageWrapper><PendingApprovals /></PageWrapper>} />
        </Route>

        {/* Student Routes */}
        <Route path="/student/login" element={<PageWrapper><StudentLogin /></PageWrapper>} />
        <Route path="/student/register" element={<PageWrapper><StudentRegister /></PageWrapper>} />
        <Route path="/student" element={<StudentPrivateRoute />}>
          <Route path="dashboard" element={<PageWrapper><StudentDashboard /></PageWrapper>} />
        </Route>

        <Route path="*" element={<Navigate to="/student/login" />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <ThemeProvider>
      <div className="scanline" />
      <div className="bg-terminal-grid fixed inset-0 z-[-1]" />
      <Router>
        <AnimatedRoutes />
      </Router>
    </ThemeProvider>
  )
}

export default App
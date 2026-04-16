import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import StudentLogin from './components/StudentLogin'
import StudentRegister from './components/StudentRegister'
import StudentDashboard from './components/StudentDashboard'
import StudentPrivateRoute from './components/StudentPrivateRoute'
import PendingApprovals from './components/PendingApprovals'

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin/pending" element={<PendingApprovals />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/student" element={<StudentPrivateRoute />}>
          <Route path="dashboard" element={<StudentDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/student/login" />} />
      </Routes>
    </Router>
  )
}

export default App
import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { GraduationCap, LogOut, User, Bell } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { studentAPI } from '../services/endpoints'

const Navbar = () => {
  const navigate = useNavigate()

  const { data: pendingStudents } = useQuery({
    queryKey: ['pendingStudents'],
    queryFn: studentAPI.getPending,
    staleTime: 30000
  })

  const pendingCount = pendingStudents?.length || 0

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 cursor-pointer">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-xl">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">School Management</h1>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          </Link>

          <div className="flex items-center space-x-6">
            <Link 
              to="/admin/pending" 
              className="relative p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-xl transition-all"
            >
              <Bell className="w-5 h-5" />
              {pendingCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                  {pendingCount}
                </span>
              )}
            </Link>

            <div className="flex items-center space-x-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Admin</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
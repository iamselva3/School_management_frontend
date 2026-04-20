import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { GraduationCap, LogOut, User, Bell, Sun, Moon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { studentAPI } from '../services/endpoints'
import { useTheme } from '../context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

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
    <div className="fixed top-6 left-0 right-0 z-50 px-6 pointer-events-none">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/20 rounded-[2rem] shadow-2xl h-20 flex items-center px-8 pointer-events-auto transition-colors duration-500"
      >
        <div className="flex justify-between items-center w-full">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-4 cursor-pointer group">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900 group-hover:scale-110 transition-transform duration-300">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-tight">School <span className="text-indigo-600">OS</span></h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mt-1">Institutional Control</p>
            </div>
          </Link>

          {/* Right Section Actions */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Theme Toggle */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all shadow-sm"
            >
              <AnimatePresence mode="wait">
                {theme === 'light' ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Notifications */}
            <Link 
              to="/admin/pending" 
              className="relative p-3 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800 shadow-sm"
            >
              <Bell className="w-5 h-5" />
              {pendingCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-sm animate-bounce">
                  {pendingCount}
                </span>
              )}
            </Link>

            <div className="hidden md:flex flex-col items-end mr-2">
               <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">Director General</span>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Administrator</span>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

            <motion.button
              whileHover={{ x: 3 }}
              onClick={handleLogout}
              className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-900/40 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all shadow-sm group"
            >
              <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span className="hidden lg:block text-xs font-black uppercase tracking-widest">Power Off</span>
            </motion.button>
          </div>
        </div>
      </motion.nav>
    </div>
  )
}

export default Navbar
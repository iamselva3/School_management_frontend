import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { studentAuthAPI } from '../services/endpoints'
import toast from 'react-hot-toast'
import { GraduationCap, Eye, EyeOff, Mail, Lock, Loader2, UserCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const StudentLogin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const loginMutation = useMutation({
    mutationFn: studentAuthAPI.login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', 'student')
      localStorage.setItem('studentId', data.student._id || data.student.id)
      toast.success('Access Granted')
      navigate('/student/dashboard')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Invalid credentials')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    loginMutation.mutate(formData)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 overflow-hidden relative transition-colors duration-500">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50 dark:opacity-20 transition-opacity">
        <motion.div 
          animate={{ x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-[40rem] h-[40rem] bg-indigo-200/40 dark:bg-indigo-600/20 rounded-full blur-[10rem]" 
        />
        <motion.div 
          animate={{ x: [0, -80, 0], y: [0, -40, 0], scale: [1.2, 1, 1.2] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-20 w-[40rem] h-[40rem] bg-rose-200/40 dark:bg-rose-600/20 rounded-full blur-[10rem]" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-12">
          <motion.div 
            whileHover={{ rotate: 360, scale: 1.1, borderRadius: "40%" }}
            transition={{ type: "spring", stiffness: 100 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-indigo-600 rounded-[2.5rem] mb-8 shadow-2xl shadow-indigo-200 dark:shadow-none"
          >
            <GraduationCap className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Intelligence Hub</h1>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 mt-4 uppercase tracking-[0.3em]">Authorized Personnel Interaction Point</p>
        </div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white/95 dark:bg-slate-900/95 rounded-[3.5rem] shadow-2xl p-12 border border-white/20 dark:border-slate-800/30 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-rose-500 opacity-50" />
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-4">
                Registry Identification (Email)
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-5 bg-white/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/50 rounded-3xl text-sm font-black text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 uppercase tracking-widest"
                  placeholder="ID@STUDENT.COM"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-4">
                Access Token (Secret Key)
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-14 pr-16 py-5 bg-white/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/50 rounded-3xl text-sm font-black text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 uppercase tracking-widest"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-2"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black rounded-3xl transition-all shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[10px]"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  <UserCircle className="w-5 h-5" />
                  Establish Connection
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800/50 text-center space-y-6">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              New Unit? 
              <Link to="/student/register" className="text-indigo-600 dark:text-indigo-400 font-black ml-3 hover:underline">
                Initialize Profile
              </Link>
            </p>
            <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-tighter">
              Admin Node? <Link to="/login" className="text-slate-600 dark:text-slate-400 hover:underline">Switch to root terminal</Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default StudentLogin

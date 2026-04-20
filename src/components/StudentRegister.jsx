import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { studentAuthAPI } from '../services/endpoints'
import toast from 'react-hot-toast'
import { GraduationCap, User, Mail, Lock, BookOpen, Hash, Phone, Loader2, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'

const StudentRegister = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        className: '',
        rollNumber: '',
        phone: ''
    })

    const registerMutation = useMutation({
        mutationFn: studentAuthAPI.register,
        onSuccess: (data) => {
            toast.success(data.message || 'Enrollment initiated. Waiting for verification.')
            navigate('/student/login')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Registration failed')
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        registerMutation.mutate(formData)
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <React.Fragment>
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 overflow-hidden relative transition-colors duration-500">
                {/* Background elements */}
                <div className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-20 transition-opacity">
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-10 right-10 w-[35rem] h-[35rem] bg-indigo-200/40 dark:bg-indigo-600/20 rounded-full blur-[10rem]" 
                    />
                    <motion.div 
                        animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0], y: [0, -30, 0] }}
                        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-10 left-10 w-[35rem] h-[35rem] bg-rose-200/40 dark:bg-rose-600/20 rounded-full blur-[10rem]" 
                    />
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="max-w-2xl w-full relative z-10"
                >
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-600 rounded-[2.5rem] mb-8 shadow-2xl shadow-indigo-100 dark:shadow-none">
                            <GraduationCap className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Initialize Unit</h1>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 mt-4 uppercase tracking-[0.3em]">Personnel Registry Enrollment Terminal</p>
                    </div>

                    <div className="bg-white/95 dark:bg-slate-900/95 rounded-[3.5rem] shadow-2xl p-12 border border-white/20 dark:border-slate-800/30 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-rose-500 opacity-60" />
                        
                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    { name: 'name', label: 'Identity Mapping', icon: User, placeholder: 'JOHN DOE', type: 'text' },
                                    { name: 'email', label: 'Communication Hub', icon: Mail, placeholder: 'ID@STUDENT.COM', type: 'email' },
                                    { name: 'className', label: 'Cohort Designation', icon: BookOpen, placeholder: 'GRADE-12X', type: 'text' },
                                    { name: 'rollNumber', label: 'Registry Serial', icon: Hash, placeholder: 'ID-402', type: 'text' },
                                    { name: 'phone', label: 'Direct Channel', icon: Phone, placeholder: '+00 000 000 00', type: 'tel' },
                                    { name: 'password', label: 'Encryption Secret', icon: Lock, placeholder: '••••••••', type: 'password' }
                                ].map((field) => (
                                    <div key={field.name} className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-4 block font-black">
                                            {field.label}
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                                <field.icon className="w-5 h-5" />
                                            </div>
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                className="w-full pl-14 pr-6 py-4 bg-white/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/50 rounded-[1.75rem] text-sm font-black text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 uppercase tracking-widest shadow-inner group-hover:border-slate-200"
                                                placeholder={field.placeholder}
                                                required={field.name !== 'phone'}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={registerMutation.isPending}
                                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black rounded-3xl transition-all shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[10px] mt-4"
                            >
                                {registerMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        TRANSMITTING REGISTRY DATA...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5" />
                                        Initialize Personnel Profile
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800/50 text-center">
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                Connection established previously? 
                                <Link to="/student/login" className="text-indigo-600 dark:text-indigo-400 font-black ml-3 hover:underline">
                                    Authentication Terminal
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </React.Fragment>
    )
}

export default StudentRegister

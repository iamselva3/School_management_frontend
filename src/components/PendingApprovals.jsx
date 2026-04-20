import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { studentAPI } from '../services/endpoints'
import toast from 'react-hot-toast'
import { 
  UserCheck, 
  UserX, 
  Clock, 
  Mail, 
  BookOpen, 
  Hash, 
  Phone,
  ArrowLeft,
  Loader2
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const PendingApprovals = () => {
    const queryClient = useQueryClient()

    const { data: pendingStudents, isLoading } = useQuery({
        queryKey: ['pendingStudents'],
        queryFn: studentAPI.getPending
    })

    const approveMutation = useMutation({
        mutationFn: studentAPI.approve,
        onSuccess: () => {
            queryClient.invalidateQueries(['pendingStudents'])
            queryClient.invalidateQueries(['students'])
            toast.success('Student approved!')
        },
        onError: () => toast.error('Failed to approve student')
    })

    const rejectMutation = useMutation({
        mutationFn: studentAPI.reject,
        onSuccess: () => {
            queryClient.invalidateQueries(['pendingStudents'])
            toast.success('Registration rejected')
        },
        onError: () => toast.error('Failed to reject registration')
    })

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-10 space-y-12"
        >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl p-10 rounded-[3rem] border border-white/20 dark:border-slate-800/20 shadow-2xl">
                <div className="flex items-center gap-8">
                    <motion.div whileHover={{ x: -5 }}>
                        <Link to="/" className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-sm transition-all text-slate-500 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                    </motion.div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Security Pipeline</h1>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-3">Personnel Authorization Terminal</p>
                    </div>
                </div>
                <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="bg-amber-500/10 dark:bg-amber-500/5 text-amber-600 dark:text-amber-500 px-8 py-4 rounded-2xl text-xs font-black flex items-center gap-4 border border-amber-500/20 shadow-inner"
                >
                    <Clock className="w-5 h-5 animate-pulse" />
                    <span className="uppercase tracking-widest">{pendingStudents?.length || 0} ENROLLMENTS PENDING</span>
                </motion.div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 bg-white/10 dark:bg-slate-900/10 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                    <Loader2 className="h-16 w-16 text-indigo-600 dark:text-indigo-400 animate-spin mb-8" />
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Synchronizing Registry Access...</p>
                </div>
            ) : pendingStudents?.length === 0 ? (
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center py-40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl rounded-[3.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 shadow-inner"
                >
                    <div className="bg-emerald-500/10 dark:bg-emerald-500/5 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl">
                        <UserCheck className="w-14 h-14 text-emerald-500" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Perimeter Secure</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium">All personnel units have been authorized and categorized.</p>
                </motion.div>
            ) : (
                <motion.div 
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                    {pendingStudents?.map(student => (
                        <motion.div 
                            key={student._id}
                            variants={{
                                hidden: { opacity: 0, y: 30, scale: 0.95 },
                                show: { opacity: 1, y: 0, scale: 1 }
                            }}
                            whileHover={{ 
                                y: -12, 
                                rotateY: 5,
                                rotateX: -2,
                                transition: { type: "spring", stiffness: 300, damping: 20 }
                            }}
                            className="card group !p-10 relative overflow-hidden text-left border-slate-100 dark:border-slate-800/50 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all duration-500 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md"
                        >
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                            
                            <div className="flex flex-col h-full">
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:bg-indigo-600 group-hover:text-white rounded-[1.75rem] flex items-center justify-center font-black text-3xl uppercase transition-all duration-500 shadow-inner group-hover:shadow-2xl group-hover:shadow-indigo-100 dark:group-hover:shadow-none">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-black text-slate-900 dark:text-white truncate text-2xl tracking-tighter group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase">{student.name}</h3>
                                        <div className="flex items-center gap-3 text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.2em] mt-2">
                                            <BookOpen className="w-3.5 h-3.5" />
                                            {student.className} • SERIAL {student.rollNumber}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-12">
                                    <div className="flex items-center gap-5 text-sm font-bold text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20 p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-inner">
                                        <Mail className="w-4.5 h-4.5 text-indigo-400" />
                                        <span className="truncate tracking-tight lowercase">{student.email}</span>
                                    </div>
                                    {student.phone && (
                                        <div className="flex items-center gap-5 text-sm font-bold text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20 p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-inner">
                                            <Phone className="w-4.5 h-4.5 text-indigo-400" />
                                            <span className="tracking-widest">{student.phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest px-3">
                                        <Clock className="w-4 h-4" />
                                        <span>Log: {new Date(student.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                <div className="mt-auto flex gap-6">
                                    <motion.button 
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => approveMutation.mutate(student._id)}
                                        disabled={approveMutation.isPending || rejectMutation.isPending}
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-100 dark:shadow-none text-[10px] uppercase tracking-[0.2em]"
                                    >
                                        <UserCheck className="w-5 h-5" />
                                        Authorize
                                    </motion.button>
                                    <motion.button 
                                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(244, 63, 94, 0.1)' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => rejectMutation.mutate(student._id)}
                                        disabled={approveMutation.isPending || rejectMutation.isPending}
                                        className="bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 font-black p-5 rounded-2xl transition-all flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-lg group-hover:border-rose-200"
                                        title="Deny Access"
                                    >
                                        <UserX className="w-6 h-6" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    )
}

export default PendingApprovals

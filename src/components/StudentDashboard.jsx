import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskAPI, notificationAPI, studentAPI } from '../services/endpoints'
import toast from 'react-hot-toast'
import { useSubmitWork } from '../hooks/useApi'
import TaskDetailModal from './TaskDetailModal'
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  Calendar, 
  ClipboardList, 
  LogOut, 
  User, 
  CheckCircle2,
  Circle,
  FileDown,
  FileUp,
  AlertCircle,
  FileText,
  RotateCcw,
  Loader2,
  GraduationCap
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const StudentDashboard = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [showNotifications, setShowNotifications] = useState(false)
    const [selectedTask, setSelectedTask] = useState(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [uploadingTaskId, setUploadingTaskId] = useState(null)

    const { data: tasks, isLoading: tasksLoading } = useQuery({
        queryKey: ['myTasks'],
        queryFn: taskAPI.getMyTasks
    })

    const { data: notifications, isLoading: notifsLoading } = useQuery({
        queryKey: ['myNotifications'],
        queryFn: notificationAPI.getMyNotifications,
        refetchInterval: 30000 
    })

    const submitWorkMutation = useSubmitWork()

    const markAllReadMutation = useMutation({
        mutationFn: notificationAPI.markAllRead,
        onSuccess: () => {
            queryClient.invalidateQueries(['myNotifications'])
        }
    })

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        navigate('/student/login')
    }

    const studentId = localStorage.getItem('studentId')

    const { data: student } = useQuery({
        queryKey: ['myProfile', studentId],
        queryFn: () => studentAPI.getById(studentId),
        enabled: !!studentId
    })

    const unreadCount = notifications?.filter(n => !n.isRead).length || 0

    const handleFileSubmit = async (taskId, file) => {
        if (!file) return
        
        const formData = new FormData()
        formData.append('doc', file)
        
        try {
            await submitWorkMutation.mutateAsync({ id: taskId, formData })
            setUploadingTaskId(null)
        } catch (error) {
            console.error('Submission error:', error)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-500">
            {/* Header */}
            <header className="sticky top-0 z-[100] px-10 py-6">
                <nav className="max-w-7xl mx-auto bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 dark:border-slate-800/30 shadow-2xl px-10 py-5 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex items-center gap-4"
                        >
                            <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none">
                                <GraduationCap className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Intelligence <span className="text-indigo-600">Terminal</span></h1>
                                <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Student Data Interface</p>
                            </div>
                        </motion.div>

                        <div className="flex items-center gap-8">
                            <div className="relative">
                                <motion.button 
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                        setShowNotifications(!showNotifications)
                                        if (!showNotifications && unreadCount > 0) markAllReadMutation.mutate()
                                    }}
                                    className="p-4 text-slate-500 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all relative border border-transparent hover:border-slate-100 dark:hover:border-slate-700 shadow-sm"
                                >
                                    <Bell className="w-5 h-5" />
                                    <AnimatePresence>
                                        {unreadCount > 0 && (
                                            <motion.span 
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                className="absolute top-2 right-2 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-lg border-2 border-white dark:border-slate-900 shadow-lg"
                                            >
                                                {unreadCount}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.button>

                                <AnimatePresence>
                                    {showNotifications && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                            className="absolute right-0 mt-6 w-[28rem] bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/20 dark:border-slate-800/30 overflow-hidden z-50 p-4"
                                        >
                                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                                <span className="font-black text-slate-900 dark:text-white uppercase text-[10px] tracking-[0.3em]">Telemetry Feed</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                                    <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Connected</span>
                                                </div>
                                            </div>
                                            <div className="max-h-[35rem] overflow-y-auto custom-scrollbar p-2">
                                                {notifications?.length === 0 ? (
                                                    <div className="py-20 text-center">
                                                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                                            <Bell className="w-8 h-8 text-slate-200" />
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">No recent transmissions</p>
                                                    </div>
                                                ) : (
                                                    notifications?.map(notif => (
                                                        <motion.div 
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            key={notif._id} 
                                                            className={`p-6 mb-2 rounded-[2rem] border transition-all duration-300 ${!notif.isRead ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30' : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                                        >
                                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed tracking-tight">{notif.message}</p>
                                                            <div className="flex items-center gap-3 mt-4">
                                                                <Clock className="w-3.5 h-3.5 text-slate-300" />
                                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">{new Date(notif.createdAt).toLocaleString()}</p>
                                                            </div>
                                                        </motion.div>
                                                    ))
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="h-8 w-px bg-slate-100 dark:bg-slate-800"></div>

                            <motion.button 
                                whileHover={{ scale: 1.05, x: 5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="flex items-center gap-4 px-8 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 bg-slate-100/50 dark:bg-slate-800/50 hover:bg-rose-50/50 dark:hover:bg-rose-900/20 rounded-[1.5rem] transition-all border border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-800 uppercase tracking-widest shadow-sm"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </motion.button>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="flex-1 max-w-7xl mx-auto px-10 py-10 w-full">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column: Stats & Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full lg:w-[28%] space-y-10"
                    >
                        <div className="card group !p-10 relative overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl">
                            <div className="absolute -top-10 -right-10 opacity-[0.05] dark:opacity-[0.02] rotate-12 group-hover:scale-110 transition-transform duration-700">
                                <GraduationCap className="w-60 h-60" />
                            </div>
                            
                            <div className="relative z-10">
                                <div className="flex flex-col gap-8">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-indigo-100 dark:shadow-none">
                                        {student?.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Certified Identity</p>
                                        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{student?.name}</h2>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 mt-12 pt-10 border-t border-slate-100 dark:border-slate-800/50">
                                    <div className="p-6 bg-slate-100 dark:bg-slate-950/30 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-inner">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Cohort ID</p>
                                        <p className="font-black text-indigo-600 dark:text-indigo-400 uppercase text-xs">{student?.className}</p>
                                    </div>
                                    <div className="p-6 bg-slate-100 dark:bg-slate-950/30 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-inner">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Registry Serial</p>
                                        <p className="font-black text-indigo-600 dark:text-indigo-400 uppercase text-xs">{student?.rollNumber}</p>
                                    </div>
                                </div>
                                
                                <div className="mt-12 space-y-6">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Telemetry Matrix</p>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-5 bg-white/50 dark:bg-slate-800/30 rounded-2xl border border-white dark:border-slate-700 shadow-sm">
                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tight">Active Ops</span>
                                            <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{tasks?.filter(t => t.status === 'pending' || t.status === 'rejected').length || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-5 bg-white/50 dark:bg-slate-800/30 rounded-2xl border border-white dark:border-slate-700 shadow-sm">
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-tight">Transmitting</span>
                                            <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{tasks?.filter(t => t.status === 'submitted').length || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-5 bg-white/50 dark:bg-slate-800/30 rounded-2xl border border-white dark:border-slate-700 shadow-sm">
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tight">Archives</span>
                                            <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{tasks?.filter(t => t.status === 'completed').length || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Tasks */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1 space-y-10"
                    >
                        <div className="flex items-center justify-between px-4">
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase flex items-center gap-6">
                                <div className="bg-indigo-600 w-2 h-10 rounded-full shadow-lg shadow-indigo-100" />
                                Mission Directives
                            </h2>
                        </div>

                        {tasksLoading ? (
                            <div className="flex flex-col items-center justify-center py-40 bg-white/20 dark:bg-slate-950/20 backdrop-blur-md rounded-[4rem] border-2 border-dashed border-slate-100 dark:border-slate-800 shadow-inner">
                                <Loader2 className="animate-spin h-16 w-16 text-indigo-600 dark:text-indigo-400 mb-8" />
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">Synchronizing Trajectory Data...</p>
                            </div>
                        ) : tasks?.length === 0 ? (
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center justify-center py-40 bg-white/20 dark:bg-slate-900/10 backdrop-blur-md rounded-[4rem] border-2 border-dashed border-slate-100 dark:border-slate-800 shadow-inner"
                            >
                                <div className="bg-indigo-500/10 dark:bg-indigo-500/5 p-12 rounded-[3.5rem] mb-10 shadow-2xl">
                                    <CheckCircle2 className="w-20 h-20 text-indigo-300 dark:text-indigo-800" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Trajectory Clear</h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium uppercase tracking-widest text-[10px]">No active directives detected in current sector.</p>
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial="hidden"
                                animate="show"
                                variants={{
                                    hidden: { opacity: 0 },
                                    show: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.15 }
                                    }
                                }}
                                className="grid gap-8"
                            >
                                {tasks?.map(task => (
                                    <motion.div 
                                        key={task._id} 
                                        variants={{
                                            hidden: { opacity: 0, y: 30, scale: 0.95 },
                                            show: { opacity: 1, y: 0, scale: 1 }
                                        }}
                                        whileHover={{ 
                                            y: -10,
                                            rotateY: 2,
                                            rotateX: -1,
                                            transition: { type: "spring", stiffness: 300, damping: 25 }
                                        }}
                                        className={`group relative perspective-1000 p-10 rounded-[3rem] border transition-all duration-500 flex flex-col md:flex-row items-center gap-10 cursor-pointer overflow-hidden backdrop-blur-xl ${
                                            task.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/20' : 
                                            task.status === 'submitted' ? 'bg-blue-500/5 border-blue-500/20' : 
                                            task.status === 'rejected' ? 'bg-rose-500/5 border-rose-500/20' : 
                                            'bg-white/40 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/50 shadow-xl'
                                        }`}
                                        onClick={() => {
                                            setSelectedTask(task)
                                            setIsDetailModalOpen(true)
                                        }}
                                    >
                                        <div className={`absolute top-0 left-0 w-1.5 h-full ${
                                            task.status === 'completed' ? 'bg-emerald-500' : 
                                            task.status === 'submitted' ? 'bg-blue-500' : 
                                            task.status === 'rejected' ? 'bg-rose-500' : 
                                            'bg-indigo-600'
                                        }`} />

                                        <div className={`p-6 rounded-[2rem] shadow-2xl transition-all duration-500 group-hover:scale-110 ${
                                            task.status === 'completed' ? 'bg-emerald-500 text-white shadow-emerald-200' : 
                                            task.status === 'submitted' ? 'bg-blue-500 text-white shadow-blue-200' : 
                                            task.status === 'rejected' ? 'bg-rose-500 text-white shadow-rose-200' : 
                                            'bg-indigo-600 text-white shadow-indigo-100 dark:shadow-none'
                                        }`}>
                                            {task.status === 'completed' ? <CheckCircle2 className="w-10 h-10" /> : 
                                             task.status === 'submitted' ? <Clock className="w-10 h-10" strokeWidth={2.5} /> :
                                             task.status === 'rejected' ? <AlertCircle className="w-10 h-10" /> :
                                             <ClipboardList className="w-10 h-10" />}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0 space-y-6">
                                            <div className="flex items-center justify-between gap-6">
                                                <h3 className={`text-2xl font-black tracking-tight truncate uppercase leading-none ${task.status === 'completed' ? 'opacity-40' : 'text-slate-900 dark:text-white'}`}>
                                                    {task.title}
                                                </h3>
                                                <span className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] shadow-lg ${
                                                    task.status === 'completed' ? 'bg-emerald-500 text-white' : 
                                                    task.status === 'submitted' ? 'bg-blue-500 text-white' : 
                                                    task.status === 'rejected' ? 'bg-rose-500 text-white' : 
                                                    'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500'
                                                }`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                            
                                            <p className={`text-[13px] leading-relaxed line-clamp-2 font-medium ${task.status === 'completed' ? 'opacity-40' : 'text-slate-600 dark:text-slate-400'}`}>
                                                {task.description}
                                            </p>

                                            {task.status === 'rejected' && task.rejectionReason && (
                                                <motion.div 
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-sm italic font-bold text-rose-900 dark:text-rose-400 relative overflow-hidden"
                                                >
                                                    <div className="absolute top-0 right-0 p-3 opacity-10">
                                                        <RotateCcw className="w-12 h-12" />
                                                    </div>
                                                    <span className="font-black uppercase tracking-widest text-[9px] block mb-2 opacity-60">Calibration Feedback</span>
                                                    "{task.rejectionReason}"
                                                </motion.div>
                                            )}

                                            <div className="flex flex-wrap items-center justify-between gap-8 pt-8 border-t border-slate-100 dark:border-slate-800/80">
                                                <div className="flex items-center gap-8">
                                                    {task.questionDoc && (
                                                        <motion.a 
                                                            whileHover={{ scale: 1.1, color: "#4f46e5" }}
                                                            href={task.questionDoc}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest transition-colors"
                                                        >
                                                            <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all"><FileDown className="w-4 h-4" /></div>
                                                            Directives
                                                        </motion.a>
                                                    )}
                                                    {task.submissionDoc && (
                                                        <motion.a 
                                                            whileHover={{ scale: 1.1, color: "#3b82f6" }}
                                                            href={task.submissionDoc}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest transition-colors"
                                                        >
                                                            <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all"><FileText className="w-4 h-4" /></div>
                                                            Telemetry
                                                        </motion.a>
                                                    )}
                                                </div>
                                                
                                                {(task.status === 'pending' || task.status === 'rejected') && (
                                                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                                                        <input
                                                            type="file"
                                                            id={`file-${task._id}`}
                                                            className="hidden"
                                                            onChange={(e) => handleFileSubmit(task._id, e.target.files[0])}
                                                        />
                                                        <motion.button 
                                                            whileHover={{ scale: 1.05, y: -2 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => document.getElementById(`file-${task._id}`).click()}
                                                            disabled={submitWorkMutation.isPending}
                                                            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-2xl flex items-center gap-4 shadow-xl shadow-indigo-100 dark:shadow-none transition-all disabled:opacity-50"
                                                        >
                                                            {task.status === 'rejected' ? <RotateCcw className="w-4.5 h-4.5" /> : <FileUp className="w-4.5 h-4.5" />}
                                                            {task.status === 'rejected' ? 'Recall & Retry' : 'Transmit Module'}
                                                            {submitWorkMutation.isPending && <Loader2 className="w-4.5 h-4.5 animate-spin" />}
                                                        </motion.button>
                                                    </div>
                                                )}

                                                {task.status === 'completed' && (
                                                    <div className="flex items-center gap-3 text-emerald-500/40 text-[10px] font-black uppercase tracking-[0.2em]">
                                                        <CheckCircle className="w-4 h-4" />
                                                        Archived Success
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </main>
            
            <TaskDetailModal 
                isOpen={isDetailModalOpen} 
                onClose={() => setIsDetailModalOpen(false)}
                task={selectedTask}
                isAdmin={false}
            />
        </div>
    )
}

export default StudentDashboard

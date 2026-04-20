import React from 'react'
import { X, Calendar, User, Clock, CheckCircle, Circle, BookOpen, Download, AlertCircle, Check, XCircle, MessageSquare, FileText } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { useVerifySubmission } from '../hooks/useApi'
import toast from 'react-hot-toast'

const TaskDetailModal = ({ isOpen, onClose, task, isAdmin = true }) => {
  const verifySubmission = useVerifySubmission()
  const [rejectionReason, setRejectionReason] = React.useState('')
  const [showRejectInput, setShowRejectInput] = React.useState(false)

  if (!isOpen || !task) return null

  const isOverdue = new Date(task.dueDate) < new Date() && task.status === 'pending'
  const daysUntilDue = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-6 py-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/20 dark:border-slate-800/20 max-w-2xl w-full overflow-hidden"
          >
            {/* Top Accent */}
            <div className={`absolute top-0 left-0 w-full h-1.5 ${
              task.status === 'completed' ? 'bg-emerald-500' : 
              task.status === 'submitted' ? 'bg-indigo-500' :
              task.status === 'rejected' ? 'bg-rose-500' :
              isOverdue ? 'bg-rose-500' : 'bg-amber-500'
            }`} />

            <div className="sticky top-0 z-20 px-10 py-8 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl shadow-xl ${
                       task.status === 'completed' ? 'bg-emerald-500 shadow-emerald-100' :
                       task.status === 'submitted' ? 'bg-indigo-500 shadow-indigo-100' :
                       'bg-slate-100 dark:bg-slate-800'
                    }`}>
                       {task.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                       ) : (
                          <Clock className={`w-5 h-5 ${task.status === 'submitted' ? 'text-white' : 'text-slate-400'}`} />
                       )}
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{task.title}</h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 
                      task.status === 'submitted' ? 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20' :
                      task.status === 'rejected' ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' :
                      isOverdue ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' :
                      'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                    }`}>
                      {task.status}
                    </span>
                    {isOverdue && <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">CRITICAL OVERDUE</span>}
                  </div>
                </div>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-rose-500 transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            <div className="p-10 space-y-10">
              {task.questionDoc && (
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                     <BookOpen className="w-4 h-4" /> Curriculum Material
                  </p>
                  <a 
                    href={task.questionDoc} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-6 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-3xl hover:bg-white dark:hover:bg-slate-900 transition-all duration-300 shadow-sm group"
                  >
                    <div className="flex items-center gap-4 text-indigo-600 dark:text-indigo-400">
                       <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <FileText className="w-6 h-6" />
                       </div>
                       <span className="text-sm font-black uppercase tracking-tight">Deployment Material.pdf</span>
                    </div>
                    <Download className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:translate-y-1 transition-transform" />
                  </a>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/50 rounded-[2rem] space-y-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Personnel</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-indigo-100 dark:shadow-none">
                       {task.studentId?.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">{task.studentId?.name || 'Unknown Unit'}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Serial: {task.studentId?.rollNumber || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black text-slate-400 uppercase">Cohort Assignment</span>
                       <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase">{task.studentId?.className || 'Global'}</span>
                    </div>
                    {task.studentId?.email && (
                       <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase">Communication Frequency</span>
                          <span className="text-[10px] font-bold text-slate-900 dark:text-white truncate">{task.studentId.email}</span>
                       </div>
                    )}
                  </div>
                </div>

                <div className="p-8 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/50 rounded-[2rem] space-y-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temporal Timeline</p>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Threshold Expiration</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                        {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      </p>
                      {task.status === 'pending' && (
                        <div className={`inline-flex items-center gap-2 mt-3 text-[10px] font-black uppercase tracking-widest ${
                          isOverdue ? 'text-rose-500' : daysUntilDue <= 3 ? 'text-amber-500' : 'text-emerald-500'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                             isOverdue ? 'bg-rose-500 animate-ping' : daysUntilDue <= 3 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                          {isOverdue 
                            ? `${Math.abs(daysUntilDue)} Days Post-Threshold`
                            : daysUntilDue === 0 ? 'Expiring Today' : `Expires in ${daysUntilDue} Cycles`
                          }
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase">Deployment</p>
                          <p className="text-[10px] font-black text-slate-900 dark:text-white mt-1">{format(new Date(task.createdAt), 'MMM dd')}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] font-black text-slate-400 uppercase">Elapsed</p>
                          <p className="text-[10px] font-black text-slate-900 dark:text-white mt-1">{formatDistanceToNow(new Date(task.createdAt), { addSuffix: false })}</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {(task.status === 'completed' || task.status === 'submitted' || task.status === 'rejected') && (
                <div className="space-y-6">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                     <AlertCircle className="w-4 h-4" /> Telemetry Submission Details
                  </p>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {task.submissionDoc && (
                      <div className="p-8 bg-indigo-600 rounded-[2rem] shadow-xl text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                           <FileText className="w-24 h-24" />
                        </div>
                        <div className="relative z-10 space-y-6">
                           <p className="text-[10px] font-black uppercase tracking-[0.3em]">Personnel Transmitted Data</p>
                           <a 
                             href={task.submissionDoc} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="inline-flex items-center gap-4 px-6 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl transition-all"
                           >
                             <Download className="w-5 h-5" />
                             <span className="text-xs font-black uppercase tracking-widest">Verify Submission Module</span>
                           </a>
                        </div>
                      </div>
                    )}

                    {task.rejectionReason && task.status === 'rejected' && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-8 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] flex items-start gap-6"
                      >
                        <div className="p-3 bg-rose-500 rounded-2xl shadow-lg shadow-rose-100">
                           <XCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2">Calibration Failure Reason</p>
                          <p className="text-sm font-bold text-rose-900 dark:text-rose-400 leading-relaxed italic">"{task.rejectionReason}"</p>
                        </div>
                      </motion.div>
                    )}

                    {task.status === 'completed' && task.completedAt && (
                      <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] flex items-center gap-6">
                        <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-100">
                           <CheckCircle className="w-6 h-6 text-white" strokeWidth={3} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Calibration Success</p>
                          <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Finalized: {format(new Date(task.completedAt), 'MMMM dd, yyyy')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {isAdmin && task.status === 'submitted' && (
              <div className="px-10 py-10 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                {!showRejectInput ? (
                  <div className="flex flex-col sm:flex-row gap-6">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleVerify('completed')}
                      className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-100 dark:shadow-none transition-all disabled:opacity-50"
                      disabled={verifySubmission.isPending}
                    >
                      <Check className="w-5 h-5" strokeWidth={4} />
                      Commit Success
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowRejectInput(true)}
                      className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-5 bg-white dark:bg-slate-800 text-rose-500 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-sm transition-all"
                      disabled={verifySubmission.isPending}
                    >
                      <XCircle className="w-5 h-5" />
                      Refuse Submission
                    </motion.button>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="relative group">
                      <MessageSquare className="absolute left-5 top-5 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                      <textarea
                        placeholder="SPECIFY CALIBRATION FAILURE REASON..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-950/30 border border-rose-200 dark:border-rose-900/30 rounded-3xl text-sm font-medium text-slate-900 dark:text-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all placeholder:text-slate-400 uppercase tracking-widest min-h-[120px]"
                        rows="3"
                      />
                    </div>
                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleVerify('rejected')}
                        className="flex-1 py-5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-rose-100 dark:shadow-none"
                        disabled={verifySubmission.isPending}
                      >
                        Confirm Refusal
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowRejectInput(false)}
                        className="px-8 py-5 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl"
                        disabled={verifySubmission.isPending}
                      >
                        Abort
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            <div className={`px-10 py-10 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 ${!isAdmin || task.status !== 'submitted' ? 'rounded-b-[3rem]' : ''}`}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-5 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all"
              >
                Close Communications
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}

export default TaskDetailModal
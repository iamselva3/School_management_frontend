import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskAPI, notificationAPI } from '../services/endpoints'
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
  RotateCcw
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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
        refetchInterval: 30000 // Poll for new notifications every 30s
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

    const unreadCount = notifications?.filter(n => !n.isRead).length || 0

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <ClipboardList className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">EduTrack <span className="text-indigo-600">Student</span></h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button 
                                onClick={() => {
                                    setShowNotifications(!showNotifications)
                                    if (!showNotifications && unreadCount > 0) markAllReadMutation.mutate()
                                }}
                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative"
                            >
                                <Bell className="w-6 h-6" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                    <div className="p-4 border-b border-gray-50 bg-gray-50 flex justify-between items-center">
                                        <span className="font-semibold text-gray-900">Notifications</span>
                                        <button className="text-xs text-indigo-600 hover:underline">Mark all read</button>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications?.length === 0 ? (
                                            <div className="p-8 text-center text-gray-500 text-sm">No notifications yet</div>
                                        ) : (
                                            notifications?.map(notif => (
                                                <div key={notif._id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notif.isRead ? 'bg-indigo-50/30' : ''}`}>
                                                    <p className="text-sm text-gray-800">{notif.message}</p>
                                                    <p className="text-[10px] text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="h-8 w-px bg-gray-200"></div>

                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Column: Stats & Info */}
                    <div className="w-full md:w-1/3 lg:w-1/4 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <User className="w-24 h-24" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 mb-4">My Profile</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Student ID</span>
                                    <span className="font-medium text-gray-900 uppercase">#{localStorage.getItem('token')?.slice(-5)}</span>
                                </div>
                                <div className="pt-3 border-t border-gray-50 space-y-2">
                                    <div className="bg-indigo-50 rounded-lg p-3">
                                        <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mb-1">Assignments Status</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-indigo-900">To Do</span>
                                            <span className="text-lg font-bold text-indigo-600">{tasks?.filter(t => t.status === 'pending' || t.status === 'rejected').length || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-sm font-medium text-blue-900">Submitted</span>
                                            <span className="text-lg font-bold text-blue-600">{tasks?.filter(t => t.status === 'submitted').length || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-sm font-medium text-green-900">Completed</span>
                                            <span className="text-lg font-bold text-green-600">{tasks?.filter(t => t.status === 'completed').length || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Tasks */}
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <ClipboardList className="text-indigo-600 w-6 h-6" />
                                My Assignments
                            </h2>
                        </div>

                        {tasksLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                                <p className="text-gray-500">Loading your assignments...</p>
                            </div>
                        ) : tasks?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                                <ClipboardList className="w-16 h-16 text-gray-200 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900">No Assignments Yet</h3>
                                <p className="text-gray-500">Great job! You have no pending work.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {tasks?.map(task => (
                                    <div 
                                        key={task._id} 
                                        className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 p-5 flex items-start gap-4 cursor-pointer ${
                                            task.status === 'completed' ? 'border-green-100 bg-green-50/10' : 
                                            task.status === 'submitted' ? 'border-blue-100 bg-blue-50/10' : 
                                            task.status === 'rejected' ? 'border-red-100 bg-red-50/10' : 
                                            'border-gray-100 hover:shadow-md'
                                        }`}
                                        onClick={() => {
                                            setSelectedTask(task)
                                            setIsDetailModalOpen(true)
                                        }}
                                    >
                                        <div className={`mt-1 p-2 rounded-xl h-fit ${
                                            task.status === 'completed' ? 'bg-green-100 text-green-600' : 
                                            task.status === 'submitted' ? 'bg-blue-100 text-blue-600' : 
                                            task.status === 'rejected' ? 'bg-red-100 text-red-600' : 
                                            'bg-indigo-100 text-indigo-600'
                                        }`}>
                                            {task.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : 
                                             task.status === 'submitted' ? <Clock className="w-6 h-6" /> :
                                             task.status === 'rejected' ? <AlertCircle className="w-6 h-6" /> :
                                             <Circle className="w-6 h-6" />}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-4 mb-2">
                                                <h3 className={`text-lg font-bold truncate ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                                    {task.title}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    task.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                                    task.status === 'submitted' ? 'bg-blue-100 text-blue-700' : 
                                                    task.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                            
                                            <p className={`text-sm mb-4 line-clamp-2 ${task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {task.description}
                                            </p>

                                            {task.status === 'rejected' && task.rejectionReason && (
                                                <div className="mb-4 p-3 bg-red-100/50 border border-red-100 rounded-lg text-xs text-red-800">
                                                    <span className="font-bold">Reason: </span> {task.rejectionReason}
                                                </div>
                                            )}

                                            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-50">
                                                <div className="flex items-center gap-3">
                                                    {task.questionDoc && (
                                                        <a 
                                                            href={task.questionDoc}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-tighter"
                                                        >
                                                            <FileDown className="w-3 h-3" />
                                                            Question Material
                                                        </a>
                                                    )}
                                                    {task.submissionDoc && (
                                                        <a 
                                                            href={task.submissionDoc}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-tighter"
                                                        >
                                                            <FileText className="w-3 h-3" />
                                                            My Submission
                                                        </a>
                                                    )}
                                                </div>
                                                <div className="flex-1"></div>
                                                {(task.status === 'pending' || task.status === 'rejected') && (
                                                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                                                        <input
                                                            type="file"
                                                            id={`file-${task._id}`}
                                                            className="hidden"
                                                            onChange={(e) => handleFileSubmit(task._id, e.target.files[0])}
                                                        />
                                                        <button 
                                                            onClick={() => document.getElementById(`file-${task._id}`).click()}
                                                            disabled={submitWorkMutation.isPending}
                                                            className="btn-primary py-1.5 px-3 text-xs shadow-none bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
                                                        >
                                                            {task.status === 'rejected' ? <RotateCcw className="w-3 h-3" /> : <FileUp className="w-3 h-3" />}
                                                            {task.status === 'rejected' ? 'Resubmit Work' : 'Submit Work'}
                                                            {submitWorkMutation.isPending && <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
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

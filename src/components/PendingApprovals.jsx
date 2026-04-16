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
  ArrowLeft 
} from 'lucide-react'
import { Link } from 'react-router-dom'

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
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Pending Approvals</h1>
                        <p className="text-gray-500">Review and approve new student registrations</p>
                    </div>
                </div>
                <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {pendingStudents?.length || 0} Pending
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : pendingStudents?.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserCheck className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">All caught up!</h3>
                    <p className="text-gray-500 mt-2">No pending student registrations to review.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingStudents?.map(student => (
                        <div key={student._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-xl uppercase shadow-inner">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate">{student.name}</h3>
                                        <div className="flex items-center gap-1 text-xs text-indigo-600 font-semibold uppercase tracking-wider">
                                            <BookOpen className="w-3 h-3" />
                                            {student.className} • {student.rollNumber}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="truncate">{student.email}</span>
                                    </div>
                                    {student.phone && (
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span>{student.phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span>Registered {new Date(student.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => approveMutation.mutate(student._id)}
                                        disabled={approveMutation.isPending || rejectMutation.isPending}
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
                                    >
                                        <UserCheck className="w-4 h-4" />
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => rejectMutation.mutate(student._id)}
                                        disabled={approveMutation.isPending || rejectMutation.isPending}
                                        className="bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 font-bold p-3 rounded-2xl transition-all flex items-center justify-center"
                                        title="Reject"
                                    >
                                        <UserX className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default PendingApprovals

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

  const handleVerify = async (status) => {
    if (status === 'rejected' && !rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }

    try {
      await verifySubmission.mutateAsync({
        id: task._id,
        data: {
          status,
          rejectionReason: status === 'rejected' ? rejectionReason : null
        }
      })
      setShowRejectInput(false)
      setRejectionReason('')
      onClose()
    } catch (error) {
      console.error('Error verifying submission:', error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {task.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-yellow-600" />
                  )}
                  <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : task.status === 'submitted'
                      ? 'bg-blue-100 text-blue-700'
                      : task.status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : isOverdue
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {task.questionDoc && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Question Document
                </h3>
                <a 
                  href={task.questionDoc} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Download Question Material</span>
                </a>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-xs font-medium text-gray-500 uppercase mb-3">Assigned To</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 font-medium">{task.studentId?.name || 'Unknown Student'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Class</p>
                      <p className="text-gray-900">{task.studentId?.className || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Roll Number</p>
                      <p className="text-gray-900">{task.studentId?.rollNumber || 'N/A'}</p>
                    </div>
                    {task.studentId?.email && (
                      <div className="col-span-2">
                        <p className="text-gray-500 text-xs">Email</p>
                        <p className="text-gray-900 text-sm">{task.studentId.email}</p>
                      </div>
                    )}
                    {task.studentId?.phone && (
                      <div className="col-span-2">
                        <p className="text-gray-500 text-xs">Phone</p>
                        <p className="text-gray-900 text-sm">{task.studentId.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-xs font-medium text-gray-500 uppercase mb-3">Timeline</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Due Date</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {format(new Date(task.dueDate), 'MMMM dd, yyyy')}
                    </p>
                    {task.status === 'pending' && (
                      <p className={`text-sm mt-1 ${
                        isOverdue 
                          ? 'text-red-600' 
                          : daysUntilDue <= 3 
                          ? 'text-orange-600' 
                          : 'text-gray-500'
                      }`}>
                        {isOverdue 
                          ? `Overdue by ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? 's' : ''}`
                          : daysUntilDue === 0
                          ? 'Due today'
                          : `Due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`
                        }
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Created</span>
                    </div>
                    <p className="text-gray-900">
                      {format(new Date(task.createdAt), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                    </p>
                  </div>

                  {task.updatedAt && task.updatedAt !== task.createdAt && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Last Updated</span>
                      </div>
                      <p className="text-gray-900">
                        {format(new Date(task.updatedAt), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {(task.status === 'completed' || task.status === 'submitted' || task.status === 'rejected') && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Submission Details
                </h3>
                
                {task.submissionDoc && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase mb-2">Submitted File</p>
                    <a 
                      href={task.submissionDoc} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-primary-500 transition-colors group"
                    >
                      <FileText className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
                      <span className="text-sm font-medium text-gray-700">Download Student Submission</span>
                    </a>
                  </div>
                )}

                {task.rejectionReason && task.status === 'rejected' && (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-red-900">Rejection Reason</p>
                        <p className="text-sm text-red-700 mt-1">{task.rejectionReason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {task.status === 'completed' && task.completedAt && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-900">Task Completed</p>
                        <p className="text-xs text-green-700">
                          Completed on {format(new Date(task.completedAt), 'MMMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {isAdmin && task.status === 'submitted' && (
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              {!showRejectInput ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleVerify('completed')}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    disabled={verifySubmission.isPending}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve & Complete
                  </button>
                  <button
                    onClick={() => setShowRejectInput(true)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    disabled={verifySubmission.isPending}
                  >
                    <XCircle className="w-4 h-4 mr-2 text-red-600" />
                    Reject Submission
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      placeholder="Provide a reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                      rows="3"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleVerify('rejected')}
                      className="flex-1 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
                      disabled={verifySubmission.isPending}
                    >
                      Confirm Rejection
                    </button>
                    <button
                      onClick={() => setShowRejectInput(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50"
                      disabled={verifySubmission.isPending}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-xl">
            <button
              onClick={onClose}
              className="btn-secondary w-full"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetailModal
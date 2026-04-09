import React from 'react'
import { X, Calendar, User, Clock, CheckCircle, Circle, BookOpen } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'

const TaskDetailModal = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null

  const isOverdue = new Date(task.dueDate) < new Date() && task.status === 'pending'
  const daysUntilDue = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))

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
                      : isOverdue
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {task.status === 'completed' 
                      ? 'Completed' 
                      : isOverdue 
                      ? 'Overdue' 
                      : 'Pending'}
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
            {task.description ? (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Description
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Description
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-400 italic">No description provided</p>
                </div>
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
import React, { useState, useMemo } from 'react'
import TaskModal from './TaskModal'
import TaskDetailModal from './TaskDetailModal'
import { useMarkTaskComplete, useDeleteTask, useStudents } from '../hooks/useApi'
import { Plus, CheckCircle, Circle, Trash2, Calendar, User, Filter, Pencil, Eye, Users as UsersIcon } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const TaskList = ({ tasks, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [viewingTask, setViewingTask] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterClass, setFilterClass] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState({})
  
  const { data: students = [] } = useStudents()
  const markComplete = useMarkTaskComplete()
  const deleteTask = useDeleteTask()

  const uniqueClasses = ['all', ...new Set(students.map(student => student.className))]

  const groupedTasks = useMemo(() => {
    const groups = {}
    
    tasks.forEach(task => {
      const key = `${task.title}_${task.description}_${task.dueDate}`
      if (!groups[key]) {
        groups[key] = {
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          status: task.status,
          tasks: []
        }
      }
      groups[key].tasks.push(task)
    })
    
    return Object.values(groups)
  }, [tasks])

  const filteredGroups = groupedTasks.filter(group => {
    const statusMatch = filterStatus === 'all' || group.status === filterStatus
    const classMatch = filterClass === 'all' || group.tasks.some(task => task.studentId?.className === filterClass)
    return statusMatch && classMatch
  })

  const handleToggleComplete = async (group) => {
    try {
      const promises = group.tasks
        .filter(task => task.status === 'pending')
        .map(task => markComplete.mutateAsync(task._id))
      
      if (promises.length > 0) {
        await Promise.all(promises)
        toast.success('Tasks marked as completed')
      }
    } catch (error) {
      toast.error('Failed to update tasks')
    }
  }

  const handleEdit = (group) => {
    setEditingTask(group)
    setIsModalOpen(true)
  }

  const handleView = (group) => {
    setViewingTask(group)
    setIsDetailModalOpen(true)
  }

  const handleDelete = async (group) => {
    const studentCount = group.tasks.length
    if (window.confirm(`Are you sure you want to delete "${group.title}" for ${studentCount} student${studentCount !== 1 ? 's' : ''}?`)) {
      try {
        await Promise.all(group.tasks.map(task => deleteTask.mutateAsync(task._id)))
        toast.success('Tasks deleted successfully')
      } catch (error) {
        toast.error('Failed to delete tasks')
      }
    }
  }

  const handleDeleteSingleTask = async (task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}" for ${task.studentId?.name}?`)) {
      try {
        await deleteTask.mutateAsync(task._id)
        toast.success('Task deleted successfully')
      } catch (error) {
        toast.error('Failed to delete task')
      }
    }
  }

  const toggleGroupExpansion = (groupKey) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }))
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setViewingTask(null)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const pendingCount = filteredGroups.filter(g => g.status === 'pending').length
  const completedCount = filteredGroups.filter(g => g.status === 'completed').length

  return (
    <div>
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">All Tasks</h2>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {(filterClass !== 'all' || filterStatus !== 'all') && (
                <span className="bg-primary-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  !
                </span>
              )}
            </button>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center justify-center space-x-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Assign Task</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="card p-4 space-y-4 bg-gray-50">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Class</h3>
              <div className="flex flex-wrap gap-4">
                {uniqueClasses.map((className) => (
                  <label key={className} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="classFilter"
                      value={className}
                      checked={filterClass === className}
                      onChange={(e) => setFilterClass(e.target.value)}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">
                      {className === 'all' ? ' All Classes' : className}
                    </span>
                    {className !== 'all' && (
                      <span className="text-xs text-gray-500">
                        ({students.filter(s => s.className === className).length})
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Status</h3>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="statusFilter"
                    value="all"
                    checked={filterStatus === 'all'}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700"> All Tasks</span>
                  <span className="text-xs text-gray-500">({filteredGroups.length})</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="statusFilter"
                    value="pending"
                    checked={filterStatus === 'pending'}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-700"> Pending</span>
                  <span className="text-xs text-gray-500">({pendingCount})</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="statusFilter"
                    value="submitted"
                    checked={filterStatus === 'submitted'}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700"> Submitted</span>
                  <span className="text-xs text-gray-500">({filteredGroups.filter(g => g.status === 'submitted').length})</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="statusFilter"
                    value="rejected"
                    checked={filterStatus === 'rejected'}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700"> Rejected</span>
                  <span className="text-xs text-gray-500">({filteredGroups.filter(g => g.status === 'rejected').length})</span>
                </label>
              </div>
            </div>

            {(filterClass !== 'all' || filterStatus !== 'all') && (
              <div className="pt-2 border-t border-gray-200">
                <button
                  onClick={() => {
                    setFilterClass('all')
                    setFilterStatus('all')
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {filteredGroups.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No tasks found</p>
          {(filterClass !== 'all' || filterStatus !== 'all') ? (
            <button
              onClick={() => {
                setFilterClass('all')
                setFilterStatus('all')
              }}
              className="btn-secondary mt-4"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary mt-4"
            >
              Assign Your First Task
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mb-3 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{filteredGroups.length}</span> task group{filteredGroups.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="space-y-3">
            {filteredGroups.map((group, index) => {
              const groupKey = `${group.title}_${index}`
              const isExpanded = expandedGroups[groupKey]
              const studentCount = group.tasks.length
              
              return (
                <div
                  key={groupKey}
                  className={`card p-4 hover:shadow-md transition-shadow ${
                    group.status === 'completed' ? 'opacity-75 bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => handleToggleComplete(group)}
                        className={`mt-0.5 transition-colors ${
                          group.status === 'completed'
                            ? 'text-green-600 hover:text-green-700'
                            : 'text-gray-400 hover:text-green-600'
                        }`}
                      >
                        {group.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-medium ${
                            group.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                          }`}>
                            {group.title}
                          </h3>
                          {studentCount > 1 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                              <UsersIcon className="w-3 h-3" />
                              {studentCount} students
                            </span>
                          )}
                        </div>
                        {group.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{group.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                          {studentCount === 1 ? (
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{group.tasks[0].studentId?.name || 'Unknown Student'}</span>
                              <span className="text-gray-400">•</span>
                              <span>{group.tasks[0].studentId?.className}</span>
                              <span className="text-gray-400">•</span>
                              <span>Roll: {group.tasks[0].studentId?.rollNumber}</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => toggleGroupExpansion(groupKey)}
                              className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                            >
                              <UsersIcon className="w-3 h-3" />
                              <span>{isExpanded ? 'Hide' : 'Show'} {studentCount} assigned students</span>
                            </button>
                          )}
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Due: {format(new Date(group.dueDate), 'MMM dd, yyyy')}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            group.status === 'completed' ? 'bg-green-100 text-green-700' :
                            group.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                            group.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                          </span>
                        </div>
                        
                        {isExpanded && studentCount > 1 && (
                          <div className="mt-3 pl-2 border-l-2 border-blue-200 space-y-2">
                            {group.tasks.map(task => (
                              <div key={task._id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                  <User className="w-3 h-3 text-gray-400" />
                                  <span className="text-gray-700">{task.studentId?.name}</span>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-gray-500">{task.studentId?.className}</span>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-gray-500">Roll: {task.studentId?.rollNumber}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleView(task)}
                                    className="text-blue-500 hover:text-blue-700 p-1"
                                    title="Verify Submission"
                                  >
                                    <Eye className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSingleTask(task)}
                                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                    title={`Remove from ${task.studentId?.name}`}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {studentCount === 1 ? (
                        <button
                          onClick={() => handleView(group.tasks[0])}
                          className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleGroupExpansion(groupKey)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                          title="View Students"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(group)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50"
                        title="Edit Task"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(group)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask}
      />

      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        task={viewingTask}
      />
    </div>
  )
}

export default TaskList
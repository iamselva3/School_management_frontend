import React, { useState, useMemo } from 'react'
import TaskModal from './TaskModal'
import TaskDetailModal from './TaskDetailModal'
import { useMarkTaskComplete, useDeleteTask, useStudents } from '../hooks/useApi'
import { Plus, CheckCircle, Circle, Trash2, Calendar, User, Filter, Pencil, Eye, Users as UsersIcon, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

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
      <div className="flex flex-col items-center justify-center py-32 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
        <Loader2 className="h-12 w-12 text-indigo-600 dark:text-indigo-400 animate-spin mb-6" />
        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Filtering Curriculum Pathways...</p>
      </div>
    )
  }

  const pendingCount = filteredGroups.filter(g => g.status === 'pending').length
  const completedCount = filteredGroups.filter(g => g.status === 'completed').length

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4 uppercase tracking-tighter">
              <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              Curriculum Tasks
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Active Academic Trajectories</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2 flex-grow sm:flex-grow-0 ${
                showFilters 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100 dark:shadow-none' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-800'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Logic Filters</span>
              {(filterClass !== 'all' || filterStatus !== 'all') && (
                <div className="w-2 h-2 rounded-full bg-white animate-pulse ml-1" />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center justify-center space-x-3 flex-grow sm:flex-grow-0"
            >
              <Plus className="w-5 h-5" />
              <span>Deploy Task</span>
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0, y: -20 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -20 }}
              className="overflow-hidden"
            >
              <div className="card p-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/20 shadow-2xl space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      Filter by Class
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {uniqueClasses.map((className) => (
                        <button
                          key={className}
                          onClick={() => setFilterClass(className)}
                          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 border ${
                            filterClass === className
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100 dark:shadow-none'
                              : 'bg-white/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:border-indigo-300'
                          }`}
                        >
                          {className === 'all' ? 'All Units' : className}
                          {className !== 'all' && (
                            <span className="ml-3 opacity-50 px-2 py-0.5 bg-black/5 dark:bg-white/5 rounded-md text-[9px]">
                               {students.filter(s => s.className === className).length}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                       Filter by State
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { id: 'all', label: 'Universal', count: filteredGroups.length, color: 'indigo-500' },
                        { id: 'pending', label: 'Pending', count: pendingCount, color: 'amber-500' },
                        { id: 'submitted', label: 'Submitted', count: filteredGroups.filter(g => g.status === 'submitted').length, color: 'blue-500' },
                        { id: 'rejected', label: 'Rejected', count: filteredGroups.filter(g => g.status === 'rejected').length, color: 'red-500' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setFilterStatus(item.id)}
                          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 border flex items-center gap-3 ${
                            filterStatus === item.id
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100 dark:shadow-none'
                              : 'bg-white/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:border-indigo-300'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full ${filterStatus === item.id ? 'bg-white' : `bg-${item.color}`}`} />
                          {item.label}
                          <span className="opacity-50 text-[9px]">({item.count})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {(filterClass !== 'all' || filterStatus !== 'all') && (
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                      onClick={() => {
                        setFilterClass('all')
                        setFilterStatus('all')
                      }}
                      className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:opacity-70 uppercase tracking-widest"
                    >
                      Reset All Logic Gates
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {filteredGroups.length === 0 ? (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-32 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800"
        >
          <div className="bg-slate-100 dark:bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
             <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Zero Curriculum Data</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">No results matched the specified logical restrictions.</p>
          {(filterClass !== 'all' || filterStatus !== 'all') ? (
            <button
              onClick={() => {
                setFilterClass('all')
                setFilterStatus('all')
              }}
              className="btn-secondary mt-10 px-10"
            >
              Default View State
            </button>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary mt-10 px-10"
            >
              Generate New Curricula
            </button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
               System Index: <span className="text-indigo-600 dark:text-indigo-400">{filteredGroups.length}</span> Active Segments
            </p>
          </div>
          
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.05 }
              }
            }}
            className="space-y-6"
          >
            {filteredGroups.map((group, index) => {
              const groupKey = `${group.title}_${index}`
              const isExpanded = expandedGroups[groupKey]
              const studentCount = group.tasks.length
              
              return (
                <motion.div
                  key={groupKey}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ x: 8 }}
                  className={`card group hover:shadow-2xl transition-all border-slate-100 dark:border-slate-800/50 relative overflow-hidden ${
                    group.status === 'completed' ? 'opacity-70 grayscale-[0.5]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-start space-x-6 flex-1">
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => handleToggleComplete(group)}
                        className={`mt-1 transition-all duration-300 ${
                          group.status === 'completed'
                            ? 'text-emerald-500'
                            : 'text-slate-200 dark:text-slate-700 hover:text-emerald-500'
                        }`}
                      >
                        {group.status === 'completed' ? (
                          <CheckCircle className="w-8 h-8" />
                        ) : (
                          <Circle className="w-8 h-8" />
                        )}
                      </motion.button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-4 mb-3">
                          <h3 className={`text-xl font-black tracking-tight uppercase truncate max-w-md ${
                            group.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'
                          }`}>
                            {group.title}
                          </h3>
                          {studentCount > 1 && (
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[10px] font-black rounded-lg uppercase tracking-wider shadow-sm">
                              <UsersIcon className="w-3.5 h-3.5" />
                              {studentCount} Students
                            </span>
                          )}
                        </div>
                        {group.description && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed font-medium line-clamp-2">{group.description}</p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-4">
                          {studentCount === 1 ? (
                            <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-xl shadow-inner border border-slate-200 dark:border-slate-800">
                              <User className="w-3.5 h-3.5 text-indigo-500" />
                              <span>{group.tasks[0].studentId?.name}</span>
                              <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                              <span className="uppercase tracking-[0.2em]">{group.tasks[0].studentId?.className}</span>
                            </div>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              onClick={() => toggleGroupExpansion(groupKey)}
                              className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:opacity-70 uppercase tracking-widest border-b-2 border-indigo-100 dark:border-indigo-900/30 pb-0.5"
                            >
                              {isExpanded ? 'Collapse Cluster' : `Explode ${studentCount} Task Instances`}
                            </motion.button>
                          )}
                          <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-xl shadow-inner border border-slate-200 dark:border-slate-800">
                            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                            <span>EXPIRES {format(new Date(group.dueDate), 'MMM dd, yyyy').toUpperCase()}</span>
                          </div>
                          <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
                            group.status === 'completed' ? 'bg-emerald-500 text-white shadow-emerald-200 dark:shadow-none' :
                            group.status === 'submitted' ? 'bg-blue-500 text-white shadow-blue-200 dark:shadow-none' :
                            group.status === 'rejected' ? 'bg-red-500 text-white shadow-red-200 dark:shadow-none' :
                            'bg-amber-500 text-white shadow-amber-200 dark:shadow-none'
                          }`}>
                            {group.status}
                          </span>
                        </div>
                        
                        <AnimatePresence>
                          {isExpanded && studentCount > 1 && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mt-8 space-y-3 border-l-4 border-indigo-100 dark:border-indigo-900/30 pl-6 py-2 overflow-hidden"
                            >
                              {group.tasks.map(task => (
                                <div key={task._id} className="flex items-center justify-between group/student p-4 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-white dark:hover:bg-slate-900 rounded-2xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-800 shadow-inner">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter shadow-sm border border-slate-100 dark:border-slate-700">
                                      {task.studentId?.className.slice(0, 2)}
                                    </div>
                                    <div>
                                      <p className="text-sm font-black text-slate-900 dark:text-white leading-none uppercase tracking-tight">{task.studentId?.name}</p>
                                      <p className="text-[10px] font-black text-slate-400 uppercase mt-2 tracking-widest">Roll: {task.studentId?.rollNumber}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 opacity-0 group-hover/student:opacity-100 transition-opacity">
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      onClick={() => handleView(task)}
                                      className="p-2.5 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                                      title="Verify Instance"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      onClick={() => handleDeleteSingleTask(task)}
                                      className="p-2.5 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                                      title="Purge Task"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </motion.button>
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity ml-8">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => studentCount === 1 ? handleView(group.tasks[0]) : toggleGroupExpansion(groupKey)}
                        className="p-3 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl transition-all shadow-sm border border-slate-100 dark:border-slate-700"
                        title="Focus Overview"
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleEdit(group)}
                        className="p-3 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl transition-all shadow-sm border border-slate-100 dark:border-slate-700"
                        title="Modify Cluster"
                      >
                        <Pencil className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleDelete(group)}
                        className="p-3 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-600 rounded-2xl transition-all shadow-sm border border-slate-100 dark:border-slate-700"
                        title="Purge Segment"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
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
    </motion.div>
  )
}

export default TaskList
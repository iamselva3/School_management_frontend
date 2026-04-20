import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateTask, useUpdateTask, useDeleteTask, useStudents, useBulkCreateTask } from '../hooks/useApi'
import { taskAPI } from '../services/endpoints'
import { X, ChevronDown, Users, Search, FileUp, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

const TaskModal = ({ isOpen, onClose, task }) => {
  const createTask = useCreateTask()
  const bulkCreateTask = useBulkCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const { data: students = [] } = useStudents()
  
  const [selectedStudents, setSelectedStudents] = useState([])
  const [originalStudentIds, setOriginalStudentIds] = useState([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      assignToAll: false
    }
  })

  const assignToAll = watch('assignToAll')
  const isEditMode = !!task

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        assignToAll: false
      })
      const originalIds = (task.tasks || []).map(t => t.studentId?._id).filter(Boolean)
      setSelectedStudents(originalIds)
      setOriginalStudentIds(originalIds)
      setSelectedFile(null)
    } else {
      reset({
        title: '',
        description: '',
        dueDate: '',
        assignToAll: false
      })
      setSelectedStudents([])
      setOriginalStudentIds([])
      setSelectedFile(null)
    }
  }, [task, reset, isOpen])

  useEffect(() => {
    if (!isEditMode && assignToAll) {
      setSelectedStudents(students.map(s => s._id))
    }
  }, [assignToAll, students, isEditMode])

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const groupedStudents = filteredStudents.reduce((acc, student) => {
    if (!acc[student.className]) {
      acc[student.className] = []
    }
    acc[student.className].push(student)
    return acc
  }, {})

  const sortedClasses = Object.keys(groupedStudents).sort()

  const allFilteredSelected = filteredStudents.length > 0 && 
    filteredStudents.every(s => selectedStudents.includes(s._id))

  const toggleStudent = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const toggleAllFiltered = () => {
    if (allFilteredSelected) {
      setSelectedStudents(prev => prev.filter(id => 
        !filteredStudents.some(s => s._id === id)
      ))
    } else {
      const filteredIds = filteredStudents.map(s => s._id)
      setSelectedStudents(prev => [...new Set([...prev, ...filteredIds])])
    }
  }

  const toggleAllInClass = (className) => {
    const classStudentIds = groupedStudents[className].map(s => s._id)
    const allSelected = classStudentIds.every(id => selectedStudents.includes(id))
    
    if (allSelected) {
      setSelectedStudents(prev => prev.filter(id => !classStudentIds.includes(id)))
    } else {
      setSelectedStudents(prev => [...new Set([...prev, ...classStudentIds])])
    }
  }

  const selectAllStudents = () => {
    setSelectedStudents(students.map(s => s._id))
  }

  const clearAll = () => {
    setSelectedStudents([])
  }

  const onSubmit = async (data) => {
    try {
      const studentsToAssign = assignToAll ? students.map(s => s._id) : selectedStudents
      
      if (studentsToAssign.length === 0) {
        alert('Please select at least one student')
        return
      }

      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('dueDate', new Date(data.dueDate).toISOString())
      if (selectedFile) {
        formData.append('doc', selectedFile)
      }

      if (isEditMode) {
        // For simplicity in edit mode with files, we'll update the group info
        // Note: Real bulk update with shared file across multiple task IDs would go here
        const updatePromises = task.tasks.map(t => {
           const updatePayload = { ...data, id: t._id }
           // In a real app, you'd handle file update per task or shared
           return updateTask.mutateAsync({
             id: t._id,
             title: data.title,
             description: data.description,
             dueDate: new Date(data.dueDate).toISOString()
           })
        })
        await Promise.all(updatePromises)
      } else {
        formData.append('studentIds', JSON.stringify(studentsToAssign))
        await bulkCreateTask.mutateAsync(formData)
      }
      
      reset()
      setSelectedStudents([])
      setOriginalStudentIds([])
      setSelectedFile(null)
      setSearchTerm('')
      onClose()
    } catch (error) {
      console.error('Error submitting task:', error)
      toast.error('Failed to process task. Please try again.')
    }
  }

  if (!isOpen) return null

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const selectedCount = selectedStudents.length
  const totalStudents = students.length
  const isSubmitting = createTask.isPending || updateTask.isPending || deleteTask.isPending

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
            className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
            
            <div className="sticky top-0 z-20 px-10 py-8 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                    {isEditMode ? 'Modify Directive' : 'Deploy Task'}
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-2">
                    {isEditMode ? 'Calibrate existing curriculum parameters' : 'Initialize academic trajectory assignment'}
                  </p>
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

            <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-10">
              <div className="space-y-8">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Title Registry *
                  </label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    className="w-full px-6 py-4 bg-slate-100/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-black text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 uppercase"
                    placeholder="e.g., QUANTUM PHYSICS MODULE A"
                    disabled={isSubmitting}
                  />
                  {errors.title && (
                    <p className="text-rose-500 text-[10px] font-black uppercase tracking-tighter ml-2">{errors.title.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Executive Summary
                  </label>
                  <textarea
                    {...register('description')}
                    className="w-full px-6 py-4 bg-slate-100/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 min-h-[120px]"
                    placeholder="Detail curriculum objectives and deliverables..."
                    disabled={isSubmitting}
                  />
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Expiration Threshold *
                  </label>
                  <input
                    type="date"
                    {...register('dueDate', { required: 'Due date is required' })}
                    className="w-full px-6 py-4 bg-slate-100/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-black text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all uppercase tracking-widest"
                    min={minDate}
                    disabled={isSubmitting}
                  />
                  {errors.dueDate && (
                    <p className="text-rose-500 text-[10px] font-black uppercase tracking-tighter ml-2">{errors.dueDate.message}</p>
                  )}
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Support Documentation
                  </label>
                  <div className="relative group">
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      disabled={isSubmitting}
                    />
                    <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] bg-slate-50/50 dark:bg-slate-950/20 group-hover:bg-white dark:group-hover:bg-slate-900 transition-all duration-300 group-hover:border-indigo-500 shadow-inner overflow-hidden">
                      {selectedFile ? (
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex flex-col items-center space-y-4"
                        >
                           <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl">
                              <FileText className="w-10 h-10 text-white" />
                           </div>
                           <div className="text-center">
                              <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight truncate max-w-[300px]">{selectedFile.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • READY FOR CALIBRATION</p>
                           </div>
                        </motion.div>
                      ) : (
                        <div className="text-center space-y-4">
                           <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto transition-transform group-hover:-translate-y-2 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30">
                              <FileUp className="h-8 w-8 text-slate-400 group-hover:text-indigo-600" />
                           </div>
                           <div>
                              <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Transmit Protocol File</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">PDF, DOCX, IMG MAX 10MB</p>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Assignment Cluster */}
                <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <label className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-3">
                       <div className="p-2 bg-indigo-600 rounded-lg shadow-lg">
                          <Users className="w-3 h-3 text-white" />
                       </div>
                       Target Personnel Cluster
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={selectAllStudents}
                        className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:opacity-70 uppercase tracking-widest transition-all"
                        disabled={isSubmitting}
                      >
                        Global Select
                      </button>
                      <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <button
                        type="button"
                        onClick={clearAll}
                        className="text-[10px] font-black text-slate-400 dark:text-slate-500 hover:text-rose-500 uppercase tracking-widest transition-all"
                        disabled={isSubmitting}
                      >
                        Purge Selection
                      </button>
                    </div>
                  </div>

                  {!isEditMode && (
                    <label className="group block p-6 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-3xl cursor-pointer hover:bg-white dark:hover:bg-slate-900 transition-all duration-300 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${assignToAll ? 'bg-indigo-600 shadow-lg' : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700'}`}>
                             {assignToAll && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                          </div>
                          <input
                            type="checkbox"
                            {...register('assignToAll')}
                            className="hidden"
                            disabled={isSubmitting}
                          />
                          <div>
                            <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Universal Broadcast Mode</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Assign to all current and future personnel units</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  )}

                  {isEditMode && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-4 animate-pulse">
                      <div className="p-2 bg-amber-500 rounded-lg shadow-lg shadow-amber-200 dark:shadow-none">
                         <X className="w-3 h-3 text-white rotate-45" />
                      </div>
                      <p className="text-[10px] font-black text-amber-700 dark:text-amber-500 uppercase tracking-widest leading-relaxed">
                        Modifying will calibrate this directive for all linked units. Personnel removal will result in data purge.
                      </p>
                    </div>
                  )}

                  {(!assignToAll || isEditMode) && (
                    <div className="border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl bg-white/50 dark:bg-slate-950/30">
                      <div className="p-6 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Personnel Matrix: <span className="text-indigo-600">{selectedCount}</span> / <span className="text-slate-900 dark:text-white">{totalStudents}</span> INDEXED
                         </p>
                         <motion.button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all"
                            disabled={isSubmitting}
                         >
                            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-500 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                         </motion.button>
                      </div>

                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                               <div className="relative group">
                                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                  <input
                                    type="text"
                                    placeholder="IDENTIFY BY NAME, COHORT, OR SERIAL..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 uppercase tracking-widest shadow-inner group-hover:border-slate-300"
                                    disabled={isSubmitting}
                                  />
                               </div>
                            </div>

                            <div className="max-h-72 overflow-y-auto p-4 space-y-4">
                              <div className="px-2">
                                <label className="flex items-center gap-4 cursor-pointer group">
                                  <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${allFilteredSelected ? 'bg-indigo-600 shadow-md' : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
                                     {allFilteredSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
                                  </div>
                                  <input
                                    type="checkbox"
                                    checked={allFilteredSelected}
                                    onChange={toggleAllFiltered}
                                    className="hidden"
                                    disabled={isSubmitting}
                                  />
                                  <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest group-hover:text-indigo-600">Universal Visible Selection ({filteredStudents.length})</span>
                                </label>
                              </div>

                              {Object.keys(groupedStudents).length === 0 ? (
                                <div className="py-10 text-center space-y-3">
                                  <Users className="w-10 h-10 mx-auto text-slate-200 dark:text-slate-800" />
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Personnel Identification Failure</p>
                                </div>
                              ) : (
                                sortedClasses.map((className) => {
                                  const classStudents = groupedStudents[className]
                                  const allClassSelected = classStudents.every(s => selectedStudents.includes(s._id))
                                  const someClassSelected = classStudents.some(s => selectedStudents.includes(s._id))
                                  
                                  return (
                                    <div key={className} className="bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/50">
                                      <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                           <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${allClassSelected ? 'bg-indigo-600 shadow-sm' : someClassSelected ? 'bg-indigo-400' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
                                              {allClassSelected ? <Check className="w-3 h-3 text-white" strokeWidth={4} /> : someClassSelected ? <div className="w-2 h-0.5 bg-white rounded-full" /> : null}
                                           </div>
                                           <input
                                              type="checkbox"
                                              checked={allClassSelected}
                                              onChange={() => toggleAllInClass(className)}
                                              className="hidden"
                                              disabled={isSubmitting}
                                           />
                                           <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{className}</span>
                                        </div>
                                        <motion.button
                                          type="button"
                                          whileHover={{ x: 3 }}
                                          onClick={() => toggleAllInClass(className)}
                                          className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest"
                                          disabled={isSubmitting}
                                        >
                                          {allClassSelected ? 'Unlink Unit' : 'Link Unit'}
                                        </motion.button>
                                      </div>
                                      
                                      <div className="divide-y divide-slate-100 dark:divide-slate-800/30">
                                        {classStudents.map((student) => (
                                          <label
                                            key={student._id}
                                            className="flex items-center gap-4 px-6 py-3.5 hover:bg-white dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-300"
                                          >
                                            <div className={`w-4 h-4 rounded flex items-center justify-center transition-all ${selectedStudents.includes(student._id) ? 'bg-indigo-600' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700'}`}>
                                               {selectedStudents.includes(student._id) && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                                            </div>
                                            <input
                                              type="checkbox"
                                              checked={selectedStudents.includes(student._id)}
                                              onChange={() => toggleStudent(student._id)}
                                              className="hidden"
                                              disabled={isSubmitting}
                                            />
                                            <div className="flex-1 flex items-center justify-between">
                                              <div>
                                                <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{student.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Serial: {student.rollNumber}</p>
                                              </div>
                                              {student.email && (
                                                <span className="hidden sm:block text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">{student.email}</span>
                                              )}
                                            </div>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  )
                                })
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {!isEditMode && assignToAll && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-indigo-600 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                         <Users className="w-32 h-32" />
                      </div>
                      <div className="relative z-10 space-y-4">
                        <p className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                           Universal Broadcast Initialized
                        </p>
                        <div className="space-y-2">
                           <div className="flex items-center gap-3 text-[10px] font-bold">
                              <Check className="w-4 h-4 text-emerald-300" strokeWidth={3} />
                              <span className="uppercase tracking-widest">Active Personnel: {totalStudents} Units Targeted</span>
                           </div>
                           <div className="flex items-center gap-3 text-[10px] font-bold">
                              <Check className="w-4 h-4 text-emerald-300" strokeWidth={3} />
                              <span className="uppercase tracking-widest">Latency: Automatic Enrollment for Future Personnel</span>
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-6 pt-10 border-t border-slate-100 dark:border-slate-800">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-10 py-5 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all"
                  disabled={isSubmitting}
                >
                  Terminate
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting || selectedStudents.length === 0}
                  className="px-12 py-5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-indigo-200 dark:shadow-none transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center space-x-3">
                      <Loader2 className="animate-spin h-4 w-4" />
                      <span>{isEditMode ? 'TRANSMITTING...' : 'INITIALIZING...'}</span>
                    </span>
                  ) : (
                    isEditMode 
                      ? `Calibrate for ${selectedCount} PERSONNEL`
                      : `Deploy to ${assignToAll ? 'GLOBAL Personnel' : `${selectedCount} PERSONNEL`}`
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}

export default TaskModal
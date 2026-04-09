import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateTask, useUpdateTask, useDeleteTask, useStudents } from '../hooks/useApi'
import { taskAPI } from '../services/endpoints'
import { X, ChevronDown, Users, Search } from 'lucide-react'
import toast from 'react-hot-toast'

const TaskModal = ({ isOpen, onClose, task }) => {
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const { data: students = [] } = useStudents()
  
  const [selectedStudents, setSelectedStudents] = useState([])
  const [originalStudentIds, setOriginalStudentIds] = useState([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
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
    } else {
      reset({
        title: '',
        description: '',
        dueDate: '',
        assignToAll: false
      })
      setSelectedStudents([])
      setOriginalStudentIds([])
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
      if (isEditMode) {
        const currentSelected = selectedStudents
        if (currentSelected.length === 0) {
          alert('Please select at least one student')
          return
        }

        const studentsToRemove = originalStudentIds.filter(id => !currentSelected.includes(id))
        const studentsToAdd = currentSelected.filter(id => !originalStudentIds.includes(id))
        const studentsToUpdate = currentSelected.filter(id => originalStudentIds.includes(id))
        
        const deletePromises = studentsToRemove.map(studentId => {
          const taskToDelete = task.tasks.find(t => t.studentId?._id === studentId)
          if (taskToDelete) return deleteTask.mutateAsync(taskToDelete._id)
          return Promise.resolve()
        })

        const createPromises = studentsToAdd.map(studentId => 
          createTask.mutateAsync({
            title: data.title,
            description: data.description,
            studentId,
            dueDate: new Date(data.dueDate).toISOString()
          })
        )

        const updatePromises = studentsToUpdate.map(studentId => {
          const taskToUpdate = task.tasks.find(t => t.studentId?._id === studentId)
          if (taskToUpdate) {
            return updateTask.mutateAsync({
              id: taskToUpdate._id,
              title: data.title,
              description: data.description,
              dueDate: new Date(data.dueDate).toISOString()
            })
          }
          return Promise.resolve()
        })

        await Promise.all([...deletePromises, ...createPromises, ...updatePromises])
        toast.success('Tasks updated successfully')

      } else {
        const studentsToAssign = assignToAll ? students.map(s => s._id) : selectedStudents
        
        if (studentsToAssign.length === 0) {
          alert('Please select at least one student')
          return
        }

        const createPromises = studentsToAssign.map(studentId => 
          createTask.mutateAsync({
            title: data.title,
            description: data.description,
            studentId,
            dueDate: new Date(data.dueDate).toISOString()
          })
        )

        await Promise.all(createPromises)
        toast.success('Tasks assigned successfully')
      }
      
      reset()
      setSelectedStudents([])
      setOriginalStudentIds([])
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl z-10">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditMode ? 'Edit Task' : 'Assign New Task'}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {isEditMode ? 'Update task details and reassign to students' : 'Assign to one or multiple students'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title *
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                className="input-field"
                placeholder="e.g., Math Homework"
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                className="input-field"
                rows="3"
                placeholder="Task details..."
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                {...register('dueDate', { required: 'Due date is required' })}
                className="input-field"
                min={minDate}
                disabled={isSubmitting}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  {isEditMode ? 'Reassign To *' : 'Assign To *'}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={selectAllStudents}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                    disabled={isSubmitting}
                  >
                    Select All Students
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                    disabled={isSubmitting}
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {!isEditMode && (
                <div className="mb-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('assignToAll')}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Assign to all current and future students
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-6">
                    This will automatically assign the task to all existing students and any new students added later
                  </p>
                </div>
              )}

              {isEditMode && (
                <div className="mb-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800">
                    ⚠️ Editing will update this task for all selected students. 
                    Students removed from selection will have this task deleted.
                  </p>
                </div>
              )}

              {(!assignToAll || isEditMode) && (
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {selectedCount} of {totalStudents} students selected
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={isSubmitting}
                      >
                        <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {isDropdownOpen && (
                    <div>
                      <div className="p-3 border-b border-gray-200 bg-white">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search by name, class or roll number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className="max-h-64 overflow-y-auto">
                        <div className="p-3 bg-gray-50 border-b border-gray-200">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={allFilteredSelected}
                              onChange={toggleAllFiltered}
                              className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                              disabled={isSubmitting}
                            />
                            <span className="text-sm font-medium text-gray-700">
                              Select All Visible Students
                            </span>
                            <span className="text-xs text-gray-500">
                              ({filteredStudents.length})
                            </span>
                          </label>
                        </div>

                        {Object.keys(groupedStudents).length === 0 ? (
                          <div className="p-6 text-center text-gray-500">
                            <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p>No students found</p>
                            <p className="text-xs mt-1">Try adjusting your search</p>
                          </div>
                        ) : (
                          sortedClasses.map((className) => {
                            const classStudents = groupedStudents[className]
                            const allClassSelected = classStudents.every(s => selectedStudents.includes(s._id))
                            const someClassSelected = classStudents.some(s => selectedStudents.includes(s._id))
                            
                            return (
                              <div key={className} className="border-b border-gray-100 last:border-b-0">
                                <div className="px-3 py-2 bg-gray-50 flex items-center justify-between border-b border-gray-100">
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      checked={allClassSelected}
                                      ref={el => el && (el.indeterminate = !allClassSelected && someClassSelected)}
                                      onChange={() => toggleAllInClass(className)}
                                      className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                                      disabled={isSubmitting}
                                    />
                                    <span className="text-sm font-semibold text-gray-700">{className}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-500">{classStudents.length} students</span>
                                    <button
                                      type="button"
                                      onClick={() => toggleAllInClass(className)}
                                      className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                      disabled={isSubmitting}
                                    >
                                      {allClassSelected ? 'Deselect All' : 'Select All'}
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="divide-y divide-gray-100">
                                  {classStudents.map((student) => (
                                    <label
                                      key={student._id}
                                      className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selectedStudents.includes(student._id)}
                                        onChange={() => toggleStudent(student._id)}
                                        className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                                        disabled={isSubmitting}
                                      />
                                      <div className="flex-1 flex items-center justify-between">
                                        <div>
                                          <span className="text-sm text-gray-900 font-medium">{student.name}</span>
                                          <span className="text-xs text-gray-500 ml-2">Roll: {student.rollNumber}</span>
                                        </div>
                                        {student.email && (
                                          <span className="text-xs text-gray-400">{student.email}</span>
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
                    </div>
                  )}
                </div>
              )}

              {!isEditMode && assignToAll && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Task will be assigned to all students
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        ✓ Currently {totalStudents} student{totalStudents !== 1 ? 's' : ''} will receive this task
                      </p>
                      <p className="text-xs text-blue-700">
                        ✓ Any new students added in the future will also receive this task
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || selectedStudents.length === 0}
                className="btn-primary"
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    <span>{isEditMode ? 'Updating...' : 'Assigning...'}</span>
                  </span>
                ) : (
                  isEditMode 
                    ? `Update for ${selectedCount} Student${selectedCount !== 1 ? 's' : ''}`
                    : `Assign to ${assignToAll ? 'All' : selectedCount} Student${selectedCount !== 1 ? 's' : ''}`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TaskModal
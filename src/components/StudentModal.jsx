import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateStudent, useUpdateStudent } from '../hooks/useApi'
import { X } from 'lucide-react'

const StudentModal = ({ isOpen, onClose, student }) => {
  const createStudent = useCreateStudent()
  const updateStudent = useUpdateStudent()
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      className: '',
      rollNumber: '',
      phone: ''
    }
  })

  useEffect(() => {
    if (student) {
      reset({
        name: student.name,
        email: student.email,
        className: student.className,
        rollNumber: student.rollNumber,
        phone: student.phone || ''
      })
    } else {
      reset({
        name: '',
        email: '',
        className: '',
        rollNumber: '',
        phone: ''
      })
    }
  }, [student, reset])

  const onSubmit = (data) => {
    if (student) {
      updateStudent.mutate({ id: student._id, ...data }, {
        onSuccess: onClose
      })
    } else {
      createStudent.mutate(data, {
        onSuccess: onClose
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {student ? 'Edit Student' : 'Add New Student'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="input-field"
                placeholder="Enter student name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="input-field"
                placeholder="student@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class *
                </label>
                <input
                  {...register('className', { required: 'Class is required' })}
                  className="input-field"
                  placeholder="e.g., Class 10"
                />
                {errors.className && (
                  <p className="text-red-500 text-xs mt-1">{errors.className.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Roll Number *
                </label>
                <input
                  {...register('rollNumber', { required: 'Roll number is required' })}
                  className="input-field"
                  placeholder="e.g., 2024001"
                />
                {errors.rollNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.rollNumber.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone (Optional)
              </label>
              <input
                {...register('phone')}
                className="input-field"
                placeholder="Enter phone number"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createStudent.isPending || updateStudent.isPending}
                className="btn-primary"
              >
                {createStudent.isPending || updateStudent.isPending
                  ? 'Saving...'
                  : student ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default StudentModal
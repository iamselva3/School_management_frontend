import React, { useState } from 'react'
import StudentModal from './StudentModal'
import { useDeleteStudent } from '../hooks/useApi'
import { Plus, Pencil, Trash2, Mail, Phone, GraduationCap } from 'lucide-react'

const StudentList = ({ students, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const deleteStudent = useDeleteStudent()

  const handleEdit = (student) => {
    setEditingStudent(student)
    setIsModalOpen(true)
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteStudent.mutate(id)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingStudent(null)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">All Students</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Student</span>
        </button>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-12">
          <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No students added yet</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary mt-4"
          >
            Add Your First Student
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <div key={student._id} className="card hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-500">Roll No: {student.rollNumber}</p>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(student)}
                    className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(student._id, student.name)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{student.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{student.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {student.className}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <StudentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        student={editingStudent}
      />
    </div>
  )
}

export default StudentList
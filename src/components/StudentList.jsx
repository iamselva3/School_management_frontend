import React, { useState } from 'react'
import StudentModal from './StudentModal'
import { useDeleteStudent } from '../hooks/useApi'
import { Plus, Pencil, Trash2, Mail, Phone, GraduationCap, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

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
      <div className="flex flex-col items-center justify-center py-32 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
        <Loader2 className="h-12 w-12 text-indigo-600 dark:text-indigo-400 animate-spin mb-6" />
        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Synchronizing Student Database...</p>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4 uppercase tracking-tighter">
            <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none">
               <GraduationCap className="w-6 h-6 text-white" />
            </div>
            Population Directory
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Active Personnel Management</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-3 w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          <span>Register Student</span>
        </motion.button>
      </div>

      {students.length === 0 ? (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-32 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800"
        >
          <div className="bg-slate-100 dark:bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
             <GraduationCap className="w-12 h-12 text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Zero Enrollment</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">The institution currently has no active student records.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary mt-10 px-10"
          >
            Initiate First Entry
          </button>
        </motion.div>
      ) : (
        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.04 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {students.map((student) => (
            <motion.div 
              key={student._id}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                show: { opacity: 1, y: 0, scale: 1 }
              }}
              whileHover={{ 
                y: -10,
                rotateY: 2,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="card group border-slate-100 dark:border-slate-800/50 relative overflow-hidden perspective-1000"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-full -mr-20 -mt-20 group-hover:bg-indigo-500/10 transition-colors duration-500" />
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex-1">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tighter leading-tight">{student.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">ID CODE:</span>
                     <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{student.rollNumber}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(student)}
                    className="p-3 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all shadow-sm"
                  >
                    <Pencil className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(student._id, student.name)}
                    className="p-3 text-slate-400 hover:text-red-600 bg-slate-100 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 rounded-2xl border border-transparent hover:border-red-100 dark:hover:border-red-900/30 transition-all shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-center space-x-4 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <Mail className="w-4 h-4 text-indigo-500" />
                  </div>
                  <span className="truncate text-xs font-bold leading-none">{student.email}</span>
                </div>
                <div className="flex items-center space-x-4 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <Phone className="w-4 h-4 text-indigo-500" />
                  </div>
                  <span className="text-xs font-bold leading-none">{student.phone || 'COMMS PENDING'}</span>
                </div>
                
                <div className="pt-4 flex items-center justify-between">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CURRENT COHORT</span>
                   <span className="px-5 py-2 bg-indigo-600 dark:bg-indigo-500 text-white text-[10px] font-black rounded-xl uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 dark:shadow-none">
                    {student.className}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <StudentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        student={editingStudent}
      />
    </motion.div>
  )
}

export default StudentList
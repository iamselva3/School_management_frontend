import React, { useState, useMemo } from 'react'
import AttendanceList from './AttendanceList'
import { GraduationCap, Calendar, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const AttendanceView = ({ students }) => {
  const [selectedClass, setSelectedClass] = useState(null)
  
  // Extract unique classes from student list
  const classes = useMemo(() => {
    const uniqueClasses = [...new Set(students.map(s => s.className))]
    return uniqueClasses.sort()
  }, [students])

  if (selectedClass) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-8"
      >
        <button 
          onClick={() => setSelectedClass(null)}
          className="group flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:opacity-70"
        >
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl group-hover:-translate-x-1 transition-transform">
             <span className="text-xl leading-none">←</span>
          </div>
          Return to Registry
        </button>
        
        <motion.div 
          layoutId={`card-${selectedClass}`}
          className="card overflow-hidden !p-0 border-indigo-100 dark:border-indigo-900/30 shadow-2xl"
        >
          <div className="bg-slate-50/50 dark:bg-slate-950/20 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 p-10">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Cohort: {selectedClass}</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] mt-2">Attendance Matrix Calibration</p>
              </div>
            </div>
          </div>
          <AttendanceList className={selectedClass} />
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      }}
      className="space-y-10"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {classes.length > 0 ? (
          classes.map((cls) => (
            <motion.button
              key={cls}
              layoutId={`card-${cls}`}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                show: { opacity: 1, y: 0, scale: 1 }
              }}
              whileHover={{ 
                y: -10,
                rotateY: 5,
                rotateX: -2,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedClass(cls)}
              className="card group !p-10 relative overflow-hidden text-left border-slate-100 dark:border-slate-800/50 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors"
            >
              {/* Abstract Symbol */}
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                <GraduationCap className="h-48 w-48 text-indigo-600 dark:text-indigo-400" />
              </div>
              
              <div className="relative z-10">
                <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:shadow-xl group-hover:shadow-indigo-100 dark:shadow-none transition-all duration-500">
                  <GraduationCap className="h-10 w-10 text-slate-400 dark:text-slate-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tighter leading-none">
                  Unit {cls}
                </h3>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-10 uppercase tracking-widest">
                  {students.filter(s => s.className === cls).length} ACTIVE PERSONNEL
                </p>
                
                <div className="flex items-center gap-3 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em]">
                  Calibrate Attendance
                  <ChevronRight className="h-5 w-5 transform group-hover:translate-x-3 transition-transform" />
                </div>
              </div>
            </motion.button>
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-white/30 dark:bg-slate-900/30 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="bg-slate-100 dark:bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
               <GraduationCap className="h-12 w-12 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Deployment Empty</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Add students to initialize class attendance matrices.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default AttendanceView

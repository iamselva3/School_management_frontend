import React, { useState, useMemo } from 'react'
import Navbar from './Navbar'
import StudentList from './StudentList'
import TaskList from './TaskList'
import StatCard from './StatCard'
import RankList from './RankList'
import AttendanceView from './AttendanceView'
import { useStudents, useTasks } from '../hooks/useApi'
import { Users, Clipboard, CheckCircle2, Clock, UserCheck, Trophy, FileText, CalendarCheck } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { studentAPI } from '../services/endpoints'
import { motion, AnimatePresence } from 'framer-motion'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('students')
  const { data: students = [], isLoading: studentsLoading } = useStudents()
  const { data: tasks = [], isLoading: tasksLoading } = useTasks()

  const { data: pendingStudents = [] } = useQuery({
    queryKey: ['pendingStudents'],
    queryFn: studentAPI.getPending,
    staleTime: 30000
  })

  const uniqueTasks = useMemo(() => {
    const groups = {}
    tasks.forEach(task => {
      const key = `${task.title}_${task.description}_${task.dueDate}`
      if (!groups[key]) {
        groups[key] = {
          ...task,
          status: task.status
        }
      } else {
        // If any task in the group is completed, maybe mark group as completed? 
        // Or if any is pending, mark group as pending? Let's match TaskList behavior
        // TaskList just takes the first task's status for the group status initially
      }
    })
    return Object.values(groups)
  }, [tasks])

  const submittedTasks = uniqueTasks.filter(task => task.status === 'submitted')
  const pendingTasks = uniqueTasks.filter(task => task.status === 'pending' || task.status === 'rejected')
  const completedTasks = uniqueTasks.filter(task => task.status === 'completed')

  const stats = [
    {
      title: 'Total Students',
      value: students.length,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Pending Students',
      value: pendingStudents.length,
      icon: UserCheck,
      color: 'bg-pink-500'
    },
    {
      title: 'Total Tasks',
      value: uniqueTasks.length,
      icon: Clipboard,
      color: 'bg-purple-500'
    },
    {
      title: 'Pending Tasks',
      value: pendingTasks.length,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Submitted',
      value: submittedTasks.length,
      icon: FileText,
      color: 'bg-indigo-500'
    },
    {
      title: 'Completed',
      value: completedTasks.length,
      icon: CheckCircle2,
      color: 'bg-green-500'
    }
  ]

  return (
    <div className="min-h-screen transition-colors duration-500">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="h-1 w-12 bg-indigo-600 rounded-full" />
               <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em]">System Overview</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Academic <span className="text-indigo-600">Command</span></h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase tracking-widest text-xs">Directing Institutional Performance & Data Flow</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-2 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
             <div className="px-4 py-2 text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Current Cycle</p>
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase leading-tight">Academic 2026</p>
             </div>
             <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
             <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
                <CalendarCheck className="w-5 h-5" />
             </div>
          </div>
        </motion.div>

        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.9 },
                show: { opacity: 1, y: 0, scale: 1 }
              }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="card p-0 overflow-hidden glass-card"
        >
          <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20">
            <nav className="flex flex-wrap gap-4">
              {[
                { id: 'students', label: 'Personnel Registry' },
                { id: 'tasks', label: 'Operational Directives' },
                { id: 'rankings', label: 'Elite Leaderboard' },
                { id: 'attendance', label: 'Temporal Attendance' }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700'
                  }`}
                >
                  {tab.label}
                </motion.button>
              ))}
            </nav>
          </div>

          <div className="p-6 overflow-hidden relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, rotateY: 15, x: 50 }}
                animate={{ opacity: 1, rotateY: 0, x: 0 }}
                exit={{ opacity: 0, rotateY: -15, x: -50 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {activeTab === 'students' ? (
                  <StudentList students={students} isLoading={studentsLoading} />
                ) : activeTab === 'tasks' ? (
                  <TaskList tasks={tasks} isLoading={tasksLoading} />
                ) : activeTab === 'rankings' ? (
                  <RankList />
                ) : (
                  <AttendanceView students={students} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default Dashboard
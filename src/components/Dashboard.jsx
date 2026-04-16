import React, { useState, useMemo } from 'react'
import Navbar from './Navbar'
import StudentList from './StudentList'
import TaskList from './TaskList'
import StatCard from './StatCard'
import RankList from './RankList'
import { useStudents, useTasks } from '../hooks/useApi'
import { Users, Clipboard, CheckCircle2, Clock, UserCheck, Trophy, FileText } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { studentAPI } from '../services/endpoints'

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage students and track assignments</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="card p-0 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('students')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'students'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'tasks'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tasks
              </button>
              <button
                onClick={() => setActiveTab('rankings')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'rankings'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Rankings
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'students' ? (
              <StudentList students={students} isLoading={studentsLoading} />
            ) : activeTab === 'tasks' ? (
              <TaskList tasks={tasks} isLoading={tasksLoading} />
            ) : (
              <RankList />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
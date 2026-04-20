import React, { useState, useEffect } from 'react'
import { useAttendance, useSaveAttendance } from '../hooks/useApi'
import { Calendar, Save, Check, X, Loader2, UserCheck, UserX, Search } from 'lucide-react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'

const AttendanceList = ({ className }) => {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [localRecords, setLocalRecords] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const { data: attendanceData, isLoading, isFetching } = useAttendance(className, date)
  const saveAttendanceMutation = useSaveAttendance()

  useEffect(() => {
    if (attendanceData?.records) {
      setLocalRecords(attendanceData.records.map(record => ({
        studentId: record.studentId._id || record.studentId,
        name: record.studentId.name,
        rollNumber: record.studentId.rollNumber,
        status: record.status
      })))
    }
  }, [attendanceData])

  const handleStatusChange = (studentId, status) => {
    setLocalRecords(prev => 
      prev.map(record => 
        record.studentId === studentId ? { ...record, status } : record
      )
    )
  }

  const handleSave = () => {
    const recordsToSave = localRecords.map(r => ({
      studentId: r.studentId,
      status: r.status
    }))
    saveAttendanceMutation.mutate({ className, date, records: recordsToSave })
  }

  // Filter records based on search term
  const filteredRecords = localRecords.filter(record => 
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 m-8">
        <Loader2 className="h-12 w-12 text-indigo-600 dark:text-indigo-400 animate-spin mb-6" />
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Synchronizing Personnel Records...</p>
      </div>
    )
  }

  return (
    <div className="p-10 space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
          <div className="relative group flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-indigo-500 transition-colors">
              <Calendar className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-black text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all uppercase tracking-widest shadow-inner group-hover:border-slate-300"
            />
          </div>

          <div className="relative group flex-[1.5]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-indigo-500 transition-colors">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="IDENTIFY STUDENT BY NAME OR SERIAL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-black text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder-slate-400 uppercase tracking-widest shadow-inner group-hover:border-slate-300"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saveAttendanceMutation.isPending || localRecords.length === 0}
          className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-indigo-100 dark:shadow-none"
        >
          {saveAttendanceMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saveAttendanceMutation.isPending ? 'TRANSMITTING...' : 'COMMIT ATTENDANCE'}
        </motion.button>
      </div>

      {filteredRecords.length > 0 ? (
        <div className="overflow-x-auto rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-2xl bg-white/30 dark:bg-slate-900/30 backdrop-blur-md">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/20">
                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] w-32">
                  Serial
                </th>
                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  Student Identity
                </th>
                <th className="px-10 py-6 text-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  Status Calibration
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredRecords.map((record) => (
                <tr key={record.studentId} className="group hover:bg-white/50 dark:hover:bg-slate-800/30 transition-all duration-300">
                  <td className="px-10 py-6 whitespace-nowrap text-[10px] font-black text-indigo-600 dark:text-indigo-400 tracking-widest uppercase">
                    {record.rollNumber}
                  </td>
                  <td className="px-10 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-500">
                          {record.name.charAt(0)}
                       </div>
                       <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{record.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 whitespace-nowrap text-center">
                    <div className="inline-flex rounded-2xl p-1.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-inner">
                      <button
                        onClick={() => handleStatusChange(record.studentId, 'Present')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                          record.status === 'Present'
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100 dark:shadow-none'
                            : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 hover:bg-white/50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <UserCheck className={`h-3.5 w-3.5 ${record.status === 'Present' ? 'text-white' : 'text-emerald-500'}`} />
                        Present
                      </button>
                      <button
                        onClick={() => handleStatusChange(record.studentId, 'Absent')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                          record.status === 'Absent'
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-100 dark:shadow-none'
                            : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 hover:bg-white/50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <UserX className={`h-3.5 w-3.5 ${record.status === 'Absent' ? 'text-white' : 'text-rose-500'}`} />
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : localRecords.length > 0 ? (
        <div className="py-32 text-center bg-slate-50/50 dark:bg-slate-950/20 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
          <Search className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-6" />
          <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Logic Match Failure</h4>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">No records correspond to the criteria: "{searchTerm}"</p>
        </div>
      ) : (
        <div className="py-32 text-center bg-slate-50/50 dark:bg-slate-950/20 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
           <UserX className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-6" />
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Awaiting Valid Personnel Authorization</p>
        </div>
      )}
      
      <AnimatePresence>
        {isFetching && !isLoading && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 right-10 flex items-center gap-4 bg-indigo-600 text-white px-6 py-4 rounded-3xl shadow-2xl z-50 border border-indigo-400"
          >
             <Loader2 className="h-5 w-5 animate-spin" />
             <span className="text-[10px] font-black uppercase tracking-widest">Active Matrix Resync...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AttendanceList

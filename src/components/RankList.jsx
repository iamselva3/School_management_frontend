import React from 'react'
import { useRanking } from '../hooks/useApi'
import { Trophy, Medal, Award, Star, TrendingUp, User, LayoutDashboard, CheckCircle2, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const RankList = () => {
    const { data: rankings, isLoading } = useRanking()

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 shadow-inner">
                <Loader2 className="animate-spin h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-6" />
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Processing Academic Excellence...</p>
            </div>
        )
    }

    if (!rankings || rankings.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-32 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800"
            >
                <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-full mb-8 shadow-inner">
                    <Trophy className="w-16 h-16 text-slate-200 dark:text-slate-700" />
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Leaderboard Dormant</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Rankings materialize upon task verification.</p>
            </motion.div>
        )
    }

    const getRankIcon = (index) => {
        switch (index) {
            case 0: return <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 3 }}><Trophy className="w-8 h-8 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] dark:drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" /></motion.div>
            case 1: return <Medal className="w-8 h-8 text-slate-400/80" />
            case 2: return <Award className="w-8 h-8 text-amber-700/80" />
            default: return <div className="w-8 h-8 flex items-center justify-center text-[10px] font-black text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">{index + 1}</div>
        }
    }

    const formatAvgTime = (ms) => {
        if (!ms) return 'N/A'
        const hours = Math.floor(ms / (1000 * 60 * 60))
        if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`
        return `${hours}h ${Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))}m`
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800/20 overflow-hidden"
        >
            <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="bg-indigo-600 p-4 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none">
                        <Trophy className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Elite Performance</h3>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] mt-2 leading-none">Institutional Leaderboard</p>
                    </div>
                </div>
                <motion.div 
                    animate={{ x: [0, 5, 0] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex items-center gap-3 px-5 py-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20"
                >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Live Matrix Sync</span>
                </motion.div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] bg-slate-50/30 dark:bg-slate-950/20">
                            <th className="px-10 py-6">Rank</th>
                            <th className="px-10 py-6">Student Personnel</th>
                            <th className="px-10 py-6 text-center">Unit</th>
                            <th className="px-10 py-6 text-center">Output</th>
                            <th className="px-10 py-6 text-right">Velocity</th>
                        </tr>
                    </thead>
                    <motion.tbody 
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: { staggerChildren: 0.08 }
                            }
                        }}
                        className="divide-y divide-slate-50 dark:divide-slate-800/50"
                    >
                        {rankings.map((rank, index) => (
                            <motion.tr 
                                key={rank._id}
                                variants={{
                                    hidden: { opacity: 0, x: -30 },
                                    show: { opacity: 1, x: 0 }
                                }}
                                whileHover={{ 
                                    backgroundColor: "rgba(79, 70, 229, 0.03)",
                                    x: 10,
                                }}
                                className="group transition-all duration-300 cursor-default"
                            >
                                <td className="px-10 py-8">
                                    <div className="flex items-center">
                                        {getRankIcon(index)}
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-900 dark:text-white font-black text-lg group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-500 shadow-inner">
                                            {rank.student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tighter leading-tight">{rank.student.name}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase">Roll:</span>
                                                <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">{rank.student.rollNumber}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-center">
                                    <span className="px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] font-black group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 border border-slate-200 dark:border-slate-700 uppercase tracking-widest shadow-sm">
                                        {rank.student.className}
                                    </span>
                                </td>
                                <td className="px-10 py-8 text-center">
                                    <div className="flex flex-col items-center">
                                        <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 leading-none group-hover:scale-125 transition-transform duration-500">{rank.completedCount}</span>
                                        <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest mt-2">Verified Tasks</span>
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-3 text-base font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/80 px-4 py-2 rounded-xl shadow-inner border border-slate-100 dark:border-slate-700">
                                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                            {formatAvgTime(rank.avgCompletionTime)}
                                        </div>
                                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-3">Completion Delta</span>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </motion.tbody>
                </table>
            </div>
            
            <div className="p-10 bg-slate-50/30 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">
                    <div className="h-px w-10 bg-slate-200 dark:bg-slate-800" />
                    Academic Intelligence Frontier
                    <div className="h-px w-10 bg-slate-200 dark:bg-slate-800" />
                </div>
            </div>
        </motion.div>
    )
}

export default RankList

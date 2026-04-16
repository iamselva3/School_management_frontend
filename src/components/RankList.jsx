import React from 'react'
import { useRanking } from '../hooks/useApi'
import { Trophy, Medal, Award, Star, TrendingUp, User, LayoutDashboard, CheckCircle2 } from 'lucide-react'

const RankList = () => {
    const { data: rankings, isLoading } = useRanking()

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
                <p className="text-sm text-gray-500">Calculating rankings...</p>
            </div>
        )
    }

    if (!rankings || rankings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                <Trophy className="w-12 h-12 text-gray-200 mb-3" />
                <p className="text-sm text-gray-500">No rankings available yet</p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Rankings appear after task approval</p>
            </div>
        )
    }

    const getRankIcon = (index) => {
        switch (index) {
            case 0: return <Trophy className="w-6 h-6 text-yellow-500" />
            case 1: return <Medal className="w-6 h-6 text-gray-400" />
            case 2: return <Award className="w-6 h-6 text-amber-600" />
            default: return <div className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-400">{index + 1}</div>
        }
    }

    const formatAvgTime = (ms) => {
        if (!ms) return 'N/A'
        const hours = Math.floor(ms / (1000 * 60 * 60))
        if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`
        return `${hours}h ${Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))}m`
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-xl">
                        <Trophy className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Student Leaderboard</h3>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">Based on Assignment Completions</p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Live Updates</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/30">
                            <th className="px-6 py-4">Rank</th>
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Class</th>
                            <th className="px-6 py-4 px-6 text-center">Score</th>
                            <th className="px-6 py-4 text-right">Avg. Speed</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {rankings.map((rank, index) => (
                            <tr key={rank._id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        {getRankIcon(index)}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                            {rank.student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{rank.student.name}</p>
                                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">Roll: {rank.student.rollNumber}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold">
                                        {rank.student.className}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex flex-col items-center">
                                        <span className="text-lg font-black text-indigo-600 leading-none">{rank.completedCount}</span>
                                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Done</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                                            <Star className="w-3 h-3 text-amber-500" />
                                            {formatAvgTime(rank.avgCompletionTime)}
                                        </div>
                                        <span className="text-[8px] font-medium text-gray-400 uppercase tracking-tighter">Completion Time</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center">
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest flex items-center gap-2">
                    <LayoutDashboard className="w-3 h-3" />
                    End of Rankings
                </p>
            </div>
        </div>
    )
}

export default RankList

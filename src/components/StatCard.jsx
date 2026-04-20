import React from 'react'
import { motion } from 'framer-motion'

const StatCard = ({ title, value, icon: Icon, color }) => {
  // Extract color intensity for glow
  const glowColor = color.replace('bg-', 'text-')

  return (
    <motion.div 
      whileHover={{ 
        y: -5,
        rotateY: 5,
        rotateX: -2,
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      className="group relative h-[140px] w-full perspective-1000"
    >
      {/* Dynamic Glow Layer */}
      <div className={`absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 ${color}`} />
      
      <div className="relative h-full w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/20 rounded-[2rem] p-6 shadow-xl dark:shadow-2xl overflow-hidden flex flex-col justify-between transition-colors duration-500">
        {/* Background Grain/Mesh */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        <div className="flex justify-between items-start relative z-10">
          <div className={`p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
            <Icon className={`w-5 h-5 ${glowColor}`} />
          </div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className={`w-1.5 h-1.5 rounded-full ${color} shadow-[0_0_10px_rgba(0,0,0,0.1)]`} 
          />
        </div>

        <div className="relative z-10">
          <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
              {value}
            </span>
            <div className={`h-1 w-1 rounded-full ${color} opacity-0 group-hover:opacity-100 transition-opacity`} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Stopwatch from '../components/Stopwatch';
import Timer from '../components/Timer';
import Clock from '../components/Clock';
import Calendar from '../components/Calendar';
import { Timer as TimerIcon, Clock as ClockIcon, Calendar as CalendarIcon } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'stopwatch' | 'timer'>('stopwatch');
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-blue-950 relative overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-purple-950/50 to-gray-900/60"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl"></div>
      
      {/* Main container */}
      <div className="relative z-10 flex flex-col items-center min-h-screen p-4 pt-32">
        {/* Premium App Title */}
        <motion.div 
          className="mb-10 relative flex flex-col items-center"
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="relative">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/15 via-blue-400/10 to-purple-400/15 blur-2xl opacity-50"></div>
            
            {/* Main title - centered */}
            <h1 className="relative text-3xl md:text-5xl lg:text-6xl font-black bg-gradient-to-br from-slate-200 via-purple-200 to-blue-200 bg-clip-text text-transparent tracking-[0.15em] select-none text-center">
              <span className="relative inline-block">
                {/* Subtle shadow */}
                <span className="absolute inset-0 bg-gradient-to-br from-purple-800 via-blue-800 to-gray-800 bg-clip-text text-transparent blur-sm opacity-40 transform translate-x-1 translate-y-1"></span>
                
                {/* Main text */}
                <span 
                  className="relative bg-gradient-to-br from-slate-200 via-purple-200 to-blue-200 bg-clip-text text-transparent"
                  style={{
                    textShadow: '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.2)',
                    filter: 'drop-shadow(0 4px 16px rgba(139, 92, 246, 0.2))'
                  }}
                >
                  CHRONOS
                </span>
              </span>
            </h1>
          </div>
          
          {/* New Subtitle - Bold */}
          <motion.div 
            className="text-center text-slate-400 text-base md:text-lg font-bold tracking-[0.2em] mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <p className="leading-relaxed">
              Ek aur shaam ho gayi, ek aur din dhal gaya<br />
              Zindagi ki kitaab se ek aur panna nikal gaya !! 🕐
            </p>
          </motion.div>
        </motion.div>

        {/* Top Navigation */}
        <div className="w-full max-w-6xl flex justify-between items-center mb-8">
          {/* Calendar Button */}
          <motion.button
            onClick={() => setShowCalendar(!showCalendar)}
            className="bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 shadow-xl hover:shadow-purple-500/20 transition-all duration-500 group relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CalendarIcon 
              size={28} 
              className="text-purple-400 group-hover:text-purple-300 transition-colors duration-300 relative z-10" 
            />
          </motion.button>

          {/* Tab Navigation - Perfectly Centered */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-black/50 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-4 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5 opacity-50"></div>
              <div className="flex space-x-4 relative z-10">
                <motion.button
                  onClick={() => setActiveTab('stopwatch')}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all duration-500 text-lg relative overflow-hidden ${
                    activeTab === 'stopwatch'
                      ? 'bg-gradient-to-r from-cyan-600/80 to-blue-600/80 text-white shadow-lg shadow-cyan-500/30 border border-cyan-400/40'
                      : 'text-purple-300 hover:text-white hover:bg-purple-500/20 hover:shadow-lg hover:shadow-purple-500/20 border border-transparent hover:border-purple-400/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ClockIcon size={26} className="relative z-10" />
                  <span className="font-black tracking-wide relative z-10">STOPWATCH</span>
                </motion.button>
                
                <motion.button
                  onClick={() => setActiveTab('timer')}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all duration-500 text-lg relative overflow-hidden ${
                    activeTab === 'timer'
                      ? 'bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white shadow-lg shadow-purple-500/30 border border-purple-400/40'
                      : 'text-purple-300 hover:text-white hover:bg-purple-500/20 hover:shadow-lg hover:shadow-purple-500/20 border border-transparent hover:border-purple-400/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <TimerIcon size={26} className="relative z-10" />
                  <span className="font-black tracking-wide relative z-10">TIMER</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Clock HUD - Right Side */}
          <Clock />
        </div>

        {/* Calendar Modal */}
        <AnimatePresence>
          {showCalendar && (
            <Calendar onClose={() => setShowCalendar(false)} />
          )}
        </AnimatePresence>
        
        {/* Main Content */}
        <div className="w-full max-w-6xl mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === 'timer' ? 100 : -100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: activeTab === 'timer' ? -100 : 100, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {activeTab === 'stopwatch' ? <Stopwatch /> : <Timer />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Index;

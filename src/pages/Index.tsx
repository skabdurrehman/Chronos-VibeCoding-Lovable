
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '30s' }}></div>
      
      {/* Main container */}
      <div className="relative z-10 flex flex-col items-center min-h-screen p-4">
        {/* Top Navigation */}
        <div className="w-full max-w-4xl flex justify-between items-center mb-6">
          {/* Calendar Button */}
          <motion.button
            onClick={() => setShowCalendar(!showCalendar)}
            className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 group"
            whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(6, 182, 212, 0.25)' }}
            whileTap={{ scale: 0.95 }}
          >
            <CalendarIcon 
              size={24} 
              className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" 
            />
          </motion.button>

          {/* Tab Navigation - Centered */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-3 shadow-2xl shadow-black/50">
              <div className="flex space-x-3">
                <motion.button
                  onClick={() => setActiveTab('stopwatch')}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-500 text-lg ${
                    activeTab === 'stopwatch'
                      ? 'bg-gradient-to-r from-cyan-500/90 to-blue-500/90 text-white shadow-lg shadow-cyan-500/40 border border-cyan-400/50'
                      : 'text-gray-300 hover:text-white hover:bg-white/5 hover:shadow-lg hover:shadow-white/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ClockIcon size={24} />
                  <span className="font-bold tracking-wide">Stopwatch</span>
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab('timer')}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-500 text-lg ${
                    activeTab === 'timer'
                      ? 'bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white shadow-lg shadow-purple-500/40 border border-purple-400/50'
                      : 'text-gray-300 hover:text-white hover:bg-white/5 hover:shadow-lg hover:shadow-white/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <TimerIcon size={24} />
                  <span className="font-bold tracking-wide">Timer</span>
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
        <div className="w-full max-w-4xl mt-8">
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

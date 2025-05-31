
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900 relative overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-orange-900/30 to-cyan-900/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-orange-500/8 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '30s' }}></div>
      
      {/* Main container */}
      <div className="relative z-10 flex flex-col items-center min-h-screen p-4">
        {/* Ultra Premium App Title */}
        <motion.div 
          className="mb-8 relative flex flex-col items-center"
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="relative mb-4">
            {/* Multiple glowing layers for premium effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 blur-3xl opacity-40 animate-pulse scale-110"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-300 via-yellow-200 to-orange-400 blur-2xl opacity-30 animate-pulse delay-500 scale-105"></div>
            
            {/* Main title with perfect alignment and stunning effects */}
            <h1 className="relative text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] font-black bg-gradient-to-br from-orange-200 via-amber-100 to-orange-300 bg-clip-text text-transparent tracking-[0.15em] select-none flex items-center justify-center">
              <span className="relative inline-block transform hover:scale-105 transition-transform duration-700">
                {/* Deep shadow for depth */}
                <span className="absolute inset-0 bg-gradient-to-br from-orange-800 via-amber-700 to-orange-900 bg-clip-text text-transparent blur-sm opacity-60 transform translate-x-2 translate-y-2"></span>
                
                {/* Bright glow layer */}
                <span className="absolute inset-0 bg-gradient-to-br from-white via-orange-100 to-amber-200 bg-clip-text text-transparent animate-pulse opacity-80"></span>
                
                {/* Main gorgeous text */}
                <span 
                  className="relative bg-gradient-to-br from-orange-200 via-amber-100 to-orange-300 bg-clip-text text-transparent font-extrabold"
                  style={{
                    textShadow: '0 0 40px rgba(251, 146, 60, 0.9), 0 0 80px rgba(251, 146, 60, 0.5), 0 0 120px rgba(251, 146, 60, 0.3)',
                    filter: 'drop-shadow(0 10px 40px rgba(251, 146, 60, 0.4))',
                    WebkitTextStroke: '1px rgba(251, 146, 60, 0.3)'
                  }}
                >
                  CHRONOS
                </span>
              </span>
            </h1>
            
            {/* Decorative floating elements */}
            <motion.div 
              className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full blur-md opacity-70" 
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div 
              className="absolute -bottom-6 -right-6 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-md opacity-70" 
              animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
          </div>
          
          {/* Premium subtitle */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
          >
            <p className="text-orange-300/90 text-xl md:text-2xl font-light tracking-[0.4em] uppercase bg-gradient-to-r from-orange-300 via-amber-200 to-orange-400 bg-clip-text text-transparent">
              Time Mastery Redefined
            </p>
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto mt-3 opacity-60"></div>
          </motion.div>
        </motion.div>

        {/* Top Navigation - Perfect Alignment */}
        <div className="w-full max-w-7xl flex justify-between items-center mb-8 px-4">
          {/* Calendar Button */}
          <motion.button
            onClick={() => setShowCalendar(!showCalendar)}
            className="bg-black/40 backdrop-blur-xl border border-orange-400/30 rounded-2xl p-4 shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 group relative overflow-hidden"
            whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(251, 146, 60, 0.4)' }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CalendarIcon 
              size={28} 
              className="text-orange-400 group-hover:text-orange-300 transition-colors duration-300 relative z-10" 
            />
          </motion.button>

          {/* Tab Navigation - Perfectly Centered */}
          <motion.div 
            className="flex justify-center flex-1 px-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-black/40 backdrop-blur-xl border border-orange-400/20 rounded-3xl p-4 shadow-2xl shadow-black/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 opacity-50"></div>
              <div className="flex space-x-4 relative z-10">
                <motion.button
                  onClick={() => setActiveTab('stopwatch')}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all duration-500 text-lg relative overflow-hidden ${
                    activeTab === 'stopwatch'
                      ? 'bg-gradient-to-r from-cyan-500/90 to-blue-500/90 text-white shadow-lg shadow-cyan-500/50 border border-cyan-400/60'
                      : 'text-orange-300 hover:text-white hover:bg-orange-500/20 hover:shadow-lg hover:shadow-orange-500/20 border border-transparent hover:border-orange-400/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {activeTab === 'stopwatch' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 animate-pulse"></div>
                  )}
                  <ClockIcon size={26} className="relative z-10" />
                  <span className="font-black tracking-wide relative z-10">STOPWATCH</span>
                </motion.button>
                
                <motion.button
                  onClick={() => setActiveTab('timer')}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all duration-500 text-lg relative overflow-hidden ${
                    activeTab === 'timer'
                      ? 'bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white shadow-lg shadow-purple-500/50 border border-purple-400/60'
                      : 'text-orange-300 hover:text-white hover:bg-orange-500/20 hover:shadow-lg hover:shadow-orange-500/20 border border-transparent hover:border-orange-400/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {activeTab === 'timer' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-pulse"></div>
                  )}
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


import React, { useState, useEffect } from 'react';
import Stopwatch from '../components/Stopwatch';
import Timer from '../components/Timer';
import Clock from '../components/Clock';
import { Timer as TimerIcon, Stopwatch as StopwatchIcon } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'stopwatch' | 'timer'>('stopwatch');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      {/* Main container */}
      <div className="relative z-10 flex flex-col items-center min-h-screen p-4">
        {/* Clock HUD */}
        <Clock />
        
        {/* Tab Navigation */}
        <div className="mt-8 mb-8">
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('stopwatch')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === 'stopwatch'
                    ? 'bg-gradient-to-r from-cyan-500/80 to-blue-500/80 text-white shadow-lg shadow-cyan-500/25 scale-105'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <StopwatchIcon size={20} />
                <span>Stopwatch</span>
              </button>
              <button
                onClick={() => setActiveTab('timer')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === 'timer'
                    ? 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white shadow-lg shadow-purple-500/25 scale-105'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <TimerIcon size={20} />
                <span>Timer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-4xl">
          {activeTab === 'stopwatch' ? <Stopwatch /> : <Timer />}
        </div>
      </div>
    </div>
  );
};

export default Index;

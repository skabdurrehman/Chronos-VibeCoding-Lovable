
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Bell, BellRing, Volume2, VolumeX, RotateCcw, Edit, Trash } from 'lucide-react';
import TimerPresets from './TimerPresets';
import TimerInput from './TimerInput';

interface TimerState {
  duration: number;
  remaining: number;
  isRunning: boolean;
  isComplete: boolean;
}

interface CustomPreset {
  id: string;
  name: string;
  duration: number;
  color: string;
}

const Timer = () => {
  const [activeTab, setActiveTab] = useState<'manual' | 'presets'>('manual');
  const [timer, setTimer] = useState<TimerState>({
    duration: 0,
    remaining: 0,
    isRunning: false,
    isComplete: false,
  });
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatMode] = useState(false);
  const [customPresets, setCustomPresets] = useState<CustomPreset[]>([]);
  const [isCompleteAnimating, setIsCompleteAnimating] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load settings from localStorage
  useEffect(() => {
    const savedMuted = localStorage.getItem('timer-muted');
    const savedRepeat = localStorage.getItem('timer-repeat');
    const savedPresets = localStorage.getItem('timer-custom-presets');
    
    if (savedMuted) setIsMuted(JSON.parse(savedMuted));
    if (savedRepeat) setRepeatMode(JSON.parse(savedRepeat));
    if (savedPresets) setCustomPresets(JSON.parse(savedPresets));
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('timer-muted', JSON.stringify(isMuted));
  }, [isMuted]);

  useEffect(() => {
    localStorage.setItem('timer-repeat', JSON.stringify(repeatMode));
  }, [repeatMode]);

  useEffect(() => {
    localStorage.setItem('timer-custom-presets', JSON.stringify(customPresets));
  }, [customPresets]);

  // Timer logic with millisecond precision
  useEffect(() => {
    if (timer.isRunning && timer.remaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          const newRemaining = prev.remaining - 100;
          if (newRemaining <= 0) {
            return {
              ...prev,
              remaining: 0,
              isRunning: false,
              isComplete: true,
            };
          }
          return { ...prev, remaining: newRemaining };
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isRunning, timer.remaining]);

  // Handle timer completion
  useEffect(() => {
    if (timer.isComplete && timer.remaining === 0) {
      setIsCompleteAnimating(true);
      
      // Play sound if not muted
      if (!isMuted) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      }

      setTimeout(() => {
        setIsCompleteAnimating(false);
        if (repeatMode) {
          setTimeout(() => {
            handleRestart();
          }, 2000);
        }
      }, 3000);
    }
  }, [timer.isComplete, timer.remaining, isMuted, repeatMode]);

  const formatTime = (ms: number, includeMilliseconds = false) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 100);
    
    if (hours > 0) {
      if (includeMilliseconds) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds}`;
      }
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    if (includeMilliseconds) {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const setTimerDuration = (duration: number) => {
    setTimer({
      duration,
      remaining: duration,
      isRunning: false,
      isComplete: false,
    });
  };

  const handleStart = () => {
    if (timer.remaining > 0) {
      setTimer(prev => ({ ...prev, isRunning: true, isComplete: false }));
    }
  };

  const handlePause = () => {
    setTimer(prev => ({ ...prev, isRunning: false }));
  };

  const handleReset = () => {
    setTimer(prev => ({
      ...prev,
      remaining: prev.duration,
      isRunning: false,
      isComplete: false,
    }));
  };

  const handleRestart = () => {
    setTimer(prev => ({
      ...prev,
      remaining: prev.duration,
      isRunning: true,
      isComplete: false,
    }));
  };

  const handleResetToZero = () => {
    setTimer({
      duration: 0,
      remaining: 0,
      isRunning: false,
      isComplete: false,
    });
  };

  const getProgressPercentage = () => {
    if (timer.duration === 0) return 0;
    return ((timer.duration - timer.remaining) / timer.duration) * 100;
  };

  const getStatusColor = () => {
    if (timer.isComplete) return 'from-green-400 via-emerald-400 to-green-500';
    if (timer.isRunning) return 'from-blue-400 via-purple-400 to-blue-500';
    if (timer.remaining > 0) return 'from-yellow-400 via-orange-400 to-yellow-500';
    return 'from-gray-400 via-gray-500 to-gray-400';
  };

  return (
    <div className="space-y-8">
      {/* Timer Completion Banner */}
      <AnimatePresence>
        {isCompleteAnimating && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 p-12 rounded-3xl shadow-2xl border border-green-400/50"
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: -50 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="text-center text-white">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                >
                  <BellRing size={64} className="mx-auto mb-6" />
                </motion.div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                  Timer Complete!
                </h2>
                {repeatMode && (
                  <p className="text-xl text-green-100">Restarting in 2 seconds...</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Timer Display */}
      <motion.div 
        className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <motion.div 
            className={`text-5xl md:text-7xl font-mono font-light bg-gradient-to-r ${getStatusColor()} bg-clip-text text-transparent mb-6 drop-shadow-2xl tracking-wider ${timer.isRunning ? 'animate-pulse' : ''}`}
            style={{
              textShadow: timer.isRunning ? '0 0 30px rgba(59, 130, 246, 0.5)' : 'none',
              filter: timer.isRunning ? 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))' : 'none'
            }}
          >
            {formatTime(timer.remaining, timer.remaining < 60000)}
          </motion.div>
          
          {/* Progress Bar */}
          {timer.duration > 0 && (
            <motion.div 
              className="w-full bg-white/10 rounded-full h-3 mb-8 overflow-hidden border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 transition-all duration-300 ease-linear shadow-lg"
                style={{ width: `${getProgressPercentage()}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
              />
            </motion.div>
          )}
          
          {/* Control Buttons */}
          <div className="flex justify-center space-x-6 mb-8">
            {!timer.isRunning ? (
              <motion.button
                onClick={handleStart}
                disabled={timer.remaining === 0}
                className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-400 hover:via-emerald-400 hover:to-green-500 disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed text-white p-5 rounded-2xl shadow-lg shadow-green-500/40 transition-all duration-500 border border-green-400/50 disabled:border-gray-500/50"
                whileHover={timer.remaining > 0 ? { 
                  scale: 1.1, 
                  boxShadow: '0 25px 50px -12px rgba(34, 197, 94, 0.4)' 
                } : {}}
                whileTap={timer.remaining > 0 ? { scale: 0.95 } : {}}
              >
                <Play size={28} />
              </motion.button>
            ) : (
              <motion.button
                onClick={handlePause}
                className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 hover:from-yellow-400 hover:via-orange-400 hover:to-yellow-500 text-white p-5 rounded-2xl shadow-lg shadow-yellow-500/40 transition-all duration-500 border border-yellow-400/50"
                whileHover={{ 
                  scale: 1.1, 
                  boxShadow: '0 25px 50px -12px rgba(245, 158, 11, 0.4)' 
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Pause size={28} />
              </motion.button>
            )}
            
            <motion.button
              onClick={handleReset}
              disabled={timer.remaining === timer.duration}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:from-blue-400 hover:via-purple-400 hover:to-blue-500 disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed text-white p-5 rounded-2xl shadow-lg shadow-blue-500/40 transition-all duration-500 border border-blue-400/50 disabled:border-gray-500/50"
              whileHover={timer.remaining !== timer.duration ? { 
                scale: 1.1, 
                boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.4)' 
              } : {}}
              whileTap={timer.remaining !== timer.duration ? { scale: 0.95 } : {}}
            >
              <RotateCcw size={28} />
            </motion.button>
            
            <motion.button
              onClick={handleRestart}
              disabled={timer.duration === 0}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-400 hover:via-pink-400 hover:to-purple-500 disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed text-white p-5 rounded-2xl shadow-lg shadow-purple-500/40 transition-all duration-500 border border-purple-400/50 disabled:border-gray-500/50"
              whileHover={timer.duration > 0 ? { 
                scale: 1.1, 
                boxShadow: '0 25px 50px -12px rgba(168, 85, 247, 0.4)' 
              } : {}}
              whileTap={timer.duration > 0 ? { scale: 0.95 } : {}}
            >
              <Square size={28} />
            </motion.button>

            <motion.button
              onClick={handleResetToZero}
              className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-400 hover:via-pink-400 hover:to-red-500 text-white p-5 rounded-2xl shadow-lg shadow-red-500/40 transition-all duration-500 border border-red-400/50"
              whileHover={{ 
                scale: 1.1, 
                boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.4)' 
              }}
              whileTap={{ scale: 0.95 }}
              title="Reset to 00:00"
            >
              <Square size={28} />
            </motion.button>
          </div>

          {/* Settings */}
          <div className="flex justify-center space-x-6">
            <motion.button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-2xl transition-all duration-500 border-2 ${
                isMuted 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-400/50 shadow-lg shadow-red-500/25' 
                  : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-400/50 shadow-lg shadow-green-500/25'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </motion.button>
            
            <motion.button
              onClick={() => setRepeatMode(!repeatMode)}
              className={`p-4 rounded-2xl transition-all duration-500 border-2 ${
                repeatMode 
                  ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-blue-400/50 shadow-lg shadow-blue-500/25' 
                  : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 border-gray-400/50 shadow-lg shadow-gray-500/25'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={24} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-2xl">
          <div className="flex space-x-3">
            <motion.button
              onClick={() => setActiveTab('manual')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-500 ${
                activeTab === 'manual'
                  ? 'bg-gradient-to-r from-blue-500/80 to-cyan-500/80 text-white shadow-lg shadow-blue-500/25 border border-blue-400/50'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Manual Input
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('presets')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-500 ${
                activeTab === 'presets'
                  ? 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white shadow-lg shadow-purple-500/25 border border-purple-400/50'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Presets
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Timer Input/Presets */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === 'presets' ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: activeTab === 'presets' ? -100 : 100 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {activeTab === 'manual' ? (
            <TimerInput onSetDuration={setTimerDuration} />
          ) : (
            <TimerPresets 
              onSelectDuration={setTimerDuration}
              customPresets={customPresets}
              setCustomPresets={setCustomPresets}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Timer;

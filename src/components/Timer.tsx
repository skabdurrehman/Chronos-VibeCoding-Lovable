import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, SquareX, BellRing, Volume2, VolumeX } from 'lucide-react';
import TimerPresets from './TimerPresets';
import TimerInput from './TimerInput';

interface TimerState {
  duration: number;
  remaining: number;
  isRunning: boolean;
  isComplete: boolean;
  startTime?: number;
}

interface CustomPreset {
  id: string;
  name: string;
  duration: number;
  color: string;
  days?: number;
  hours?: number;
  minutes?: number;
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
  const [customPresets, setCustomPresets] = useState<CustomPreset[]>([]);
  const [isCompleteAnimating, setIsCompleteAnimating] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load settings and timer state from localStorage
  useEffect(() => {
    const savedMuted = localStorage.getItem('timer-muted');
    const savedRepeat = localStorage.getItem('timer-repeat');
    const savedPresets = localStorage.getItem('timer-custom-presets');
    const savedTimerState = localStorage.getItem('timer-state');
    
    if (savedMuted) setIsMuted(JSON.parse(savedMuted));
    if (savedRepeat) setRepeatMode(JSON.parse(savedRepeat));
    if (savedPresets) setCustomPresets(JSON.parse(savedPresets));
    
    // Restore timer state and calculate elapsed time
    if (savedTimerState) {
      const state = JSON.parse(savedTimerState);
      if (state.isRunning && state.startTime) {
        const now = Date.now();
        const elapsed = now - state.startTime;
        const newRemaining = Math.max(0, state.remaining - elapsed);
        
        setTimer({
          ...state,
          remaining: newRemaining,
          isRunning: newRemaining > 0,
          isComplete: newRemaining <= 0,
        });
      } else {
        setTimer(state);
      }
    }
  }, []);

  // Save timer state to localStorage
  useEffect(() => {
    const stateToSave = {
      ...timer,
      startTime: timer.isRunning ? (timer.startTime || Date.now()) : undefined,
    };
    localStorage.setItem('timer-state', JSON.stringify(stateToSave));
  }, [timer]);

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
              startTime: undefined,
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
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor((ms % 86400000) / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 100);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
      startTime: undefined,
    });
  };

  const handleStart = () => {
    if (timer.remaining > 0) {
      setTimer(prev => ({ 
        ...prev, 
        isRunning: true, 
        isComplete: false,
        startTime: Date.now() - (prev.duration - prev.remaining),
      }));
    }
  };

  const handlePause = () => {
    setTimer(prev => ({ ...prev, isRunning: false, startTime: undefined }));
  };

  const handleReset = () => {
    setTimer(prev => ({
      ...prev,
      remaining: prev.duration,
      isRunning: false,
      isComplete: false,
      startTime: undefined,
    }));
  };

  const handleRestart = () => {
    setTimer(prev => ({
      ...prev,
      remaining: prev.duration,
      isRunning: true,
      isComplete: false,
      startTime: Date.now(),
    }));
  };

  const handleResetToZero = () => {
    setTimer({
      duration: 0,
      remaining: 0,
      isRunning: false,
      isComplete: false,
      startTime: undefined,
    });
  };

  const getProgressPercentage = () => {
    if (timer.duration === 0) return 0;
    return ((timer.duration - timer.remaining) / timer.duration) * 100;
  };

  const getStatusColor = () => {
    if (timer.isComplete) return 'from-green-400 via-emerald-400 to-green-500';
    if (timer.isRunning) return 'from-blue-400 via-purple-400 to-blue-500';
    if (timer.remaining > 0) return 'from-purple-400 via-blue-400 to-purple-500';
    return 'from-gray-400 via-gray-500 to-gray-400';
  };

  return (
    <div className="space-y-8">
      {/* Timer Completion Banner */}
      <AnimatePresence>
        {isCompleteAnimating && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 p-12 rounded-3xl shadow-2xl border border-green-500/50"
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
                <h2 className="text-4xl font-bold mb-4">Timer Complete!</h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Timer Display */}
      <motion.div 
        className="bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <motion.div 
            className={`text-5xl md:text-7xl font-mono font-light bg-gradient-to-r ${getStatusColor()} bg-clip-text text-transparent mb-6 tracking-wider`}
          >
            {formatTime(timer.remaining, timer.remaining < 60000)}
          </motion.div>
          
          {/* Progress Bar */}
          {timer.duration > 0 && (
            <motion.div 
              className="w-full bg-white/10 rounded-full h-3 mb-8 overflow-hidden border border-purple-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 transition-all duration-300 ease-linear"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </motion.div>
          )}
          
          {/* Control Buttons - Only 4 buttons in first row */}
          <div className="flex justify-center space-x-6 mb-6">
            {/* 1. Start/Pause Button */}
            {!timer.isRunning ? (
              <motion.button
                onClick={handleStart}
                disabled={timer.remaining === 0}
                className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-500 hover:via-emerald-500 hover:to-green-600 disabled:from-gray-700 disabled:via-gray-800 disabled:to-gray-700 disabled:cursor-not-allowed text-white p-5 rounded-2xl shadow-lg transition-all duration-500 border border-green-500/50 disabled:border-gray-600/50"
                whileHover={timer.remaining > 0 ? { scale: 1.1 } : {}}
                whileTap={timer.remaining > 0 ? { scale: 0.95 } : {}}
              >
                <Play size={28} />
              </motion.button>
            ) : (
              <motion.button
                onClick={handlePause}
                className="bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-700 hover:from-yellow-500 hover:via-amber-500 hover:to-yellow-600 text-white p-5 rounded-2xl shadow-lg transition-all duration-500 border border-yellow-500/50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Pause size={28} />
              </motion.button>
            )}
            
            {/* 2. Reset Button */}
            <motion.button
              onClick={handleReset}
              disabled={timer.remaining === timer.duration}
              className="bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-700 hover:from-yellow-500 hover:via-amber-500 hover:to-yellow-600 disabled:from-gray-700 disabled:via-gray-800 disabled:to-gray-700 disabled:cursor-not-allowed text-white p-5 rounded-2xl shadow-lg transition-all duration-500 border border-yellow-500/50 disabled:border-gray-600/50"
              whileHover={timer.remaining !== timer.duration ? { scale: 1.1 } : {}}
              whileTap={timer.remaining !== timer.duration ? { scale: 0.95 } : {}}
            >
              <RotateCcw size={28} />
            </motion.button>
            
            {/* 3. Restart Button */}
            <motion.button
              onClick={handleRestart}
              disabled={timer.duration === 0}
              className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-500 hover:via-violet-500 hover:to-purple-600 disabled:from-gray-700 disabled:via-gray-800 disabled:to-gray-700 disabled:cursor-not-allowed text-white p-5 rounded-2xl shadow-lg transition-all duration-500 border border-purple-500/50 disabled:border-gray-600/50"
              whileHover={timer.duration > 0 ? { scale: 1.1 } : {}}
              whileTap={timer.duration > 0 ? { scale: 0.95 } : {}}
            >
              <RotateCcw size={28} />
            </motion.button>

            {/* 4. Clear/Reset to Zero Button */}
            <motion.button
              onClick={handleResetToZero}
              className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:via-rose-500 hover:to-red-600 text-white p-5 rounded-2xl shadow-lg transition-all duration-500 border border-red-500/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <SquareX size={28} />
            </motion.button>

            {/* 5. Volume Button - Moved to first row with orange background */}
            <motion.button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-5 rounded-2xl transition-all duration-500 border-2 ${
                isMuted 
                  ? 'bg-red-600/80 text-red-200 hover:bg-red-500/90 border-red-500/50 shadow-lg' 
                  : 'bg-orange-600/80 text-orange-200 hover:bg-orange-500/90 border-orange-500/50 shadow-lg'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
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
        <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-3 shadow-2xl">
          <div className="flex space-x-3">
            <motion.button
              onClick={() => setActiveTab('manual')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-500 ${
                activeTab === 'manual'
                  ? 'bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white shadow-lg border border-blue-500/50'
                  : 'text-purple-300 hover:text-white hover:bg-purple-500/20'
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
                  ? 'bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white shadow-lg border border-purple-500/50'
                  : 'text-purple-300 hover:text-white hover:bg-purple-500/20'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Presets
            </motion.button>
          </div>
        </div>
      </motion.div>

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


import React, { useState, useEffect, useRef } from 'react';
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
  const [activeTab, setActiveTab] = useState<'manual' | 'presets'>('presets');
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Timer logic
  useEffect(() => {
    if (timer.isRunning && timer.remaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          const newRemaining = prev.remaining - 1000;
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
      }, 1000);
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
        // Create a simple beep sound
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

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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

  const getProgressPercentage = () => {
    if (timer.duration === 0) return 0;
    return ((timer.duration - timer.remaining) / timer.duration) * 100;
  };

  const getStatusColor = () => {
    if (timer.isComplete) return 'from-green-500 to-emerald-500';
    if (timer.isRunning) return 'from-blue-500 to-purple-500';
    if (timer.remaining > 0) return 'from-yellow-500 to-orange-500';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-8">
      {/* Timer Completion Banner */}
      {isCompleteAnimating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 rounded-3xl shadow-2xl animate-bounce">
            <div className="text-center text-white">
              <BellRing size={48} className="mx-auto mb-4 animate-pulse" />
              <h2 className="text-3xl font-bold">Timer Complete!</h2>
              {repeatMode && (
                <p className="mt-2 text-green-100">Restarting in 2 seconds...</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'presets'
                  ? 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Presets
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'manual'
                  ? 'bg-gradient-to-r from-blue-500/80 to-cyan-500/80 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Manual Input
            </button>
          </div>
        </div>
      </div>

      {/* Timer Input/Presets */}
      {activeTab === 'presets' ? (
        <TimerPresets 
          onSelectDuration={setTimerDuration}
          customPresets={customPresets}
          setCustomPresets={setCustomPresets}
        />
      ) : (
        <TimerInput onSetDuration={setTimerDuration} />
      )}

      {/* Main Timer Display */}
      <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="text-center">
          <div className={`text-6xl md:text-8xl font-mono font-light bg-gradient-to-r ${getStatusColor()} bg-clip-text text-transparent mb-4 ${timer.isRunning ? 'animate-pulse' : ''}`}>
            {formatTime(timer.remaining)}
          </div>
          
          {/* Progress Bar */}
          {timer.duration > 0 && (
            <div className="w-full bg-white/10 rounded-full h-2 mb-6 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-linear"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          )}
          
          {/* Control Buttons */}
          <div className="flex justify-center space-x-4 mb-6">
            {!timer.isRunning ? (
              <button
                onClick={handleStart}
                disabled={timer.remaining === 0}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white p-4 rounded-2xl shadow-lg shadow-green-500/25 transition-all duration-300 hover:scale-105 hover:shadow-green-500/40 disabled:hover:scale-100"
              >
                <Play size={24} />
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white p-4 rounded-2xl shadow-lg shadow-yellow-500/25 transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/40"
              >
                <Pause size={24} />
              </button>
            )}
            
            <button
              onClick={handleReset}
              disabled={timer.remaining === timer.duration}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white p-4 rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40 disabled:hover:scale-100"
            >
              <RotateCcw size={24} />
            </button>
            
            <button
              onClick={handleRestart}
              disabled={timer.duration === 0}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white p-4 rounded-2xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40 disabled:hover:scale-100"
            >
              <Square size={24} />
            </button>
          </div>

          {/* Settings */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                isMuted 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                  : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
              }`}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            
            <button
              onClick={() => setRepeatMode(!repeatMode)}
              className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                repeatMode 
                  ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
                  : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
              }`}
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;

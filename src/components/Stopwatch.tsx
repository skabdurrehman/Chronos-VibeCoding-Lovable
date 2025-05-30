
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Plus, Trash, Edit3, Check, X, RotateCcw } from 'lucide-react';

interface Lap {
  id: string;
  number: number;
  time: number;
  timestamp: Date;
  label: string;
}

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [selectedLaps, setSelectedLaps] = useState<Set<string>>(new Set());
  const [lapCounter, setLapCounter] = useState(1);
  const [editingLap, setEditingLap] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
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
  }, [isRunning]);

  const formatTime = (ms: number, includeHours = false) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    
    if (includeHours || hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  const handleLap = () => {
    if (time > 0) {
      const newLap: Lap = {
        id: Date.now().toString(),
        number: lapCounter,
        time: time,
        timestamp: new Date(),
        label: `Lap ${lapCounter}`,
      };
      setLaps(prev => [newLap, ...prev]);
      setLapCounter(prev => prev + 1);
    }
  };

  const toggleLapSelection = (lapId: string) => {
    setSelectedLaps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lapId)) {
        newSet.delete(lapId);
      } else {
        newSet.add(lapId);
      }
      return newSet;
    });
  };

  const deleteSelectedLaps = () => {
    if (selectedLaps.size > 0) {
      setLaps(prev => prev.filter(lap => !selectedLaps.has(lap.id)));
      setSelectedLaps(new Set());
    }
  };

  const deleteAllLaps = () => {
    setLaps([]);
    setSelectedLaps(new Set());
    setLapCounter(1);
  };

  const startEditingLap = (lap: Lap) => {
    setEditingLap(lap.id);
    setEditLabel(lap.label);
  };

  const saveEditingLap = () => {
    if (editingLap && editLabel.trim()) {
      setLaps(prev => prev.map(lap => 
        lap.id === editingLap 
          ? { ...lap, label: editLabel.trim() }
          : lap
      ));
    }
    setEditingLap(null);
    setEditLabel('');
  };

  const cancelEditingLap = () => {
    setEditingLap(null);
    setEditLabel('');
  };

  const getStatusColor = () => {
    if (isRunning) return 'from-cyan-400 via-blue-400 to-cyan-500';
    if (time > 0) return 'from-yellow-400 via-orange-400 to-yellow-500';
    return 'from-gray-400 via-gray-500 to-gray-400';
  };

  const getGlowColor = () => {
    if (isRunning) return 'shadow-cyan-500/50';
    if (time > 0) return 'shadow-yellow-500/50';
    return 'shadow-gray-500/50';
  };

  return (
    <div className="space-y-8">
      {/* Main Timer Display */}
      <motion.div 
        className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <motion.div 
            className={`text-5xl md:text-7xl font-mono font-light bg-gradient-to-r ${getStatusColor()} bg-clip-text text-transparent mb-8 drop-shadow-2xl tracking-wider ${isRunning ? 'animate-pulse' : ''}`}
            style={{
              textShadow: isRunning ? '0 0 30px rgba(6, 182, 212, 0.5)' : 'none',
              filter: isRunning ? 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.3))' : 'none'
            }}
          >
            {formatTime(time, time >= 3600000)}
          </motion.div>
          
          {/* Control Buttons */}
          <div className="flex justify-center space-x-6">
            {!isRunning ? (
              <motion.button
                onClick={handleStart}
                className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-400 hover:via-emerald-400 hover:to-green-500 text-white p-5 rounded-2xl shadow-lg shadow-green-500/40 transition-all duration-500 border border-green-400/50"
                whileHover={{ 
                  scale: 1.1, 
                  boxShadow: '0 25px 50px -12px rgba(34, 197, 94, 0.4)',
                  borderColor: 'rgba(74, 222, 128, 0.8)'
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Play size={28} />
              </motion.button>
            ) : (
              <motion.button
                onClick={handlePause}
                className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 hover:from-yellow-400 hover:via-orange-400 hover:to-yellow-500 text-white p-5 rounded-2xl shadow-lg shadow-yellow-500/40 transition-all duration-500 border border-yellow-400/50"
                whileHover={{ 
                  scale: 1.1, 
                  boxShadow: '0 25px 50px -12px rgba(245, 158, 11, 0.4)',
                  borderColor: 'rgba(251, 191, 36, 0.8)'
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Pause size={28} />
              </motion.button>
            )}
            
            <motion.button
              onClick={handleLap}
              disabled={time === 0}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:from-blue-400 hover:via-purple-400 hover:to-blue-500 disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed text-white p-5 rounded-2xl shadow-lg shadow-blue-500/40 transition-all duration-500 border border-blue-400/50 disabled:border-gray-500/50"
              whileHover={time > 0 ? { 
                scale: 1.1, 
                boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.4)',
                borderColor: 'rgba(96, 165, 250, 0.8)'
              } : {}}
              whileTap={time > 0 ? { scale: 0.95 } : {}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Plus size={28} />
            </motion.button>
            
            <motion.button
              onClick={handleReset}
              className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-400 hover:via-pink-400 hover:to-red-500 text-white p-5 rounded-2xl shadow-lg shadow-red-500/40 transition-all duration-500 border border-red-400/50"
              whileHover={{ 
                scale: 1.1, 
                boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.4)',
                borderColor: 'rgba(248, 113, 113, 0.8)'
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <RotateCcw size={28} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Laps Section */}
      <AnimatePresence>
        {laps.length > 0 && (
          <motion.div 
            className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Laps ({laps.length})
              </h3>
              <div className="flex space-x-3">
                {selectedLaps.size > 0 && (
                  <motion.button
                    onClick={deleteSelectedLaps}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white px-4 py-2 rounded-xl shadow-lg shadow-red-500/25 transition-all duration-300 flex items-center space-x-2 border border-red-400/50"
                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -12px rgba(239, 68, 68, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Trash size={16} />
                    <span>Delete Selected ({selectedLaps.size})</span>
                  </motion.button>
                )}
                <motion.button
                  onClick={deleteAllLaps}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-4 py-2 rounded-xl shadow-lg shadow-gray-500/25 transition-all duration-300 flex items-center space-x-2 border border-gray-500/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={16} />
                  <span>Clear All</span>
                </motion.button>
              </div>
            </div>
            
            <div className="max-h-80 overflow-y-auto space-y-3 custom-scrollbar">
              <AnimatePresence>
                {laps.map((lap, index) => (
                  <motion.div
                    key={lap.id}
                    onClick={() => toggleLapSelection(lap.id)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-500 border-2 ${
                      selectedLaps.has(lap.id)
                        ? 'bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 border-blue-400/60 shadow-lg shadow-blue-500/25'
                        : 'bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/30 hover:shadow-lg hover:shadow-white/10'
                    }`}
                    initial={{ opacity: 0, x: -50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    layout
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-mono text-gray-400 bg-black/30 rounded-lg px-3 py-1 border border-gray-600/50">
                          #{lap.number.toString().padStart(2, '0')}
                        </div>
                        <div className="text-xl font-mono text-white font-bold tracking-wide">
                          {formatTime(lap.time, lap.time >= 3600000)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          {editingLap === lap.id ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={editLabel}
                                onChange={(e) => setEditLabel(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-black/40 border border-white/30 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                onKeyPress={(e) => e.key === 'Enter' && saveEditingLap()}
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  saveEditingLap();
                                }}
                                className="text-green-400 hover:text-green-300 p-1"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  cancelEditingLap();
                                }}
                                className="text-red-400 hover:text-red-300 p-1"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <div>
                                <div className="text-lg font-semibold text-white">
                                  {lap.label}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {lap.timestamp.toLocaleTimeString()}
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditingLap(lap);
                                }}
                                className="text-gray-400 hover:text-cyan-400 transition-colors p-1 opacity-0 group-hover:opacity-100"
                              >
                                <Edit3 size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Stopwatch;

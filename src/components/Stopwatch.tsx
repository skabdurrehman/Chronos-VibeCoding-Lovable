
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Square, Plus, Trash } from 'lucide-react';

interface Lap {
  id: string;
  number: number;
  time: number;
  timestamp: Date;
  label?: string;
}

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [selectedLaps, setSelectedLaps] = useState<Set<string>>(new Set());
  const [lapCounter, setLapCounter] = useState(1);
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

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    
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

  const getStatusColor = () => {
    if (isRunning) return 'from-cyan-500 to-blue-500';
    if (time > 0) return 'from-yellow-500 to-orange-500';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-8">
      {/* Main Timer Display */}
      <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="text-center">
          <div className={`text-6xl md:text-8xl font-mono font-light bg-gradient-to-r ${getStatusColor()} bg-clip-text text-transparent mb-8 ${isRunning ? 'animate-pulse' : ''}`}>
            {formatTime(time)}
          </div>
          
          {/* Control Buttons */}
          <div className="flex justify-center space-x-4">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white p-4 rounded-2xl shadow-lg shadow-green-500/25 transition-all duration-300 hover:scale-105 hover:shadow-green-500/40"
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
              onClick={handleLap}
              disabled={time === 0}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white p-4 rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40 disabled:hover:scale-100 disabled:shadow-gray-500/25"
            >
              <Plus size={24} />
            </button>
            
            <button
              onClick={handleReset}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white p-4 rounded-2xl shadow-lg shadow-red-500/25 transition-all duration-300 hover:scale-105 hover:shadow-red-500/40"
            >
              <Square size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Laps Section */}
      {laps.length > 0 && (
        <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Laps</h3>
            {selectedLaps.size > 0 && (
              <button
                onClick={deleteSelectedLaps}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white px-4 py-2 rounded-xl shadow-lg shadow-red-500/25 transition-all duration-300 hover:scale-105 flex items-center space-x-2"
              >
                <Trash size={16} />
                <span>Delete Selected ({selectedLaps.size})</span>
              </button>
            )}
          </div>
          
          <div className="max-h-64 overflow-y-auto space-y-2 custom-scrollbar">
            {laps.map((lap) => (
              <div
                key={lap.id}
                onClick={() => toggleLapSelection(lap.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  selectedLaps.has(lap.id)
                    ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-2 border-blue-400/50'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-mono text-gray-400">
                      #{lap.number.toString().padStart(2, '0')}
                    </div>
                    <div className="text-lg font-mono text-white">
                      {formatTime(lap.time)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {lap.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stopwatch;

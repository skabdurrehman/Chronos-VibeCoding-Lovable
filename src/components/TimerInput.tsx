
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';

interface TimerInputProps {
  onSetDuration: (duration: number) => void;
}

const TimerInput: React.FC<TimerInputProps> = ({ onSetDuration }) => {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  const handleSetTimer = () => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    
    if (h === 0 && m === 0 && s === 0) return;
    
    const totalMs = (h * 3600 + m * 60 + s) * 1000;
    onSetDuration(totalMs);
  };

  const handleInputChange = (value: string, setter: (value: string) => void, max: number) => {
    const num = parseInt(value);
    if (value === '' || (num >= 0 && num <= max)) {
      setter(value);
    }
  };

  const quickSet = (minutes: number) => {
    setHours('');
    setMinutes(minutes.toString());
    setSeconds('');
    onSetDuration(minutes * 60 * 1000);
  };

  return (
    <motion.div 
      className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center mb-8">
        <Clock className="mr-3 text-cyan-400" size={32} />
        <h3 className="text-3xl font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Set Custom Timer
        </h3>
      </div>
      
      {/* Time Input */}
      <div className="flex justify-center items-center space-x-6 mb-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <input
            type="number"
            value={hours}
            onChange={(e) => handleInputChange(e.target.value, setHours, 23)}
            placeholder="00"
            className="w-24 h-20 bg-black/30 border-2 border-white/30 rounded-2xl text-3xl font-mono text-white text-center focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 transition-all duration-500 hover:border-white/50 backdrop-blur-sm shadow-lg"
            min="0"
            max="23"
          />
          <div className="text-sm text-gray-400 mt-3 font-semibold tracking-wide">Hours</div>
        </motion.div>
        
        <div className="text-5xl font-mono text-white/60 self-start pt-2">:</div>
        
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <input
            type="number"
            value={minutes}
            onChange={(e) => handleInputChange(e.target.value, setMinutes, 59)}
            placeholder="00"
            className="w-24 h-20 bg-black/30 border-2 border-white/30 rounded-2xl text-3xl font-mono text-white text-center focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 transition-all duration-500 hover:border-white/50 backdrop-blur-sm shadow-lg"
            min="0"
            max="59"
          />
          <div className="text-sm text-gray-400 mt-3 font-semibold tracking-wide">Minutes</div>
        </motion.div>
        
        <div className="text-5xl font-mono text-white/60 self-start pt-2">:</div>
        
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <input
            type="number"
            value={seconds}
            onChange={(e) => handleInputChange(e.target.value, setSeconds, 59)}
            placeholder="00"
            className="w-24 h-20 bg-black/30 border-2 border-white/30 rounded-2xl text-3xl font-mono text-white text-center focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 transition-all duration-500 hover:border-white/50 backdrop-blur-sm shadow-lg"
            min="0"
            max="59"
          />
          <div className="text-sm text-gray-400 mt-3 font-semibold tracking-wide">Seconds</div>
        </motion.div>
      </div>

      {/* Set Button */}
      <div className="text-center mb-8">
        <motion.button
          onClick={handleSetTimer}
          disabled={!hours && !minutes && !seconds}
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:from-blue-400 hover:via-purple-400 hover:to-blue-500 disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/40 transition-all duration-500 border border-blue-400/50 disabled:border-gray-500/50 flex items-center space-x-3 mx-auto"
          whileHover={hours || minutes || seconds ? { 
            scale: 1.05, 
            boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.4)' 
          } : {}}
          whileTap={hours || minutes || seconds ? { scale: 0.95 } : {}}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Zap size={24} />
          <span>Set Timer</span>
        </motion.button>
      </div>

      {/* Quick Set Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h4 className="text-lg font-semibold text-gray-300 mb-6 text-center">Quick Set</h4>
        <div className="flex flex-wrap justify-center gap-4">
          {[1, 2, 3, 5, 10, 15, 20, 30].map((mins, index) => (
            <motion.button
              key={mins}
              onClick={() => quickSet(mins)}
              className="bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 text-white px-6 py-3 rounded-xl transition-all duration-500 font-semibold backdrop-blur-sm shadow-lg hover:shadow-white/20"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
            >
              {mins}m
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TimerInput;

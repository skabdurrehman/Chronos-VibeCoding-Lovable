
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';

interface TimerInputProps {
  onSetDuration: (duration: number) => void;
}

const TimerInput: React.FC<TimerInputProps> = ({ onSetDuration }) => {
  const [days, setDays] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  const handleSetTimer = () => {
    const d = parseInt(days) || 0;
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    
    if (d === 0 && h === 0 && m === 0 && s === 0) return;
    
    const totalMs = (d * 86400 + h * 3600 + m * 60 + s) * 1000;
    onSetDuration(totalMs);
  };

  const handleInputChange = (value: string, setter: (value: string) => void, max: number) => {
    const num = parseInt(value);
    if (value === '' || (num >= 0 && num <= max)) {
      setter(value);
    }
  };

  const quickSet = (minutes: number) => {
    setDays('');
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
        <Clock className="mr-3 text-orange-400" size={32} />
        <h3 className="text-3xl font-bold text-white bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
          Set Custom Timer
        </h3>
      </div>
      
      {/* Time Input */}
      <div className="flex justify-center items-center space-x-4 mb-10 flex-wrap">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <input
            type="number"
            value={days}
            onChange={(e) => handleInputChange(e.target.value, setDays, 999)}
            placeholder="0"
            className="w-20 h-20 bg-black/30 border-2 border-white/30 rounded-2xl text-2xl font-mono text-white text-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all duration-500 hover:border-white/50 backdrop-blur-sm shadow-lg"
            min="0"
            max="999"
          />
          <div className="text-sm text-gray-400 mt-3 font-semibold tracking-wide">Days</div>
        </motion.div>
        
        <div className="text-4xl font-mono text-white/60 self-start pt-2">:</div>
        
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <input
            type="number"
            value={hours}
            onChange={(e) => handleInputChange(e.target.value, setHours, 23)}
            placeholder="0"
            className="w-20 h-20 bg-black/30 border-2 border-white/30 rounded-2xl text-2xl font-mono text-white text-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all duration-500 hover:border-white/50 backdrop-blur-sm shadow-lg"
            min="0"
            max="23"
          />
          <div className="text-sm text-gray-400 mt-3 font-semibold tracking-wide">Hours</div>
        </motion.div>
        
        <div className="text-4xl font-mono text-white/60 self-start pt-2">:</div>
        
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
            placeholder="0"
            className="w-20 h-20 bg-black/30 border-2 border-white/30 rounded-2xl text-2xl font-mono text-white text-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all duration-500 hover:border-white/50 backdrop-blur-sm shadow-lg"
            min="0"
            max="59"
          />
          <div className="text-sm text-gray-400 mt-3 font-semibold tracking-wide">Minutes</div>
        </motion.div>
        
        <div className="text-4xl font-mono text-white/60 self-start pt-2">:</div>
        
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <input
            type="number"
            value={seconds}
            onChange={(e) => handleInputChange(e.target.value, setSeconds, 59)}
            placeholder="0"
            className="w-20 h-20 bg-black/30 border-2 border-white/30 rounded-2xl text-2xl font-mono text-white text-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all duration-500 hover:border-white/50 backdrop-blur-sm shadow-lg"
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
          disabled={!days && !hours && !minutes && !seconds}
          className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:via-amber-400 hover:to-orange-500 disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-orange-500/40 transition-all duration-500 border border-orange-400/50 disabled:border-gray-500/50 flex items-center space-x-3 mx-auto"
          whileHover={days || hours || minutes || seconds ? { 
            scale: 1.05, 
            boxShadow: '0 25px 50px -12px rgba(251, 146, 60, 0.4)' 
          } : {}}
          whileTap={days || hours || minutes || seconds ? { scale: 0.95 } : {}}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Zap size={24} />
          <span>Set Timer</span>
        </motion.button>
      </div>

      {/* Quick Set Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
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
              transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
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

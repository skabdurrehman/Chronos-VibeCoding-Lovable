
import React, { useState } from 'react';
import { Clock } from 'lucide-react';

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
    <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
        <Clock className="mr-2" size={24} />
        Set Custom Timer
      </h3>
      
      {/* Time Input */}
      <div className="flex justify-center items-center space-x-4 mb-8">
        <div className="text-center">
          <input
            type="number"
            value={hours}
            onChange={(e) => handleInputChange(e.target.value, setHours, 23)}
            placeholder="00"
            className="w-20 h-16 bg-white/10 border-2 border-white/20 rounded-2xl text-2xl font-mono text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            min="0"
            max="23"
          />
          <div className="text-xs text-gray-400 mt-2">Hours</div>
        </div>
        
        <div className="text-4xl font-mono text-white/60">:</div>
        
        <div className="text-center">
          <input
            type="number"
            value={minutes}
            onChange={(e) => handleInputChange(e.target.value, setMinutes, 59)}
            placeholder="00"
            className="w-20 h-16 bg-white/10 border-2 border-white/20 rounded-2xl text-2xl font-mono text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            min="0"
            max="59"
          />
          <div className="text-xs text-gray-400 mt-2">Minutes</div>
        </div>
        
        <div className="text-4xl font-mono text-white/60">:</div>
        
        <div className="text-center">
          <input
            type="number"
            value={seconds}
            onChange={(e) => handleInputChange(e.target.value, setSeconds, 59)}
            placeholder="00"
            className="w-20 h-16 bg-white/10 border-2 border-white/20 rounded-2xl text-2xl font-mono text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            min="0"
            max="59"
          />
          <div className="text-xs text-gray-400 mt-2">Seconds</div>
        </div>
      </div>

      {/* Set Button */}
      <div className="text-center mb-6">
        <button
          onClick={handleSetTimer}
          disabled={!hours && !minutes && !seconds}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-8 py-3 rounded-2xl font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40 disabled:hover:scale-100"
        >
          Set Timer
        </button>
      </div>

      {/* Quick Set Buttons */}
      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-4 text-center">Quick Set</h4>
        <div className="flex flex-wrap justify-center gap-3">
          {[1, 2, 3, 5, 10, 15, 20, 30].map((minutes) => (
            <button
              key={minutes}
              onClick={() => quickSet(minutes)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 text-sm"
            >
              {minutes}m
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimerInput;

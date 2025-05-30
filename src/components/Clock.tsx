
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div 
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 shadow-2xl">
        <div className="text-center">
          <motion.div 
            className="text-3xl font-mono font-light text-white tracking-wider mb-1"
            style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
              filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))'
            }}
            key={formatTime(time)}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {formatTime(time)}
          </motion.div>
          <div className="text-sm text-gray-400 font-medium tracking-wide">
            {formatDate(time)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Clock;

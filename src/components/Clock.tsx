
import React, { useState, useEffect } from 'react';

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

  return (
    <div className="mt-6">
      <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 shadow-2xl">
        <div className="text-2xl font-mono font-light text-white/90 tracking-wider">
          {formatTime(time)}
        </div>
      </div>
    </div>
  );
};

export default Clock;

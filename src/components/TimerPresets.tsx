
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash } from 'lucide-react';

interface CustomPreset {
  id: string;
  name: string;
  duration: number;
  color: string;
  days?: number;
  hours?: number;
  minutes?: number;
}

interface TimerPresetsProps {
  onSelectDuration: (duration: number) => void;
  customPresets: CustomPreset[];
  setCustomPresets: (presets: CustomPreset[]) => void;
}

const TimerPresets: React.FC<TimerPresetsProps> = ({ 
  onSelectDuration, 
  customPresets, 
  setCustomPresets 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDays, setNewPresetDays] = useState('');
  const [newPresetHours, setNewPresetHours] = useState('');
  const [newPresetMinutes, setNewPresetMinutes] = useState('');

  const defaultPresets = [
    { name: '5 min', duration: 5 * 60 * 1000, color: 'from-green-400 to-green-600' },
    { name: '10 min', duration: 10 * 60 * 1000, color: 'from-blue-400 to-blue-600' },
    { name: '25 min', duration: 25 * 60 * 1000, color: 'from-purple-400 to-purple-600' },
    { name: '30 min', duration: 30 * 60 * 1000, color: 'from-pink-400 to-pink-600' },
    { name: '45 min', duration: 45 * 60 * 1000, color: 'from-orange-400 to-orange-600' },
    { name: '60 min', duration: 60 * 60 * 1000, color: 'from-red-400 to-red-600' },
    { name: '2 hours', duration: 2 * 60 * 60 * 1000, color: 'from-cyan-400 to-cyan-600' },
    { name: '8 hours', duration: 8 * 60 * 60 * 1000, color: 'from-indigo-400 to-indigo-600' },
  ];

  const colorOptions = [
    'from-cyan-400 to-cyan-600',
    'from-indigo-400 to-indigo-600',
    'from-emerald-400 to-emerald-600',
    'from-yellow-400 to-yellow-600',
    'from-rose-400 to-rose-600',
    'from-violet-400 to-violet-600',
    'from-teal-400 to-teal-600',
    'from-amber-400 to-amber-600',
  ];

  const getRandomColor = () => {
    const usedColors = customPresets.map(p => p.color);
    const availableColors = colorOptions.filter(color => !usedColors.includes(color));
    return availableColors[Math.floor(Math.random() * availableColors.length)] || colorOptions[0];
  };

  const handleAddPreset = () => {
    if (newPresetName.trim()) {
      const days = parseInt(newPresetDays) || 0;
      const hours = parseInt(newPresetHours) || 0;
      const minutes = parseInt(newPresetMinutes) || 0;
      
      if (days > 0 || hours > 0 || minutes > 0) {
        const totalMs = (days * 86400 + hours * 3600 + minutes * 60) * 1000;
        const newPreset: CustomPreset = {
          id: Date.now().toString(),
          name: newPresetName.trim(),
          duration: totalMs,
          color: getRandomColor(),
          days,
          hours,
          minutes,
        };
        setCustomPresets([...customPresets, newPreset]);
        setNewPresetName('');
        setNewPresetDays('');
        setNewPresetHours('');
        setNewPresetMinutes('');
        setShowAddForm(false);
      }
    }
  };

  const handleDeletePreset = (id: string) => {
    setCustomPresets(customPresets.filter(p => p.id !== id));
  };

  const formatDuration = (ms: number) => {
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor((ms % 86400000) / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    
    return parts.join(' ') || '0m';
  };

  return (
    <motion.div 
      className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-semibold text-white mb-6 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Timer Presets</h3>
      
      {/* Default Presets */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-400 mb-4">Default Presets</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {defaultPresets.map((preset) => (
            <motion.button
              key={preset.name}
              onClick={() => onSelectDuration(preset.duration)}
              className={`bg-gradient-to-r ${preset.color} p-4 rounded-2xl text-white font-medium shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm border border-white/20`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {preset.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Custom Presets */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-medium text-gray-400">Custom Presets</h4>
          <motion.button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white p-2 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} />
          </motion.button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <motion.div 
            className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <input
              type="text"
              placeholder="Preset name"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-3"
            />
            <div className="flex space-x-2 mb-3">
              <input
                type="number"
                placeholder="Days"
                value={newPresetDays}
                onChange={(e) => setNewPresetDays(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                min="0"
                max="999"
              />
              <input
                type="number"
                placeholder="Hours"
                value={newPresetHours}
                onChange={(e) => setNewPresetHours(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                min="0"
                max="23"
              />
              <input
                type="number"
                placeholder="Minutes"
                value={newPresetMinutes}
                onChange={(e) => setNewPresetMinutes(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                min="0"
                max="59"
              />
            </div>
            <div className="flex space-x-2">
              <motion.button
                onClick={handleAddPreset}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add
              </motion.button>
              <motion.button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Custom Preset List */}
        {customPresets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customPresets.map((preset) => (
              <motion.div
                key={preset.id}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.button
                  onClick={() => onSelectDuration(preset.duration)}
                  className={`w-full bg-gradient-to-r ${preset.color} p-4 rounded-2xl text-white font-medium shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm border border-white/20`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-left">
                    <div className="font-semibold">{preset.name}</div>
                    <div className="text-sm opacity-90">{formatDuration(preset.duration)}</div>
                  </div>
                </motion.button>
                
                <motion.button
                  onClick={() => handleDeletePreset(preset.id)}
                  className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash size={14} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            No custom presets yet. Click the + button to add one!
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TimerPresets;

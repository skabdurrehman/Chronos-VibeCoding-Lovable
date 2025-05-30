
import React, { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';

interface CustomPreset {
  id: string;
  name: string;
  duration: number;
  color: string;
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
  const [newPresetMinutes, setNewPresetMinutes] = useState('');

  const defaultPresets = [
    { name: '5 min', duration: 5 * 60 * 1000, color: 'from-green-400 to-green-600' },
    { name: '10 min', duration: 10 * 60 * 1000, color: 'from-blue-400 to-blue-600' },
    { name: '25 min', duration: 25 * 60 * 1000, color: 'from-purple-400 to-purple-600' },
    { name: '30 min', duration: 30 * 60 * 1000, color: 'from-pink-400 to-pink-600' },
    { name: '45 min', duration: 45 * 60 * 1000, color: 'from-orange-400 to-orange-600' },
    { name: '60 min', duration: 60 * 60 * 1000, color: 'from-red-400 to-red-600' },
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
    if (newPresetName.trim() && newPresetMinutes.trim()) {
      const minutes = parseInt(newPresetMinutes);
      if (minutes > 0) {
        const newPreset: CustomPreset = {
          id: Date.now().toString(),
          name: newPresetName.trim(),
          duration: minutes * 60 * 1000,
          color: getRandomColor(),
        };
        setCustomPresets([...customPresets, newPreset]);
        setNewPresetName('');
        setNewPresetMinutes('');
        setShowAddForm(false);
      }
    }
  };

  const handleDeletePreset = (id: string) => {
    setCustomPresets(customPresets.filter(p => p.id !== id));
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
      <h3 className="text-xl font-semibold text-white mb-6">Timer Presets</h3>
      
      {/* Default Presets */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-400 mb-4">Default Presets</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {defaultPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onSelectDuration(preset.duration)}
              className={`bg-gradient-to-r ${preset.color} p-4 rounded-2xl text-white font-medium shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Presets */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-medium text-gray-400">Custom Presets</h4>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white p-2 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/10">
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="Preset name"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Minutes"
                value={newPresetMinutes}
                onChange={(e) => setNewPresetMinutes(e.target.value)}
                className="w-24 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddPreset}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Custom Preset List */}
        {customPresets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customPresets.map((preset) => (
              <div
                key={preset.id}
                className="group relative"
              >
                <button
                  onClick={() => onSelectDuration(preset.duration)}
                  className={`w-full bg-gradient-to-r ${preset.color} p-4 rounded-2xl text-white font-medium shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                >
                  <div className="text-left">
                    <div className="font-semibold">{preset.name}</div>
                    <div className="text-sm opacity-90">{formatDuration(preset.duration)}</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleDeletePreset(preset.id)}
                  className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <Trash size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            No custom presets yet. Click the + button to add one!
          </div>
        )}
      </div>
    </div>
  );
};

export default TimerPresets;

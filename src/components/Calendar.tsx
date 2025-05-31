
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Plus, X, Clock, AlertCircle } from 'lucide-react';
import { Calendar as UICalendar } from '@/components/ui/calendar';

interface Task {
  id: string;
  date: string;
  title: string;
  note: string;
}

interface Holiday {
  date: string;
  name: string;
  type: 'indian' | 'custom';
}

interface CustomHoliday {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

interface CalendarProps {
  onClose: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [customHolidays, setCustomHolidays] = useState<CustomHoliday[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddHoliday, setShowAddHoliday] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNote, setNewTaskNote] = useState('');
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [holidayName, setHolidayName] = useState('');
  const [holidayStartDate, setHolidayStartDate] = useState('');
  const [holidayEndDate, setHolidayEndDate] = useState('');

  // Indian holidays for 2024-2025 (Delhi schools)
  const indianHolidays: Holiday[] = [
    { date: '2024-01-26', name: 'Republic Day', type: 'indian' },
    { date: '2024-03-08', name: 'Holi', type: 'indian' },
    { date: '2024-03-29', name: 'Good Friday', type: 'indian' },
    { date: '2024-04-11', name: 'Eid ul-Fitr', type: 'indian' },
    { date: '2024-04-17', name: 'Ram Navami', type: 'indian' },
    { date: '2024-06-17', name: 'Eid ul-Adha', type: 'indian' },
    { date: '2024-08-15', name: 'Independence Day', type: 'indian' },
    { date: '2024-08-19', name: 'Raksha Bandhan', type: 'indian' },
    { date: '2024-08-26', name: 'Janmashtami', type: 'indian' },
    { date: '2024-10-02', name: 'Gandhi Jayanti', type: 'indian' },
    { date: '2024-10-12', name: 'Dussehra', type: 'indian' },
    { date: '2024-11-01', name: 'Diwali', type: 'indian' },
    { date: '2024-11-15', name: 'Guru Nanak Jayanti', type: 'indian' },
    { date: '2024-12-25', name: 'Christmas Day', type: 'indian' },
    { date: '2025-01-26', name: 'Republic Day', type: 'indian' },
    { date: '2025-03-14', name: 'Holi', type: 'indian' },
    { date: '2025-03-30', name: 'Ram Navami', type: 'indian' },
    { date: '2025-04-18', name: 'Good Friday', type: 'indian' },
    { date: '2025-06-06', name: 'Eid ul-Adha', type: 'indian' },
    { date: '2025-08-15', name: 'Independence Day', type: 'indian' },
    { date: '2025-10-02', name: 'Gandhi Jayanti', type: 'indian' },
    { date: '2025-10-20', name: 'Diwali', type: 'indian' },
    { date: '2025-12-25', name: 'Christmas Day', type: 'indian' },
  ];

  // Load data from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('calendar-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    
    const savedHolidays = localStorage.getItem('custom-holidays');
    if (savedHolidays) {
      setCustomHolidays(JSON.parse(savedHolidays));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('calendar-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('custom-holidays', JSON.stringify(customHolidays));
  }, [customHolidays]);

  const handleAddTask = () => {
    if (selectedDate && newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        date: selectedDate.toISOString().split('T')[0],
        title: newTaskTitle.trim(),
        note: newTaskNote.trim(),
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskNote('');
      setShowAddTask(false);
    }
  };

  const handleAddHoliday = () => {
    if (holidayName.trim() && holidayStartDate && holidayEndDate) {
      const newHoliday: CustomHoliday = {
        id: Date.now().toString(),
        name: holidayName.trim(),
        startDate: holidayStartDate,
        endDate: holidayEndDate,
      };
      setCustomHolidays([...customHolidays, newHoliday]);
      setHolidayName('');
      setHolidayStartDate('');
      setHolidayEndDate('');
      setShowAddHoliday(false);
    }
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => task.date === dateStr);
  };

  const getHolidayForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    // Check Indian holidays first (higher priority)
    const indianHoliday = indianHolidays.find(holiday => holiday.date === dateStr);
    if (indianHoliday) return indianHoliday;
    
    // Check custom holidays
    const customHoliday = customHolidays.find(holiday => {
      const holidayStart = new Date(holiday.startDate);
      const holidayEnd = new Date(holiday.endDate);
      const currentDate = new Date(dateStr);
      return currentDate >= holidayStart && currentDate <= holidayEnd;
    });
    
    if (customHoliday) {
      return { date: dateStr, name: customHoliday.name, type: 'custom' as const };
    }
    
    return null;
  };

  const getNextTask = () => {
    const today = new Date().toISOString().split('T')[0];
    const futureTasks = tasks.filter(task => task.date >= today);
    futureTasks.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return futureTasks[0];
  };

  const getDaysUntilTask = (taskDate: string) => {
    const today = new Date();
    const target = new Date(taskDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nextTask = getNextTask();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-slate-900/90 via-purple-950/95 to-blue-950/90 backdrop-blur-2xl border border-purple-500/30 rounded-3xl p-8 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="text-purple-400" size={32} />
            <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Calendar
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => setShowAddHoliday(true)}
              className="bg-gradient-to-r from-orange-500/80 to-red-500/80 hover:from-orange-400/90 hover:to-red-400/90 text-white px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Holiday
            </motion.button>
            <motion.button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={28} />
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar - Left Side (bigger) */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/40 rounded-2xl p-6 border border-purple-500/20 backdrop-blur-sm relative">
              <UICalendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-2xl w-full"
                classNames={{
                  months: "flex flex-col space-y-4",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center text-purple-200 text-xl",
                  caption_label: "text-xl font-semibold",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-10 w-10 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 hover:text-purple-200 rounded-lg transition-colors border border-purple-400/30",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-purple-300 rounded-md w-12 h-12 font-normal text-base flex items-center justify-center",
                  row: "flex w-full mt-2",
                  cell: "h-12 w-12 text-center text-base p-0 relative hover:bg-purple-500/20 rounded-lg transition-colors",
                  day: "h-12 w-12 p-0 font-normal text-white hover:bg-purple-500/30 rounded-lg transition-colors text-base relative",
                  day_selected: "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-400 hover:to-blue-400 shadow-lg shadow-purple-500/30",
                  day_today: "bg-purple-500/30 text-purple-200 font-bold border border-purple-400/50",
                  day_outside: "text-gray-600 opacity-50",
                }}
                modifiers={{
                  holiday: (date) => {
                    const holiday = getHolidayForDate(date);
                    return !!holiday;
                  },
                  indianHoliday: (date) => {
                    const holiday = getHolidayForDate(date);
                    return holiday?.type === 'indian';
                  },
                  customHoliday: (date) => {
                    const holiday = getHolidayForDate(date);
                    return holiday?.type === 'custom';
                  }
                }}
                modifiersClassNames={{
                  indianHoliday: "bg-gradient-to-r from-orange-500/70 to-red-500/70 text-white font-bold",
                  customHoliday: "bg-gradient-to-r from-green-500/70 to-teal-500/70 text-white font-bold"
                }}
                onDayMouseEnter={(date) => setHoveredDate(date)}
                onDayMouseLeave={() => setHoveredDate(null)}
              />
              
              {/* Holiday Tooltip */}
              {hoveredDate && getHolidayForDate(hoveredDate) && (
                <motion.div
                  className="absolute z-50 bg-slate-800/95 border border-purple-400/50 rounded-lg px-3 py-2 text-white text-sm font-medium shadow-lg backdrop-blur-sm pointer-events-none"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  {getHolidayForDate(hoveredDate)?.name}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800/95"></div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Side - Task Details */}
          <div className="space-y-6">
            {/* Selected Date Info */}
            {selectedDate && (
              <motion.div
                className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-2xl p-6 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-purple-100 mb-3">
                  {selectedDate.toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>

                {/* Holiday Check */}
                {getHolidayForDate(selectedDate) && (
                  <div className="bg-purple-500/30 border border-purple-400/40 rounded-xl p-3 mb-3 backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="text-purple-300" size={16} />
                      <span className="text-purple-100 font-medium">
                        {getHolidayForDate(selectedDate)?.name}
                      </span>
                    </div>
                  </div>
                )}

                {/* Tasks for selected date */}
                <div className="space-y-2">
                  {getTasksForDate(selectedDate).map((task) => (
                    <motion.div
                      key={task.id}
                      className="bg-slate-800/60 rounded-xl p-3 border border-purple-400/20 backdrop-blur-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h4 className="font-semibold text-white">{task.title}</h4>
                      {task.note && <p className="text-gray-300 text-sm mt-1">{task.note}</p>}
                    </motion.div>
                  ))}
                </div>

                {/* Add Task Button */}
                <motion.button
                  onClick={() => setShowAddTask(true)}
                  className="mt-3 flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={16} />
                  <span>Add Task</span>
                </motion.button>
              </motion.div>
            )}

            {/* Next Task Countdown */}
            {nextTask && (
              <motion.div
                className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-2xl p-6 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="text-purple-400" size={20} />
                  <span className="text-purple-200 font-semibold">Upcoming Task</span>
                </div>
                <h4 className="text-white font-bold text-lg">{nextTask.title}</h4>
                <p className="text-gray-300 text-sm">
                  {getDaysUntilTask(nextTask.date)} days left until {new Date(nextTask.date).toLocaleDateString('en-IN')}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Add Task Form */}
        <AnimatePresence>
          {showAddTask && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddTask(false)}
            >
              <motion.div
                className="bg-slate-800/90 border border-purple-400/30 rounded-2xl p-6 backdrop-blur-sm max-w-md w-full mx-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-4">Add New Task</h3>
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-slate-700/50 border border-purple-400/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-3"
                />
                <textarea
                  placeholder="Add a note (optional)"
                  value={newTaskNote}
                  onChange={(e) => setNewTaskNote(e.target.value)}
                  className="w-full bg-slate-700/50 border border-purple-400/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4 h-20 resize-none"
                />
                <div className="flex space-x-3">
                  <motion.button
                    onClick={handleAddTask}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add Task
                  </motion.button>
                  <motion.button
                    onClick={() => setShowAddTask(false)}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Holiday Form */}
        <AnimatePresence>
          {showAddHoliday && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddHoliday(false)}
            >
              <motion.div
                className="bg-slate-800/90 border border-purple-400/30 rounded-2xl p-6 backdrop-blur-sm max-w-md w-full mx-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-4">Add Custom Holiday</h3>
                <input
                  type="text"
                  placeholder="Holiday name"
                  value={holidayName}
                  onChange={(e) => setHolidayName(e.target.value)}
                  className="w-full bg-slate-700/50 border border-purple-400/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-3"
                />
                <input
                  type="date"
                  value={holidayStartDate}
                  onChange={(e) => setHolidayStartDate(e.target.value)}
                  className="w-full bg-slate-700/50 border border-purple-400/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-3"
                />
                <input
                  type="date"
                  value={holidayEndDate}
                  onChange={(e) => setHolidayEndDate(e.target.value)}
                  className="w-full bg-slate-700/50 border border-purple-400/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
                />
                <div className="flex space-x-3">
                  <motion.button
                    onClick={handleAddHoliday}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add Holiday
                  </motion.button>
                  <motion.button
                    onClick={() => setShowAddHoliday(false)}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Calendar;

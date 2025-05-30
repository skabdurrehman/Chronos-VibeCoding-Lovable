
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

interface CalendarProps {
  onClose: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNote, setNewTaskNote] = useState('');

  // Indian holidays for 2024-2025
  const indianHolidays = [
    { date: '2024-01-26', name: 'Republic Day' },
    { date: '2024-03-08', name: 'Holi' },
    { date: '2024-03-29', name: 'Good Friday' },
    { date: '2024-04-11', name: 'Eid ul-Fitr' },
    { date: '2024-04-17', name: 'Ram Navami' },
    { date: '2024-08-15', name: 'Independence Day' },
    { date: '2024-08-19', name: 'Raksha Bandhan' },
    { date: '2024-08-26', name: 'Janmashtami' },
    { date: '2024-10-02', name: 'Gandhi Jayanti' },
    { date: '2024-10-12', name: 'Dussehra' },
    { date: '2024-11-01', name: 'Diwali' },
    { date: '2024-11-15', name: 'Guru Nanak Jayanti' },
    { date: '2024-12-25', name: 'Christmas Day' },
  ];

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('calendar-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('calendar-tasks', JSON.stringify(tasks));
  }, [tasks]);

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

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => task.date === dateStr);
  };

  const getHolidayForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return indianHolidays.find(holiday => holiday.date === dateStr);
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto custom-scrollbar"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="text-cyan-400" size={28} />
            <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Calendar
            </h2>
          </div>
          <motion.button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} />
          </motion.button>
        </div>

        {/* Calendar */}
        <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
          <UICalendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-2xl"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center text-white",
              caption_label: "text-lg font-semibold",
              nav: "space-x-1 flex items-center",
              nav_button: "h-8 w-8 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-gray-400 rounded-md w-9 font-normal text-sm",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative hover:bg-white/10 rounded-lg transition-colors",
              day: "h-9 w-9 p-0 font-normal text-white hover:bg-white/20 rounded-lg transition-colors",
              day_selected: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400",
              day_today: "bg-white/20 text-cyan-400 font-bold",
              day_outside: "text-gray-600 opacity-50",
            }}
          />
        </div>

        {/* Selected Date Info */}
        {selectedDate && (
          <motion.div
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl p-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-white mb-3">
              {selectedDate.toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>

            {/* Holiday Check */}
            {getHolidayForDate(selectedDate) && (
              <div className="bg-orange-500/20 border border-orange-400/30 rounded-xl p-3 mb-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="text-orange-400" size={16} />
                  <span className="text-orange-200 font-medium">
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
                  className="bg-white/10 rounded-xl p-3 border border-white/20"
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
              className="mt-3 flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={16} />
              <span>Add Task</span>
            </motion.button>
          </motion.div>
        )}

        {/* Add Task Form */}
        <AnimatePresence>
          {showAddTask && (
            <motion.div
              className="bg-black/40 border border-white/20 rounded-2xl p-4 mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="text"
                placeholder="Task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent mb-3"
              />
              <textarea
                placeholder="Add a note (optional)"
                value={newTaskNote}
                onChange={(e) => setNewTaskNote(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent mb-3 h-20 resize-none"
              />
              <div className="flex space-x-3">
                <motion.button
                  onClick={handleAddTask}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-4 py-2 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Task
                </motion.button>
                <motion.button
                  onClick={() => setShowAddTask(false)}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Task Countdown */}
        {nextTask && (
          <motion.div
            className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-2xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="text-cyan-400" size={20} />
              <span className="text-cyan-200 font-semibold">Upcoming Task</span>
            </div>
            <h4 className="text-white font-bold text-lg">{nextTask.title}</h4>
            <p className="text-gray-300 text-sm">
              {getDaysUntilTask(nextTask.date)} days left until {new Date(nextTask.date).toLocaleDateString('en-IN')}
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Calendar;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Plus, X, Clock, AlertCircle, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar as UICalendar } from '@/components/ui/calendar';

interface Reminder {
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
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [customHolidays, setCustomHolidays] = useState<CustomHoliday[]>([]);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [showAddHoliday, setShowAddHoliday] = useState(false);
  const [showEditReminder, setShowEditReminder] = useState<string | null>(null);
  const [showEditHoliday, setShowEditHoliday] = useState<string | null>(null);
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderNote, setNewReminderNote] = useState('');
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [holidayName, setHolidayName] = useState('');
  const [holidayStartDate, setHolidayStartDate] = useState('');
  const [holidayEndDate, setHolidayEndDate] = useState('');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [editingYear, setEditingYear] = useState('');

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
    const savedReminders = localStorage.getItem('calendar-reminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
    
    const savedHolidays = localStorage.getItem('custom-holidays');
    if (savedHolidays) {
      setCustomHolidays(JSON.parse(savedHolidays));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('calendar-reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('custom-holidays', JSON.stringify(customHolidays));
  }, [customHolidays]);

  const handleAddReminder = () => {
    if (selectedDate && newReminderTitle.trim()) {
      const newReminder: Reminder = {
        id: Date.now().toString(),
        date: selectedDate.toISOString().split('T')[0],
        title: newReminderTitle.trim(),
        note: newReminderNote.trim(),
      };
      setReminders([...reminders, newReminder]);
      setNewReminderTitle('');
      setNewReminderNote('');
      setShowAddReminder(false);
    }
  };

  const handleEditReminder = (reminder: Reminder) => {
    setNewReminderTitle(reminder.title);
    setNewReminderNote(reminder.note);
    setShowEditReminder(reminder.id);
  };

  const handleUpdateReminder = () => {
    if (showEditReminder && newReminderTitle.trim()) {
      setReminders(reminders.map(reminder => 
        reminder.id === showEditReminder 
          ? { ...reminder, title: newReminderTitle.trim(), note: newReminderNote.trim() }
          : reminder
      ));
      setNewReminderTitle('');
      setNewReminderNote('');
      setShowEditReminder(null);
    }
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
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

  const handleEditHoliday = (holiday: CustomHoliday) => {
    setHolidayName(holiday.name);
    setHolidayStartDate(holiday.startDate);
    setHolidayEndDate(holiday.endDate);
    setShowEditHoliday(holiday.id);
  };

  const handleUpdateHoliday = () => {
    if (showEditHoliday && holidayName.trim() && holidayStartDate && holidayEndDate) {
      setCustomHolidays(customHolidays.map(holiday => 
        holiday.id === showEditHoliday 
          ? { ...holiday, name: holidayName.trim(), startDate: holidayStartDate, endDate: holidayEndDate }
          : holiday
      ));
      setHolidayName('');
      setHolidayStartDate('');
      setHolidayEndDate('');
      setShowEditHoliday(null);
    }
  };

  const handleDeleteHoliday = (id: string) => {
    setCustomHolidays(customHolidays.filter(holiday => holiday.id !== id));
  };

  const handleYearChange = (newYear: number) => {
    setCurrentYear(newYear);
    setSelectedDate(new Date(newYear, currentMonth, selectedDate?.getDate() || 1));
  };

  const handleMonthChange = (newMonth: number) => {
    setCurrentMonth(newMonth);
    setSelectedDate(new Date(currentYear, newMonth, selectedDate?.getDate() || 1));
  };

  const handleYearInput = () => {
    const year = parseInt(editingYear);
    if (year && year >= 1900 && year <= 2100) {
      handleYearChange(year);
    }
    setShowYearPicker(false);
    setEditingYear('');
  };

  const getRemindersForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return reminders.filter(reminder => reminder.date === dateStr);
  };

  const getHolidayForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    const indianHoliday = indianHolidays.find(holiday => holiday.date === dateStr);
    if (indianHoliday) return indianHoliday;
    
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

  const getNextReminder = () => {
    const today = new Date().toISOString().split('T')[0];
    const futureReminders = reminders.filter(reminder => reminder.date >= today);
    futureReminders.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return futureReminders[0];
  };

  const getDaysUntilReminder = (reminderDate: string) => {
    const today = new Date();
    const target = new Date(reminderDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nextReminder = getNextReminder();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const SmallCalendar = ({ onDateSelect }: { onDateSelect: (date: string) => void }) => (
    <div className="bg-slate-700/30 rounded-xl p-3 border border-green-400/30">
      <UICalendar
        mode="single"
        selected={new Date()}
        onSelect={(date) => date && onDateSelect(date.toISOString().split('T')[0])}
        className="rounded-xl w-full scale-75 origin-top"
        classNames={{
          months: "flex flex-col space-y-2",
          month: "space-y-2",
          caption: "flex justify-center pt-1 relative items-center text-green-200 text-sm",
          caption_label: "text-sm font-semibold",
          nav: "space-x-1 flex items-center",
          nav_button: "h-6 w-6 bg-green-500/20 hover:bg-green-500/30 text-green-300 hover:text-green-200 rounded-lg transition-colors border border-green-400/30 text-xs",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-green-300 rounded-md w-8 h-8 font-normal text-xs flex items-center justify-center",
          row: "flex w-full mt-1",
          cell: "h-8 w-8 text-center text-xs p-0 relative hover:bg-green-500/20 rounded-lg transition-colors",
          day: "h-8 w-8 p-0 font-normal text-white hover:bg-green-500/30 rounded-lg transition-colors text-xs relative",
          day_selected: "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-400 hover:to-teal-400 shadow-lg shadow-green-500/30",
          day_today: "bg-green-500/30 text-green-200 font-bold border border-green-400/50",
          day_outside: "text-gray-600 opacity-50",
        }}
      />
    </div>
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-slate-900/90 via-purple-950/95 to-blue-950/90 backdrop-blur-2xl border border-purple-500/30 rounded-3xl p-8 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
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
              {/* Custom Year/Month Navigation */}
              <div className="flex justify-between items-center mb-6">
                <button onClick={() => handleMonthChange(currentMonth > 0 ? currentMonth - 1 : 11)}>
                  <ChevronLeft className="h-6 w-6 text-purple-300 hover:text-purple-200" />
                </button>
                
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setShowMonthPicker(!showMonthPicker)}
                    className="text-xl font-semibold text-purple-200 hover:text-purple-100 px-3 py-1 rounded-lg hover:bg-purple-500/20"
                  >
                    {monthNames[currentMonth]}
                  </button>
                  
                  <button 
                    onClick={() => setShowYearPicker(!showYearPicker)}
                    className="text-xl font-semibold text-purple-200 hover:text-purple-100 px-3 py-1 rounded-lg hover:bg-purple-500/20"
                  >
                    {currentYear}
                  </button>
                </div>
                
                <button onClick={() => handleMonthChange(currentMonth < 11 ? currentMonth + 1 : 0)}>
                  <ChevronRight className="h-6 w-6 text-purple-300 hover:text-purple-200" />
                </button>
              </div>

              {/* Year Picker */}
              {showYearPicker && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 bg-slate-800/95 border border-purple-400/50 rounded-lg p-4 backdrop-blur-sm">
                  <input
                    type="number"
                    value={editingYear}
                    onChange={(e) => setEditingYear(e.target.value)}
                    placeholder={currentYear.toString()}
                    className="w-24 bg-slate-700/50 border border-purple-400/30 rounded-lg px-3 py-2 text-white text-center"
                    onKeyPress={(e) => e.key === 'Enter' && handleYearInput()}
                  />
                  <div className="flex space-x-2 mt-2">
                    <button onClick={handleYearInput} className="bg-purple-500 text-white px-3 py-1 rounded text-sm">Set</button>
                    <button onClick={() => setShowYearPicker(false)} className="bg-gray-500 text-white px-3 py-1 rounded text-sm">Cancel</button>
                  </div>
                </div>
              )}

              {/* Month Picker */}
              {showMonthPicker && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 bg-slate-800/95 border border-purple-400/50 rounded-lg p-4 backdrop-blur-sm grid grid-cols-3 gap-2">
                  {monthNames.map((month, index) => (
                    <button
                      key={month}
                      onClick={() => { handleMonthChange(index); setShowMonthPicker(false); }}
                      className="bg-purple-500/20 hover:bg-purple-500/40 text-white px-3 py-2 rounded text-sm"
                    >
                      {month.slice(0, 3)}
                    </button>
                  ))}
                </div>
              )}

              <UICalendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={new Date(currentYear, currentMonth)}
                className="rounded-2xl w-full"
                classNames={{
                  months: "flex flex-col space-y-4",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center text-purple-200 text-xl hidden",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-purple-300 rounded-md w-14 h-14 font-normal text-base flex items-center justify-center",
                  row: "flex w-full mt-2",
                  cell: "h-14 w-14 text-center text-base p-0 relative hover:bg-purple-500/20 rounded-lg transition-colors",
                  day: "h-14 w-14 p-0 font-normal text-white hover:bg-purple-500/30 rounded-lg transition-colors text-base relative",
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

          {/* Right Side - Reminder Details */}
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="text-purple-300" size={16} />
                        <span className="text-purple-100 font-medium">
                          {getHolidayForDate(selectedDate)?.name}
                        </span>
                      </div>
                      {getHolidayForDate(selectedDate)?.type === 'custom' && (
                        <button
                          onClick={() => {
                            const holiday = customHolidays.find(h => {
                              const start = new Date(h.startDate);
                              const end = new Date(h.endDate);
                              const current = selectedDate;
                              return current >= start && current <= end;
                            });
                            if (holiday) handleEditHoliday(holiday);
                          }}
                          className="text-purple-300 hover:text-purple-200"
                        >
                          <Edit size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Reminders for selected date */}
                <div className="space-y-2">
                  {getRemindersForDate(selectedDate).map((reminder) => (
                    <motion.div
                      key={reminder.id}
                      className="bg-slate-800/60 rounded-xl p-3 border border-purple-400/20 backdrop-blur-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white">{reminder.title}</h4>
                          {reminder.note && <p className="text-gray-300 text-sm mt-1">{reminder.note}</p>}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditReminder(reminder)}
                            className="text-purple-400 hover:text-purple-300"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteReminder(reminder.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Add Reminder Button */}
                <motion.button
                  onClick={() => setShowAddReminder(true)}
                  className="mt-3 flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={16} />
                  <span>Add Reminder</span>
                </motion.button>
              </motion.div>
            )}

            {/* Next Reminder Countdown */}
            {nextReminder && (
              <motion.div
                className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-2xl p-6 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="text-purple-400" size={20} />
                  <span className="text-purple-200 font-semibold">Upcoming Reminder</span>
                </div>
                <h4 className="text-white font-bold text-lg">{nextReminder.title}</h4>
                <p className="text-gray-300 text-sm">
                  {getDaysUntilReminder(nextReminder.date)} days left until {new Date(nextReminder.date).toLocaleDateString('en-IN')}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Add/Edit Reminder Forms */}
        <AnimatePresence>
          {(showAddReminder || showEditReminder) && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowAddReminder(false); setShowEditReminder(null); setNewReminderTitle(''); setNewReminderNote(''); }}
            >
              <motion.div
                className="bg-slate-800/90 border border-purple-400/30 rounded-2xl p-6 backdrop-blur-sm max-w-md w-full mx-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  {showEditReminder ? 'Edit Reminder' : 'Add New Reminder'}
                </h3>
                <input
                  type="text"
                  placeholder="Reminder title"
                  value={newReminderTitle}
                  onChange={(e) => setNewReminderTitle(e.target.value)}
                  className="w-full bg-slate-700/50 border border-purple-400/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-3"
                />
                <textarea
                  placeholder="Add a note (optional)"
                  value={newReminderNote}
                  onChange={(e) => setNewReminderNote(e.target.value)}
                  className="w-full bg-slate-700/50 border border-purple-400/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4 h-20 resize-none"
                />
                <div className="flex space-x-3">
                  <motion.button
                    onClick={showEditReminder ? handleUpdateReminder : handleAddReminder}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showEditReminder ? 'Update' : 'Add'} Reminder
                  </motion.button>
                  <motion.button
                    onClick={() => { 
                      setShowAddReminder(false); 
                      setShowEditReminder(null); 
                      setNewReminderTitle(''); 
                      setNewReminderNote(''); 
                    }}
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

        {/* Add/Edit Holiday Forms */}
        <AnimatePresence>
          {(showAddHoliday || showEditHoliday) && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { 
                setShowAddHoliday(false); 
                setShowEditHoliday(null); 
                setHolidayName(''); 
                setHolidayStartDate(''); 
                setHolidayEndDate(''); 
              }}
            >
              <motion.div
                className="bg-slate-800/90 border border-purple-400/30 rounded-2xl p-6 backdrop-blur-sm max-w-md w-full mx-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  {showEditHoliday ? 'Edit Custom Holiday' : 'Add Custom Holiday'}
                </h3>
                <input
                  type="text"
                  placeholder="Holiday name"
                  value={holidayName}
                  onChange={(e) => setHolidayName(e.target.value)}
                  className="w-full bg-slate-700/50 border border-purple-400/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-3"
                />
                
                <div className="mb-4">
                  <SmallCalendar onDateSelect={setHolidayStartDate} />
                  <p className="text-sm text-gray-400 mt-2">From: {holidayStartDate || 'Select start date'}</p>
                </div>
                
                <div className="mb-4">
                  <SmallCalendar onDateSelect={setHolidayEndDate} />
                  <p className="text-sm text-gray-400 mt-2">To: {holidayEndDate || 'Select end date'}</p>
                </div>
                
                <div className="flex space-x-3">
                  <motion.button
                    onClick={showEditHoliday ? handleUpdateHoliday : handleAddHoliday}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showEditHoliday ? 'Update' : 'Add'} Holiday
                  </motion.button>
                  <motion.button
                    onClick={() => { 
                      setShowAddHoliday(false); 
                      setShowEditHoliday(null); 
                      setHolidayName(''); 
                      setHolidayStartDate(''); 
                      setHolidayEndDate(''); 
                    }}
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

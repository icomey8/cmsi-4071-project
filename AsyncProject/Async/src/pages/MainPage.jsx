import React, { useState, useRef } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { FaBars } from 'react-icons/fa';
import Calendar from '@/components/Calendar';
import ProfileModal from '@/components/ProfileModal';

function MainPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [plans, setPlans] = useState({
    "2024-10-30": { summary: "Project Due" },
    "2024-11-01": { summary: "Meeting with Prof. Smith" },
  });
  const [showClassInput, setShowClassInput] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showClassesDropdown, setShowClassesDropdown] = useState(false);
  const [newPlan, setNewPlan] = useState('');
  const [planMonth, setPlanMonth] = useState('');
  const [planDay, setPlanDay] = useState('');
  const [planYear, setPlanYear] = useState('');
  const inputRef = useRef(null);

  const handleOutsideClick = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setShowClassInput(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleAddPlan = () => {
    if (!newPlan.trim() || !planMonth.trim() || !planDay.trim() || !planYear.trim()) return;

    const dateKey = format(new Date(`${planYear}-${planMonth}-${planDay}`), 'yyyy-MM-dd');
    setPlans((prevPlans) => ({
      ...prevPlans,
      [dateKey]: { summary: newPlan },
    }));
    setNewPlan('');
    setPlanMonth('');
    setPlanDay('');
    setPlanYear('');
  };

  const getWeeklyNotifications = () => {
    const startOfWeekDate = startOfWeek(selectedDate);
    const endOfWeekDate = endOfWeek(selectedDate);
    const daysOfWeek = eachDayOfInterval({ start: startOfWeekDate, end: endOfWeekDate });

    return daysOfWeek
      .map((day) => {
        const dateKey = format(day, 'yyyy-MM-dd');
        return plans[dateKey] ? { date: format(day, 'MMMM do, yyyy'), summary: plans[dateKey].summary } : null;
      })
      .filter(Boolean);
  };

  return (
    <>
      <nav className="p-4 bg-gray-800 flex justify-between items-center">
        <FaBars onClick={() => setShowSidebar(!showSidebar)} className="text-white text-2xl cursor-pointer" />
        <div className="container flex items-center justify-center mx-auto">
          <div className="text-lg font-semibold text-white">
            <h1>Async</h1>
          </div>
        </div>
      </nav>

      {showSidebar && (
        <div className="fixed inset-0 z-40 flex">
          <div className={`w-64 h-full bg-white dark:bg-gray-900 p-6 shadow-lg transform transition-transform duration-300 ease-in-out ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Async</h2>
            <button className="w-full text-left text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2" onClick={() => setShowClassesDropdown(!showClassesDropdown)}>
              Classes
            </button>
            {showClassesDropdown && (
              <div className="pl-4 space-y-2">
                <div className="text-gray-700 dark:text-gray-300 cursor-pointer">CMSI 3100</div>
                <div className="text-gray-700 dark:text-gray-300 cursor-pointer">CMSI 201</div>
                <div className="text-gray-700 dark:text-gray-300 cursor-pointer">CMSI 301</div>
              </div>
            )}
          </div>
          <div className="flex-1 bg-gray-800 bg-opacity-50 transition-opacity duration-300 ease-in-out" onClick={() => setShowSidebar(false)}></div>
        </div>
      )}

      <div className="flex flex-col items-center w-screen min-h-screen bg-slate-950 dark:bg-gray-900 p-8 space-y-8">
        <div className="flex w-full max-w-4xl items-center justify-between mb-4">
          <div className="w-1/2" ref={inputRef}>
            {showClassInput ? (
              <div className="p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enter Class Code
                </label>
                <input
                  type="text"
                  maxLength="10"
                  className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="8-10 character code"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                />
              </div>
            ) : (
              <button onClick={() => setShowClassInput(true)} className="px-4 py-3 text-center font-semibold text-gray-900 bg-gray-200 rounded-md shadow-lg hover:bg-gray-300 focus:outline-none dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700">
                Click here to add a class
              </button>
            )}
          </div>

          <div onClick={() => setShowProfileModal(true)} className="flex items-center cursor-pointer space-x-2">
            <div className="flex flex-col text-right mr-2">
              <span className="text-gray-900 font-medium dark:text-gray-100">John Doe</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Student/Teacher</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-400 dark:bg-gray-600"></div>
          </div>
        </div>

        <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} plans={plans} />
        
        <div className="flex w-full max-w-4xl space-x-4 mt-4">
          <div className="w-1/2 p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Add Plan</h3>
            <div className="mt-2 flex space-x-2">
              <input type="text" placeholder="MM" value={planMonth} onChange={(e) => setPlanMonth(e.target.value)} className="w-1/3 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
              <input type="text" placeholder="DD" value={planDay} onChange={(e) => setPlanDay(e.target.value)} className="w-1/3 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
              <input type="text" placeholder="YYYY" value={planYear} onChange={(e) => setPlanYear(e.target.value)} className="w-1/3 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            </div>
            <input type="text" placeholder="Plan Details" value={newPlan} onChange={(e) => setNewPlan(e.target.value)} className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            <button onClick={handleAddPlan} className="mt-2 w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600">Add Plan</button>
          </div>

          <div className="w-1/2 p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Weekly Notifications</h3>
            <ul className="mt-2 space-y-2">
              {getWeeklyNotifications().length > 0 ? (
                getWeeklyNotifications().map((notification, index) => (
                  <li key={index} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <p className="text-gray-900 dark:text-gray-100">{notification.date}</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{notification.summary}</p>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No notifications for this week</p>
              )}
            </ul>
          </div>
        </div>
      </div>

      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
    </>
  );
}

export default MainPage;

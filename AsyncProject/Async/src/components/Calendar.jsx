import React, { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { Card } from "@/components/card";

function Calendar({ selectedDate, setSelectedDate, plans }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handlePreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleDateClick = (day) => {
    // Set selected date at midnight to avoid time issues
    const dateAtMidnight = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    setSelectedDate(dateAtMidnight);
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button onClick={handlePreviousMonth} className="text-lg font-semibold text-gray-700 dark:text-gray-100">{'<'}</button>
      <h2 className="text-xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
      <button onClick={handleNextMonth} className="text-lg font-semibold text-gray-700 dark:text-gray-100">{'>'}</button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const dayFormat = "EEE";
    let startDay = startOfWeek(new Date());

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium text-gray-500 dark:text-gray-400">
          {format(addDays(startDay, i), dayFormat)}
        </div>
      );
    }
    return <div className="grid grid-cols-7 gap-1">{days}</div>;
  };

  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const dayString = format(day, 'yyyy-MM-dd');
        const isSelected = isSameDay(day, selectedDate);
        const isInMonth = isSameMonth(day, monthStart);
        const hasPlan = Boolean(plans[dayString]); // Check if day has a plan
        
        const dayStyles = `p-4 text-center rounded-lg cursor-pointer ${
          isInMonth ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'
        } ${isSelected ? 'ring-2 ring-indigo-500' : ''} ${hasPlan ? 'bg-indigo-100 dark:bg-indigo-700' : ''}`;

        days.push(
          <div
            key={day.toISOString()}
            className={dayStyles}
            style={{ minHeight: "70px", minWidth: "105px" }} // Consistent cell size
            onClick={() => handleDateClick(day)}
          >
            <span className="inline-block w-full">{format(day, 'd')}</span>
            {hasPlan && <div className="w-2 h-2 bg-indigo-500 rounded-full mx-auto mt-1"></div>} {/* Dot for plans */}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toISOString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <Card
      className="p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800"
      style={{ minWidth: "600px", maxWidth: "800px", minHeight: "500px", maxHeight: "600px" }}
    >
      {renderHeader()}
      {renderDays()}
      <div className="space-y-1">{renderCells()}</div>
    </Card>
  );
}

export default Calendar;

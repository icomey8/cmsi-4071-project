import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import './Calendar.css';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ time: '', title: '', description: '' });

  // Fetch events from Firebase
  useEffect(() => {
    const fetchEvents = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      try {
        const eventsRef = collection(db, `users/${userId}/calendarEvents`);
        const snapshot = await getDocs(eventsRef);

        const fetchedEvents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handlePreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  const handleAddEvent = async () => {
    if (newEvent.time && newEvent.title && newEvent.description && selectedDate) {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const newEventEntry = {
        date: selectedDate.toISOString().split('T')[0],
        time: newEvent.time,
        title: newEvent.title,
        description: newEvent.description,
      };

      try {
        const eventsRef = collection(db, `users/${userId}/calendarEvents`);
        await addDoc(eventsRef, newEventEntry);
        setEvents([...events, newEventEntry]);
        setNewEvent({ time: '', title: '', description: '' });
      } catch (error) {
        console.error('Error adding event:', error);
      }
    }
  };

  const generateCalendarDays = () => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startOfCalendar = new Date(startOfMonth);
    startOfCalendar.setDate(startOfMonth.getDate() - startOfMonth.getDay());

    const endOfCalendar = new Date(endOfMonth);
    endOfCalendar.setDate(endOfMonth.getDate() + (6 - endOfMonth.getDay()));

    const days = [];
    for (let day = new Date(startOfCalendar); day <= endOfCalendar; day.setDate(day.getDate() + 1)) {
      days.push(new Date(day));
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="calendar-layout">
      <div className="calendar-container">
        <div className="calendar">
          <h1 className="calendar-heading">Calendar</h1>
          <div className="calendar-header">
            <button className="calendar-nav" onClick={handlePreviousMonth}>
              {'<'}
            </button>
            <h2 className="calendar-title">
              {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
            </h2>
            <button className="calendar-nav" onClick={handleNextMonth}>
              {'>'}
            </button>
          </div>
          <div className="calendar-days-row">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>
          <div className="calendar-body">
            {calendarDays.map((day) => (
              <div
                key={day.toISOString()}
                className={`calendar-cell ${
                  day.getMonth() === currentMonth.getMonth() ? 'current-month' : 'other-month'
                } ${selectedDate?.toDateString() === day.toDateString() ? 'selected' : ''} ${
                  day.toDateString() === new Date().toDateString() ? 'today' : ''
                }`}
                onClick={() => handleDateClick(day)}
              >
                {day.getDate()}
                {events.some((event) => event.date === day.toISOString().split('T')[0]) && (
                  <div className="event-indicator"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="event-section">
        <h2 className="selected-date">
          {selectedDate ? `Selected Date: ${selectedDate.toDateString()}` : 'Select a date'}
        </h2>
        <div className="add-event">
          <div className="time-input">
            <label>Time:</label>
            <input
              type="time"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
            />
          </div>
          <div className="event-input">
            <input
              type="text"
              placeholder="Enter Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <textarea
              placeholder="Enter Event Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            ></textarea>
          </div>
          <button className="event-popup-btn" onClick={handleAddEvent}>
            Add Event
          </button>
        </div>
        <div className="event-list">
          {events
            .filter((event) => event.date === selectedDate?.toISOString().split('T')[0])
            .map((event, index) => (
              <div className="event" key={index}>
                <h3 className="event-title">{event.title}</h3>
                <div className="event-time">{event.time}</div>
                <p className="event-description">{event.description}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;

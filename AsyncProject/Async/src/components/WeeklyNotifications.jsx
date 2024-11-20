import React from "react";

export default function WeeklyNotifications({ plans }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 h-[400px]">
      <h2 className="text-lg font-semibold mb-4">Weekly Notifications</h2>
      <ul className="space-y-2 overflow-y-auto h-[300px] pr-2">
        {Object.entries(plans).map(([date, plan]) => (
          <li key={date} className="text-gray-300">
            <span className="font-bold text-blue-400">{date}</span>: {plan.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

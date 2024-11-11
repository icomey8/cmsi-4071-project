import React from 'react';
import { Card } from "@/components/card";

function ProfileModal({ onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="w-96 p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">User Profile</h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300">Name: John Doe</p>
        <p className="text-gray-700 dark:text-gray-300">Email: johndoe@example.com</p>
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          Close
        </button>
      </Card>
    </div>
  );
}

export default ProfileModal;

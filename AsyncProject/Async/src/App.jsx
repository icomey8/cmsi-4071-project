import Login from './pages/Login';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Discussions from './pages/Discussions';

//NOTE:
/*
  THIS CODE IS FOR A CLASS DISCUSSION BOARD
  WHAT YOU ARE SEEING SHOULD BE A SUB PAGE OF THE MAIN PAGE,
  THAT STILL NEEDS TO BE IMPLEMETED.
  THEREFORE, THIS CODE NEEDS TO BE MOVED TO A SEPARATE FILE
*/

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Route for Login page */}
        <Route path="/login" element={<Login />} />

        {/* Route for Discussions page */}
        <Route path="/discussions" element={<Discussions />} />

        {/* Default Route redirects to Login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
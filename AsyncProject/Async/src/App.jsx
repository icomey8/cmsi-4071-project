import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Intro from './pages/Intro';
import Login from './pages/Login';
import MainPage from './pages/MainPage';
import './styles/fonts.css';
import './styles/normalize.css';
import './styles/webstyle.css';
import './styles/async.css';

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
        <Route path="/" element={<Intro />} />
        <Route path="/discussions" element={<Discussions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

//all installs
//npm install react-icons
//npm install react-router-dom
//npm install @tiptap/react
//npm install @tiptap/starter-kit
//npm install @tiptap/extension-underline
//npm install @tiptap/extension-link
//npm install date-fns
//npm install react-icons
//npm install react-router-dom
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '/assets/app-logo.svg';
import CalendarIcon from '/assets/calendar.svg';
import DiscussionIcon from '/assets/discussion.svg';
import LiveChatIcon from '/assets/live-chat.svg';
import '../styles/normalize.css';
import '../styles/webstyle.css';
import '../styles/async.css';

function Intro() {
  const navigate = useNavigate();

  return (
    <div className="body-bg w-body" style={{ backgroundColor: '#0f172a', paddingBottom: '2rem' }}>
      <nav className="nav w-nav" style={{ backgroundColor: '#1a1a1a', padding: '1rem 0', position: 'fixed', width: '100%', zIndex: 10 }}>
        <div className="nav-container w-container flex justify-between items-center p-4">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={Logo} alt="Logo" width="40" height="40" />
            <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginLeft: '0.5rem' }}>Async</span>
          </div>
          
          <div className="flex space-x-4 mr-4">
            <button onClick={() => navigate('/signin')} className="button-secondary w-button">Sign In</button>
            <button onClick={() => navigate('/login')} className="button w-button">Get Started</button>
          </div>
        </div>
      </nav>

      <section className="section intro-section w-section text-left flex items-center justify-between p-4" style={{ marginLeft: '2rem', marginBottom: '3rem', paddingTop: '100px' }}>
        <div className="intro-text">
          <h1 className="heading extra-large text-bold leading-tight">
            Your<br />Ultimate<br />Study<br />Companion
          </h1>
          <p className="paragraph large mt-4">
            Async empowers your learning journey with tools to keep you connected, organized, and ahead.
          </p>
          <div className="button-group flex space-x-4 mt-6">
            <button onClick={() => navigate('/login')} className="button w-button">Get Started</button>
            <button onClick={() => navigate('/signin')} className="button-secondary w-button">Sign In</button>
          </div>
        </div>
        
        <div className="intro-image-container">
          <img 
            src={Logo} 
            alt="App Logo" 
            className="app-logo-image fade-in-scale-animation" 
            style={{ height: '80%' }} 
          />
        </div>
      </section>

      <section className="section benefits-section w-section" style={{ backgroundColor: '#0f172a', padding: '3rem 0' }}>
        <div className="container-large grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-item intro-card w-card text-center p-6 flex flex-col justify-between items-center" style={{ backgroundColor: '#171918', borderRadius: '8px', height: '320px' }}>
            <div className="flex flex-col items-center" style={{ flexGrow: 1 }}>
              <img src={CalendarIcon} alt="Calendar" className="w-12 h-12 mb-4" />
              <h3 className="heading medium text-center mb-4">Stay Ahead of Smart Scheduling</h3>
              <p className="paragraph" style={{ marginTop: '1.5rem' }}>Plan, organize, and get notified about upcoming events.</p>
            </div>
          </div>
          <div className="card-item intro-card w-card text-center p-6 flex flex-col justify-between items-center" style={{ backgroundColor: '#171918', borderRadius: '8px', height: '320px' }}>
            <div className="flex flex-col items-center" style={{ flexGrow: 1 }}>
              <img src={DiscussionIcon} alt="Discussion" className="w-12 h-12 mb-4" />
              <h3 className="heading medium text-center mb-4">Engage in<br />Class Discussions</h3>
              <p className="paragraph" style={{ marginTop: '1.5rem' }}>Connect with classmates through interactive discussion boards.</p>
            </div>
          </div>
          <div className="card-item intro-card w-card text-center p-6 flex flex-col justify-between items-center" style={{ backgroundColor: '#171918', borderRadius: '8px', height: '320px' }}>
            <div className="flex flex-col items-center" style={{ flexGrow: 1 }}>
              <img src={LiveChatIcon} alt="Live Chat" className="w-12 h-12 mb-4" />
              <h3 className="heading medium text-center mb-4">Instant<br />Communication</h3>
              <p className="paragraph" style={{ marginTop: '1.5rem' }}>Real-time messaging with classmates and instructors.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="section footer-section w-section bg-gray-900 py-8 text-center text-gray-500">
        <p>© Async</p>
      </footer>
    </div>
  );
}

export default Intro;
import React, { useState, useEffect, useRef } from 'react';
import { FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase/firebase';
import { doc, getDoc, updateDoc, collection, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Logo from '/assets/app-logo.svg';
import userIcon from '/assets/user.svg';

function MainPage() {
  const [showClassInput, setShowClassInput] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    role: '',
    profilePictureUrl: '',
  });
  const [defaultColor, setDefaultColor] = useState('');
  const [classes, setClasses] = useState([]);
  const [editName, setEditName] = useState('');
  const [showClassesDropdown, setShowClassesDropdown] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user data and classes
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = auth.currentUser?.uid;
        const userDoc = await getDoc(doc(db, 'users', userId));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserData(userData);
          setEditName(userData.name);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const colors = ['#FFD700', '#8A2BE2', '#DC143C', '#20B2AA'];
    setDefaultColor(colors[Math.floor(Math.random() * colors.length)]);
  }, []);

  // Fetch classes from Firestore
  useEffect(() => {
    const classesRef = collection(db, 'classes');
    const unsubscribe = onSnapshot(classesRef, (snapshot) => {
      const fetchedClasses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClasses(fetchedClasses);
    });
    return unsubscribe;
  }, []);

  const handleAddClass = () => {
    if (!classCode.trim()) return;
    setClassCode('');
    setShowClassInput(false);
  };

  const toggleProfileModal = () => setShowProfileModal(!showProfileModal);

  const handleNameUpdate = async () => {
    try {
      const userId = auth.currentUser?.uid;
      await updateDoc(doc(db, 'users', userId), { name: editName });
      setUserData(prevData => ({ ...prevData, name: editName }));
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full p-4 bg-gray-800 flex justify-between items-center z-50">
        <button onClick={() => setShowSidebar(!showSidebar)} className="text-white text-2xl">
          <FaBars />
        </button>
        <button onClick={() => setShowClassInput(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-md">
          Class
        </button>
      </nav>

      {/* Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 h-full bg-gray-800 p-6 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-100 mb-6 cursor-pointer" onClick={() => {
              setShowSidebar(false);
              navigate("/main");
            }}>
              Dashboard
            </h2>

            {/* Discussion Board Button */}
            <button
              onClick={() => {
                setShowSidebar(false);
                navigate("/discussions");
              }}
              className="w-full text-left text-lg font-semibold text-gray-100 mb-4"
            >
              Discussion Board
            </button>

            {/* Classes Dropdown */}
            <button
              className="w-full text-left text-lg font-semibold text-gray-100 mb-2"
              onClick={() => setShowClassesDropdown(!showClassesDropdown)}
            >
              Classes
            </button>
            {showClassesDropdown && (
              <div className="pl-4 space-y-2">
                {classes.map((classItem) => (
                  <div
                    key={classItem.id}
                    className="text-gray-300 cursor-pointer"
                    onClick={() => {
                      setShowSidebar(false);
                      navigate(`/discussions/${classItem.id}`);
                    }}
                  >
                    {classItem.name}
                  </div>
                ))}
                <button
                  onClick={() => setShowClassInput(true)}
                  className="w-full text-left text-gray-200 underline mt-2"
                >
                  + Add New Class
                </button>
              </div>
            )}

            {/* Profile Button */}
            <div
              onClick={toggleProfileModal}
              className="absolute bottom-6 left-6 flex items-center space-x-3 cursor-pointer"
            >
              <img
                src={userData.profilePictureUrl || userIcon}
                alt="User"
                className="w-12 h-12 rounded-full"
                style={{ backgroundColor: userData.profilePictureUrl ? 'transparent' : defaultColor }}
              />
              <div>
                <p className="text-gray-200 font-medium">{userData.name}</p>
                <p className="text-gray-400 text-sm">{userData.role}</p>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-gray-900 bg-opacity-50" onClick={() => setShowSidebar(false)}></div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-white mb-6">Your Profile</h2>
            <div className="flex justify-center mb-4">
              <div
                className="w-28 h-28 rounded-full flex items-center justify-center"
                style={{ backgroundColor: userData.profilePictureUrl ? 'transparent' : defaultColor }}
              >
                <img
                  src={userData.profilePictureUrl || userIcon}
                  alt="User Profile"
                  className="w-28 h-28 rounded-full"
                />
              </div>
            </div>
            <div className="text-center text-white">
              <label className="block text-sm font-medium text-gray-300">Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleNameUpdate}
                className="w-full px-3 py-2 mt-2 text-center text-gray-200 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-sm font-medium text-gray-300 mt-4">Role</p>
              <p className="text-lg font-semibold text-indigo-400">{userData.role}</p>
            </div>
            <button
              onClick={toggleProfileModal}
              className="w-full px-4 py-2 mt-6 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col items-center w-screen min-h-screen bg-slate-950 dark:bg-gray-900 p-8 space-y-8 mt-20">
        {/* Add Class Modal */}
        {showClassInput && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg" ref={inputRef}>
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Add Class by Code</h3>
              <input
                type="text"
                maxLength="10"
                className="w-full px-3 py-2 mb-4 border border-gray-700 rounded-md bg-gray-900 text-gray-100 focus:ring-indigo-500"
                placeholder="Enter class code"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowClassInput(false)}
                  className="px-4 py-2 bg-gray-600 text-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddClass}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                >
                  Add Class
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Google Calendar Section */}
        <div className="w-full max-w-4xl p-6 bg-gray-800 rounded-lg shadow-lg mt-4">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Your Calendar</h3>
          <iframe
            src="https://calendar.google.com/calendar/embed?src=your_calendar_id&ctz=your_timezone"
            style={{ border: 0 }}
            width="100%"
            height="600"
            frameBorder="0"
            scrolling="no"
          ></iframe>
        </div>

        {/* Weekly Notifications */}
        <div className="w-full max-w-4xl p-6 bg-gray-800 rounded-lg shadow-lg mt-4">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Weekly Notifications</h3>
          <ul className="text-gray-300 space-y-2">
            <li>2024-10-30: Project Due</li>
            <li>2024-11-01: Meeting with Prof. Smith</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default MainPage;

import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import MainPageSidebar from "../components/MainPageSidebar";
import Calendar from "../components/Calendar";
import WeeklyNotifications from "../components/WeeklyNotifications";
import AddClassCard from "../components/AddClassCard";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import "../styles/mainpage.css";

export default function MainPage() {
  const [userData, setUserData] = useState({
    name: "",
    role: "",
    createdClasses: [],
    joinedClasses: [],
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [plans, setPlans] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(false); // Trigger for sidebar refresh

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      try {
        const plansRef = collection(db, `users/${userId}/calendarEvents`);
        const snapshot = await getDocs(plansRef);

        const plansData = {};
        snapshot.forEach((doc) => {
          const data = doc.data();
          plansData[data.date] = data;
        });

        setPlans(plansData);
      } catch (error) {
        console.error("Error fetching calendar events:", error);
      }
    };
    fetchPlans();
  }, []);

  const refreshSidebar = () => setRefreshTrigger(!refreshTrigger); // Refresh trigger function

  return (
    <div className="mainpage-container">
      <MainPageSidebar
        onDashboardClick={() => console.log("Dashboard clicked")}
        refreshTrigger={refreshTrigger}
      />

      <div className="main-content">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="responsive-layout">
          <div className="calendar">
            <Calendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              plans={plans}
            />
          </div>
          <div className="right-panel">
            <div className="weekly-notifications">
              <WeeklyNotifications plans={plans} />
            </div>
            <div className="add-class-container">
              <AddClassCard
                userRole={userData.role}
                onClassAdded={refreshSidebar} // Pass the refresh function
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

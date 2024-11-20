import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/Button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/Collapsible";
import { ScrollArea } from "@/components/ScrollArea";
import Logo from "/assets/app-logo.svg"; // Import app icon

export default function MainPageSidebar({ onDashboardClick, refreshTrigger }) {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    name: "",
    role: "",
    profilePictureUrl: "",
  });
  const [classes, setClasses] = useState([]);
  const [isClassesOpen, setIsClassesOpen] = useState(true);

  // Fetch user profile information
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch joined classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const classesRef = collection(db, "classes");
        const snapshot = await getDocs(classesRef);

        const userClasses = snapshot.docs
          .filter((doc) => doc.data().student?.includes(userId))
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setClasses(userClasses);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, [refreshTrigger]);

  return (
    <div className="fixed top-0 left-0 h-screen w-64 p-4 border-r bg-slate-900 border-slate-800 flex flex-col">
      {/* App Logo */}
      <div className="flex items-center gap-2 mb-4">
        <img src={Logo} alt="App Icon" className="w-6 h-6" />
        <h1 className="text-xl font-bold text-slate-100">Async</h1>
      </div>

      {/* Dashboard Button */}
      <Button
        variant="ghost"
        className="justify-start w-full font-medium text-left text-slate-300 hover:text-slate-100 hover:bg-slate-800 mb-4"
        onClick={onDashboardClick}
      >
        Dashboard
      </Button>

      {/* Discussion Board Button */}
      <Button
        variant="ghost"
        className="justify-start w-full font-medium text-left text-slate-300 hover:text-slate-100 hover:bg-slate-800 mb-4"
        onClick={() => navigate("/discussions")}
      >
        Discussion Board
      </Button>

      {/* Classes Dropdown */}
      <Collapsible
        open={isClassesOpen}
        onOpenChange={setIsClassesOpen}
        className="flex flex-col"
      >
        <div className="flex items-center justify-between px-1 space-x-4">
          <h2 className="text-lg font-semibold text-slate-100">Classes</h2>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 w-9 text-slate-400 hover:text-slate-100"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isClassesOpen ? "transform rotate-180" : ""
                }`}
              />
              <span className="sr-only">Toggle Classes</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="flex-1 min-h-0 mt-2">
          <ScrollArea className="h-full">
            {classes.length > 0 ? (
              classes.map((classItem) => (
                <div key={classItem.id} className="mb-2">
                  <Button
                    variant="ghost"
                    className="justify-start w-full font-normal text-left text-slate-300 hover:text-slate-100 hover:bg-slate-800"
                  >
                    {classItem.name} - {classItem.uniqueCode}
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-slate-400">No classes joined yet</p>
            )}
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>

      {/* Profile Button */}
      <button
        onClick={() => navigate("/profile")}
        className="mt-auto flex items-center gap-4 hover:bg-slate-800 p-2 rounded-lg"
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-700">
          {userProfile.profilePictureUrl ? (
            <img
              src={userProfile.profilePictureUrl}
              alt="Profile"
              className="w-full h-full rounded-full"
            />
          ) : (
            <span className="text-white text-lg font-semibold">
              {userProfile.name?.charAt(0) || "U"}
            </span>
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            {userProfile.name || "User Name"}
          </h2>
          <p className="text-sm text-slate-400">
            {userProfile.role || "Role"}
          </p>
        </div>
      </button>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { ChevronDown, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { Button } from "@/components/Button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/Collapsible";
import { ScrollArea } from "@/components/ScrollArea";
import Logo from "/assets/app-logo.svg"; // Import app icon
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/Select";

export default function Sidebar({
  discussions,
  onDiscussionClick,
  onAddDiscussion,
  onSelectClass,
}) {
  const navigate = useNavigate();
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  // Fetch user's joined classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        // Fetch user's joined classes from Firebase
        const userDoc = await getDoc(doc(db, `users/${userId}`));
        const joinedClassIds = userDoc.data()?.joinedClasses || [];

        // Fetch class names from the `classes` collection
        const classesQuery = collection(db, "classes");
        const snapshot = await getDocs(classesQuery);

        const classes = snapshot.docs
          .filter((doc) => joinedClassIds.includes(doc.id))
          .map((doc) => ({
            id: doc.id,
            name: doc.data().name, // Get class name
          }));

        setJoinedClasses(classes);

        // Automatically select the first class
        if (classes.length > 0 && !selectedClassroom) {
          setSelectedClassroom(classes[0].id);
          onSelectClass(classes[0].id); // Notify parent component
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, [onSelectClass, selectedClassroom]);

  const handleSelectClassroom = (classroomId) => {
    setSelectedClassroom(classroomId);
    onSelectClass(classroomId); // Notify parent component
  };

  return (
    <div className="flex flex-col w-64 h-screen p-4 border-r bg-slate-900 border-slate-800">
      {/* App Logo and Title */}
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <img src={Logo} alt="App Icon" className="w-6 h-6" />
        <h1 className="text-xl font-bold text-slate-100">Async</h1>
      </div>

      {/* Dashboard Button */}
      <Button
        variant="ghost"
        className="justify-start w-full font-medium text-left text-slate-300 hover:text-slate-100 hover:bg-slate-800 mb-4"
        onClick={() => navigate("/main")}
      >
        Dashboard
      </Button>

      {/* Class Selector */}
      <div className="mb-4 shrink-0">
        <Select
          value={selectedClassroom || ""}
          onValueChange={handleSelectClassroom}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a classroom" />
          </SelectTrigger>
          <SelectContent>
            {joinedClasses.map((classroom) => (
              <SelectItem key={classroom.id} value={classroom.id}>
                {classroom.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Discussion Board */}
      <div className="flex flex-col flex-1 min-h-0">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="flex flex-col flex-1"
        >
          <div className="flex items-center justify-between px-1 space-x-4 shrink-0">
            <h2 className="text-lg font-semibold text-slate-100">
              Discussion Board
            </h2>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-0 w-9 text-slate-400 hover:text-slate-100"
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isOpen ? "transform rotate-180" : ""
                  }`}
                />
                <span className="sr-only">Toggle discussion board</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="flex-1 min-h-0 mt-2">
            <ScrollArea className="h-full">
              {discussions.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="justify-start w-full font-normal text-left text-slate-300 hover:text-slate-100 hover:bg-slate-800"
                  onClick={() => onDiscussionClick(item)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {item.title}
                </Button>
              ))}
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Add New Discussion Button */}
      <Button
        onClick={onAddDiscussion}
        className="w-full mt-4 shrink-0"
        variant="default"
      >
        Add New Discussion
      </Button>
    </div>
  );
}



// export default function Sidebar({ discussions, onDiscussionClick, onAddDiscussion }) {
//   return (
//     <aside className="fixed w-64 h-screen p-4 text-white bg-gray-800">
//       <h2 className="mb-4 text-xl font-bold">Discussion Boards</h2>
//       <ul>
//         {discussions.map((discussion) => (
//           <li key={discussion.id}>
//             <button
//               className="block w-full px-4 py-2 text-left truncate hover:bg-gray-700 whitespace-nowrap"
//               onClick={() => onDiscussionClick(discussion)}
//             >
//               {discussion.title}
//             </button>
//           </li>
//         ))}
//       </ul>
//       <button
//         className="w-full px-4 py-2 mt-4 transition-colors bg-blue-600 rounded text-slate-100 hover:bg-blue-500"
//         onClick={onAddDiscussion}
//       >
//         Add New Discussion
//       </button>
//     </aside>
//   );
// }

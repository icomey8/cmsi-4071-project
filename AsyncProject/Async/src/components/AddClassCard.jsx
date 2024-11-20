import React, { useState } from "react";
import { auth, db } from "../firebase/firebase";
import { 
  doc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  getDoc 
} from "firebase/firestore";
import { FaArrowLeft } from "react-icons/fa";

export default function AddClassCard({ userRole }) {
  const [classAction, setClassAction] = useState("default");
  const [classCodeInput, setClassCodeInput] = useState("");
  const [newClassName, setNewClassName] = useState("");
  const [uniqueCode, setUniqueCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState(null);
  const [isCreatingClass, setIsCreatingClass] = useState(false);

  // Generate a unique code for a new class
  const generateUniqueCode = async () => {
    let code;
    let exists = true;

    while (exists) {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const q = query(collection(db, "classes"), where("uniqueCode", "==", code));
      const querySnapshot = await getDocs(q);
      exists = !querySnapshot.empty;
    }
    setUniqueCode(code);
    return code;
  };

  // Join an existing class
  const handleJoinClass = async () => {
    const userId = auth.currentUser?.uid;
    if (!classCodeInput || !userId) return;

    try {
      const q = query(collection(db, "classes"), where("uniqueCode", "==", classCodeInput));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const classDoc = querySnapshot.docs[0];
        const classId = classDoc.id;
        const classData = classDoc.data();

        // Fetch current user data
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.exists() ? userDoc.data() : {};

        // Update the user's joinedClasses
        const updatedJoinedClasses = Array.from(new Set([...(userData.joinedClasses || []), classId]));
        await updateDoc(userRef, { joinedClasses: updatedJoinedClasses });

        // Update the class's student list
        const updatedStudents = Array.from(new Set([...(classData.student || []), userId]));
        await updateDoc(doc(db, "classes", classId), { student: updatedStudents });

        setClassCodeInput("");
      }
    } catch (error) {
      console.error("Error joining class:", error);
    }
  };

  // Create a new class
  const handleCreateClass = async () => {
    const userId = auth.currentUser?.uid;
    if (!newClassName.trim() || !uniqueCode || !userId || isCreatingClass) return;

    setIsCreatingClass(true); // Prevent multiple creations

    try {
      // Add the new class to the `classes` collection
      const classRef = await addDoc(collection(db, "classes"), {
        name: newClassName,
        uniqueCode,
        professor: userId,
        student: [userId],
        discussions: [],
      });

      const classId = classRef.id;

      // Fetch current user data
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.exists() ? userDoc.data() : {};

      // Update the user's createdClasses and joinedClasses
      const updatedCreatedClasses = Array.from(new Set([...(userData.createdClasses || []), classId]));
      const updatedJoinedClasses = Array.from(new Set([...(userData.joinedClasses || []), classId]));
      await updateDoc(userRef, {
        createdClasses: updatedCreatedClasses,
        joinedClasses: updatedJoinedClasses,
      });

      setGeneratedCode(uniqueCode);
      setNewClassName("");
    } catch (error) {
      console.error("Error creating class:", error);
    } finally {
      setIsCreatingClass(false); // Reset creation lock
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 h-[400px] relative flex flex-col items-center justify-center">
      {/* Back Button */}
      {classAction !== "default" && (
        <button
          onClick={() => {
            setClassAction("default");
            setGeneratedCode(null);
          }}
          className="absolute top-2 left-2 px-2 py-1 bg-indigo-600 text-white rounded-md flex items-center gap-2"
        >
          <FaArrowLeft />
          Back
        </button>
      )}

      {/* Default Action */}
      {classAction === "default" && (
        <button
          onClick={() => setClassAction(userRole === "Student" ? "joinClass" : "chooseRole")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md w-full"
        >
          Add a Class
        </button>
      )}

      {/* Join Class */}
      {classAction === "joinClass" && (
        <div className="flex flex-col space-y-4 w-full max-w-sm">
          <input
            type="text"
            value={classCodeInput}
            onChange={(e) => setClassCodeInput(e.target.value)}
            placeholder="Enter class code"
            className="px-4 py-2 text-gray-200 bg-gray-700 border border-gray-600 rounded-md"
            style={{ width: "100%", maxWidth: "600px" }}
          />
          <button
            onClick={handleJoinClass}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md w-full"
          >
            Join Class
          </button>
        </div>
      )}

      {/* Choose Role */}
      {classAction === "chooseRole" && userRole === "Professor" && (
        <div className="flex flex-col space-y-4 w-full max-w-sm">
          <button
            onClick={() => setClassAction("joinClass")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md w-full"
          >
            Join Class
          </button>
          <button
            onClick={() => {
              generateUniqueCode();
              setClassAction("createClass");
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md w-full"
          >
            Create Class
          </button>
        </div>
      )}

      {/* Create Class */}
      {classAction === "createClass" && userRole === "Professor" && (
        <div className="flex flex-col space-y-4 w-full max-w-sm">
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="Enter class name"
            className="px-4 py-2 text-gray-200 bg-gray-700 border border-gray-600 rounded-md"
            style={{ width: "100%", maxWidth: "600px" }}
          />
          <button
            onClick={handleCreateClass}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md w-full"
          >
            Create Class
          </button>
          {generatedCode && (
            <p className="text-center text-green-400 mt-4">
              Class created successfully! Code: {generatedCode}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

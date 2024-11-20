import React, { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import Sidebar from "../components/Sidebar";
import DiscussionContent from "../components/DiscussionContent";
import NewDiscussionForm from "../components/NewDiscussionForm";

export default function Discussions() {
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [showNewDiscussionForm, setShowNewDiscussionForm] = useState(false);

  // Fetch user's joined classes
  useEffect(() => {
    const fetchJoinedClasses = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const userDoc = await getDoc(doc(db, `users/${userId}`));
        const joinedClassIds = userDoc.data()?.joinedClasses || [];

        const classesQuery = collection(db, "classes");
        const snapshot = await getDocs(classesQuery);

        const classes = snapshot.docs
          .filter((doc) => joinedClassIds.includes(doc.id))
          .map((doc) => ({
            id: doc.id,
            name: doc.data().name,
          }));

        setJoinedClasses(classes);
        setSelectedClass(classes[0]?.id || null);
      } catch (error) {
        console.error("Error fetching joined classes:", error);
      }
    };

    fetchJoinedClasses();
  }, []);

  // Fetch discussions for the selected class with real-time updates
  useEffect(() => {
    if (!selectedClass) return;

    const discussionsCollection = collection(
      db,
      `classes/${selectedClass}/discussions`
    );

    const unsubscribe = onSnapshot(discussionsCollection, (snapshot) => {
      const fetchedDiscussions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDiscussions(fetchedDiscussions);
    });

    return () => unsubscribe();
  }, [selectedClass]);

  const addDefaultDiscussions = async (classId) => {
    const defaultDiscussions = [
      {
        id: "discussionId_1",
        title: "Welcome to Async Discussions",
        content: "This is your first discussion! Feel free to edit or add more.",
        author: "Admin",
        createdAt: new Date().toISOString(),
        isEdited: false,
      },
      {
        id: "discussionId_2",
        title: "Getting Started",
        content: "Here are some tips to get started with Async.",
        author: "Admin",
        createdAt: new Date().toISOString(),
        isEdited: false,
      },
    ];

    const batchPromises = defaultDiscussions.map((discussion) =>
      setDoc(
        doc(db, `classes/${classId}/discussions`, discussion.id),
        discussion
      )
    );

    try {
      await Promise.all(batchPromises);
    } catch (error) {
      console.error("Error adding default discussions:", error);
    }
  };

  const handleAddDiscussion = () => {
    setShowNewDiscussionForm(true);
  };

  const handleSelectClass = (classId) => {
    setSelectedClass(classId);
    setSelectedDiscussion(null); // Reset discussion on class change
  };

  const handleDiscussionClick = (discussion) => {
    setSelectedDiscussion(discussion);
  };

  const handleNewDiscussionSubmit = async (title, content) => {
    const newDiscussion = {
      title,
      content,
      author: auth.currentUser?.displayName || "Unknown User",
      createdAt: new Date().toISOString(),
      isEdited: false,
    };

    try {
      const newDocRef = doc(collection(db, `classes/${selectedClass}/discussions`));
      await setDoc(newDocRef, newDiscussion);

      setDiscussions((prev) => [
        ...prev,
        { id: newDocRef.id, ...newDiscussion },
      ]);
      setShowNewDiscussionForm(false);
    } catch (error) {
      console.error("Error adding new discussion:", error);
    }
  };

  const handleAddComment = async (commentContent) => {
    if (!selectedDiscussion) return;

    const userId = auth.currentUser?.uid;
    const userDoc = await getDoc(doc(db, `users/${userId}`));
    const userData = userDoc.data();

    const comment = {
      content: commentContent,
      id: `comment_${Date.now()}`,
      senderId: userId,
      senderName: userData?.name || "Anonymous",
      profilePictureUrl: userData?.profilePictureUrl || null,
      timestamp: new Date().toISOString(),
    };

    try {
      const commentRef = doc(
        collection(
          db,
          `classes/${selectedClass}/discussions/${selectedDiscussion.id}/comments`
        ),
        comment.id
      );
      await setDoc(commentRef, comment);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar
        joinedClasses={joinedClasses}
        onSelectClass={handleSelectClass}
        discussions={discussions}
        onDiscussionClick={handleDiscussionClick}
        onAddDiscussion={handleAddDiscussion}
      />

      <div className="flex-1 flex flex-col p-4 bg-gray-800">
        {selectedDiscussion ? (
          <DiscussionContent
            discussion={selectedDiscussion}
            selectedClass={selectedClass}
            onAddComment={handleAddComment}
          />
        ) : (
          <p className="text-gray-400">Select a discussion to view its content.</p>
        )}

        {showNewDiscussionForm && (
          <NewDiscussionForm
            onSubmit={handleNewDiscussionSubmit}
            onClose={() => setShowNewDiscussionForm(false)}
          />
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import DiscussionContent from "../components/DiscussionContent";
import NewDiscussionForm from "../components/NewDiscussionForm";

const initialDiscussions = [
  {
    id: 1,
    title: "Welcome to Async Discussions",
    content: "This is your first discussion! Feel free to edit or add more.",
    author: "Admin",
    createdAt: "2024-11-19T10:00:00Z",
    comments: [],
  },
  {
    id: 2,
    title: "Getting Started",
    content: "Here are some tips to get started with Async.",
    author: "Admin",
    createdAt: "2024-11-19T11:00:00Z",
    comments: [],
  },
];

export default function Discussions() {
  const [discussions, setDiscussions] = useState(initialDiscussions);
  const [selectedDiscussion, setSelectedDiscussion] = useState(initialDiscussions[0] || null);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState("");
  const [newDiscussionContent, setNewDiscussionContent] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleDiscussionClick = (discussion) => {
    setSelectedDiscussion(discussion);
  };

  const handleAddDiscussion = () => {
    setShowForm(true);
  };

  const handleAddComment = (text) => {
    const updatedDiscussions = discussions.map((d) =>
      d.id === selectedDiscussion.id
        ? { ...d, comments: [...d.comments, text] }
        : d
    );

    const updatedSelectedDiscussion = updatedDiscussions.find(
      (d) => d.id === selectedDiscussion.id
    );

    setDiscussions(updatedDiscussions);
    setSelectedDiscussion(updatedSelectedDiscussion);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newDiscussion = {
      id: discussions.length + 1,
      title: newDiscussionTitle,
      content: newDiscussionContent || "<p>Start writing...</p>",
      author: "New User",
      createdAt: new Date().toISOString(),
      comments: [],
    };

    setDiscussions([...discussions, newDiscussion]);
    setSelectedDiscussion(newDiscussion);
    setNewDiscussionTitle("");
    setNewDiscussionContent("");
    setShowForm(false);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        discussions={discussions}
        onDiscussionClick={handleDiscussionClick}
        onAddDiscussion={handleAddDiscussion}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 bg-gray-800">
        {/* Display selected discussion */}
        <div className="flex-1">
          <DiscussionContent
            discussion={selectedDiscussion}
            onAddComment={handleAddComment}
          />
        </div>

        {/* New Discussion Form */}
        {showForm && (
          <NewDiscussionForm
            onSubmit={handleSubmit}
            onClose={() => setShowForm(false)}
            newDiscussionTitle={newDiscussionTitle}
            setNewDiscussionTitle={setNewDiscussionTitle}
            newDiscussionContent={newDiscussionContent}
            setNewDiscussionContent={setNewDiscussionContent}
          />
        )}
      </div>
    </div>
  );
}
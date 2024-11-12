import { useState } from "react";
import TiptapEditor from './TipTapEditor.jsx';

const initialDiscussions = [
  {
    id: 1,
    title: "Discussion 1",
    content: "Content for Discussion 1...",
    author: "User",
    createdAt: "2024-10-14T12:00:00Z",
    comments: []
  },
  {
    id: 2,
    title: "Discussion 2",
    content: "Content for Discussion 2...",
    author: "User",
    createdAt: "2024-10-14T12:00:00Z",
    comments: []
  },
  {
    id: 3,
    title: "Discussion ...",
    content: "Content for Discussion ...",
    author: "User",
    createdAt: "2024-10-14T12:00:00Z",
    comments: []
  },
];

export default function Discussions() {
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [newDiscussionContent, setNewDiscussionContent] = useState("<p>Start writing...</p>");
  const [discussions, setDiscussions] = useState(initialDiscussions);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newComment, setNewComment] = useState("");
  const currentUser = "Commenter";

  const handleDiscussionClick = (discussion) => {
    setSelectedDiscussion(discussion);
  };

  const handleAddDiscussion = () => {
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDiscussion = {
      id: discussions.length + 1,
      title: newDiscussionTitle,
      content: newDiscussionContent,
      author: "New User",
      createdAt: new Date().toISOString(),
      comments: []
    };
    setDiscussions([...discussions, newDiscussion]);
    setNewDiscussionTitle("");
    setNewDiscussionContent("<p>Start writing...</p>");
    setShowForm(false);
  };

  return (
    <>
      <div className="flex p-0 m-0">
        <aside className="fixed w-64 h-screen p-4 text-white bg-gray-800">
          <h2 className="mb-4 text-xl font-bold">Discussion Boards</h2>
          <ul>
            {discussions.map((discussion) => (
              <li key={discussion.id}>
                <button
                  className="block w-full px-4 py-2 text-left hover:bg-gray-700 truncate whitespace-nowrap"
                  onClick={() => handleDiscussionClick(discussion)}
                >
                  {discussion.title}
                </button>
              </li>
            ))}
          </ul>
          <button
            className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-500"
            onClick={handleAddDiscussion}
          >
            Add New Discussion
          </button>
        </aside>

        <div className="flex-1 ml-64">
          <div className="p-4 m-4 border border-gray-300 rounded">
            {selectedDiscussion ? (
              <div>
                <h2 className="text-2xl font-bold">{selectedDiscussion.title}</h2>
                <div dangerouslySetInnerHTML={{ __html: selectedDiscussion.content }} />
              </div>
            ) : (
              <p>Select a discussion to see the content.</p>
            )}
          </div>

          {showForm && (
            <div className="p-4 m-4 border border-gray-300 rounded">
              <h2 className="mb-4 text-xl font-bold">Add New Discussion</h2>
              <button
                onClick={() => setShowForm(false)}
                className="mb-2 px-2 py-1 text-white bg-red-600 rounded hover:bg-red-500"
              >
                Exit
              </button>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Discussion Title"
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                  value={newDiscussionTitle}
                  onChange={(e) => setNewDiscussionTitle(e.target.value)}
                  required
                />
                <TiptapEditor content={newDiscussionContent} setContent={setNewDiscussionContent} />
                <button
                  type="submit"
                  className="px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-500"
                >
                  Submit
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

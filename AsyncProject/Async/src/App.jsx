import React, { useState } from 'react';


//NOTE:
/*
  THIS CODE IS FOR A CLASS DISCUSSION BOARD
  WHAT YOU ARE SEEING SHOULD BE A SUB PAGE OF THE MAIN PAGE,
  THAT STILL NEEDS TO BE IMPLEMETED.
  THEREFORE, THIS CODE NEEDS TO BE MOVED TO A SEPARATE FILE
*/
export default function App() {
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [newDiscussion, setNewDiscussion] = useState("");
  const [newDiscussionContent, setNewDiscussionContent] = useState("");
  const discussions = [
    {
      id: 1,
      title: "Discussion 1",
      content: "Content for Discussion 1...",
      author: "User",
      createdAt: "2024-10-14T12:00:00Z",
    },
    {
      id: 2,
      title: "Discussion 2",
      content: "Content for Discussion 2...",
      author: "User",
      createdAt: "2024-10-14T12:00:00Z",
    },
    {
      id: 3,
      title: "Discussion ...",
      content: "Content for Discussion ...",
      author: "User",
      createdAt: "2024-10-14T12:00:00Z",
    },
  ];

  const handleDiscussionClick = (discussion) => {
    setSelectedDiscussion(discussion);
  };

  return (
    //flex margin 0 padding 0
    <div className="flex m-0 p-0">
      {/* width 64px, height screen, background gray-800, text-white, padding 4px */}
      <aside className="w-64 h-screen bg-gray-800 text-white p-4 fixed">
        {/*text extra large, font bold, margin bottom 4px*/}
        <h2 className="text-xl font-bold mb-4">Discussion Boards</h2>
        <ul>
          {discussions.map((discussion) => (
            <li key={discussion.id}>
              {/*block padding 2px 4px, when hovering make color gray-700*/}
              <button 
                className="block py-2 px-4 hover:bg-gray-700 text-left w-full"
                onClick={() => handleDiscussionClick(discussion)} 
              >
                {discussion.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/*margin left 64px flex-1*/}
      <div className="ml-64 flex-1">
        {/*margin 4px, padding 4px, text 4 extra large, font bold*/}
        <h1 className="m-4 text-4xl font-bold">Welcome to *CLASSNAME*</h1>
        {/*background gray-800, text-white, padding 2px*/}
        <nav className="bg-gray-800 text-white py-2"> 
          {/*margin left 4px*/}
          <ul className="flex space-x-4 ml-4">
            <li><a href="#" class= "hover:underline">Your Classes</a> </li>
          </ul>
        </nav>
        {/*margin 4px, padding 4px, border, border-gray-300, rounded*/}
        <div className="m-4 p-4 border border-gray-300 rounded">
          {selectedDiscussion ? (
            <div>
              {/*text 2 extra large, font bold*/}
              <h2 className="text-2xl font-bold">{selectedDiscussion.title}</h2>
              <p>{selectedDiscussion.content}</p>
              {/*text small, text-gray-500*/}
              <p className="text-sm text-gray-500">By {selectedDiscussion.author} on {new Date(selectedDiscussion.createdAt).toLocaleDateString()}</p>
            </div>
          ) : (
            <p>Select a discussion to see the content.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ discussions, onDiscussionClick, onAddDiscussion }) {
  return (
    <aside className="fixed w-64 h-screen p-4 text-white bg-gray-800">
      <h2 className="mb-4 text-xl font-bold">Discussion Boards</h2>
      <ul>
        {discussions.map((discussion) => (
          <li key={discussion.id}>
            <button
              className="block w-full px-4 py-2 text-left truncate hover:bg-gray-700 whitespace-nowrap"
              onClick={() => onDiscussionClick(discussion)}
            >
              {discussion.title}
            </button>
          </li>
        ))}
      </ul>
      <button
        className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-500"
        onClick={onAddDiscussion}
      >
        Add New Discussion
      </button>
    </aside>
  );
} 
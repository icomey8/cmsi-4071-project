import TiptapEditor from "../pages/TipTapEditor";

export default function NewDiscussionForm({ 
  onSubmit, 
  onClose, 
  newDiscussionTitle, 
  setNewDiscussionTitle,
  newDiscussionContent,
  setNewDiscussionContent 
}) {
  return (
    <div className="p-4 m-4 border border-gray-300 rounded">
      <div className="flex justify-between w-full">
        <h2 className="mb-4 text-xl font-bold">Add New Post</h2>
        <button
          onClick={onClose}
          className="px-2 py-1 mb-2 text-white bg-red-600 rounded hover:bg-red-500"
        >
          Exit
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Discussion Title"
          className="w-full px-3 py-2 border rounded-md bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={newDiscussionTitle}
          onChange={(e) => setNewDiscussionTitle(e.target.value)}
          required
        />
        <TiptapEditor
          content={newDiscussionContent}
          setContent={setNewDiscussionContent}
        />
        <button
          type="submit"
          className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
} 
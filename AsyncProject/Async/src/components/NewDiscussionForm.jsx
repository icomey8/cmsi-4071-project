import React, { useState } from "react";
import TipTapEditor from "../pages/TipTapEditor";

export default function NewDiscussionForm({ onSubmit, onClose }) {
  const [newDiscussionTitle, setNewDiscussionTitle] = useState("");
  const [newDiscussionContent, setNewDiscussionContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newDiscussionTitle.trim() && newDiscussionContent.trim()) {
      onSubmit(newDiscussionTitle, newDiscussionContent);
      setNewDiscussionTitle("");
      setNewDiscussionContent("");
    }
  };

  return (
    <div className="p-4 m-4 border border-gray-300 rounded bg-slate-900 text-white">
      <div className="flex justify-between items-center w-full mb-4">
        <h2 className="text-xl font-bold">Add New Discussion</h2>
        <button
          onClick={onClose}
          className="px-2 py-1 text-white bg-red-600 rounded hover:bg-red-500"
        >
          Close
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter discussion title"
          className="w-full px-3 py-2 mb-4 border rounded-md bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={newDiscussionTitle}
          onChange={(e) => setNewDiscussionTitle(e.target.value)}
          required
        />

        <div className="mb-4">
          <TipTapEditor
            content={newDiscussionContent}
            setContent={setNewDiscussionContent}
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

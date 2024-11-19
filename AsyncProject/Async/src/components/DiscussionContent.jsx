import React, { useState } from "react";
import DOMPurify from "dompurify";
import TipTapEditor from "../pages/TipTapEditor";

export default function DiscussionContent({ discussion, onAddComment }) {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentContent, setCommentContent] = useState("");

  if (!discussion) {
    return <p className="text-gray-500 italic">Select a discussion to see the content.</p>;
  }

  const handleAddComment = (e) => {
    e.preventDefault();
    if (commentContent.trim()) {
      onAddComment(commentContent);
      setCommentContent("");
      setShowCommentBox(false);
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">{discussion.title}</h2>
      <div
        className="prose prose-invert"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(discussion.content),
        }}
      />

      {/* Comments Section */}
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-2">Comments</h3>

        {/* Display Comments */}
        <ul className="space-y-4">
          {discussion.comments.length > 0 ? (
            discussion.comments.map((comment, index) => (
              <li
                key={index}
                className="p-3 bg-slate-800 rounded shadow text-gray-100"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment) }}
              />
            ))
          ) : (
            <p className="text-gray-400 italic">No comments yet.</p>
          )}
        </ul>

        {/* Show Add Comment Button */}
        {!showCommentBox && (
          <button
            onClick={() => setShowCommentBox(true)}
            className="mt-4 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-500"
          >
            Comment
          </button>
        )}

        {/* Add Comment Form */}
        {showCommentBox && (
          <form onSubmit={handleAddComment} className="mt-4">
            <div className="mb-4">
              <TipTapEditor content={commentContent} setContent={setCommentContent} />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-500"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setShowCommentBox(false)}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-500"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
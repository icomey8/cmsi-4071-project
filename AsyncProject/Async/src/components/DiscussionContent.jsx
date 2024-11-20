import React, { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";
import DOMPurify from "dompurify";
import TipTapEditor from "../pages/TipTapEditor";

export default function DiscussionContent({ discussion, selectedClass, onAddComment }) {
  const [comments, setComments] = useState([]);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const commentsContainerRef = useRef(null);

  useEffect(() => {
    if (!discussion || !selectedClass) return;

    const commentsRef = collection(
      db,
      `classes/${selectedClass}/discussions/${discussion.id}/comments`
    );

    // Query comments ordered by timestamp
    const commentsQuery = query(commentsRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const fetchedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(fetchedComments);

      // Scroll to the bottom of the comments container
      if (commentsContainerRef.current && fetchedComments.length > 0) {
        const container = commentsContainerRef.current;
        container.scrollTop = container.scrollHeight;
      }
    });

    return () => unsubscribe();
  }, [discussion, selectedClass]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (commentContent.trim()) {
      onAddComment(commentContent);
      setCommentContent("");
      setShowCommentBox(false);
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-md shadow-md h-full flex flex-col">
      {/* Discussion Title and Content */}
      <div>
        <h2 className="text-2xl font-bold mb-4">{discussion?.title}</h2>
        <div
          className="prose prose-invert"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(discussion?.content || ""),
          }}
        />
      </div>

      {/* Comments Section */}
      <div className="flex flex-col flex-1 mt-6 overflow-hidden">
        <h3 className="text-xl font-bold mb-2">Comments</h3>

        {/* Only show comments section if there are comments */}
        {comments.length > 0 && (
          <div
            ref={commentsContainerRef}
            className="flex-1 overflow-y-auto bg-slate-800 p-4 rounded-md max-h-96 flex flex-col-reverse"
          >
            <ul className="space-y-4">
              {comments.map((comment) => (
                <li key={comment.id} className="flex items-start space-x-4">
                  {/* Profile Picture */}
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-700">
                    {comment.profilePictureUrl ? (
                      <img
                        src={comment.profilePictureUrl}
                        alt={comment.senderName || "User"}
                        className="w-full h-full rounded-full"
                      />
                    ) : (
                      <span className="text-white text-lg font-semibold">
                        {comment.senderName?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1">
                    <p className="font-bold text-slate-100">{comment.senderName || "Anonymous"}</p>
                    <p
                      className="text-gray-300"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(comment.content || ""),
                      }}
                    />
                    <p className="text-xs text-gray-500">
                      {new Date(comment.timestamp).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Add Comment Button */}
        {!showCommentBox && (
          <button
            onClick={() => setShowCommentBox(true)}
            className="mt-4 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-500"
          >
            Add Comment
          </button>
        )}

        {/* Add Comment Form */}
        {showCommentBox && (
          <form onSubmit={handleAddComment} className="mt-4">
            <div className="mb-4">
              <TipTapEditor
                content={commentContent}
                setContent={setCommentContent}
                editorHeight="200px" // Increase height of the editor
              />
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

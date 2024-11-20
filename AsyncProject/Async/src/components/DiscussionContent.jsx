import React, { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import DOMPurify from "dompurify";
import TipTapEditor from "../pages/TipTapEditor";

export default function DiscussionContent({ discussion, selectedClass, onAddComment }) {
  const [comments, setComments] = useState([]);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const commentsContainerRef = useRef(null);

  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    if (!discussion || !selectedClass) return;

    const commentsRef = collection(
      db,
      `classes/${selectedClass}/discussions/${discussion.id}/comments`
    );

    const commentsQuery = query(commentsRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const fetchedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(fetchedComments);

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

  const handleEditComment = async (e) => {
    e.preventDefault();
    if (!editingCommentId || !editingCommentContent.trim()) return;

    try {
      const commentRef = doc(
        db,
        `classes/${selectedClass}/discussions/${discussion.id}/comments/${editingCommentId}`
      );
      await updateDoc(commentRef, { content: editingCommentContent });
      setEditingCommentId(null);
      setEditingCommentContent("");
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const commentRef = doc(
        db,
        `classes/${selectedClass}/discussions/${discussion.id}/comments/${commentId}`
      );
      await deleteDoc(commentRef);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const isUserOwner = discussion?.professor === currentUserId;

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

        {comments.length > 0 && (
          <div
            ref={commentsContainerRef}
            className="flex-1 overflow-y-auto bg-slate-800 p-4 rounded-md max-h-96"
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
                    {editingCommentId === comment.id ? (
                      <form onSubmit={handleEditComment} className="mt-2">
                        <TipTapEditor
                          content={editingCommentContent}
                          setContent={setEditingCommentContent}
                          editorHeight="100px"
                        />
                        <div className="mt-2 flex space-x-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCommentId(null)}
                            className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <p
                        className="text-gray-300"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(comment.content || ""),
                        }}
                      />
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(comment.timestamp).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  {(comment.senderId === currentUserId || isUserOwner) && (
                    <div className="flex space-x-2">
                      {comment.senderId === currentUserId && (
                        <button
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditingCommentContent(comment.content);
                          }}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!showCommentBox && (
          <button
            onClick={() => setShowCommentBox(true)}
            className="mt-4 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-500"
          >
            Add Comment
          </button>
        )}

        {showCommentBox && (
          <form onSubmit={handleAddComment} className="mt-4">
            <div className="mb-4">
              <TipTapEditor
                content={commentContent}
                setContent={setCommentContent}
                editorHeight="200px"
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

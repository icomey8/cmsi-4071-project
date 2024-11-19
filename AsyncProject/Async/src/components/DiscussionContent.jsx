import React from "react";
import DOMPurify from "dompurify";

export default function DiscussionContent({ discussion }) {

  if (!discussion || !discussion.title || !discussion.content) {
    return <p className="text-gray-500 italic">Select a discussion to see the content.</p>;
  }

  return (
    <div className="p-4 bg-gray-900 text-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">{discussion.title}</h2>
      <div
        className="prose prose-invert"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(discussion.content),
        }}
      />
    </div>
  );
}
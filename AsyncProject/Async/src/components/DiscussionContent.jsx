export default function DiscussionContent({ discussion }) {
  if (!discussion) {
    return <p>Select a discussion to see the content.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">{discussion.title}</h2>
      <div
        dangerouslySetInnerHTML={{
          __html: discussion.content,
        }}
      />
    </div>
  );
} 
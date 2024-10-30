import { useState } from "react";

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
	const [newDiscussion, setNewDiscussion] = useState("");
	const [newDiscussionContent, setNewDiscussionContent] = useState("");
	const [discussions, setDiscussions] = useState(initialDiscussions);
	const [newDiscussionTitle, setNewDiscussionTitle] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [newComment, setNewComment] = useState("");
	const currentUser = "Commenter"; // Just representing current user for now, change to user later
	
	const handleDiscussionClick = (discussion) => {
		setSelectedDiscussion(discussion);
	}

	const handleAddDiscussion = () => {
		setShowForm(true);
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		const newDiscussion = {
			id: discussions.length +1,
			title: newDiscussionTitle,
			content: newDiscussionContent,
			author: "New User",
			createdAt: new Date().toISOString(),
			comments: []
		}
		setDiscussions([...discussions, newDiscussion]);
		setNewDiscussionTitle("");
		setNewDiscussionContent("");
		setShowForm(false);
	}

	const handleAddComment = () => {
		if (newComment.trim() && selectedDiscussion){
			const updatedDiscussions = discussions.map((discussion) => {
				if (discussion.id === selectedDiscussion.id) {
					return {
						...discussion,
						comments: [
							...discussion.comments,
							{ author: "Commenter", content: newComment, createdAt: new Date().toISOString() }
						]
					};
				}
				return discussion;
			});
			setDiscussions(updatedDiscussions);
			setSelectedDiscussion({
				...selectedDiscussion,
				comments: [
					...selectedDiscussion.comments,
					{ author: "Commenter", content: newComment, createdAt: new Date().toISOString() }
				]
			});
			setNewComment("");
		}
	}
	const handleDeleteComment = (commentIndex) => {
		if (selectedDiscussion) {
			const updatedDiscussions = discussions.map((discussion) => {
				if (discussion.id === selectedDiscussion.id) {
					const updatedComments = discussion.comments.filter((_, index) => index !== commentIndex);
					return {
						...discussion,
						comments: updatedComments
					};
				}
				return discussion;
			});
			setDiscussions(updatedDiscussions);
			setSelectedDiscussion({
				...selectedDiscussion,
				comments: selectedDiscussion.comments.filter((_, index) => index !== commentIndex)
			});
		}
	}

	return (
		<>
			<div className="flex p-0 m-0">
				{/* width 64px, height screen, background gray-800, text-white, padding 4px */}
				<aside className="fixed w-64 h-screen p-4 text-white bg-gray-800">
					{/*text extra large, font bold, margin bottom 4px*/}
					<h2 className="mb-4 text-xl font-bold">Discussion Boards</h2>
					<ul>
						{discussions.map((discussion) => (
							<li key={discussion.id}>
								{/*block padding 2px 4px, when hovering make color gray-700*/}
								<button
									className="block w-full px-4 py-2 text-left hover:bg-gray-700 truncate whitespace-nowrap"
									onClick={() => handleDiscussionClick(discussion)}
								>
									{discussion.title}
								</button>
							</li>
						))}
					</ul>
					{/* Button to open the new discussion form */}
					<button
						className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-500"
						onClick={handleAddDiscussion}
					>
						Add New Discussion
					</button>
				</aside>

				{/*margin left 64px flex-1*/}
				<div className="flex-1 ml-64">
					{/*margin 4px, padding 4px, text 4 extra large, font bold*/}
					<h1 className="m-4 text-4xl font-bold">Welcome to *CLASSNAME*</h1>
					{/*background gray-800, text-white, padding 2px*/}
					<nav className="py-2 text-white bg-gray-800">
						{/*margin left 4px*/}
						<ul className="flex ml-4 space-x-4">
							<li>
								<a href="#" className="hover:underline">
									Your Classes
								</a>{" "}
							</li>
						</ul>
					</nav>

					{/*margin 4px, padding 4px, border, border-gray-300, rounded*/}
					<div className="p-4 m-4 border border-gray-300 rounded">
						{selectedDiscussion ? (
							<div>
								{/*text 2 extra large, font bold*/}
								<h2 className="text-2xl font-bold">
									{selectedDiscussion.title}
								</h2>
								<p>{selectedDiscussion.content}</p>
								{/*text small, text-gray-500*/}
								<p className="text-sm text-gray-500">
									By {selectedDiscussion.author} on{" "}
									{new Date(selectedDiscussion.createdAt).toLocaleDateString()}
								</p>
								{/* Comments Section */}
								<div className="mt-4">
									<h3 className="text-xl font-semibold">Comments</h3>
									<ul className="mt-2">
										{selectedDiscussion.comments.map((comment, index) => (
											<li key={index} className="border-b border-gray-300 py-2">
												<div>
													<p className="text-sm text-gray-700">
														<strong>{comment.author}</strong>: {comment.content}
													</p>
													<p className="text-xs text-gray-500">
														{new Date(comment.createdAt).toLocaleDateString()}
													</p>
												</div>
												{comment.author === currentUser && (
													<button
														onClick={() => handleDeleteComment(index)}
														className="px-2 py-1 text-white bg-red-600 rounded hover:bg-red-500"
													>
														Delete
													</button>
												)}
											</li>
										))}
									</ul>

									{/* Add Comment Form */}
									<div className="mt-4">
										<textarea
											placeholder="Add a comment..."
											className="w-full p-2 mb-2 border border-gray-300 rounded"
											value={newComment}
											onChange={(e) => setNewComment(e.target.value)}
										></textarea>
										<button
											onClick={handleAddComment}
											className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-500"
										>
											Add Comment
										</button>
									</div>
								</div>
							</div>
						) : (
							<p>Select a discussion to see the content.</p>
						)}
					</div>

					{/* Form to add new discussion */}
					{showForm && (
						<div className="p-4 m-4 border border-gray-300 rounded">
							<h2 className="mb-4 text-xl font-bold">Add New Discussion</h2>
							<button
								onClick={() => setShowForm(false)} // Close button to hide form
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
								<textarea
									placeholder="Discussion Content"
									className="w-full p-2 mb-2 border border-gray-300 rounded"
									value={newDiscussionContent}
									onChange={(e) => setNewDiscussionContent(e.target.value)}
									required
								></textarea>
								<button
									type="submit"
									className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-500"
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

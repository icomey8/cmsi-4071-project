import { useState } from "react";

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

export default function Discussions() {
	const [selectedDiscussion, setSelectedDiscussion] = useState(null);
	const [newDiscussion, setNewDiscussion] = useState("");
	const [newDiscussionContent, setNewDiscussionContent] = useState("");

	const handleDiscussionClick = (discussion) => {
		setSelectedDiscussion(discussion);
	};

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
									className="block w-full px-4 py-2 text-left hover:bg-gray-700"
									onClick={() => handleDiscussionClick(discussion)}
								>
									{discussion.title}
								</button>
							</li>
						))}
					</ul>
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
							</div>
						) : (
							<p>Select a discussion to see the content.</p>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

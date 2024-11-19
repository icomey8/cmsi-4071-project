import { useState } from "react";
import Sidebar from "../components/Sidebar";
import DiscussionContent from "../components/DiscussionContent";
import NewDiscussionForm from "../components/NewDiscussionForm";

const initialDiscussions = [
	{
		id: 1,
		title: "Discussion 1",
		content: "Content for Discussion 1...",
		author: "User",
		createdAt: "2024-10-14T12:00:00Z",
		comments: [],
	},
	{
		id: 2,
		title: "Discussion 2",
		content: "Content for Discussion 2...",
		author: "User",
		createdAt: "2024-10-14T12:00:00Z",
		comments: [],
	},
	{
		id: 3,
		title: "Discussion ...",
		content: "Content for Discussion ...",
		author: "User",
		createdAt: "2024-10-14T12:00:00Z",
		comments: [],
	},
];

export default function Discussions() {
	const [selectedDiscussion, setSelectedDiscussion] = useState(null);
	const [newDiscussionContent, setNewDiscussionContent] = useState(
		"<p>Start writing...</p>"
	);
	const [discussions, setDiscussions] = useState(initialDiscussions);
	const [newDiscussionTitle, setNewDiscussionTitle] = useState("");
	const [showForm, setShowForm] = useState(false);

	const handleDiscussionClick = (discussion) => {
		setSelectedDiscussion(discussion);
	};

	const handleAddDiscussion = () => {
		setShowForm(true);
	};

	const handleSubmit = (e) => {
		e.preventDefault();	  
		const newDiscussion = {
		  id: discussions.length + 1,
		  title: newDiscussionTitle,
		  content: newDiscussionContent || "<p>No content provided</p>",
		  author: "New User",
		  createdAt: new Date().toISOString(),
		  comments: [],
		};
	  
		setDiscussions([...discussions, newDiscussion]);
		setSelectedDiscussion(newDiscussion);
		setNewDiscussionTitle("");
		setNewDiscussionContent("");
		setShowForm(false);
	  };

	return (
		<div className="flex p-0 m-0">
			<Sidebar
				discussions={discussions}
				onDiscussionClick={handleDiscussionClick}
				onAddDiscussion={handleAddDiscussion}
			/>
			<div className="flex-1 mx-16">
				<div className="p-4 m-4 border border-gray-300 rounded">
					<DiscussionContent discussion={selectedDiscussion} />
				</div>

				{showForm && (
					<NewDiscussionForm
						onSubmit={handleSubmit}
						onClose={() => setShowForm(false)}
						newDiscussionTitle={newDiscussionTitle}
						setNewDiscussionTitle={setNewDiscussionTitle}
						newDiscussionContent={newDiscussionContent}
						setNewDiscussionContent={setNewDiscussionContent}
					/>
				)}
			</div>
		</div>
	);
}

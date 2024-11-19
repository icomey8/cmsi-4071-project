import React, { useState } from "react";
import { ChevronDown, MessageSquare, Puzzle } from "lucide-react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/Select";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/Collapsible";
import { Button } from "@/components/Button";
import { ScrollArea } from "@/components/ScrollArea";

const classrooms = [
	{ id: 1, name: "Math 101" },
	{ id: 2, name: "History 202" },
	{ id: 3, name: "Science 303" },
];

export default function Sidebar({
	discussions,
	onDiscussionClick,
	onAddDiscussion,
}) {
	const [selectedClassroom, setSelectedClassroom] = useState(classrooms[0].id);
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className="flex flex-col w-64 h-screen p-4 border-r bg-slate-900 border-slate-800">
			<div className="flex items-center gap-2 mb-4 shrink-0">
				<Puzzle className="w-6 h-6 text-blue-500" />
				<h1 className="text-xl font-bold text-slate-100">Async</h1>
			</div>
			<div className="mb-4 shrink-0">
				<Select
					value={selectedClassroom.toString()}
					onValueChange={(value) => setSelectedClassroom(parseInt(value))}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select a classroom" />
					</SelectTrigger>
					<SelectContent>
						{classrooms.map((classroom) => (
							<SelectItem key={classroom.id} value={classroom.id.toString()}>
								{classroom.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex flex-col flex-1 min-h-0">
				<Collapsible
					open={isOpen}
					onOpenChange={setIsOpen}
					className="flex flex-col flex-1"
				>
					<div className="flex items-center justify-between px-1 space-x-4 shrink-0">
						<h2 className="text-lg font-semibold text-slate-100">
							Discussion Board
						</h2>
						<CollapsibleTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="p-0 w-9 text-slate-400 hover:text-slate-100"
							>
								<ChevronDown
									className={`h-4 w-4 transition-transform duration-200 ${
										isOpen ? "transform rotate-180" : ""
									}`}
								/>
								<span className="sr-only">Toggle discussion board</span>
							</Button>
						</CollapsibleTrigger>
					</div>
					<CollapsibleContent className="flex-1 min-h-0 mt-2">
						<ScrollArea className="h-full">
							{discussions.map((item) => (
								<Button
									key={item.id}
									variant="ghost"
									className="justify-start w-full font-normal text-left text-slate-300 hover:text-slate-100 hover:bg-slate-800"
									onClick={() => onDiscussionClick(item)}
								>
									<MessageSquare className="w-4 h-4 mr-2" />
									{item.title}
								</Button>
							))}
						</ScrollArea>
					</CollapsibleContent>
				</Collapsible>
			</div>

			<Button
				onClick={onAddDiscussion}
				className="w-full mt-4 shrink-0"
				variant="default"
			>
				Add New Discussion
			</Button>
		</div>
	);
}

// export default function Sidebar({ discussions, onDiscussionClick, onAddDiscussion }) {
//   return (
//     <aside className="fixed w-64 h-screen p-4 text-white bg-gray-800">
//       <h2 className="mb-4 text-xl font-bold">Discussion Boards</h2>
//       <ul>
//         {discussions.map((discussion) => (
//           <li key={discussion.id}>
//             <button
//               className="block w-full px-4 py-2 text-left truncate hover:bg-gray-700 whitespace-nowrap"
//               onClick={() => onDiscussionClick(discussion)}
//             >
//               {discussion.title}
//             </button>
//           </li>
//         ))}
//       </ul>
//       <button
//         className="w-full px-4 py-2 mt-4 transition-colors bg-blue-600 rounded text-slate-100 hover:bg-blue-500"
//         onClick={onAddDiscussion}
//       >
//         Add New Discussion
//       </button>
//     </aside>
//   );
// }

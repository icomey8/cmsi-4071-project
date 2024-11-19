import React, { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import {
	MdFormatBold,
	MdFormatItalic,
	MdFormatUnderlined,
	MdFormatListBulleted,
	MdFormatListNumbered,
	MdAddLink,
	MdOutlineLinkOff,
} from "react-icons/md";
import "./styles.scss";

const BlueCircle = () => {
	return (
		<svg
			className="w-6 h-6 text-blue-500 transition-colors duration-200 hover:text-blue-700 animate-color-change"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
		>
			<circle cx="12" cy="12" r="5" />
		</svg>
	);
};

const TipTapEditor = () => {
	const editor = useEditor({
		extensions: [StarterKit, Underline, Link, CharacterCount],
		content: "<p>Hello, world!</p>",
		editorProps: {
			attributes: {
				class:
					"prose prose-slate prose-invert max-w-none min-h-[300px] focus:outline-none",
			},
		},
	});

	if (!editor) {
		return null;
	}

	const addLink = () => {
		const url = prompt("Enter the URL");
		if (url) {
			editor
				.chain()
				.focus()
				.extendMarkRange("link")
				.setLink({ href: url })
				.run();
		}
	};

	const removeLink = () => {
		editor.chain().focus().unsetLink().run();
	};

	return (
		<div className="h-[400px]">
			{/* Toolbar Buttons */}
			<div className="flex items-center mb-4 space-x-2 rounded-t bg-slate-900 ">
				<button
					onClick={() => editor.chain().focus().toggleBold().run()}
					className={`p-2 border h-8 rounded-md ${
						editor.isActive("bold") ? "bg-gray-800" : ""
					}`}
				>
					<MdFormatBold className="w-5 h-5" />
				</button>
				<button
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className={`p-2 border h-8 rounded-md ${
						editor.isActive("italic") ? "bg-gray-800" : ""
					}`}
				>
					<MdFormatItalic className="w-5 h-5"/>
				</button>
				<button
					onClick={() => editor.chain().focus().toggleUnderline().run()}
					className={`p-2 h-8 border rounded-md ${
						editor.isActive("underline") ? "bg-gray-800" : ""
					}`}
				>
					<MdFormatUnderlined className="w-5 h-5" />
				</button>
				<button
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={`p-2 border h-8 rounded-md ${
						editor.isActive("bulletList") ? "bg-gray-800" : ""
					}`}
				>
					<MdFormatListBulleted className="w-5 h-5" />
				</button>
				<button
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={`p-2 border h-8 rounded-md ${
						editor.isActive("orderedList") ? "bg-gray-800" : ""
					}`}
				>
					<MdFormatListNumbered className="w-5 h-5" />
				</button>
				<button onClick={addLink} className="p-2 border">
					<MdAddLink className="w-5 h-5" />
				</button>
				<button onClick={removeLink} className="p-2 border">
					<MdOutlineLinkOff className="w-5 h-5" />
				</button>

				<div className="flex items-center p-4 text-xs text-slate-500 ">
					<BlueCircle /> {editor.storage.characterCount.words()} words
				</div>
			</div>

			{/* Editor Content */}
			<div className="min-h-[400px]  rounded  bg-slate-900">
				<EditorContent editor={editor} className="h-full" />
			</div>
		</div>
	);
};

export default TipTapEditor;

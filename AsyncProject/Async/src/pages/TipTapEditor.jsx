import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import {
    MdFormatBold,
    MdFormatItalic,
    MdFormatUnderlined,
    MdFormatListBulleted,
    MdFormatListNumbered,
    MdAddLink,
    MdOutlineLinkOff,
} from "react-icons/md";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/Select";
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

const TipTapEditor = ({ content, setContent }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            CharacterCount,
            Heading.configure({
                levels: [1, 2, 3],
            }),
        ],
        content: content,
        editorProps: {
            attributes: {
                class:
                    "prose prose-slate prose-invert max-w-none min-h-[300px] focus:outline-none bg-slate-800",
            },
        },
        onUpdate: ({ editor }) => {
            const updatedContent = editor.getHTML();
            setContent(updatedContent);
        },
    });

    if (!editor) {
        return null;
    }

    const headingOptions = [
        { value: "paragraph", label: "Paragraph" },
        { value: "heading-1", label: "Heading 1" },
        { value: "heading-2", label: "Heading 2" },
        { value: "heading-3", label: "Heading 3" },
    ];

    const getCurrentHeading = () => {
        if (editor.isActive("heading", { level: 1 })) return "heading-1";
        if (editor.isActive("heading", { level: 2 })) return "heading-2";
        if (editor.isActive("heading", { level: 3 })) return "heading-3";
        return "paragraph";
    };

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
            <div className="flex items-center p-2 mb-4 space-x-2 rounded-t bg-slate-900">
                <Select
                    value={getCurrentHeading()}
                    onValueChange={(value) => {
                        if (value === "paragraph") {
                            editor.chain().focus().setParagraph().run();
                        } else {
                            const level = parseInt(value.split("-")[1]);
                            editor.chain().focus().toggleHeading({ level }).run();
                        }
                    }}
                >
                    <SelectTrigger className="w-[140px] bg-slate-800 border-slate-700">
                        <SelectValue placeholder="Style" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                        {headingOptions.map((option) => (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                                className="text-slate-200 hover:bg-slate-700 focus:bg-slate-700"
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

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
                    <MdFormatItalic className="w-5 h-5" />
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
            <div className="min-h-[300px] rounded bg-slate-900">
                <EditorContent editor={editor} className="h-full" />
            </div>
        </div>
    );
};

export default TipTapEditor;
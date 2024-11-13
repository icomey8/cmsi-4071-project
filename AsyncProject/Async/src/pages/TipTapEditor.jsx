import React, { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import CharacterCount from '@tiptap/extension-character-count'
import Link from '@tiptap/extension-link';
import './styles.scss';

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
    extensions: [
      StarterKit,
      Underline,
      Link,
      CharacterCount
    ],
    content: '<p>Hello, world!</p>',
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = prompt('Enter the URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  return (
    <div>
      {/* Toolbar Buttons */}
      <div className="flex mb-4 space-x-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 border ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 border ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 border ${editor.isActive('underline') ? 'bg-gray-300' : ''}`}
        >
          Underline
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 border ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
        >
          Bullet List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 border ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
        >
          Ordered List
        </button>
        <button
          onClick={addLink} 
          className="p-2 border"
        >
          Add Link
        </button>
        <button
          onClick={removeLink} 
          className="p-2 border"
        >
          Remove Link
        </button>

      </div>

      {/* Editor Content */}
      <div className="p-4 border rounded">
        <EditorContent editor={editor} />
        <div className='flex items-center pt-4 text-xs text-gray-500'> <BlueCircle></BlueCircle> {editor.storage.characterCount.words()} words</div>
      </div>
    </div>
  );
};

export default TipTapEditor;

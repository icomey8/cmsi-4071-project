import React, { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import './styles.scss';

const TipTapEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
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
      <div className="flex space-x-2 mb-4">
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
      <div className="border p-4 rounded">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TipTapEditor;

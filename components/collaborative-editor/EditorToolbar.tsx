'use client';

import {
  Bold,
  Italic,
  List,
  ListOrdered,
} from 'lucide-react';
import type { EditorToolbarProps } from './types';

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-gray-50 border-b border-gray-200">
      {/* Bold */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('bold') ? 'bg-gray-300' : ''
        }`}
        title="Negrita (Ctrl+B)"
      >
        <Bold className="w-5 h-5 text-gray-700" />
      </button>

      {/* Italic */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('italic') ? 'bg-gray-300' : ''
        }`}
        title="Cursiva (Ctrl+I)"
      >
        <Italic className="w-5 h-5 text-gray-700" />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-2"></div>

      {/* Heading 1 */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors text-sm font-semibold ${
          editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''
        }`}
        title="Título 1"
      >
        H1
      </button>

      {/* Heading 2 */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors text-sm font-semibold ${
          editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''
        }`}
        title="Título 2"
      >
        H2
      </button>

      {/* Heading 3 */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors text-sm font-semibold ${
          editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''
        }`}
        title="Título 3"
      >
        H3
      </button>

      <div className="w-px h-6 bg-gray-300 mx-2"></div>

      {/* Bullet List */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('bulletList') ? 'bg-gray-300' : ''
        }`}
        title="Lista con viñetas"
      >
        <List className="w-5 h-5 text-gray-700" />
      </button>

      {/* Ordered List */}
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('orderedList') ? 'bg-gray-300' : ''
        }`}
        title="Lista numerada"
      >
        <ListOrdered className="w-5 h-5 text-gray-700" />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-2"></div>

      {/* Paragraph */}
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors text-sm ${
          editor.isActive('paragraph') ? 'bg-gray-300' : ''
        }`}
        title="Párrafo normal"
      >
        P
      </button>

      {/* Horizontal Rule */}
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="px-3 py-2 rounded hover:bg-gray-200 transition-colors text-sm"
        title="Línea horizontal"
      >
        —
      </button>
    </div>
  );
}

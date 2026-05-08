"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";

export function RichTextRenderer({
  content,
  className = "prose prose-slate max-w-none text-sm leading-7 focus:outline-none",
}: {
  content: string;
  className?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: (() => {
      try {
        return JSON.parse(content);
      } catch {
        return {
          type: "doc",
          content: String(content)
            .split(/\n{2,}/)
            .filter(Boolean)
            .map((paragraph) => ({
              type: "paragraph",
              content: [{ type: "text", text: paragraph }],
            })),
        };
      }
    })(),
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: className },
    },
  });

  if (!editor) return null;
  return <EditorContent editor={editor} />;
}

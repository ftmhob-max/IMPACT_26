"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

type SaveStatus = "saved" | "unsaved" | "saving" | "error";

interface Props {
  lessonId: string;
  initialContent: string | null;
  onContentChange?: (json: string) => void;
}

export interface LessonContentEditorHandle {
  flushSave: () => Promise<void>;
}

export const LessonContentEditor = forwardRef<LessonContentEditorHandle, Props>(function LessonContentEditor(
  { lessonId, initialContent, onContentChange }: Props,
  ref
) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestContent = useRef<string | null>(null);

  const save = useCallback(
    async (contentJson: string) => {
      setSaveStatus("saving");
      try {
        const res = await fetch("/api/admin/courses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update-lesson",
            lessonId,
            contentJson,
          }),
        });
        setSaveStatus(res.ok ? "saved" : "error");
      } catch {
        setSaveStatus("error");
      }
    },
    [lessonId]
  );

  const scheduleSave = useCallback(
    (contentJson: string) => {
      latestContent.current = contentJson;
      setSaveStatus("unsaved");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        if (latestContent.current) save(latestContent.current);
      }, 1500);
    },
    [save]
  );

  const flushSave = useCallback(async () => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }

    if (!latestContent.current || saveStatus === "saving") return;
    await save(latestContent.current);
  }, [save, saveStatus]);

  useImperativeHandle(ref, () => ({
    flushSave,
  }), [flushSave]);

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
      if (!initialContent) return "";
      try {
        return JSON.parse(initialContent);
      } catch {
        return initialContent;
      }
    })(),
    onUpdate({ editor }) {
      const json = JSON.stringify(editor.getJSON());
      onContentChange?.(json);
      scheduleSave(json);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none text-sm leading-7 focus:outline-none min-h-[320px] px-6 py-5",
      },
    },
  });

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  function manualSave() {
    if (!editor) return;
    const json = JSON.stringify(editor.getJSON());
    latestContent.current = json;
    save(json);
  }

  if (!editor) return null;

  return (
    <div className="rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 flex-wrap border-b border-slate-100 px-3 py-2 bg-slate-50/60">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <strong className="text-xs">B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <em className="text-xs">I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          <span className="text-xs line-through">S</span>
        </ToolbarButton>
        <div className="w-px h-4 bg-slate-200 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <span className="text-xs font-bold">H2</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <span className="text-xs font-bold">H3</span>
        </ToolbarButton>
        <div className="w-px h-4 bg-slate-200 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet list"
        >
          <Icons.List size={13} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered list"
        >
          <Icons.ListOrdered size={13} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Icons.Quote size={13} />
        </ToolbarButton>
        <div className="w-px h-4 bg-slate-200 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Inline code"
        >
          <Icons.Code size={13} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code block"
        >
          <Icons.FileCode size={13} />
        </ToolbarButton>
        <div className="w-px h-4 bg-slate-200 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Icons.Undo size={13} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Icons.Redo size={13} />
        </ToolbarButton>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <SaveIndicator status={saveStatus} />
          <button
            type="button"
            onClick={manualSave}
            disabled={saveStatus === "saving" || saveStatus === "saved"}
            className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
});

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-30",
        active && "bg-slate-200 text-slate-900"
      )}
    >
      {children}
    </button>
  );
}

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "saved")
    return <span className="text-[10px] text-emerald-600 font-medium">Saved</span>;
  if (status === "saving")
    return <span className="text-[10px] text-slate-400 font-medium">Saving…</span>;
  if (status === "unsaved")
    return <span className="text-[10px] text-amber-500 font-medium">Unsaved changes</span>;
  return <span className="text-[10px] text-red-500 font-medium">Save failed</span>;
}

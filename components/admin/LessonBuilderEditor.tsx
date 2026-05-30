"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import * as Icons from "@/components/ui/Icons";

// Both of these must live at module scope, not inside the component.
// TipTap's EditorInstanceManager compares ALL options by reference on each render.
// Any new object/array reference triggers refreshEditorInstance → setEditor →
// React store rerender → infinite loop (affects TipTap v2.5+ with React 18/19).
const RICH_TEXT_EXTENSIONS = [
  StarterKit,
  Image.configure({ inline: false, allowBase64: true }),
  Table.configure({ resizable: true }),
  TableRow,
  TableHeader,
  TableCell,
];

const RICH_TEXT_EDITOR_PROPS = {
  attributes: {
    class: "prose prose-slate max-w-none min-h-[220px] px-5 py-4 text-sm leading-7 focus:outline-none",
  },
};
import { cn } from "@/lib/utils";
import {
  blockCategoryForType,
  createDefaultLessonBlock,
  getLessonReadinessReport,
  parseStructuredLessonContent,
  stringifyStructuredLessonContent,
  type LessonReadinessIssue,
  type LessonBlock,
  type LessonBlockType,
  type LessonFormulaSnapshot,
  type LessonGlossaryTermSnapshot,
  type StructuredLessonDocument,
} from "@/lib/lessons/structured-content";

type SaveStatus = "saved" | "unsaved" | "saving" | "error";

interface Props {
  lessonId: string;
  initialContent: string | null;
  onContentChange?: (json: string) => void;
  onSaveStatusChange?: (status: SaveStatus) => void;
  hideAuthorTools?: boolean;
}

interface FormulaLibraryItem extends LessonFormulaSnapshot {}

interface GlossaryLibraryItem extends LessonGlossaryTermSnapshot {
  relatedTerms?: string[];
}

interface MaterialLibraryItem {
  id: string;
  title: string;
  kind?: "document" | "audio" | "video" | "image";
  status?: string;
  pages?: number | null;
  previewSnippet?: string;
  hasAsset?: boolean;
  hasExtractedText?: boolean;
  characters?: number;
}


interface QuizLibraryItem {
  id: string;
  title: string;
  timeLimitSeconds?: number | null;
  shuffleQuestions?: boolean;
  shuffleChoices?: boolean;
}

export interface LessonBuilderEditorHandle {
  flushSave: () => Promise<void>;
}

const BLOCK_LIBRARY: Array<{
  type: LessonBlockType;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  category: "core" | "practice" | "support";
}> = [
  { type: "richText", label: "Text", description: "Instruction, explanation, and worked notes.", icon: Icons.FileText, category: "core" },
  { type: "video", label: "Video", description: "Mux or embedded video with transcript support.", icon: Icons.Video, category: "core" },
  { type: "audio", label: "Audio", description: "Narrated explanation with transcript.", icon: Icons.FileText, category: "core" },
  { type: "transcript", label: "Transcript", description: "Standalone transcript or reading support.", icon: Icons.FileCode, category: "core" },
  { type: "formula", label: "Formula", description: "Formula Compass explainer block.", icon: Icons.Calculator, category: "core" },
  { type: "callout", label: "Callout", description: "Teacher note, warning, or exam tip.", icon: Icons.Info, category: "core" },
  { type: "quizCheckpoint", label: "Checkpoint", description: "Embedded knowledge check.", icon: Icons.ClipboardList, category: "practice" },
  { type: "reflectionPrompt", label: "Reflection", description: "Prompt students to self-check their understanding.", icon: Icons.Quote, category: "practice" },
  { type: "image", label: "Image", description: "Illustrations, charts, and annotated visuals.", icon: Icons.BookOpen, category: "support" },
  { type: "document", label: "Document", description: "PDFs, slides, or worksheets.", icon: Icons.FileText, category: "support" },
  { type: "sourceReference", label: "Source", description: "Source library citation or excerpt.", icon: Icons.Database, category: "support" },
  { type: "glossaryTermSet", label: "Glossary", description: "Key vocabulary with definitions.", icon: Icons.BookOpen, category: "support" },
  { type: "download", label: "Download", description: "Assignment or supporting file.", icon: Icons.Upload, category: "support" },
  { type: "externalResource", label: "External link", description: "Curated off-platform reference.", icon: Icons.Link2, category: "support" },
];

export const LessonBuilderEditor = forwardRef<LessonBuilderEditorHandle, Props>(function LessonBuilderEditor(
  { lessonId, initialContent, onContentChange, onSaveStatusChange, hideAuthorTools = false }: Props,
  ref
) {
  // Pass lessonId as seed so that a null initialContent always produces the same
  // default block ID on both server and client, preventing SSR hydration mismatches.
  const [documentState, setDocumentState] = useState<StructuredLessonDocument>(() =>
    parseStructuredLessonContent(initialContent, lessonId)
  );
  const [saveStatus, setSaveStatusRaw] = useState<SaveStatus>("saved");
  const setSaveStatus = useCallback(
    (status: SaveStatus) => {
      setSaveStatusRaw(status);
      onSaveStatusChange?.(status);
    },
    [onSaveStatusChange]
  );
  const [formulas, setFormulas] = useState<FormulaLibraryItem[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryLibraryItem[]>([]);
  const [materials, setMaterials] = useState<MaterialLibraryItem[]>([]);
  const [quizzes, setQuizzes] = useState<QuizLibraryItem[]>([]);
  const [librariesLoaded, setLibrariesLoaded] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [collapsedBlockIds, setCollapsedBlockIds] = useState<Set<string>>(new Set());
  const [sidebarTab, setSidebarTab] = useState<"blocks" | "materials" | "readiness">("blocks");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const latestSerialized = useRef(stringifyStructuredLessonContent(parseStructuredLessonContent(initialContent, lessonId)));
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [insertingMaterialId, setInsertingMaterialId] = useState<string | null>(null);
  const [justInsertedBlockId, setJustInsertedBlockId] = useState<string | null>(null);

  useEffect(() => {
    const next = parseStructuredLessonContent(initialContent, lessonId);
    setDocumentState(next);
    latestSerialized.current = stringifyStructuredLessonContent(next);
    setSaveStatus("saved");
    setLastSavedAt(null);
    setCollapsedBlockIds(new Set());
  }, [initialContent, lessonId]);

  useEffect(() => {
    if (librariesLoaded) return;
    let active = true;

    Promise.all([
      fetch("/api/quiz/formulas").then((res) => (res.ok ? res.json() : [])),
      fetch("/api/admin/glossary").then((res) => (res.ok ? res.json() : { terms: [] })),
      fetch("/api/admin/materials").then((res) => (res.ok ? res.json() : { materials: [] })),
      fetch("/api/admin/overview", { cache: "no-store" }).then((res) => (res.ok ? res.json() : { quizzes: [] })),
    ])
      .then(([formulaSections, glossaryData, materialsData, overviewData]) => {
        if (!active) return;
        const formulaItems = (formulaSections as Array<{ formulas?: FormulaLibraryItem[] }>)
          .flatMap((section) => section.formulas ?? []);
        setFormulas(formulaItems);
        setGlossaryTerms((glossaryData.terms ?? []) as GlossaryLibraryItem[]);
        setMaterials(
          (materialsData.materials ?? []).map((material: any) => ({
            id: material.id,
            title: material.title,
            kind: material.kind,
            status: material.status,
            pages: material.pages ?? null,
            previewSnippet: material.previewSnippet ?? "",
            hasAsset: material.hasAsset,
            hasExtractedText: material.hasExtractedText,
            characters: material.characters,
          }))
        );
        setQuizzes((overviewData.quizzes ?? []) as QuizLibraryItem[]);
        setLibrariesLoaded(true);
      })
      .catch(() => {
        if (active) setLibrariesLoaded(true);
      });

    return () => {
      active = false;
    };
  }, [librariesLoaded]);

  const save = useCallback(
    async (serializedDocument: string) => {
      setSaveStatus("saving");
      try {
        const res = await fetch("/api/admin/courses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update-lesson",
            lessonId,
            contentJson: serializedDocument,
          }),
        });
        if (res.ok) {
          setSaveStatus("saved");
          setLastSavedAt(new Date());
        } else {
          setSaveStatus("error");
        }
      } catch {
        setSaveStatus("error");
      }
    },
    [lessonId]
  );

  const queueSave = useCallback(
    (nextDocument: StructuredLessonDocument) => {
      const serialized = stringifyStructuredLessonContent(nextDocument);
      latestSerialized.current = serialized;
      onContentChange?.(serialized);
      setSaveStatus("unsaved");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        void save(serialized);
      }, 1200);
    },
    [onContentChange, save]
  );

  const flushSave = useCallback(async () => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    if (!latestSerialized.current || saveStatus === "saving") return;
    await save(latestSerialized.current);
  }, [save, saveStatus]);

  useImperativeHandle(ref, () => ({ flushSave }), [flushSave]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const updateDocument = useCallback(
    (updater: (draft: StructuredLessonDocument) => StructuredLessonDocument) => {
      setDocumentState(updater);
    },
    []
  );

  useEffect(() => {
    const serialized = stringifyStructuredLessonContent(documentState);
    if (serialized !== latestSerialized.current) {
      queueSave(documentState);
    }
  }, [documentState, queueSave]);

  const readinessIssues = useMemo(() => getLessonReadinessReport(documentState), [documentState]);
  const blockCounts = useMemo(
    () => ({
      visible: documentState.blocks.filter((block) => block.isStudentVisible).length,
      required: documentState.blocks.filter((block) => block.required && block.isStudentVisible).length,
    }),
    [documentState.blocks]
  );
  const groupedLibrary = useMemo(
    () => ({
      core: BLOCK_LIBRARY.filter((entry) => entry.category === "core"),
      practice: BLOCK_LIBRARY.filter((entry) => entry.category === "practice"),
      support: BLOCK_LIBRARY.filter((entry) => entry.category === "support"),
    }),
    []
  );

  function addBlock(type: LessonBlockType) {
    updateDocument((current) => ({
      ...current,
      blocks: [...current.blocks, createDefaultLessonBlock(type)],
    }));
  }

  const handleInsertMaterialBlock = useCallback(
    async (material: MaterialLibraryItem, blockType: LessonBlockType) => {
      setInsertingMaterialId(material.id);
      let customFields: Partial<LessonBlock> = {};

      if (blockType === "sourceReference") {
        customFields = { materialId: material.id, title: material.title };
      } else if (blockType === "document" || blockType === "download") {
        customFields = { url: `/api/admin/materials/${material.id}/asset`, title: material.title };
      } else if (blockType === "video") {
        customFields = { videoUrl: `/api/admin/materials/${material.id}/asset`, title: material.title };
      } else if (blockType === "audio") {
        customFields = { audioUrl: `/api/admin/materials/${material.id}/asset`, title: material.title };
      }

      if (blockType === "richText" || blockType === "transcript" || blockType === "video" || blockType === "audio") {
        try {
          const res = await fetch(`/api/admin/materials/${material.id}/preview`);
          if (res.ok) {
            const data = await res.json();
            const text = data?.preview?.extractedText || "";
            if (blockType === "richText") {
              const paragraphs = text.split("\n").map((p: string) => p.trim()).filter(Boolean);
              const contentJson = paragraphs.length > 0
                ? JSON.stringify({
                    type: "doc",
                    content: paragraphs.map((p: string) => ({
                      type: "paragraph",
                      content: [{ type: "text", text: p }]
                    }))
                  })
                : JSON.stringify({ type: "doc", content: [{ type: "paragraph" }] });
              customFields = { ...customFields, content: contentJson };
            } else if (blockType === "transcript" || blockType === "video" || blockType === "audio") {
              customFields = { ...customFields, transcript: text };
            }
          }
        } catch (e) {
          console.error("Failed to fetch material preview for transcript/text", e);
        }
      }

      const blockId = `block-imported-${Date.now()}`;
      updateDocument((current) => {
        const base = createDefaultLessonBlock(blockType);
        const block = { ...base, id: blockId, materialId: material.id, ...customFields } as LessonBlock;
        return { ...current, blocks: [...current.blocks, block] };
      });

      setInsertingMaterialId(null);
      setJustInsertedBlockId(blockId);
      setTimeout(() => setJustInsertedBlockId(null), 2500);
    },
    [updateDocument]
  );

  function insertBlockAt(index: number, type: LessonBlockType) {
    updateDocument((current) => {
      const next = [...current.blocks];
      next.splice(index, 0, createDefaultLessonBlock(type));
      return { ...current, blocks: next };
    });
  }

  function updateBlock(blockId: string, updater: (block: LessonBlock) => LessonBlock) {
    updateDocument((current) => ({
      ...current,
      blocks: current.blocks.map((block) => (block.id === blockId ? updater(block) : block)),
    }));
  }

  function moveBlock(blockId: string, direction: -1 | 1) {
    updateDocument((current) => {
      const index = current.blocks.findIndex((block) => block.id === blockId);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.blocks.length) return current;
      const next = [...current.blocks];
      const [block] = next.splice(index, 1);
      next.splice(target, 0, block);
      return { ...current, blocks: next };
    });
  }

  function duplicateBlock(blockId: string) {
    updateDocument((current) => {
      const index = current.blocks.findIndex((block) => block.id === blockId);
      if (index < 0) return current;
      const original = current.blocks[index];
      const duplicate = { ...JSON.parse(JSON.stringify(original)), id: `${original.id}-copy-${Date.now()}` } as LessonBlock;
      const next = [...current.blocks];
      next.splice(index + 1, 0, duplicate);
      return { ...current, blocks: next };
    });
  }

  function removeBlock(blockId: string) {
    updateDocument((current) => ({
      ...current,
      blocks: current.blocks.filter((block) => block.id !== blockId),
    }));
  }

  function manualSave() {
    void flushSave();
  }

  function focusIssue(issue: LessonReadinessIssue) {
    if (issue.field === "block" && issue.blockId) {
      setCollapsedBlockIds((current) => {
        const next = new Set(current);
        next.delete(issue.blockId!);
        return next;
      });
    }
    const targetId =
      issue.field === "block" && issue.blockId
        ? `lesson-block-editor-${issue.blockId}`
        : issue.field === "summary"
        ? "lesson-summary-field"
        : issue.field === "objectives"
        ? "lesson-objectives-section"
        : issue.field === "estimatedDurationMinutes"
        ? "lesson-duration-field"
        : "lesson-completion-mode-field";
    window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <div className={cn("lesson-builder-editor grid gap-5", (!hideAuthorTools && !sidebarCollapsed) ? "xl:grid-cols-[minmax(0,1fr)_360px]" : "grid-cols-1")}>
      <div className="space-y-5">
        <div className="rounded-2xl border border-black/10 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#E6F1FB] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#185FA5]">
                  Lesson setup
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
                  {blockCounts.visible} visible blocks
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
                  {blockCounts.required} required
                </span>
              </div>
              <div className="flex items-center gap-3">
                <AuthorConfidencePanel status={saveStatus} lastSavedAt={lastSavedAt} />
                {sidebarCollapsed && !hideAuthorTools && (
                  <button
                    type="button"
                    onClick={() => setSidebarCollapsed(false)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5]"
                    title="Show side panel"
                  >
                    <Icons.PanelLeft size={13} />
                    <span>Show tools</span>
                  </button>
                )}
              </div>
            </div>
            <h3 className="mt-3 text-lg font-extrabold text-slate-950">Build the student experience from structured blocks</h3>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
              Set up the lesson promise first, then build the flow students will move through from orientation to practice.
            </p>
          </div>

          <div className="space-y-5 px-5 py-5">
            <div className="space-y-3" id="lesson-summary-field">
              <FieldLabel>Lesson summary</FieldLabel>
              <p className="text-xs leading-5 text-slate-500">
                Answer three things up front: what students will learn, why it matters, and how they should use this lesson.
              </p>
              <textarea
                value={documentState.summary}
                onChange={(event) =>
                  updateDocument((current) => ({ ...current, summary: event.target.value }))
                }
                rows={3}
                className="admin-input min-h-[96px]"
                placeholder="Summarize what students will learn and why it matters."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2" id="lesson-duration-field">
                <FieldLabel>Estimated time (minutes)</FieldLabel>
                <p className="mt-1 text-xs leading-5 text-slate-500">Keep this human-friendly so learners can budget their study time.</p>
                <input
                  type="number"
                  min={0}
                  value={documentState.estimatedDurationMinutes ?? ""}
                  onChange={(event) =>
                    updateDocument((current) => ({
                      ...current,
                      estimatedDurationMinutes: event.target.value ? parseInt(event.target.value, 10) : null,
                    }))
                  }
                  className="admin-input"
                  placeholder="e.g. 18"
                />
              </div>
              <div className="space-y-2" id="lesson-completion-mode-field">
                <FieldLabel>Completion mode</FieldLabel>
                <p className="mt-1 text-xs leading-5 text-slate-500">Choose whether learners can mark complete manually or only after reviewing every block.</p>
                <select
                  value={documentState.completionMode}
                  onChange={(event) =>
                    updateDocument((current) => ({
                      ...current,
                      completionMode: event.target.value === "all-blocks" ? "all-blocks" : "manual",
                    }))
                  }
                  className="admin-input"
                >
                  <option value="manual">Manual completion</option>
                  <option value="all-blocks">Explore all blocks first</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 px-5 py-5" id="lesson-objectives-section">
            <FieldLabel>Learning objectives</FieldLabel>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Use action-oriented objectives so the preview can clearly show what success looks like.
            </p>
            <div className="mt-3 space-y-2">
              {documentState.objectives.map((objective, index) => (
                <div key={`${index}-${objective}`} className="flex gap-2">
                  <input
                    value={objective}
                    onChange={(event) =>
                      updateDocument((current) => ({
                        ...current,
                        objectives: current.objectives.map((entry, entryIndex) =>
                          entryIndex === index ? event.target.value : entry
                        ),
                      }))
                    }
                    className="admin-input"
                    placeholder={`Objective ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateDocument((current) => ({
                        ...current,
                        objectives: current.objectives.length === 1
                          ? [""]
                          : current.objectives.filter((_, entryIndex) => entryIndex !== index),
                      }))
                    }
                    className="rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-500 transition hover:border-red-200 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                updateDocument((current) => ({
                  ...current,
                  objectives: [...current.objectives, ""],
                }))
              }
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5]"
            >
              <Icons.Plus size={12} />
              Add objective
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {documentState.blocks.map((block, index) => (
            <div key={block.id} className="space-y-3">
              <InlineInsertRail
                label={index === 0 ? "Start the lesson with..." : "Add a block before this one"}
                onInsert={(type) => insertBlockAt(index, type)}
              />
              <BlockEditorCard
                block={block}
                index={index}
                totalBlocks={documentState.blocks.length}
                formulas={formulas}
                glossaryTerms={glossaryTerms}
                materials={materials}
                quizzes={quizzes}
                collapsed={collapsedBlockIds.has(block.id)}
                onToggleCollapsed={() =>
                  setCollapsedBlockIds((current) => {
                    const next = new Set(current);
                    if (next.has(block.id)) next.delete(block.id);
                    else next.add(block.id);
                    return next;
                  })
                }
                onChange={(nextBlock) => updateBlock(block.id, () => nextBlock)}
                onMoveUp={() => moveBlock(block.id, -1)}
                onMoveDown={() => moveBlock(block.id, 1)}
                onDuplicate={() => duplicateBlock(block.id)}
                onRemove={() => removeBlock(block.id)}
                onInsertAfter={(type) => insertBlockAt(index + 1, type)}
              />
            </div>
          ))}
          <InlineInsertRail label="Finish the flow with..." onInsert={(type) => addBlock(type)} />
        </div>
      </div>

      {!hideAuthorTools && !sidebarCollapsed && (
        <aside className="space-y-5">
          <div className="rounded-2xl border border-black/10 bg-white shadow-sm xl:sticky xl:top-5">
            {/* Sidebar tab switcher */}
            <div className="flex border-b border-slate-100 pr-1.5 items-center justify-between">
              <div className="flex flex-1">
                <button
                  type="button"
                  onClick={() => setSidebarTab("blocks")}
                  className={cn(
                    "flex-1 py-3 text-[11px] font-extrabold uppercase tracking-[0.1em] transition-colors",
                    sidebarTab === "blocks" ? "border-b-2 border-[#185FA5] text-[#185FA5]" : "text-slate-400 hover:text-slate-700"
                  )}
                >
                  Blocks
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarTab("materials")}
                  className={cn(
                    "flex-1 py-3 text-[11px] font-extrabold uppercase tracking-[0.1em] transition-colors",
                    sidebarTab === "materials" ? "border-b-2 border-[#185FA5] text-[#185FA5]" : "text-slate-400 hover:text-slate-700"
                  )}
                >
                  Source
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarTab("readiness")}
                  className={cn(
                    "flex-1 py-3 text-[11px] font-extrabold uppercase tracking-[0.1em] transition-colors flex items-center justify-center gap-1.5",
                    sidebarTab === "readiness" ? "border-b-2 border-[#185FA5] text-[#185FA5]" : "text-slate-400 hover:text-slate-700"
                  )}
                >
                  <span>Readiness</span>
                  {readinessIssues.length > 0 && (
                    <span className={cn(
                      "rounded-full px-1.5 py-0.5 text-[9px] font-extrabold",
                      sidebarTab === "readiness" ? "bg-[#185FA5] text-white" : "bg-slate-100 text-slate-500"
                    )}>
                      {readinessIssues.length}
                    </span>
                  )}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setSidebarCollapsed(true)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition shrink-0 ml-1"
                title="Collapse tools"
                aria-label="Collapse tools"
              >
                <Icons.PanelRight size={15} />
              </button>
            </div>

            {sidebarTab === "blocks" && (
              <>
                <div className="border-b border-slate-100 px-5 py-4">
                  <p className="text-sm leading-6 text-slate-600">
                    Add blocks by teaching intent instead of one long flat list.
                  </p>
                </div>
                <div className="space-y-4 px-4 py-4">
                  <BlockLibraryGroup title="Core learning" description="Teach, explain, and model." items={groupedLibrary.core} onAdd={addBlock} />
                  <BlockLibraryGroup title="Practice" description="Check understanding and create reflection moments." items={groupedLibrary.practice} onAdd={addBlock} />
                  <BlockLibraryGroup title="Support" description="Add references, downloads, and learning aids." items={groupedLibrary.support} onAdd={addBlock} />
                </div>
              </>
            )}

            {sidebarTab === "materials" && (
              <MaterialsBrowserPanel
                materials={materials}
                loaded={librariesLoaded}
                insertingMaterialId={insertingMaterialId}
                onInsert={handleInsertMaterialBlock}
              />
            )}

            {sidebarTab === "readiness" && (
              <>
                <div className="border-b border-slate-100 px-5 py-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#185FA5]">Publish readiness</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Resolve these issues before publishing to students.
                  </p>
                </div>
                <div className="space-y-3 px-5 py-5">
                  {readinessIssues.length === 0 ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                      This lesson is ready for preview and publish.
                    </div>
                  ) : (
                    readinessIssues.map((issue) => (
                      <button
                        key={issue.id}
                        type="button"
                        onClick={() => focusIssue(issue)}
                        className={cn(
                          "block w-full rounded-xl border px-4 py-3 text-left text-sm transition hover:shadow-sm",
                          issue.severity === "required" && "border-amber-200 bg-amber-50 text-amber-900",
                          issue.severity === "recommended" && "border-sky-200 bg-sky-50 text-sky-900",
                          issue.severity === "polish" && "border-slate-200 bg-slate-50 text-slate-700"
                        )}
                      >
                        <div className="flex items-center gap-2 animate-pulse">
                          <SeverityBadge severity={issue.severity} />
                          <span className="font-semibold">{issue.message}</span>
                        </div>
                        <p className="mt-2 text-xs opacity-80">
                          {issue.blockId ? "Jump to this block" : "Jump to this lesson setup field"}
                        </p>
                      </button>
                    ))
                  )}
                  <button
                    type="button"
                    onClick={manualSave}
                    disabled={saveStatus === "saving"}
                    className="admin-action w-full flex items-center justify-center gap-2"
                  >
                    {saveStatus === "saving" ? <Icons.Loader size={13} className="animate-spin" /> : <Icons.Check size={13} />}
                    Save lesson canvas
                  </button>
                </div>
              </>
            )}
          </div>
        </aside>
      )}
    </div>
  );
});

function BlockEditorCard({
  block,
  index,
  totalBlocks,
  formulas,
  glossaryTerms,
  materials,
  quizzes,
  collapsed,
  onToggleCollapsed,
  onChange,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove,
  onInsertAfter,
}: {
  block: LessonBlock;
  index: number;
  totalBlocks: number;
  formulas: FormulaLibraryItem[];
  glossaryTerms: GlossaryLibraryItem[];
  materials: MaterialLibraryItem[];
  quizzes: QuizLibraryItem[];
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onChange: (block: LessonBlock) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onInsertAfter: (type: LessonBlockType) => void;
}) {
  return (
    <div id={`lesson-block-editor-${block.id}`} className="rounded-2xl border border-black/10 bg-white shadow-sm scroll-mt-24">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#185FA5]">
              Block {index + 1} of {totalBlocks}
            </p>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
              {blockCategoryForType(block.type)}
            </span>
            <span className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em]",
              block.isStudentVisible ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
            )}>
              {block.isStudentVisible ? "Visible to students" : "Hidden from students"}
            </span>
            {block.required && (
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-amber-700">
                Required
              </span>
            )}
          </div>
          <input
            value={block.title ?? ""}
            onChange={(event) => onChange({ ...block, title: event.target.value })}
            className="mt-2 w-full border-0 bg-transparent p-0 text-lg font-extrabold text-slate-950 outline-none"
            placeholder="Block title"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={onToggleCollapsed} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5]">
            {collapsed ? "Expand" : "Collapse"}
          </button>
          <button type="button" onClick={onMoveUp} disabled={index === 0} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5] disabled:opacity-40">
            <Icons.ChevronUp size={14} />
          </button>
          <button type="button" onClick={onMoveDown} disabled={index === totalBlocks - 1} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5] disabled:opacity-40">
            <Icons.ChevronDown size={14} />
          </button>
          <button type="button" onClick={onDuplicate} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5]">Duplicate</button>
          <button type="button" onClick={onRemove} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:border-red-200 hover:text-red-700">Delete</button>
        </div>
      </div>

      {!collapsed && (
        <div className="space-y-4 px-5 py-5">
          <div className="grid gap-3 md:grid-cols-3">
            <ToggleRow
              label="Student visible"
              checked={block.isStudentVisible}
              onToggle={() => onChange({ ...block, isStudentVisible: !block.isStudentVisible })}
            />
            <ToggleRow
              label="Required block"
              checked={block.required}
              onToggle={() => onChange({ ...block, required: !block.required })}
            />
            <div>
              <FieldLabel>Block type</FieldLabel>
              <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600">
                {block.type}
              </div>
            </div>
          </div>

          {blockCategoryForType(block.type) !== "practice" && block.type !== "sourceReference" && (
            <div className="border-t border-slate-100 pt-4">
              <FieldLabel>Linked source material</FieldLabel>
              <div className="mt-2">
                <MaterialPickerField
                  materials={getFilteredMaterialsForBlock(materials, block.type, block.materialId)}
                  value={block.materialId ?? ""}
                  onChange={(id) => onChange({ ...block, materialId: id })}
                />
              </div>
              {block.materialId && materials.find((m) => m.id === block.materialId)?.previewSnippet && (
                <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Material preview</p>
                  <p className="text-xs leading-5 text-slate-600 line-clamp-3">
                    {materials.find((m) => m.id === block.materialId)?.previewSnippet}
                  </p>
                </div>
              )}
            </div>
          )}

          <BlockSpecificFields
            block={block}
            formulas={formulas}
            glossaryTerms={glossaryTerms}
            materials={materials}
            quizzes={quizzes}
            onChange={onChange}
          />

          <InlineInsertRail label="Add a block after this one" onInsert={onInsertAfter} compact />
        </div>
      )}
    </div>
  );
}

function BlockLibraryGroup({
  title,
  description,
  items,
  onAdd,
}: {
  title: string;
  description: string;
  items: typeof BLOCK_LIBRARY;
  onAdd: (type: LessonBlockType) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
      <div className="px-1 pb-2">
        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-600">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>
      <div className="space-y-2">
        {items.map((block) => {
          const Icon = block.icon;
          return (
            <button
              key={block.type}
              type="button"
              onClick={() => onAdd(block.type)}
              className="flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-left transition hover:border-[#185FA5] hover:bg-[#f8fbff]"
            >
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6F1FB] text-[#185FA5]">
                <Icon size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">{block.label}</p>
                <p className="text-xs leading-5 text-slate-500">{block.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MaterialPickerField({
  materials,
  value,
  onChange,
}: {
  materials: MaterialLibraryItem[];
  value: string;
  onChange: (id: string, title: string) => void;
}) {
  const [query, setQuery] = useState("");
  const selected = materials.find((m) => m.id === value);
  const filtered = query.trim()
    ? materials.filter((m) => m.title.toLowerCase().includes(query.toLowerCase()))
    : materials;

  function kindLabel(kind?: string) {
    if (!kind) return "Doc";
    return kind.charAt(0).toUpperCase() + kind.slice(1);
  }

  return (
    <div className="space-y-2">
      {selected ? (
        <div className="flex items-center gap-3 rounded-xl border border-[#b8d7f0] bg-[#E6F1FB]/60 px-3 py-2.5">
          <Icons.Database size={15} className="text-[#185FA5] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#185FA5] truncate">{selected.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="rounded-full bg-[#E6F1FB] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#185FA5]">
                {kindLabel(selected.kind)}
              </span>
              {selected.pages ? <span className="text-[10px] text-slate-400">{selected.pages}p</span> : null}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange("", "")}
            className="text-xs text-slate-400 hover:text-red-500 font-semibold shrink-0"
          >
            Change
          </button>
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">No material linked yet.</p>
      )}
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search materials to link…"
        className="admin-input"
      />
      {(query || !selected) && (
        <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <p className="px-3 py-4 text-center text-xs text-slate-400">No materials match.</p>
          ) : (
            filtered.map((material) => (
              <button
                key={material.id}
                type="button"
                onClick={() => {
                  onChange(material.id, material.title);
                  setQuery("");
                }}
                className={cn(
                  "flex w-full items-start gap-2.5 px-3 py-2.5 text-left text-xs transition hover:bg-white",
                  material.id === value && "bg-[#E6F1FB]/50"
                )}
              >
                <Icons.FileText size={13} className="text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800 truncate">{material.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] font-bold uppercase text-slate-400">{kindLabel(material.kind)}</span>
                    {material.pages ? <span className="text-[10px] text-slate-400">{material.pages}p</span> : null}
                  </div>
                </div>
                {material.id === value && <Icons.Check size={12} className="text-[#185FA5] shrink-0 mt-0.5" />}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function MaterialsBrowserPanel({
  materials,
  loaded,
  insertingMaterialId,
  onInsert,
}: {
  materials: MaterialLibraryItem[];
  loaded: boolean;
  insertingMaterialId: string | null;
  onInsert: (material: MaterialLibraryItem, type: LessonBlockType) => void;
}) {
  const [query, setQuery] = useState("");
  const [expandedMaterialId, setExpandedMaterialId] = useState<string | null>(null);

  const filtered = query.trim()
    ? materials.filter((m) => m.title.toLowerCase().includes(query.toLowerCase()))
    : materials;

  function kindIcon(kind?: string) {
    if (kind === "video") return Icons.Video;
    if (kind === "audio") return Icons.FileText;
    if (kind === "image") return Icons.BookOpen;
    return Icons.FileText;
  }

  function kindLabel(kind?: string) {
    if (!kind) return "Doc";
    return kind.charAt(0).toUpperCase() + kind.slice(1);
  }

  return (
    <>
      <div className="border-b border-slate-100 px-4 py-3">
        <p className="text-xs leading-6 text-slate-500">
          Insert items from your source materials into the lesson.
        </p>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search materials…"
          className="admin-input mt-2"
        />
      </div>
      <div className="max-h-96 overflow-y-auto px-3 py-3">
        {!loaded ? (
          <div className="flex items-center justify-center py-8 text-xs text-slate-400">
            <Icons.Loader size={14} className="animate-spin mr-2" />
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-400">
            {query ? "No materials match your search." : "No materials in your library yet."}
          </p>
        ) : (
          <div className="space-y-2">
            {filtered.map((material) => {
              const Icon = kindIcon(material.kind);
              const isExpanded = expandedMaterialId === material.id;
              return (
                <div
                  key={material.id}
                  className="rounded-xl border border-slate-200 bg-white p-3 transition hover:border-[#185FA5] hover:bg-[#f8fbff]"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E6F1FB] text-[#185FA5]">
                      <Icon size={13} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold leading-5 text-slate-800 truncate">{material.title}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-500">
                          {kindLabel(material.kind)}
                        </span>
                        {material.pages ? (
                          <span className="text-[10px] text-slate-400">{material.pages}p</span>
                        ) : null}
                        {material.characters ? (
                          <span className="text-[10px] text-slate-400">{(material.characters).toLocaleString()} chars</span>
                        ) : null}
                      </div>
                      {material.previewSnippet && (
                        <p className="mt-1 text-[10px] leading-4 text-slate-400 line-clamp-2">
                          {material.previewSnippet}
                        </p>
                      )}
                    </div>
                  </div>

                  {isExpanded ? (
                    <div className="space-y-2 mt-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Insert Options</span>
                        <button
                          type="button"
                          onClick={() => setExpandedMaterialId(null)}
                          className="text-[10px] font-semibold text-[#185FA5] hover:underline"
                        >
                          Collapse
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => onInsert(material, "sourceReference")}
                          className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-2.5 text-center text-[10px] font-bold text-slate-700 transition hover:border-[#185FA5] hover:bg-slate-50"
                        >
                          <Icons.Database size={14} className="text-slate-500" />
                          <span>Citation</span>
                        </button>
                        
                        {material.kind === "video" && (
                          <button
                            type="button"
                            disabled={insertingMaterialId === material.id}
                            onClick={() => onInsert(material, "video")}
                            className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-2.5 text-center text-[10px] font-bold text-slate-700 transition hover:border-[#185FA5] hover:bg-slate-50 disabled:opacity-50"
                          >
                            {insertingMaterialId === material.id ? (
                              <Icons.Loader size={14} className="animate-spin text-[#185FA5]" />
                            ) : (
                              <Icons.Video size={14} className="text-slate-500" />
                            )}
                            <span>Video Block</span>
                          </button>
                        )}

                        {material.kind === "audio" && (
                          <button
                            type="button"
                            disabled={insertingMaterialId === material.id}
                            onClick={() => onInsert(material, "audio")}
                            className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-2.5 text-center text-[10px] font-bold text-slate-700 transition hover:border-[#185FA5] hover:bg-slate-50 disabled:opacity-50"
                          >
                            {insertingMaterialId === material.id ? (
                              <Icons.Loader size={14} className="animate-spin text-[#185FA5]" />
                            ) : (
                              <Icons.List size={14} className="text-slate-500" />
                            )}
                            <span>Audio Block</span>
                          </button>
                        )}

                        {(material.hasExtractedText || (material.characters ?? 0) > 0) && (
                          <>
                            <button
                              type="button"
                              disabled={insertingMaterialId === material.id}
                              onClick={() => onInsert(material, "richText")}
                              className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-2.5 text-center text-[10px] font-bold text-slate-700 transition hover:border-[#185FA5] hover:bg-slate-50 disabled:opacity-50"
                            >
                              {insertingMaterialId === material.id ? (
                                <Icons.Loader size={14} className="animate-spin text-[#185FA5]" />
                              ) : (
                                <Icons.FileText size={14} className="text-slate-500" />
                              )}
                              <span>Text Block</span>
                            </button>
                            <button
                              type="button"
                              disabled={insertingMaterialId === material.id}
                              onClick={() => onInsert(material, "transcript")}
                              className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-2.5 text-center text-[10px] font-bold text-slate-700 transition hover:border-[#185FA5] hover:bg-slate-50 disabled:opacity-50"
                            >
                              {insertingMaterialId === material.id ? (
                                <Icons.Loader size={14} className="animate-spin text-[#185FA5]" />
                              ) : (
                                <Icons.FileCode size={14} className="text-slate-500" />
                              )}
                              <span>Transcript</span>
                            </button>
                          </>
                        )}

                        {material.hasAsset && (
                          <>
                            <button
                              type="button"
                              onClick={() => onInsert(material, "document")}
                              className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-2.5 text-center text-[10px] font-bold text-slate-700 transition hover:border-[#185FA5] hover:bg-slate-50"
                            >
                              <Icons.Eye size={14} className="text-slate-500" />
                              <span>Doc Viewer</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onInsert(material, "download")}
                              className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-2.5 text-center text-[10px] font-bold text-slate-700 transition hover:border-[#185FA5] hover:bg-slate-50"
                            >
                              <Icons.Upload size={14} className="text-slate-500 rotate-180" />
                              <span>Download</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setExpandedMaterialId(material.id)}
                      className="mt-2.5 flex items-center justify-center gap-1 w-full rounded-lg border border-[#185FA5]/30 bg-[#E6F1FB]/60 py-1.5 text-[11px] font-semibold text-[#185FA5] transition hover:bg-[#E6F1FB]"
                    >
                      <span>Insert as block…</span>
                      <Icons.ChevronDown size={12} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="border-t border-slate-100 px-4 py-3">
        <a
          href="/admin/materials"
          className="flex items-center gap-1.5 text-[11px] font-semibold text-[#185FA5] hover:underline"
        >
          <Icons.Database size={11} />
          Manage source library
        </a>
      </div>
    </>
  );
}

function InlineInsertRail({
  label,
  onInsert,
  compact = false,
}: {
  label: string;
  onInsert: (type: LessonBlockType) => void;
  compact?: boolean;
}) {
  const quickActions = BLOCK_LIBRARY.slice(0, compact ? 4 : 6);

  return (
    <div className={cn("rounded-2xl border border-dashed border-slate-300 bg-slate-50/80", compact ? "p-3" : "px-4 py-3")}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500">{label}</span>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((item) => (
            <button
              key={item.type}
              type="button"
              onClick={() => onInsert(item.type)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5]"
            >
              + {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: LessonReadinessIssue["severity"] }) {
  const copy =
    severity === "required"
      ? { label: "Required", className: "bg-amber-100 text-amber-800" }
      : severity === "recommended"
      ? { label: "Recommended", className: "bg-sky-100 text-sky-800" }
      : { label: "Polish", className: "bg-slate-200 text-slate-700" };

  return <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em]", copy.className)}>{copy.label}</span>;
}

function AuthorConfidencePanel({
  status,
  lastSavedAt,
}: {
  status: SaveStatus;
  lastSavedAt: Date | null;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SaveIndicator status={status} />
      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-500">
        {lastSavedAt ? `Saved ${lastSavedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : "Preview reflects draft updates"}
      </span>
    </div>
  );
}

function BlockSpecificFields({
  block,
  formulas,
  glossaryTerms,
  materials,
  quizzes,
  onChange,
}: {
  block: LessonBlock;
  formulas: FormulaLibraryItem[];
  glossaryTerms: GlossaryLibraryItem[];
  materials: MaterialLibraryItem[];
  quizzes: QuizLibraryItem[];
  onChange: (block: LessonBlock) => void;
}) {
  switch (block.type) {
    case "richText":
      return <RichTextBlockField block={block} onChange={onChange} />;
    case "audio":
      return (
        <div className="space-y-3">
          <TextField label="Audio URL" value={block.audioUrl} onChange={(value) => onChange({ ...block, audioUrl: value })} placeholder="https://..." />
          <TextField label="Description" value={block.description ?? ""} onChange={(value) => onChange({ ...block, description: value })} placeholder="Explain what learners should listen for." />
          <TextAreaField label="Transcript" value={block.transcript} onChange={(value) => onChange({ ...block, transcript: value })} placeholder="Paste the transcript here." rows={6} />
        </div>
      );
    case "video":
      return (
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <TextField label="Mux playback ID" value={block.playbackId ?? ""} onChange={(value) => onChange({ ...block, playbackId: value })} placeholder="Optional if using external URL" />
            <TextField label="External video URL" value={block.videoUrl ?? ""} onChange={(value) => onChange({ ...block, videoUrl: value })} placeholder="https://youtube.com/..." />
          </div>
          <TextField label="Description" value={block.description ?? ""} onChange={(value) => onChange({ ...block, description: value })} placeholder="Explain how this video supports the lesson." />
          <TextAreaField label="Transcript" value={block.transcript} onChange={(value) => onChange({ ...block, transcript: value })} placeholder="Paste the transcript here." rows={6} />
        </div>
      );
    case "transcript":
      return <TextAreaField label="Transcript text" value={block.transcript} onChange={(value) => onChange({ ...block, transcript: value })} placeholder="Paste the transcript here." rows={8} />;
    case "image":
      return (
        <div className="space-y-3">
          <TextField label="Image URL" value={block.imageUrl} onChange={(value) => onChange({ ...block, imageUrl: value })} placeholder="https://..." />
          <TextField label="Alt text" value={block.altText} onChange={(value) => onChange({ ...block, altText: value })} placeholder="Describe the visual for learners using assistive tech." />
          <TextField label="Caption" value={block.caption ?? ""} onChange={(value) => onChange({ ...block, caption: value })} placeholder="Optional caption or source note." />
        </div>
      );
    case "document":
      return (
        <div className="space-y-3">
          <TextField label="Document URL" value={block.url} onChange={(value) => onChange({ ...block, url: value })} placeholder="https://..." />
          <TextAreaField label="Description" value={block.description ?? ""} onChange={(value) => onChange({ ...block, description: value })} placeholder="Tell students why this document matters." rows={4} />
        </div>
      );
    case "sourceReference":
      return (
        <div className="space-y-3">
          <div>
            <FieldLabel>Source library material</FieldLabel>
            <div className="mt-2">
              <MaterialPickerField
                materials={materials}
                value={block.materialId ?? ""}
                onChange={(id, title) => onChange({ ...block, materialId: id, title: title || block.title })}
              />
            </div>
          </div>
          {block.materialId && materials.find((m) => m.id === block.materialId)?.previewSnippet && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Material preview</p>
              <p className="text-xs leading-5 text-slate-600 line-clamp-3">
                {materials.find((m) => m.id === block.materialId)?.previewSnippet}
              </p>
            </div>
          )}
          <TextField label="Citation label" value={block.referenceLabel ?? ""} onChange={(value) => onChange({ ...block, referenceLabel: value })} placeholder="e.g. Source excerpt, Section 3.1" />
          <TextAreaField label="Excerpt" value={block.excerpt ?? ""} onChange={(value) => onChange({ ...block, excerpt: value })} placeholder="Quote or summarize the supporting source." rows={4} />
          <TextField label="Source URL" value={block.sourceUrl ?? ""} onChange={(value) => onChange({ ...block, sourceUrl: value })} placeholder="Optional link to the source." />
        </div>
      );
    case "formula":
      return (
        <div className="space-y-3">
          <div>
            <FieldLabel>Import from Formula Compass</FieldLabel>
            <select
              className="admin-input mt-2"
              value={block.formula.id ?? ""}
              onChange={(event) => {
                const formula = formulas.find((entry) => entry.id === event.target.value);
                if (!formula) return;
                onChange({
                  ...block,
                  formula: {
                    ...block.formula,
                    id: formula.id,
                    code: formula.code,
                    name: formula.name,
                    expression: formula.expression,
                    notes: formula.notes ?? "",
                  },
                });
              }}
            >
              <option value="">Select a formula…</option>
              {formulas.map((formula) => (
                <option key={formula.id} value={formula.id}>{formula.code} · {formula.name}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <TextField label="Formula code" value={block.formula.code} onChange={(value) => onChange({ ...block, formula: { ...block.formula, code: value } })} placeholder="e.g. COD" />
            <TextField label="Formula name" value={block.formula.name} onChange={(value) => onChange({ ...block, formula: { ...block.formula, name: value } })} placeholder="Coefficient of Dispersion" />
          </div>
          <TextAreaField label="Expression" value={block.formula.expression} onChange={(value) => onChange({ ...block, formula: { ...block.formula, expression: value } })} placeholder="Enter the formula expression." rows={3} />
          <TextAreaField label="Plain-language explanation" value={block.formula.notes ?? ""} onChange={(value) => onChange({ ...block, formula: { ...block.formula, notes: value } })} placeholder="Explain what the formula means." rows={3} />
          <TextAreaField label="Worked example" value={block.formula.workedExample ?? ""} onChange={(value) => onChange({ ...block, formula: { ...block.formula, workedExample: value } })} placeholder="Walk through the formula step by step." rows={4} />
        </div>
      );
    case "glossaryTermSet":
      return (
        <div className="space-y-4">
          <div>
            <FieldLabel>Display mode</FieldLabel>
            <select
              className="admin-input mt-2"
              value={block.displayMode}
              onChange={(event) => onChange({ ...block, displayMode: event.target.value === "inline" ? "inline" : "cards" })}
            >
              <option value="cards">Vocabulary cards</option>
              <option value="inline">Inline glossary chips</option>
            </select>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Import terms from glossary</p>
            <div className="mt-3 max-h-52 space-y-2 overflow-y-auto">
              {glossaryTerms.map((term) => {
                const checked = block.terms.some((entry) => entry.id === term.id);
                return (
                  <label key={term.id} className="flex items-start gap-3 rounded-lg border border-slate-100 px-3 py-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => {
                        if (event.target.checked) {
                          onChange({
                            ...block,
                            terms: [
                              ...block.terms,
                              {
                                id: term.id,
                                term: term.term,
                                definition: term.definition,
                                example: term.example ?? "",
                              },
                            ],
                          });
                        } else {
                          onChange({
                            ...block,
                            terms: block.terms.filter((entry) => entry.id !== term.id),
                          });
                        }
                      }}
                    />
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">{term.term}</span>
                      <span className="block text-xs leading-5 text-slate-500">{term.definition}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      );
    case "quizCheckpoint":
      return (
        <div className="space-y-3">
          <div>
            <FieldLabel>Linked quiz</FieldLabel>
            <select
              className="admin-input mt-2"
              value={block.quizId ?? ""}
              onChange={(event) => {
                const quiz = quizzes.find((entry) => entry.id === event.target.value);
                onChange({
                  ...block,
                  quizId: event.target.value,
                  titleText: quiz?.title ?? block.titleText,
                  timeLimitSeconds: quiz?.timeLimitSeconds ?? null,
                  shuffleQuestions: quiz?.shuffleQuestions ?? false,
                  shuffleChoices: quiz?.shuffleChoices ?? false,
                });
              }}
            >
              <option value="">Select a quiz…</option>
              {quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
              ))}
            </select>
          </div>
          <TextAreaField label="Description" value={block.description ?? ""} onChange={(value) => onChange({ ...block, description: value })} placeholder="Tell students how to use this checkpoint." rows={3} />
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => onChange({ ...block, glossaryEnabled: !block.glossaryEnabled })}
              className={`relative h-5 w-9 rounded-full transition-colors ${block.glossaryEnabled ? "bg-emerald-500" : "bg-slate-200"}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${block.glossaryEnabled ? "translate-x-4" : ""}`} />
            </button>
            <div>
              <p className="text-xs font-semibold text-slate-700">Enable glossary hints</p>
              <p className="text-[11px] text-slate-400">Students can hover over terms to see definitions during this quiz.</p>
            </div>
          </div>
        </div>
      );
    case "reflectionPrompt":
      return (
        <div className="space-y-3">
          <TextAreaField label="Prompt" value={block.prompt} onChange={(value) => onChange({ ...block, prompt: value })} placeholder="Ask learners to reflect or self-check." rows={3} />
          <TextAreaField label="Guidance" value={block.guidance ?? ""} onChange={(value) => onChange({ ...block, guidance: value })} placeholder="Optional answer guidance or framing." rows={3} />
        </div>
      );
    case "download":
      return (
        <div className="space-y-3">
          <TextField label="Download URL" value={block.url} onChange={(value) => onChange({ ...block, url: value })} placeholder="https://..." />
          <TextAreaField label="Description" value={block.description ?? ""} onChange={(value) => onChange({ ...block, description: value })} placeholder="Explain what students should download." rows={3} />
        </div>
      );
    case "externalResource":
      return (
        <div className="space-y-3">
          <TextField label="Resource URL" value={block.url} onChange={(value) => onChange({ ...block, url: value })} placeholder="https://..." />
          <TextAreaField label="Description" value={block.description ?? ""} onChange={(value) => onChange({ ...block, description: value })} placeholder="Explain why this off-platform resource matters." rows={3} />
        </div>
      );
    case "callout":
      return (
        <div className="space-y-3">
          <div>
            <FieldLabel>Tone</FieldLabel>
            <select
              className="admin-input mt-2"
              value={block.tone}
              onChange={(event) => onChange({ ...block, tone: event.target.value as "info" | "warning" | "success" })}
            >
              <option value="info">Exam tip</option>
              <option value="warning">Watch out</option>
              <option value="success">Key takeaway</option>
            </select>
          </div>
          <TextAreaField label="Callout text" value={block.body} onChange={(value) => onChange({ ...block, body: value })} placeholder="Add a focused note for learners." rows={4} />
        </div>
      );
  }
}

function RichTextBlockField({
  block,
  onChange,
}: {
  block: Extract<LessonBlock, { type: "richText" }>;
  onChange: (block: LessonBlock) => void;
}) {
  return (
    <div className="space-y-3">
      <FieldLabel>Lesson text</FieldLabel>
      <RichTextComposer
        key={block.id}
        value={block.content}
        onChange={(content) => onChange({ ...block, content })}
      />
    </div>
  );
}

function RichTextComposer({
  value,
  onChange,
}: {
  value: string;
  onChange: (content: string) => void;
}) {
  // Keep onChange in a ref so useEditor's onUpdate closure never changes between renders.
  // This prevents TipTap's EditorInstanceManager from detecting a config change and
  // calling refreshEditorInstance → setEditor → infinite re-render loop (React 19 + TipTap).
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useEditor({
    extensions: RICH_TEXT_EXTENSIONS,
    content: (() => {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    })(),
    immediatelyRender: false,
    onUpdate({ editor: activeEditor }) {
      // Always calls the latest onChange without the closure capturing a stale reference
      onChangeRef.current(JSON.stringify(activeEditor.getJSON()));
    },
    editorProps: RICH_TEXT_EDITOR_PROPS,
  });

  useEffect(() => {
    if (!editor) return;
    const current = JSON.stringify(editor.getJSON());
    if (current === value) return;
    try {
      editor.commands.setContent(JSON.parse(value), false);
    } catch {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-slate-50/70 px-3 py-2">
        <EditorButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>B</EditorButton>
        <EditorButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>I</EditorButton>
        <EditorButton active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</EditorButton>
        <EditorButton active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</EditorButton>
        <EditorButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><Icons.List size={12} /></EditorButton>
        <EditorButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><Icons.ListOrdered size={12} /></EditorButton>
        <EditorButton active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Icons.Quote size={12} /></EditorButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function EditorButton({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-7 min-w-7 items-center justify-center rounded px-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-200",
        active && "bg-slate-200 text-slate-900"
      )}
    >
      {children}
    </button>
  );
}

function ToggleRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={onToggle}
          className={cn("relative h-6 w-11 rounded-full transition-colors", checked ? "bg-emerald-500" : "bg-slate-200")}
        >
          <span className={cn("absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform", checked && "translate-x-5")} />
        </button>
        <span className="text-sm text-slate-600">{checked ? "On" : "Off"}</span>
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input className="admin-input mt-2" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <textarea
        className="admin-input mt-2 min-h-[96px]"
        rows={rows ?? 4}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500">{children}</label>;
}

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "saved") return <span className="text-[11px] font-bold text-emerald-600">Saved</span>;
  if (status === "saving") return <span className="text-[11px] font-bold text-slate-400">Saving…</span>;
  if (status === "unsaved") return <span className="text-[11px] font-bold text-amber-500">Unsaved changes</span>;
  return <span className="text-[11px] font-bold text-red-500">Save failed</span>;
}

function getFilteredMaterialsForBlock(
  materials: MaterialLibraryItem[],
  blockType: LessonBlockType,
  selectedId?: string
): MaterialLibraryItem[] {
  const filtered = (() => {
    switch (blockType) {
      case "audio":
        return materials.filter((m) => m.kind === "audio");
      case "video":
        return materials.filter((m) => m.kind === "video");
      case "image":
        return materials.filter((m) => m.kind === "image");
      case "document":
      case "download":
        return materials.filter((m) => m.kind === "document");
      case "richText":
      case "transcript":
        return materials.filter((m) => m.kind === "document" || m.hasExtractedText);
      default:
        return materials;
    }
  })();

  if (selectedId && !filtered.some((m) => m.id === selectedId)) {
    const selectedMaterial = materials.find((m) => m.id === selectedId);
    if (selectedMaterial) {
      return [selectedMaterial, ...filtered];
    }
  }

  return filtered;
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import {
  type LessonBlock,
  type LessonGlossaryTermSnapshot,
  type StructuredLessonDocument,
  parseStructuredLessonContent,
} from "@/lib/lessons/structured-content";
import { RichTextRenderer } from "@/components/lessons/RichTextRenderer";
import type { GlossaryTermData } from "@/components/lessons/GlossaryTooltip";
import { LessonMuxPlayer } from "@/components/platform/LessonMuxPlayer";
import { LessonExternalVideo } from "@/components/platform/LessonExternalVideo";
import { parseVideoUrl } from "@/lib/video-url";
import { StartQuizButton } from "@/components/quiz/StartQuizButton";
import { LessonMarkComplete } from "@/components/platform/LessonMarkComplete";
import { getIdToken } from "@/lib/firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

const lessonStudyLoop = [
  { label: "Learn", detail: "Read the concept and rule.", icon: Icons.BookOpen },
  { label: "Apply", detail: "Work through examples.", icon: Icons.Calculator },
  { label: "Review", detail: "Save anything to revisit.", icon: Icons.FileCheck },
  { label: "Measure", detail: "Complete the checkpoint.", icon: Icons.BarChart3 },
];

export function StructuredLessonExperience({
  lessonId,
  lessonTitle,
  contentJson,
  fallbackDurationSeconds,
  previewMode = false,
  nextLesson,
  glossaryTerms,
}: {
  lessonId: string;
  lessonTitle: string;
  contentJson: string | null;
  fallbackDurationSeconds?: number | null;
  previewMode?: boolean;
  nextLesson?: { title: string; href: string } | null;
  glossaryTerms?: GlossaryTermData[];
}) {
  const [token, setToken] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const t = await user.getIdToken();
          setToken(t);
        } catch {
          setToken(null);
        }
      } else {
        setToken(null);
      }
      setAuthInitialized(true);
    });
  }, []);

  const document = useMemo(() => parseStructuredLessonContent(contentJson), [contentJson]);
  const visibleBlocks = useMemo(
    () => document.blocks.filter((block) => block.isStudentVisible),
    [document.blocks]
  );
  const [activeBlockId, setActiveBlockId] = useState<string | null>(visibleBlocks[0]?.id ?? null);
  const [visitedBlockIds, setVisitedBlockIds] = useState<Set<string>>(new Set(visibleBlocks[0] ? [visibleBlocks[0].id] : []));
  const [bookmarkedBlockIds, setBookmarkedBlockIds] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState("");
  const [noteId, setNoteId] = useState<string | null>(null);
  const blockRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (previewMode || typeof window === "undefined") return;
    const saved = window.localStorage.getItem(`lesson-bookmarks:${lessonId}`);
    if (!saved) return;
    try {
      const ids = JSON.parse(saved) as string[];
      setBookmarkedBlockIds(new Set(ids));
    } catch {}
  }, [lessonId, previewMode]);

  useEffect(() => {
    if (previewMode || typeof window === "undefined") return;
    window.localStorage.setItem(`lesson-bookmarks:${lessonId}`, JSON.stringify([...bookmarkedBlockIds]));
  }, [bookmarkedBlockIds, lessonId, previewMode]);

  // Load note: prefer server, fall back to localStorage
  useEffect(() => {
    if (previewMode || typeof window === "undefined" || !authInitialized) return;
    const localFallback = window.localStorage.getItem(`lesson-notes:${lessonId}`) ?? "";

    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    fetch(`/api/lessons/notes?lessonId=${lessonId}`, { headers })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { note: { id: string; content: string } | null } | null) => {
        if (data?.note) {
          setNoteId(data.note.id);
          setNotes(data.note.content);
          window.localStorage.setItem(`lesson-notes:${lessonId}`, data.note.content);
        } else if (localFallback) {
          setNotes(localFallback);
        }
      })
      .catch(() => {
        if (localFallback) setNotes(localFallback);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, previewMode, authInitialized, token]);

  // Persist note: localStorage immediately, server debounced
  useEffect(() => {
    if (previewMode || typeof window === "undefined") return;
    window.localStorage.setItem(`lesson-notes:${lessonId}`, notes);
    if (!notes.trim()) return;
    const timer = setTimeout(async () => {
      try {
        const token = await getIdToken();
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        if (noteId) {
          await fetch(`/api/lessons/notes/${noteId}`, {
            method: "PUT",
            headers,
            body: JSON.stringify({ content: notes }),
          });
        } else {
          const res = await fetch("/api/lessons/notes", {
            method: "POST",
            headers,
            body: JSON.stringify({ lessonId, lessonTitle, content: notes }),
          });
          if (res.ok) {
            const data = await res.json();
            setNoteId(data.id);
          }
        }
      } catch {}
    }, 1000);
    return () => clearTimeout(timer);
  }, [lessonId, lessonTitle, noteId, notes, previewMode]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || visibleBlocks.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const nextActive = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (nextActive) {
          const blockId = nextActive.target.getAttribute("data-block-id");
          if (blockId) {
            setActiveBlockId(blockId);
            setVisitedBlockIds((prev) => {
              const next = new Set(prev);
              next.add(blockId);
              return next;
            });
          }
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.2, 0.5, 0.8] }
    );

    for (const block of visibleBlocks) {
      const element = blockRefs.current[block.id];
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [visibleBlocks]);

  const estimatedMinutes = document.estimatedDurationMinutes ?? (fallbackDurationSeconds ? Math.max(1, Math.round(fallbackDurationSeconds / 60)) : null);
  const completedPercent = visibleBlocks.length === 0 ? 0 : Math.round((visitedBlockIds.size / visibleBlocks.length) * 100);
  const activeIndex = Math.max(0, visibleBlocks.findIndex((block) => block.id === activeBlockId));
  const activeBlock = visibleBlocks[activeIndex] ?? null;
  const nextBlock = visibleBlocks[activeIndex + 1] ?? null;
  const completedCount = visitedBlockIds.size;
  const remainingCount = Math.max(visibleBlocks.length - completedCount, 0);
  const requiredCount = visibleBlocks.filter((block) => block.required).length;
  const firstActionLabel = nextBlock ? `Continue with ${titleForBlock(nextBlock)}` : "Wrap up this lesson";

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="blue">{previewMode ? "Student preview" : "Structured lesson"}</Pill>
            {estimatedMinutes != null && <Pill tone="slate">{estimatedMinutes} min</Pill>}
            <Pill tone="green">{completedPercent}% explored</Pill>
          </div>
          <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.02em] text-slate-950">{lessonTitle}</h2>
          {document.summary.trim() ? (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{document.summary}</p>
          ) : (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              {previewMode ? "Add a lesson summary to orient students before they begin." : "No lesson summary provided."}
            </p>
          )}
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <JourneyStat label="Current step" value={visibleBlocks.length ? `${activeIndex + 1} of ${visibleBlocks.length}` : "No steps"} />
            <JourneyStat label="Completed" value={`${completedCount} explored`} />
            <JourneyStat label="Remaining" value={`${remainingCount} left`} />
            <JourneyStat label="Do first" value={visibleBlocks[0] ? titleForBlock(visibleBlocks[0]) : "Add blocks"} />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {lessonStudyLoop.map((item, index) => (
              <div key={item.label} className="rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E6F1FB] text-[#185FA5]">
                    <item.icon size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#185FA5]">
                      Step {index + 1}
                    </p>
                    <p className="mt-0.5 text-sm font-extrabold text-slate-900">{item.label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {document.objectives.some((objective) => objective.trim()) && (
            <div className="mt-4 rounded-xl border border-[#d8e6f4] dark:border-slate-800 bg-[#f7fbff] dark:bg-slate-900 p-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#185FA5]">
                Learning objectives
              </p>
              <ul className="mt-2 space-y-2">
                {document.objectives
                  .filter((objective) => objective.trim())
                  .map((objective) => (
                    <li key={objective} className="flex items-start gap-2 text-sm text-slate-700">
                      <Icons.Check size={14} className="mt-0.5 text-[#185FA5]" />
                      <span>{objective}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        <div className="grid gap-6 px-5 py-5 xl:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
          <aside className="space-y-4">
            <div className="space-y-4 xl:sticky xl:top-5">
              <div className="rounded-xl border border-[#d8e6f4] dark:border-slate-800 bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_100%)] dark:bg-none dark:bg-slate-900 p-4">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#185FA5]">Next action</p>
                <p className="mt-2 text-sm font-bold text-slate-900">
                  {activeBlock ? `You’re in ${titleForBlock(activeBlock)}.` : "Start with the first learning block."}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  {nextBlock ? `After this, ${firstActionLabel.toLowerCase()}.` : "After this section, use the recap and completion action below."}
                </p>
                {nextBlock ? (
                  <button
                    type="button"
                    onClick={() => blockRefs.current[nextBlock.id]?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#185FA5] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0d3d6e]"
                  >
                    {firstActionLabel}
                    <Icons.ArrowRight size={15} />
                  </button>
                ) : nextLesson ? (
                  <a
                    href={nextLesson.href}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#185FA5] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0d3d6e]"
                  >
                    Next lesson
                    <Icons.ArrowRight size={15} />
                  </a>
                ) : null}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500">Lesson map</p>
                    <p className="mt-1 text-xs text-slate-500">{visibleBlocks.length} learning blocks · {requiredCount} required</p>
                  </div>
                  {!previewMode && bookmarkedBlockIds.size > 0 && (
                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-slate-500 shadow-sm">
                      {bookmarkedBlockIds.size} review later
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  {visibleBlocks.map((block, index) => {
                    const active = activeBlockId === block.id;
                    const bookmarked = bookmarkedBlockIds.has(block.id);
                    const visited = visitedBlockIds.has(block.id);
                    const Icon = iconForBlock(block);
                    return (
                      <button
                        key={block.id}
                        type="button"
                        onClick={() => blockRefs.current[block.id]?.scrollIntoView({ behavior: "smooth", block: "start" })}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition-colors",
                          active ? "border-[#185FA5] bg-[#E6F1FB]" : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className={cn("mt-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em]", active ? "text-[#185FA5]" : "text-slate-400")}>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full border",
                            active ? "border-[#185FA5] bg-white text-[#185FA5]" : visited ? "border-emerald-200 bg-emerald-50 text-emerald-600" : "border-slate-200 bg-slate-50 text-slate-400"
                          )}>
                            {visited ? <Icons.Check size={12} /> : <Icon size={12} />}
                          </span>
                        </div>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-bold text-slate-800">{block.title || titleForBlock(block)}</span>
                          <span className="mt-1 block text-[11px] text-slate-500">
                            {labelForBlock(block)} {block.required ? "· Required" : "· Optional"}
                          </span>
                        </span>
                        {bookmarked && <Icons.BookOpen size={13} className="text-[#185FA5]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {!previewMode && (
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500">Lesson notes</p>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={5}
                    placeholder="Capture takeaways, questions, or formulas to review later."
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none focus:border-[#185FA5] focus:bg-white"
                  />
                </div>
              )}
            </div>
          </aside>

          <div className="space-y-4">
            {visibleBlocks.map((block, index) => (
              <section
                key={block.id}
                id={`lesson-block-${block.id}`}
                data-block-id={block.id}
                ref={(element) => {
                  blockRefs.current[block.id] = element;
                }}
                className="scroll-mt-24"
              >
                <LessonBlockCard
                  block={block}
                  lessonId={lessonId}
                  previewMode={previewMode}
                  glossaryTerms={glossaryTerms}
                  bookmarked={bookmarkedBlockIds.has(block.id)}
                  token={token}
                  stepLabel={`${index + 1} of ${visibleBlocks.length}`}
                  nextLabel={visibleBlocks[index + 1] ? titleForBlock(visibleBlocks[index + 1]) : null}
                  onContinue={
                    visibleBlocks[index + 1]
                      ? () => blockRefs.current[visibleBlocks[index + 1].id]?.scrollIntoView({ behavior: "smooth", block: "start" })
                      : null
                  }
                  onToggleBookmark={() =>
                    setBookmarkedBlockIds((prev) => {
                      const next = new Set(prev);
                      if (next.has(block.id)) next.delete(block.id);
                      else next.add(block.id);
                      return next;
                    })
                  }
                />
              </section>
            ))}

            <LessonRecapCard
              objectives={document.objectives.filter((objective) => objective.trim())}
              completedPercent={completedPercent}
              nextLesson={nextLesson}
              previewMode={previewMode}
            />

            {!previewMode && <LessonMarkComplete lessonId={lessonId} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function LessonBlockCard({
  block,
  lessonId,
  previewMode,
  glossaryTerms,
  bookmarked,
  stepLabel,
  nextLabel,
  onContinue,
  onToggleBookmark,
  token,
}: {
  block: LessonBlock;
  lessonId: string;
  previewMode: boolean;
  glossaryTerms?: GlossaryTermData[];
  bookmarked: boolean;
  stepLabel: string;
  nextLabel: string | null;
  onContinue: (() => void) | null;
  onToggleBookmark: () => void;
  token: string | null;
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}${window.location.pathname}#lesson-block-${block.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#185FA5]">{labelForBlock(block)}</p>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">{stepLabel}</span>
            <span className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em]",
              block.required ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"
            )}>
              {block.required ? "Required" : "Optional"}
            </span>
          </div>
          <h3 className="mt-1 text-lg font-extrabold text-slate-950">{block.title || titleForBlock(block)}</h3>
        </div>
        <div className="flex items-center gap-2">
          {!previewMode && (
            <button
              type="button"
              onClick={onToggleBookmark}
              className={cn(
                "rounded-lg border px-2.5 py-1.5 text-[11px] font-bold transition-colors",
                bookmarked ? "border-[#185FA5] bg-[#E6F1FB] text-[#185FA5]" : "border-slate-200 text-slate-500 hover:border-[#185FA5] hover:text-[#185FA5]"
              )}
            >
              {bookmarked ? "Saved for review" : "Review later"}
            </button>
          )}
          <button
            type="button"
            onClick={copyLink}
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-500 transition-colors hover:border-[#185FA5] hover:text-[#185FA5]"
          >
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-6">
        <LessonBlockRenderer block={block} lessonId={lessonId} previewMode={previewMode} glossaryTerms={glossaryTerms} token={token} />
        {onContinue && (
          <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onContinue}
              className="inline-flex items-center gap-2 rounded-lg border border-[#185FA5] bg-white px-4 py-2 text-sm font-bold text-[#185FA5] transition hover:bg-[#E6F1FB]"
            >
              Continue to {nextLabel}
              <Icons.ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function LessonBlockRenderer({
  block,
  lessonId,
  previewMode,
  glossaryTerms,
  token,
}: {
  block: LessonBlock;
  lessonId: string;
  previewMode: boolean;
  glossaryTerms?: GlossaryTermData[];
  token: string | null;
}) {
  switch (block.type) {
    case "richText":
      return <RichTextRenderer content={block.content} glossaryTerms={glossaryTerms} />;
    case "audio": {
      const resolvedAudioUrl = getAssetUrl(block.audioUrl, block.materialId, token, true);
      return (
        <div className="space-y-4">
          {block.description && <p className="text-sm text-slate-600">{block.description}</p>}
          {resolvedAudioUrl ? (
            <audio controls preload="metadata" src={resolvedAudioUrl} className="w-full" />
          ) : (
            <EmptyBlockMessage message="Add an audio URL or link a source material to render this explanation." />
          )}
          <TranscriptPanel transcript={block.transcript} />
        </div>
      );
    }
    case "video": {
      const resolvedPlaybackId = block.playbackId || null;
      const resolvedVideoUrl = getAssetUrl(block.videoUrl, block.materialId, token);
      if (!resolvedPlaybackId?.trim() && !resolvedVideoUrl?.trim()) {
        return <EmptyBlockMessage message="Add a Mux playback ID, external video URL, or link a source material to render this lesson." />;
      }
      return (
        <div className="space-y-4">
          {block.description && <p className="text-sm text-slate-600">{block.description}</p>}
          {previewMode ? (
            <PreviewVideo playbackId={resolvedPlaybackId} videoUrl={resolvedVideoUrl} />
          ) : resolvedPlaybackId?.trim() ? (
            <LessonMuxPlayer lessonId={lessonId} playbackId={resolvedPlaybackId} title={block.title} />
          ) : (
            <ExternalVideoFromUrl lessonId={lessonId} videoUrl={resolvedVideoUrl || ""} title={block.title} />
          )}
          <TranscriptPanel transcript={block.transcript} />
        </div>
      );
    }
    case "transcript":
      return <TranscriptPanel transcript={block.transcript} />;
    case "image": {
      const resolvedImageUrl = getAssetUrl(block.imageUrl, block.materialId, token);
      return resolvedImageUrl ? (
        <figure className="space-y-3">
          <img src={resolvedImageUrl} alt={block.altText || block.title || "Visual content"} className="w-full rounded-xl border border-slate-200 object-cover" />
          {(block.caption || block.altText) && <figcaption className="text-xs leading-5 text-slate-500">{block.caption || block.altText}</figcaption>}
        </figure>
      ) : (
        <EmptyBlockMessage message="Add an image URL or link a source material to render this visual." />
      );
    }
    case "document": {
      const resolvedDocUrl = getAssetUrl(block.url, block.materialId, token);
      return <LinkCard title={block.title || "Reference document"} description={block.description} url={resolvedDocUrl} icon={<Icons.FileText size={18} className="text-[#185FA5]" />} cta="Open document" />;
    }
    case "sourceReference":
      return (
        <div className="rounded-xl border border-[#d8e6f4] dark:border-slate-800 bg-[#f7fbff] dark:bg-slate-900 p-4">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#185FA5]">
            {block.referenceLabel?.trim() || "Source reference"}
          </p>
          {block.title && <p className="mt-2 text-sm font-bold text-slate-900">{block.title}</p>}
          {block.excerpt && <p className="mt-2 text-sm leading-6 text-slate-600">{block.excerpt}</p>}
          {block.sourceUrl && (
            <a
              href={block.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#185FA5] hover:underline"
            >
              <Icons.ExternalLink size={14} />
              Open source
            </a>
          )}
        </div>
      );
    case "formula":
      return (
        <div className="rounded-xl border border-[#d8d5fb] dark:border-slate-800 bg-[#f8f7ff] dark:bg-slate-900 p-4">
          <div className="flex items-start gap-3">
            <Icons.Calculator size={18} className="mt-0.5 text-[#534AB7]" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#534AB7]">
                {block.formula.code || "Formula focus"}
              </p>
              <p className="mt-1 text-lg font-extrabold text-slate-950">{block.formula.name || "Untitled formula"}</p>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm">
                {block.formula.expression || "Add a formula expression."}
              </pre>
              {block.formula.notes && <p className="mt-3 text-sm leading-6 text-slate-600">{block.formula.notes}</p>}
              {block.formula.workedExample && (
                <div className="mt-4 rounded-lg border border-white/80 bg-white px-4 py-3">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#534AB7]">Worked example</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{block.formula.workedExample}</p>
                </div>
              )}
              {block.formula.relatedTerms && block.formula.relatedTerms.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {block.formula.relatedTerms.map((term) => (
                    <span key={term} className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#534AB7] shadow-sm">
                      {term}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    case "glossaryTermSet":
      return <GlossaryBlock terms={block.terms} displayMode={block.displayMode} />;
    case "quizCheckpoint":
      return (
        <div className="space-y-4 rounded-xl border border-[#d8e6f4] dark:border-slate-800 bg-[#f7fbff] dark:bg-slate-900 p-4">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#185FA5]">Checkpoint</p>
            <p className="mt-1 text-sm font-bold text-slate-900">Check your understanding before moving on.</p>
          </div>
          {block.description && <p className="text-sm text-slate-600">{block.description}</p>}
          <div className="grid gap-3 sm:grid-cols-3">
            <MiniStat label="Time limit" value={block.timeLimitSeconds ? `${Math.round(block.timeLimitSeconds / 60)} min` : "Untimed"} />
            <MiniStat label="Question order" value={block.shuffleQuestions ? "Shuffled" : "Fixed"} />
            <MiniStat label="Choice order" value={block.shuffleChoices ? "Shuffled" : "Fixed"} />
          </div>
          {previewMode ? (
            <button
              type="button"
              disabled
              className="w-full rounded-lg bg-[#185FA5] px-5 py-3 text-sm font-bold text-white opacity-50"
            >
              Preview only
            </button>
          ) : block.quizId ? (
            <StartQuizButton
              quizId={block.quizId}
              timeLimitSeconds={block.timeLimitSeconds ?? null}
              shuffleQuestions={Boolean(block.shuffleQuestions)}
              shuffleChoices={Boolean(block.shuffleChoices)}
              glossaryEnabled={Boolean(block.glossaryEnabled)}
            />
          ) : (
            <EmptyBlockMessage message="Link a quiz to activate this checkpoint." />
          )}
        </div>
      );
    case "reflectionPrompt":
      return (
        <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-4">
          <p className="text-sm font-bold text-amber-900 dark:text-amber-200">{block.prompt || "Add a reflection prompt."}</p>
          {block.guidance && <p className="mt-2 text-sm leading-6 text-amber-800 dark:text-amber-300">{block.guidance}</p>}
        </div>
      );
    case "download": {
      const resolvedDownloadUrl = getAssetUrl(block.url, block.materialId, token);
      return <LinkCard title={block.title || "Downloadable resource"} description={block.description} url={resolvedDownloadUrl} icon={<Icons.Upload size={18} className="text-[#185FA5]" />} cta="Download resource" />;
    }
    case "externalResource": {
      const resolvedExternalUrl = getAssetUrl(block.url, block.materialId, token);
      return <LinkCard title={block.title || "External resource"} description={block.description} url={resolvedExternalUrl} icon={<Icons.Link2 size={18} className="text-[#185FA5]" />} cta="Open resource" />;
    }
    case "callout":
      return (
        <div
          className={cn(
            "rounded-xl border p-4",
            block.tone === "warning" && "border-amber-200 bg-amber-50",
            block.tone === "success" && "border-emerald-200 bg-emerald-50",
            block.tone === "info" && "border-sky-200 bg-sky-50"
          )}
        >
          <p className="text-sm leading-6 text-slate-700">{block.body || "Add a teacher callout."}</p>
        </div>
      );
  }
}

function getAssetUrl(
  url: string | undefined | null,
  materialId: string | undefined | null,
  token: string | null,
  streamInline = false
): string {
  const rawUrl = url || (materialId ? `/api/admin/materials/${materialId}/asset` : "");
  if (!rawUrl || !rawUrl.startsWith("/api/")) return rawUrl;

  let resolvedUrl = rawUrl;
  if (streamInline && rawUrl.includes("/api/admin/materials/") && rawUrl.includes("/asset")) {
    resolvedUrl = `${resolvedUrl}${resolvedUrl.includes("?") ? "&" : "?"}stream=1`;
  }
  return token
    ? `${resolvedUrl}${resolvedUrl.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}`
    : resolvedUrl;
}

function LinkCard({
  title,
  description,
  url,
  icon,
  cta,
}: {
  title: string;
  description?: string;
  url: string;
  icon: React.ReactNode;
  cta: string;
}) {
  if (!url.trim()) {
    return <EmptyBlockMessage message="Add a URL to activate this resource." />;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E6F1FB]">{icon}</div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900">{title}</p>
          {description && <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>}
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#185FA5] hover:underline"
          >
            <Icons.ExternalLink size={14} />
            {cta}
          </a>
        </div>
      </div>
    </div>
  );
}

function JourneyStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function LessonRecapCard({
  objectives,
  completedPercent,
  nextLesson,
  previewMode,
}: {
  objectives: string[];
  completedPercent: number;
  nextLesson?: { title: string; href: string } | null;
  previewMode: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] dark:bg-none dark:bg-slate-900 p-5 shadow-sm">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#185FA5]">Lesson recap</p>
      <h3 className="mt-2 text-lg font-extrabold text-slate-950">Pause and lock in the main ideas.</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        You’ve explored {completedPercent}% of this lesson. Before you mark it complete, revisit the objectives below and check that you can explain each one in your own words.
      </p>
      {objectives.length > 0 && (
        <ul className="mt-4 space-y-2">
          {objectives.map((objective) => (
            <li key={objective} className="flex items-start gap-2 text-sm text-slate-700">
              <Icons.Check size={14} className="mt-0.5 text-[#185FA5]" />
              <span>{objective}</span>
            </li>
          ))}
        </ul>
      )}
      {!previewMode && nextLesson && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-slate-400">Recommended next</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{nextLesson.title}</p>
          </div>
          <a
            href={nextLesson.href}
            className="inline-flex items-center gap-2 rounded-lg bg-[#185FA5] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#0d3d6e]"
          >
            Start next lesson
            <Icons.ArrowRight size={15} />
          </a>
        </div>
      )}
    </div>
  );
}

function GlossaryBlock({
  terms,
  displayMode,
}: {
  terms: LessonGlossaryTermSnapshot[];
  displayMode: "inline" | "cards";
}) {
  const [expandedTermId, setExpandedTermId] = useState<string | null>(terms[0]?.id ?? terms[0]?.term ?? null);

  if (terms.length === 0) {
    return <EmptyBlockMessage message="Add glossary terms to support vocabulary learning." />;
  }

  if (displayMode === "inline") {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap gap-2">
          {terms.map((term) => {
            const id = term.id ?? term.term;
            const active = expandedTermId === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setExpandedTermId(active ? null : id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-bold transition-colors",
                  active ? "border-[#185FA5] bg-[#E6F1FB] text-[#185FA5]" : "border-slate-200 bg-white text-slate-600"
                )}
              >
                {term.term}
              </button>
            );
          })}
        </div>
        {terms.map((term) => {
          const id = term.id ?? term.term;
          if (expandedTermId !== id) return null;
          return (
            <div key={id} className="mt-4 rounded-lg border border-white bg-white px-4 py-3">
              <p className="text-sm font-bold text-slate-900">{term.term}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{term.definition}</p>
              {term.example && <p className="mt-2 text-xs italic text-slate-500">Example: {term.example}</p>}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {terms.map((term) => (
        <div key={term.id ?? term.term} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-slate-900">{term.term}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{term.definition}</p>
          {term.example && <p className="mt-2 text-xs italic text-slate-500">Example: {term.example}</p>}
        </div>
      ))}
    </div>
  );
}

function ExternalVideoFromUrl({
  lessonId,
  videoUrl,
  title,
}: {
  lessonId: string;
  videoUrl: string;
  title?: string;
}) {
  if (videoUrl && (videoUrl.startsWith("/") || videoUrl.includes("materials") || videoUrl.endsWith(".mp4") || videoUrl.endsWith(".webm"))) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-950">
        <video controls src={videoUrl} className="h-full w-full object-contain" />
      </div>
    );
  }

  const meta = parseVideoUrl(videoUrl);
  if (!meta || !meta.embedUrl) {
    return <EmptyBlockMessage message="This external video URL could not be embedded." />;
  }

  return <LessonExternalVideo lessonId={lessonId} meta={meta} title={title} />;
}

function PreviewVideo({
  playbackId,
  videoUrl,
}: {
  playbackId: string | null;
  videoUrl: string | null;
}) {
  if (playbackId) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-950">
        <div className="absolute inset-0 flex items-center justify-center">
          <Icons.Video size={42} className="text-slate-600" />
        </div>
        <div className="absolute bottom-3 left-3 rounded bg-black/70 px-2 py-1 text-[10px] font-semibold text-white">
          Mux preview · {playbackId.slice(0, 12)}…
        </div>
      </div>
    );
  }

  if (videoUrl && (videoUrl.startsWith("/") || videoUrl.includes("materials") || videoUrl.endsWith(".mp4") || videoUrl.endsWith(".webm"))) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-950">
        <video controls src={videoUrl} className="h-full w-full object-contain" />
      </div>
    );
  }

  const meta = videoUrl ? parseVideoUrl(videoUrl) : null;
  if (!meta?.embedUrl) {
    return <EmptyBlockMessage message="Add a valid embeddable video URL." />;
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-950">
      <iframe src={meta.embedUrl} className="h-full w-full" allow="autoplay; fullscreen" allowFullScreen title="Video preview" />
    </div>
  );
}

function TranscriptPanel({ transcript }: { transcript: string }) {
  const [open, setOpen] = useState(Boolean(transcript));

  if (!transcript.trim()) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
        No transcript attached yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="text-sm font-bold text-slate-800">Transcript</span>
        {open ? <Icons.ChevronUp size={16} className="text-slate-500" /> : <Icons.ChevronDown size={16} className="text-slate-500" />}
      </button>
      {open && <div className="border-t border-slate-200 px-4 py-4 text-sm leading-6 text-slate-600 whitespace-pre-wrap">{transcript}</div>}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white bg-white px-3 py-3 shadow-sm">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function iconForBlock(block: LessonBlock) {
  switch (block.type) {
    case "richText":
      return Icons.FileText;
    case "audio":
      return Icons.FileText;
    case "video":
      return Icons.Video;
    case "transcript":
      return Icons.FileCode;
    case "image":
      return Icons.BookOpen;
    case "document":
      return Icons.FileText;
    case "sourceReference":
      return Icons.Database;
    case "formula":
      return Icons.Calculator;
    case "glossaryTermSet":
      return Icons.BookOpen;
    case "quizCheckpoint":
      return Icons.ClipboardList;
    case "reflectionPrompt":
      return Icons.Quote;
    case "download":
      return Icons.Upload;
    case "externalResource":
      return Icons.Link2;
    case "callout":
      return Icons.Info;
  }
}

function EmptyBlockMessage({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
      {message}
    </div>
  );
}

function Pill({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "blue" | "green" | "slate";
}) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em]",
        tone === "blue" && "bg-[#E6F1FB] text-[#185FA5]",
        tone === "green" && "bg-emerald-50 text-emerald-700",
        tone === "slate" && "bg-slate-100 text-slate-600"
      )}
    >
      {children}
    </span>
  );
}

function titleForBlock(block: LessonBlock) {
  return block.title?.trim() || labelForBlock(block);
}

function labelForBlock(block: LessonBlock) {
  switch (block.type) {
    case "richText":
      return "Reading";
    case "audio":
      return "Audio";
    case "video":
      return "Video";
    case "transcript":
      return "Transcript";
    case "image":
      return "Visual";
    case "document":
      return "Document";
    case "sourceReference":
      return "Citation";
    case "formula":
      return "Formula Compass";
    case "glossaryTermSet":
      return "Glossary";
    case "quizCheckpoint":
      return "Checkpoint";
    case "reflectionPrompt":
      return "Reflection";
    case "download":
      return "Download";
    case "externalResource":
      return "External resource";
    case "callout":
      return "Callout";
  }
}

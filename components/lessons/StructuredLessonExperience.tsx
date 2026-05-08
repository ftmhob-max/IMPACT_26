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
import { LessonMuxPlayer } from "@/components/platform/LessonMuxPlayer";
import { LessonExternalVideo } from "@/components/platform/LessonExternalVideo";
import { parseVideoUrl } from "@/lib/video-url";
import { StartQuizButton } from "@/components/quiz/StartQuizButton";
import { LessonMarkComplete } from "@/components/platform/LessonMarkComplete";

export function StructuredLessonExperience({
  lessonId,
  lessonTitle,
  contentJson,
  fallbackDurationSeconds,
  previewMode = false,
}: {
  lessonId: string;
  lessonTitle: string;
  contentJson: string | null;
  fallbackDurationSeconds?: number | null;
  previewMode?: boolean;
}) {
  const document = useMemo(() => parseStructuredLessonContent(contentJson), [contentJson]);
  const visibleBlocks = useMemo(
    () => document.blocks.filter((block) => block.isStudentVisible),
    [document.blocks]
  );
  const [activeBlockId, setActiveBlockId] = useState<string | null>(visibleBlocks[0]?.id ?? null);
  const [visitedBlockIds, setVisitedBlockIds] = useState<Set<string>>(new Set(visibleBlocks[0] ? [visibleBlocks[0].id] : []));
  const [bookmarkedBlockIds, setBookmarkedBlockIds] = useState<Set<string>>(new Set());
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
          {document.objectives.some((objective) => objective.trim()) && (
            <div className="mt-4 rounded-xl border border-[#d8e6f4] bg-[#f7fbff] p-4">
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

        <div className="grid gap-6 px-5 py-5 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-6">
          <aside className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 lg:sticky lg:top-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500">Lesson map</p>
                  <p className="mt-1 text-xs text-slate-500">{visibleBlocks.length} learning blocks</p>
                </div>
                {!previewMode && bookmarkedBlockIds.size > 0 && (
                  <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-slate-500 shadow-sm">
                    {bookmarkedBlockIds.size} saved
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-2">
                {visibleBlocks.map((block, index) => {
                  const active = activeBlockId === block.id;
                  const bookmarked = bookmarkedBlockIds.has(block.id);
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
                      <span className={cn("mt-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em]", active ? "text-[#185FA5]" : "text-slate-400")}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-bold text-slate-800">{block.title || titleForBlock(block)}</span>
                        <span className="mt-1 block text-[11px] text-slate-500">{labelForBlock(block)}</span>
                      </span>
                      {bookmarked && <Icons.BookOpen size={13} className="text-[#185FA5]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="space-y-4">
            {visibleBlocks.map((block) => (
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
                  bookmarked={bookmarkedBlockIds.has(block.id)}
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
  bookmarked,
  onToggleBookmark,
}: {
  block: LessonBlock;
  lessonId: string;
  previewMode: boolean;
  bookmarked: boolean;
  onToggleBookmark: () => void;
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
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#185FA5]">{labelForBlock(block)}</p>
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
              {bookmarked ? "Saved" : "Save"}
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
        <LessonBlockRenderer block={block} lessonId={lessonId} previewMode={previewMode} />
      </div>
    </div>
  );
}

function LessonBlockRenderer({
  block,
  lessonId,
  previewMode,
}: {
  block: LessonBlock;
  lessonId: string;
  previewMode: boolean;
}) {
  switch (block.type) {
    case "richText":
      return <RichTextRenderer content={block.content} />;
    case "audio":
      return (
        <div className="space-y-4">
          {block.description && <p className="text-sm text-slate-600">{block.description}</p>}
          {block.audioUrl ? (
            <audio controls preload="metadata" src={block.audioUrl} className="w-full" />
          ) : (
            <EmptyBlockMessage message="Add an audio URL to render this explanation." />
          )}
          <TranscriptPanel transcript={block.transcript} />
        </div>
      );
    case "video":
      if (!block.playbackId?.trim() && !block.videoUrl?.trim()) {
        return <EmptyBlockMessage message="Add a Mux playback ID or external video URL to render this lesson." />;
      }
      return (
        <div className="space-y-4">
          {block.description && <p className="text-sm text-slate-600">{block.description}</p>}
          {previewMode ? (
            <PreviewVideo playbackId={block.playbackId || null} videoUrl={block.videoUrl || null} />
          ) : block.playbackId?.trim() ? (
            <LessonMuxPlayer lessonId={lessonId} playbackId={block.playbackId} title={block.title} />
          ) : (
            <ExternalVideoFromUrl lessonId={lessonId} videoUrl={block.videoUrl || ""} title={block.title} />
          )}
          <TranscriptPanel transcript={block.transcript} />
        </div>
      );
    case "transcript":
      return <TranscriptPanel transcript={block.transcript} />;
    case "image":
      return block.imageUrl ? (
        <figure className="space-y-3">
          <img src={block.imageUrl} alt={block.altText} className="w-full rounded-xl border border-slate-200 object-cover" />
          {(block.caption || block.altText) && <figcaption className="text-xs leading-5 text-slate-500">{block.caption || block.altText}</figcaption>}
        </figure>
      ) : (
        <EmptyBlockMessage message="Add an image URL to render this visual." />
      );
    case "document":
      return <LinkCard title={block.title || "Reference document"} description={block.description} url={block.url} icon={<Icons.FileText size={18} className="text-[#185FA5]" />} cta="Open document" />;
    case "sourceReference":
      return (
        <div className="rounded-xl border border-[#d8e6f4] bg-[#f7fbff] p-4">
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
        <div className="rounded-xl border border-[#d8d5fb] bg-[#f8f7ff] p-4">
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
        <div className="space-y-4 rounded-xl border border-[#d8e6f4] bg-[#f7fbff] p-4">
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
            />
          ) : (
            <EmptyBlockMessage message="Link a quiz to activate this checkpoint." />
          )}
        </div>
      );
    case "reflectionPrompt":
      return (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-bold text-amber-900">{block.prompt || "Add a reflection prompt."}</p>
          {block.guidance && <p className="mt-2 text-sm leading-6 text-amber-800">{block.guidance}</p>}
        </div>
      );
    case "download":
      return <LinkCard title={block.title || "Downloadable resource"} description={block.description} url={block.url} icon={<Icons.Upload size={18} className="text-[#185FA5]" />} cta="Download resource" />;
    case "externalResource":
      return <LinkCard title={block.title || "External resource"} description={block.description} url={block.url} icon={<Icons.Link2 size={18} className="text-[#185FA5]" />} cta="Open resource" />;
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

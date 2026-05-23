export type LessonCompletionMode = "manual" | "all-blocks";

export type LessonBlockType =
  | "richText"
  | "audio"
  | "video"
  | "transcript"
  | "image"
  | "document"
  | "sourceReference"
  | "formula"
  | "glossaryTermSet"
  | "quizCheckpoint"
  | "reflectionPrompt"
  | "download"
  | "externalResource"
  | "callout";

export interface LessonBlockBase {
  id: string;
  type: LessonBlockType;
  title?: string;
  isStudentVisible: boolean;
  required: boolean;
  materialId?: string;
}

export interface LessonRichTextBlock extends LessonBlockBase {
  type: "richText";
  contentKind: "tiptap";
  content: string;
}

export interface LessonAudioBlock extends LessonBlockBase {
  type: "audio";
  audioUrl: string;
  transcript: string;
  description?: string;
}

export interface LessonVideoBlock extends LessonBlockBase {
  type: "video";
  playbackId?: string;
  videoUrl?: string;
  transcript: string;
  description?: string;
}

export interface LessonTranscriptBlock extends LessonBlockBase {
  type: "transcript";
  transcript: string;
}

export interface LessonImageBlock extends LessonBlockBase {
  type: "image";
  imageUrl: string;
  altText: string;
  caption?: string;
}

export interface LessonDocumentBlock extends LessonBlockBase {
  type: "document";
  url: string;
  description?: string;
}

export interface LessonSourceReferenceBlock extends LessonBlockBase {
  type: "sourceReference";
  materialId?: string;
  referenceLabel?: string;
  excerpt?: string;
  sourceUrl?: string;
}

export interface LessonFormulaSnapshot {
  id?: string;
  code: string;
  name: string;
  expression: string;
  notes?: string | null;
  workedExample?: string;
  relatedTerms?: string[];
}

export interface LessonFormulaBlock extends LessonBlockBase {
  type: "formula";
  formula: LessonFormulaSnapshot;
}

export interface LessonGlossaryTermSnapshot {
  id?: string;
  term: string;
  definition: string;
  example?: string | null;
}

export interface LessonGlossaryTermSetBlock extends LessonBlockBase {
  type: "glossaryTermSet";
  displayMode: "inline" | "cards";
  terms: LessonGlossaryTermSnapshot[];
}

export interface LessonQuizCheckpointBlock extends LessonBlockBase {
  type: "quizCheckpoint";
  quizId?: string;
  titleText?: string;
  description?: string;
  timeLimitSeconds?: number | null;
  shuffleQuestions?: boolean;
  shuffleChoices?: boolean;
  glossaryEnabled?: boolean;
}

export interface LessonReflectionPromptBlock extends LessonBlockBase {
  type: "reflectionPrompt";
  prompt: string;
  guidance?: string;
}

export interface LessonDownloadBlock extends LessonBlockBase {
  type: "download";
  url: string;
  description?: string;
}

export interface LessonExternalResourceBlock extends LessonBlockBase {
  type: "externalResource";
  url: string;
  description?: string;
}

export interface LessonCalloutBlock extends LessonBlockBase {
  type: "callout";
  tone: "info" | "warning" | "success";
  body: string;
}

export type LessonBlock =
  | LessonRichTextBlock
  | LessonAudioBlock
  | LessonVideoBlock
  | LessonTranscriptBlock
  | LessonImageBlock
  | LessonDocumentBlock
  | LessonSourceReferenceBlock
  | LessonFormulaBlock
  | LessonGlossaryTermSetBlock
  | LessonQuizCheckpointBlock
  | LessonReflectionPromptBlock
  | LessonDownloadBlock
  | LessonExternalResourceBlock
  | LessonCalloutBlock;

export interface StructuredLessonDocument {
  version: 2;
  kind: "structured-lesson";
  summary: string;
  objectives: string[];
  estimatedDurationMinutes: number | null;
  completionMode: LessonCompletionMode;
  blocks: LessonBlock[];
}

export type LessonReadinessSeverity = "required" | "recommended" | "polish";

export interface LessonReadinessIssue {
  id: string;
  message: string;
  severity: LessonReadinessSeverity;
  field: "summary" | "objectives" | "estimatedDurationMinutes" | "completionMode" | "block";
  blockId?: string;
}

export function createStructuredLessonDocument(): StructuredLessonDocument {
  return {
    version: 2,
    kind: "structured-lesson",
    summary: "",
    objectives: [""],
    estimatedDurationMinutes: null,
    completionMode: "manual",
    blocks: [createDefaultLessonBlock("richText")],
  };
}

export function createDefaultLessonBlock(type: LessonBlockType): LessonBlock {
  const base: LessonBlockBase = {
    id: createBlockId(),
    type,
    title: defaultTitleForBlock(type),
    isStudentVisible: true,
    required: false,
  };

  switch (type) {
    case "richText":
      return { ...base, type, contentKind: "tiptap", content: emptyTipTapDocument() };
    case "audio":
      return { ...base, type, audioUrl: "", transcript: "", description: "" };
    case "video":
      return { ...base, type, playbackId: "", videoUrl: "", transcript: "", description: "" };
    case "transcript":
      return { ...base, type, transcript: "" };
    case "image":
      return { ...base, type, imageUrl: "", altText: "", caption: "" };
    case "document":
      return { ...base, type, url: "", description: "" };
    case "sourceReference":
      return { ...base, type, materialId: "", referenceLabel: "", excerpt: "", sourceUrl: "" };
    case "formula":
      return {
        ...base,
        type,
        formula: { code: "", name: "", expression: "", notes: "", workedExample: "", relatedTerms: [] },
      };
    case "glossaryTermSet":
      return { ...base, type, displayMode: "cards", terms: [] };
    case "quizCheckpoint":
      return {
        ...base,
        type,
        quizId: "",
        titleText: "Knowledge check",
        description: "",
        timeLimitSeconds: null,
        shuffleQuestions: false,
        shuffleChoices: false,
        glossaryEnabled: false,
      };
    case "reflectionPrompt":
      return { ...base, type, prompt: "", guidance: "" };
    case "download":
      return { ...base, type, url: "", description: "" };
    case "externalResource":
      return { ...base, type, url: "", description: "" };
    case "callout":
      return { ...base, type, tone: "info", body: "" };
  }
}

export function parseStructuredLessonContent(contentJson: string | null | undefined): StructuredLessonDocument {
  if (!contentJson) return createStructuredLessonDocument();

  try {
    const parsed = JSON.parse(contentJson);
    if (isStructuredLessonDocument(parsed)) {
      return normalizeStructuredLessonDocument(parsed);
    }
    return legacyContentToStructuredDocument(parsed);
  } catch {
    return legacyContentToStructuredDocument(contentJson);
  }
}

export function stringifyStructuredLessonContent(document: StructuredLessonDocument): string {
  return JSON.stringify(normalizeStructuredLessonDocument(document));
}

export function getLessonReadinessIssues(document: StructuredLessonDocument): string[] {
  return getLessonReadinessReport(document).map((issue) => issue.message);
}

export function getLessonReadinessReport(document: StructuredLessonDocument): LessonReadinessIssue[] {
  const issues: string[] = [];
  const detailed: LessonReadinessIssue[] = [];
  const visibleBlocks = document.blocks.filter((block) => block.isStudentVisible);

  if (!document.summary.trim()) {
    issues.push("Add a lesson summary so students know what this lesson covers.");
    detailed.push({
      id: "summary-required",
      message: "Add a lesson summary so students know what this lesson covers.",
      severity: "required",
      field: "summary",
    });
  }
  if (document.objectives.filter((objective) => objective.trim().length > 0).length === 0) {
    issues.push("Add at least one learning objective.");
    detailed.push({
      id: "objectives-required",
      message: "Add at least one learning objective.",
      severity: "required",
      field: "objectives",
    });
  }
  if (visibleBlocks.length === 0) {
    issues.push("Add at least one student-visible lesson block.");
    detailed.push({
      id: "visible-block-required",
      message: "Add at least one student-visible lesson block.",
      severity: "required",
      field: "block",
    });
  }
  if (document.estimatedDurationMinutes == null) {
    detailed.push({
      id: "duration-recommended",
      message: "Add an estimated duration so students can plan their study session.",
      severity: "recommended",
      field: "estimatedDurationMinutes",
    });
  }

  for (const block of visibleBlocks) {
    const label = block.title?.trim() || defaultTitleForBlock(block.type);
    const pushBlockIssue = (suffix: string, message: string, severity: LessonReadinessSeverity = "required") => {
      issues.push(message);
      detailed.push({
        id: `${block.id}-${suffix}`,
        message,
        severity,
        field: "block",
        blockId: block.id,
      });
    };
    switch (block.type) {
      case "richText":
        if (!hasMeaningfulRichText(block.content)) pushBlockIssue("content", `${label}: add lesson text or remove the empty block.`);
        break;
      case "audio":
        if (!block.audioUrl.trim()) pushBlockIssue("audio-url", `${label}: add an audio URL.`);
        if (!block.transcript.trim()) pushBlockIssue("audio-transcript", `${label}: add a transcript for accessibility.`);
        break;
      case "video":
        if (!block.playbackId?.trim() && !block.videoUrl?.trim()) pushBlockIssue("video-source", `${label}: add a video playback ID or URL.`);
        if (!block.transcript.trim()) pushBlockIssue("video-transcript", `${label}: add a transcript for accessibility.`);
        break;
      case "transcript":
        if (!block.transcript.trim()) pushBlockIssue("transcript", `${label}: transcript text is empty.`);
        break;
      case "image":
        if (!block.imageUrl.trim()) pushBlockIssue("image-url", `${label}: add an image URL.`);
        if (!block.altText.trim()) pushBlockIssue("image-alt", `${label}: alt text is required.`);
        break;
      case "document":
      case "download":
      case "externalResource":
        if (!block.url.trim()) pushBlockIssue("url", `${label}: add a destination URL.`);
        break;
      case "sourceReference":
        if (!block.referenceLabel?.trim() && !block.title?.trim()) pushBlockIssue("citation", `${label}: add a citation label or title.`);
        break;
      case "formula":
        if (!block.formula.expression.trim()) pushBlockIssue("formula-expression", `${label}: add the formula expression.`);
        if (!block.formula.name.trim()) pushBlockIssue("formula-name", `${label}: add the formula name.`);
        break;
      case "glossaryTermSet":
        if (block.terms.length === 0) pushBlockIssue("glossary-terms", `${label}: add at least one glossary term.`);
        break;
      case "quizCheckpoint":
        if (!block.quizId?.trim()) pushBlockIssue("quiz-link", `${label}: link a quiz for this checkpoint.`);
        break;
      case "reflectionPrompt":
        if (!block.prompt.trim()) pushBlockIssue("reflection-prompt", `${label}: add a reflection prompt.`);
        break;
      case "callout":
        if (!block.body.trim()) pushBlockIssue("callout-body", `${label}: add callout text.`);
        break;
    }
  }

  return detailed;
}

export function defaultTitleForBlock(type: LessonBlockType): string {
  switch (type) {
    case "richText":
      return "Lesson text";
    case "audio":
      return "Audio explanation";
    case "video":
      return "Video lesson";
    case "transcript":
      return "Transcript";
    case "image":
      return "Image";
    case "document":
      return "Reference document";
    case "sourceReference":
      return "Source citation";
    case "formula":
      return "Formula focus";
    case "glossaryTermSet":
      return "Key vocabulary";
    case "quizCheckpoint":
      return "Knowledge check";
    case "reflectionPrompt":
      return "Reflection prompt";
    case "download":
      return "Downloadable resource";
    case "externalResource":
      return "External resource";
    case "callout":
      return "Teaching callout";
  }
}

export function blockCategoryForType(type: LessonBlockType): "core" | "practice" | "support" {
  switch (type) {
    case "richText":
    case "video":
    case "audio":
    case "transcript":
    case "formula":
    case "callout":
      return "core";
    case "quizCheckpoint":
    case "reflectionPrompt":
      return "practice";
    case "image":
    case "document":
    case "sourceReference":
    case "glossaryTermSet":
    case "download":
    case "externalResource":
      return "support";
  }
}

export function emptyTipTapDocument() {
  return JSON.stringify({ type: "doc", content: [{ type: "paragraph" }] });
}

export function hasMeaningfulRichText(content: string) {
  try {
    const parsed = JSON.parse(content);
    return JSON.stringify(parsed).length > JSON.stringify({ type: "doc", content: [{ type: "paragraph" }] }).length;
  } catch {
    return content.trim().length > 0;
  }
}

function legacyContentToStructuredDocument(parsed: unknown): StructuredLessonDocument {
  return {
    version: 2,
    kind: "structured-lesson",
    summary: "",
    objectives: [""],
    estimatedDurationMinutes: null,
    completionMode: "manual",
    blocks: [
      {
        id: "legacy-rich-text",
        type: "richText",
        title: "Lesson text",
        isStudentVisible: true,
        required: true,
        contentKind: "tiptap",
        content: typeof parsed === "string" ? parsed : JSON.stringify(parsed),
      },
    ],
  };
}

function isStructuredLessonDocument(value: unknown): value is StructuredLessonDocument {
  return Boolean(
    value &&
      typeof value === "object" &&
      (value as StructuredLessonDocument).kind === "structured-lesson" &&
      Array.isArray((value as StructuredLessonDocument).blocks)
  );
}

function normalizeStructuredLessonDocument(document: StructuredLessonDocument): StructuredLessonDocument {
  return {
    version: 2,
    kind: "structured-lesson",
    summary: String(document.summary ?? ""),
    objectives:
      Array.isArray(document.objectives) && document.objectives.length > 0
        ? document.objectives.map((objective) => String(objective ?? ""))
        : [""],
    estimatedDurationMinutes:
      document.estimatedDurationMinutes == null || Number.isNaN(Number(document.estimatedDurationMinutes))
        ? null
        : Math.max(0, Number(document.estimatedDurationMinutes)),
    completionMode: document.completionMode === "all-blocks" ? "all-blocks" : "manual",
    blocks: Array.isArray(document.blocks) ? document.blocks.map(normalizeLessonBlock) : [],
  };
}

function normalizeLessonBlock(block: LessonBlock): LessonBlock {
  const base: LessonBlockBase = {
    id: String(block.id ?? createBlockId()),
    type: block.type,
    title: block.title ? String(block.title) : defaultTitleForBlock(block.type),
    isStudentVisible: block.isStudentVisible !== false,
    required: Boolean(block.required),
    materialId: block.materialId ? String(block.materialId) : undefined,
  };

  switch (block.type) {
    case "richText":
      return {
        ...base,
        type: "richText",
        contentKind: "tiptap",
        content: typeof block.content === "string" ? block.content : emptyTipTapDocument(),
      };
    case "audio":
      return { ...base, type: "audio", audioUrl: String(block.audioUrl ?? ""), transcript: String(block.transcript ?? ""), description: String(block.description ?? "") };
    case "video":
      return {
        ...base,
        type: "video",
        playbackId: String(block.playbackId ?? ""),
        videoUrl: String(block.videoUrl ?? ""),
        transcript: String(block.transcript ?? ""),
        description: String(block.description ?? ""),
      };
    case "transcript":
      return { ...base, type: "transcript", transcript: String(block.transcript ?? "") };
    case "image":
      return { ...base, type: "image", imageUrl: String(block.imageUrl ?? ""), altText: String(block.altText ?? ""), caption: String(block.caption ?? "") };
    case "document":
      return { ...base, type: "document", url: String(block.url ?? ""), description: String(block.description ?? "") };
    case "sourceReference":
      return {
        ...base,
        type: "sourceReference",
        materialId: String(block.materialId ?? ""),
        referenceLabel: String(block.referenceLabel ?? ""),
        excerpt: String(block.excerpt ?? ""),
        sourceUrl: String(block.sourceUrl ?? ""),
      };
    case "formula":
      return {
        ...base,
        type: "formula",
        formula: {
          id: block.formula?.id ? String(block.formula.id) : undefined,
          code: String(block.formula?.code ?? ""),
          name: String(block.formula?.name ?? ""),
          expression: String(block.formula?.expression ?? ""),
          notes: String(block.formula?.notes ?? ""),
          workedExample: String(block.formula?.workedExample ?? ""),
          relatedTerms: Array.isArray(block.formula?.relatedTerms) ? block.formula.relatedTerms.map((term) => String(term)) : [],
        },
      };
    case "glossaryTermSet":
      return {
        ...base,
        type: "glossaryTermSet",
        displayMode: block.displayMode === "inline" ? "inline" : "cards",
        terms: Array.isArray(block.terms)
          ? block.terms.map((term) => ({
              id: term.id ? String(term.id) : undefined,
              term: String(term.term ?? ""),
              definition: String(term.definition ?? ""),
              example: String(term.example ?? ""),
            }))
          : [],
      };
    case "quizCheckpoint":
      return {
        ...base,
        type: "quizCheckpoint",
        quizId: String(block.quizId ?? ""),
        titleText: String(block.titleText ?? ""),
        description: String(block.description ?? ""),
        timeLimitSeconds: block.timeLimitSeconds == null ? null : Number(block.timeLimitSeconds),
        shuffleQuestions: Boolean(block.shuffleQuestions),
        shuffleChoices: Boolean(block.shuffleChoices),
        glossaryEnabled: Boolean(block.glossaryEnabled),
      };
    case "reflectionPrompt":
      return { ...base, type: "reflectionPrompt", prompt: String(block.prompt ?? ""), guidance: String(block.guidance ?? "") };
    case "download":
      return { ...base, type: "download", url: String(block.url ?? ""), description: String(block.description ?? "") };
    case "externalResource":
      return { ...base, type: "externalResource", url: String(block.url ?? ""), description: String(block.description ?? "") };
    case "callout":
      return { ...base, type: "callout", tone: block.tone === "warning" || block.tone === "success" ? block.tone : "info", body: String(block.body ?? "") };
  }
}

function createBlockId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `block-${Math.random().toString(36).slice(2, 10)}`;
}

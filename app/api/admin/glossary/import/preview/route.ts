import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { getAdminFirestore } from "@/lib/firebase/admin-firestore";
import { parseGlossaryCsv, type GlossaryImportRow } from "@/lib/admin/csv-glossary";
import { parseGlossaryDocx } from "@/lib/admin/docx-glossary";

export interface DuplicateEntry {
  row: number;
  term: string;
  existingId: string;
  existingDefinition: string;
  resolution: "skip" | "overwrite" | "keep_both";
}

export interface IntraFileDuplicate {
  rows: number[];
  term: string;
}

export interface PreviewResult {
  rows: GlossaryImportRow[];
  errors: Array<{ row: number; message: string }>;
  duplicates: DuplicateEntry[];
  intraFileDuplicates: IntraFileDuplicate[];
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const name = file.name.toLowerCase();
  let rows: GlossaryImportRow[] = [];
  let parseErrors: Array<{ row: number; message: string }> = [];

  if (name.endsWith(".csv")) {
    const text = await file.text();
    const result = parseGlossaryCsv(text);
    rows = result.rows;
    parseErrors = result.errors;
  } else if (name.endsWith(".docx")) {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      rows = await parseGlossaryDocx(buffer);
    } catch (e: any) {
      return NextResponse.json({ error: `DOCX parse error: ${e.message}` }, { status: 400 });
    }
  } else {
    return NextResponse.json({ error: "Unsupported file type. Upload a .csv or .docx file." }, { status: 400 });
  }

  // ── Intra-file duplicate detection ────────────────────────────────────────
  const termIndexMap = new Map<string, number[]>();
  rows.forEach((row, idx) => {
    const key = row.term.toLowerCase().trim();
    const existing = termIndexMap.get(key) ?? [];
    existing.push(idx);
    termIndexMap.set(key, existing);
  });

  const intraFileDuplicates: IntraFileDuplicate[] = [];
  for (const [term, indices] of termIndexMap) {
    if (indices.length > 1) {
      intraFileDuplicates.push({ term, rows: indices });
    }
  }

  // ── Cross-check against existing Firestore terms ──────────────────────────
  const db = getAdminFirestore();
  const existingSnap = await db.collection("glossaryTerms").get();
  const existingMap = new Map<string, { id: string; definition: string }>();
  existingSnap.docs.forEach((doc: any) => {
    const data = doc.data();
    existingMap.set((data.term as string).toLowerCase().trim(), {
      id: doc.id,
      definition: data.definition as string,
    });
  });

  const duplicates: DuplicateEntry[] = [];
  rows.forEach((row, idx) => {
    const key = row.term.toLowerCase().trim();
    const match = existingMap.get(key);
    if (match) {
      duplicates.push({
        row: idx,
        term: row.term,
        existingId: match.id,
        existingDefinition: match.definition,
        resolution: "skip",
      });
    }
  });

  const result: PreviewResult = { rows, errors: parseErrors, duplicates, intraFileDuplicates };
  return NextResponse.json(result);
}

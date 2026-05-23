import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";
import { z } from "zod";
import { DOMAINS } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;

  const hardcoded = Object.keys(DOMAINS) as string[];

  try {
    const data = await adminDcQuery<{ customDomains: { id: string; name: string }[] }>(
      "ListCustomDomains"
    );
    const custom = (data.customDomains ?? []).map((d) => d.name);
    const all = Array.from(new Set([...hardcoded, ...custom])).sort();
    return NextResponse.json({ domains: all });
  } catch (err: any) {
    console.error("[admin/domains:GET]", err.message);
    return NextResponse.json({ domains: hardcoded.sort() });
  }
}

const createSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Domain name is required")
    .max(64, "Domain name must be 64 characters or fewer")
    .regex(
      /^[a-z0-9_-]+$/,
      "Domain name may only contain lowercase letters, digits, hyphens, and underscores"
    ),
});

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { name } = parsed.data;

  if (Object.prototype.hasOwnProperty.call(DOMAINS, name)) {
    return NextResponse.json({ name }, { status: 200 });
  }

  try {
    const existing = await adminDcQuery<{ customDomains: { name: string }[] }>(
      "ListCustomDomains"
    );
    if ((existing.customDomains ?? []).some((d) => d.name === name)) {
      return NextResponse.json({ name }, { status: 200 });
    }
  } catch (err: any) {
    console.error("[admin/domains:POST:check]", err.message);
  }

  const id = randomUUID();
  try {
    await adminDcMutate("CreateCustomDomain", {
      id,
      name,
      createdById: auth.session.uid,
    });
    return NextResponse.json({ name }, { status: 201 });
  } catch (err: any) {
    console.error("[admin/domains:POST]", err.message);
    return NextResponse.json({ error: "Failed to create domain." }, { status: 500 });
  }
}

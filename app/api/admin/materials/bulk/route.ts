// Backend bulk source-material actions: app/api/admin/materials/bulk/route.ts

import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminRequest } from "@/lib/admin/auth";
import { fetchAdminMaterialFolders, fetchAdminMaterialLibrary, findMaterialById } from "@/lib/admin/material-library";
import { adminDcMutate } from "@/lib/firebase/admin-dc";
import { formatUuid } from "@/lib/utils";

const bulkSchema = z.object({
  action: z.enum(["move", "tag", "link-course", "link-lesson", "archive", "trash", "restore", "mark-reviewed", "visibility", "export-metadata"]),
  ids: z.array(z.string().trim().min(1)).min(1),
  folderId: z.string().trim().min(1).optional().nullable(),
  tags: z.array(z.string().trim()).optional(),
  courseId: z.string().trim().min(1).optional().nullable(),
  lessonId: z.string().trim().min(1).optional().nullable(),
  visibility: z.enum(["admin", "learner"]).optional(),
});

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const parsed = bulkSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const body = {
    ...parsed.data,
    ids: parsed.data.ids.map(formatUuid),
    folderId: parsed.data.folderId ? formatUuid(parsed.data.folderId) : parsed.data.folderId,
    courseId: parsed.data.courseId ? formatUuid(parsed.data.courseId) : parsed.data.courseId,
    lessonId: parsed.data.lessonId ? formatUuid(parsed.data.lessonId) : parsed.data.lessonId,
  };
  const today = new Date().toISOString().split("T")[0];
  const materials = await fetchAdminMaterialLibrary();
  const folders = await fetchAdminMaterialFolders();
  const updated: string[] = [];

  if (body.action === "export-metadata") {
    return NextResponse.json({
      materials: body.ids
        .map((id) => findMaterialById(materials, id))
        .filter(Boolean)
        .map((material) => ({
          id: material!.id,
          title: material!.title,
          fileName: material!.fileName,
          type: material!.fileType,
          status: material!.displayStatus,
          folder: material!.folder?.name ?? "All Materials",
          tags: material!.tags.map((tag) => tag.name),
          links: material!.links,
          parser: material!.parser,
          sizeBytes: material!.sizeBytes,
          updatedAt: material!.updatedAt,
        })),
    });
  }

  for (const id of body.ids) {
    const material = findMaterialById(materials, id);
    if (!material) continue;

    if (body.action === "link-course" || body.action === "link-lesson") {
      await adminDcMutate("CreateContentSourceLink", {
        id: randomUUID(),
        sourceMaterialId: material.id,
        lessonId: body.action === "link-lesson" ? body.lessonId ?? null : null,
        courseId: body.action === "link-course" ? body.courseId ?? null : null,
        questionId: null,
        referenceLabel: "Bulk link",
      }).catch(() => null);
    } else {
      const nextTags = body.action === "tag" && body.tags ? body.tags : material.tags.map((tag) => tag.name);
      const nextMetadata = {
        ...material.metadata,
        tags: nextTags,
        ...(body.action === "move"
          ? {
              libraryFolderId: body.folderId ?? null,
              libraryFolderName: body.folderId
                ? folders.find((folder) => folder.id === body.folderId)?.name
                : null,
            }
          : {}),
        libraryUpdatedAt: new Date().toISOString(),
      };
      await adminDcMutate("UpdateSourceMaterialLibraryState", {
        id: material.id,
        title: material.title,
        folderId: body.action === "move" ? body.folderId ?? null : material.folder?.id ?? null,
        starred: material.starred,
        archivedAt: body.action === "restore" ? null : body.action === "archive" ? today : material.archivedAt ?? null,
        trashedAt: body.action === "restore" ? null : body.action === "trash" ? today : material.trashedAt ?? null,
        reviewStatus: body.action === "mark-reviewed" ? "reviewed" : material.reviewStatus,
        visibility: body.action === "visibility" ? body.visibility ?? material.visibility : material.visibility,
        duplicateOfId: material.duplicateOf?.id ?? null,
        lastActivityAt: today,
        metadataJson: JSON.stringify(nextMetadata),
        status: material.status,
      }).catch(async (error) => {
        const message = error instanceof Error ? error.message : String(error);
        if (!message.includes("operation \"UpdateSourceMaterialLibraryState\" not found")) throw error;
        await adminDcMutate("UpdateSourceMaterial", {
          id: material.id,
          extractedText: material.extractedText ?? "",
          metadataJson: JSON.stringify(nextMetadata),
          status: material.status,
        });
      });

      if (body.action === "tag" && body.tags) {
        await adminDcMutate("DeleteTagAssignmentsForMaterial", { sourceMaterialId: material.id }).catch(() => null);
        for (const name of body.tags.filter(Boolean)) {
          const tagId = randomUUID();
          await adminDcMutate("CreateSourceMaterialTag", {
            id: tagId,
            name,
            color: null,
            createdById: auth.session.uid,
          }).catch(() => null);
          await adminDcMutate("CreateSourceMaterialTagAssignment", {
            sourceMaterialId: material.id,
            tagId,
          }).catch(() => null);
        }
      }
    }

    await adminDcMutate("CreateSourceMaterialActivity", {
      id: randomUUID(),
      sourceMaterialId: material.id,
      folderId: body.folderId ?? material.folder?.id ?? null,
      actorId: auth.session.uid,
      activityType: `bulk-${body.action}`,
      message: `Bulk action: ${body.action}`,
      metadataJson: JSON.stringify(body),
    }).catch(() => null);
    updated.push(material.id, id);
  }

  return NextResponse.json({ ok: true, updated: body.ids.length, ids: [...new Set(updated)] });
}

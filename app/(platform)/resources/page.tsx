// Front-end learner resource library: app/(platform)/resources/page.tsx

import {
  EmptyState,
  LearnerPage,
  PageHeader,
  SectionPanel,
  StatusBadge,
} from "@/components/ui/LearnerPrimitives";
import * as Icons from "@/components/ui/Icons";
import {
  listLearnerSourceMaterials,
  type LearnerSourceMaterial,
} from "@/lib/firebase/learner-portal";
import { getLearnerSession } from "@/lib/firebase/learner-session";

interface ResourceGroup {
  id: string;
  name: string;
  resources: LearnerSourceMaterial[];
}

async function loadLearnerResources(): Promise<LearnerSourceMaterial[]> {
  const session = await getLearnerSession();
  if (!session) return [];

  try {
    return await listLearnerSourceMaterials();
  } catch (error) {
    console.error("[resources/page] Failed to load learner resources", error);
    return [];
  }
}

function groupResourcesByFolder(resources: LearnerSourceMaterial[]): ResourceGroup[] {
  const resourcesByFolder = new Map<string, ResourceGroup>();

  for (const resource of resources) {
    const folderId = resource.folder?.id ?? "unfiled";
    const group = resourcesByFolder.get(folderId) ?? {
      id: folderId,
      name: resource.folder?.name ?? "General resources",
      resources: [],
    };
    group.resources.push(resource);
    resourcesByFolder.set(folderId, group);
  }

  return Array.from(resourcesByFolder.values()).sort((firstGroup, secondGroup) =>
    firstGroup.name.localeCompare(secondGroup.name));
}

export default async function ResourcesPage() {
  const resources = await loadLearnerResources();
  const resourceGroups = groupResourcesByFolder(resources);

  return (
    <LearnerPage>
      <PageHeader
        eyebrow="Reference library"
        title="Learner resources"
        description="View and download source materials that instructors have made available to learners."
        icon={Icons.Database}
      />

      {resourceGroups.length === 0 ? (
        <EmptyState
          title="No learner resources available"
          description="No active materials are currently shared with learners, or the resource library could not be loaded."
          icon={Icons.FileText}
        />
      ) : (
        <div className="space-y-5">
          {resourceGroups.map((group) => (
            <SectionPanel
              key={group.id}
              title={group.name}
              description={`${group.resources.length} resource${group.resources.length === 1 ? "" : "s"}`}
            >
              <div className="divide-y divide-slate-100">
                {group.resources.map((resource) => (
                  <ResourceRow key={resource.id} resource={resource} />
                ))}
              </div>
            </SectionPanel>
          ))}
        </div>
      )}
    </LearnerPage>
  );
}

function ResourceRow({ resource }: { resource: LearnerSourceMaterial }) {
  const assetUrl = `/api/resources/${resource.id}/asset`;
  const tags = resource.sourceMaterialTagAssignments_on_sourceMaterial.map(({ tag }) => tag);

  return (
    <article className="grid gap-4 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="blue">{fileTypeLabel(resource.fileType)}</StatusBadge>
          {resource.sizeBytes !== null && (
            <span className="text-xs font-semibold text-slate-500">
              {formatFileSize(resource.sizeBytes)}
            </span>
          )}
        </div>
        <h2 className="mt-2 truncate text-base font-extrabold text-slate-950">{resource.title}</h2>
        <p className="mt-1 truncate text-xs text-slate-500">{resource.fileName}</p>
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Resource tags">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={assetUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#185FA5] bg-white px-3 py-2 text-sm font-bold text-[#185FA5] hover:bg-[#E6F1FB]"
        >
          <Icons.Eye size={16} />
          View
        </a>
        <a
          href={`${assetUrl}?download=1`}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#185FA5] px-3 py-2 text-sm font-bold text-white hover:bg-[#0d3d6e]"
        >
          <Icons.Upload size={16} />
          Download
        </a>
      </div>
    </article>
  );
}

function fileTypeLabel(fileType: string): string {
  if (fileType.startsWith("image/")) return "Image";
  if (fileType.startsWith("audio/")) return "Audio";
  if (fileType.startsWith("video/")) return "Video";
  if (fileType === "application/pdf") return "PDF";
  return "Document";
}

function formatFileSize(sizeBytes: number): string {
  if (sizeBytes < 1024) return `${sizeBytes} B`;
  if (sizeBytes < 1024 * 1024) return `${Math.round(sizeBytes / 1024)} KB`;
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

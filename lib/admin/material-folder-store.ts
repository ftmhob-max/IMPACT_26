import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { MaterialFolderSummary } from "./material-library";

const STORE_PATH = path.join(process.cwd(), ".next", "cache", "source-material-folders.json");

interface FolderStoreFile {
  folders: MaterialFolderSummary[];
  assignments: Record<string, string | null>;
}

async function readStore(): Promise<FolderStoreFile> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<FolderStoreFile>;
    return {
      folders: Array.isArray(parsed.folders) ? parsed.folders : [],
      assignments: parsed.assignments && typeof parsed.assignments === "object" ? parsed.assignments : {},
    };
  } catch {
    return { folders: [], assignments: {} };
  }
}

async function writeStore(store: FolderStoreFile) {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2));
}

export async function listStoredMaterialFolders() {
  return (await readStore()).folders;
}

export async function listStoredMaterialFolderAssignments() {
  return (await readStore()).assignments;
}

export async function createStoredMaterialFolder({
  id,
  name,
  parentFolderId,
  folderType,
  createdBy,
}: {
  id: string;
  name: string;
  parentFolderId?: string | null;
  folderType: string;
  createdBy?: { id: string; email?: string | null; fullName?: string | null } | null;
}) {
  const store = await readStore();
  const now = new Date().toISOString();
  const parent = parentFolderId
    ? store.folders.find((folder) => folder.id === parentFolderId)
    : null;
  const folder: MaterialFolderSummary = {
    id,
    name,
    folderType,
    parentFolder: parent ? { id: parent.id, name: parent.name } : null,
    createdBy: createdBy ?? null,
    createdAt: now,
    updatedAt: now,
    archivedAt: null,
    trashedAt: null,
  };
  store.folders.push(folder);
  await writeStore(store);
  return folder;
}

export async function updateStoredMaterialFolder(id: string, patch: Partial<MaterialFolderSummary> & { parentFolderId?: string | null }) {
  const store = await readStore();
  const index = store.folders.findIndex((folder) => folder.id === id);
  if (index < 0) return null;
  const parent = patch.parentFolderId
    ? store.folders.find((folder) => folder.id === patch.parentFolderId)
    : patch.parentFolderId === null
      ? null
      : undefined;
  store.folders[index] = {
    ...store.folders[index],
    ...patch,
    parentFolder: parent === undefined
      ? store.folders[index].parentFolder
      : parent
        ? { id: parent.id, name: parent.name }
        : null,
    updatedAt: new Date().toISOString(),
  };
  await writeStore(store);
  return store.folders[index];
}

export async function deleteStoredMaterialFolder(id: string) {
  const store = await readStore();
  const now = new Date().toISOString();
  const deletedIds = new Set<string>([id]);
  let found = false;
  let changed = true;

  while (changed) {
    changed = false;
    for (const folder of store.folders) {
      if (deletedIds.has(folder.id)) {
        found = true;
      }
      if (folder.parentFolder?.id && deletedIds.has(folder.parentFolder.id) && !deletedIds.has(folder.id)) {
        deletedIds.add(folder.id);
        changed = true;
      }
    }
  }

  if (!found) return null;

  store.folders = store.folders.map((folder) => (
    deletedIds.has(folder.id)
      ? { ...folder, trashedAt: now, updatedAt: now }
      : folder
  ));

  for (const [materialId, folderId] of Object.entries(store.assignments)) {
    if (folderId && deletedIds.has(folderId)) {
      store.assignments[materialId] = null;
    }
  }

  await writeStore(store);
  return [...deletedIds];
}

export async function assignStoredMaterialsToFolder(materialIds: string[], folderId: string | null) {
  const store = await readStore();
  for (const materialId of materialIds) {
    store.assignments[materialId] = folderId;
  }
  await writeStore(store);
}

import { File, Directory, Paths } from "expo-file-system";

export type FileSystemEntry = {
  name: string;
  uri: string;
  isDirectory: boolean;
  size: number;
  modificationTime: number;
};

export async function ensureAppDirectory(path: string) {
  try {
    const dir = new Directory(Paths.document, path);

    if (!dir.exists) {
      await dir.create();
    }
  } catch (e) {
    console.error("ensureAppDirectory error", e);
    throw e;
  }
}

export async function getFilesInDirectory(dir: Directory) {
  try {
    const entries = await dir.list();

    const detailed = await Promise.all(
      entries.map(async (entry) => {
        const info = await entry.info();
        return {
          name: entry.name,
          uri: entry.uri,
          isDirectory: entry instanceof Directory,
          size: info.size ?? 0,
          modificationTime: info.modificationTime ?? 0,
        };
      })
    );
    detailed.sort((a, b) => a.name.localeCompare(b.name));
    return detailed;
  } catch (e) {
    console.error("getFilesInDirectory error", e);
    return [];
  }
}

function normalizeUri(uri: string) {
  return decodeURI(uri).replace(/\/$/, "").toLowerCase();
}

export async function getUniqueName(
  item: File | Directory,
  baseName: string,
  isParent: boolean = false
) {
  let parentDir: Directory;
  let currentUri: string | null = null;

  if (
    !isParent &&
    (item instanceof File || (item instanceof Directory && item.exists))
  ) {
    parentDir = item.parentDirectory;
    currentUri = normalizeUri(item.uri);
  } else {
    parentDir = item as Directory;
  }

  const entries = await parentDir.list();
  const existingNames = entries
    .filter((entry) => !currentUri || normalizeUri(entry.uri) !== currentUri)
    .map((entry) => entry.name.toLowerCase());

  if (!existingNames.includes(baseName.toLowerCase())) return baseName;

  let counter = 1;
  let newName = `${baseName}(${counter})`;
  while (existingNames.includes(newName.toLowerCase())) {
    counter++;
    newName = `${baseName}(${counter})`;
  }

  return newName;
}

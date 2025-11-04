import { Directory, File, Paths } from "expo-file-system";
import { FileTypes, IconName } from "../types/ExplorerTypes";

export async function ensureAppDirectory(path: string) {
  try {
    const dir = new Directory(Paths.document, path);
    if (!dir.exists) {
      dir.create({ intermediates: true });
    }
  } catch (e) {
    console.error("ensureAppDirectory error", e);
    throw e;
  }
}

function getFileIcon(file: File): IconName {
  const fileType = file.type?.toLowerCase() ?? "";
  const match =
    FileTypes.find((itemType) => fileType.startsWith(itemType.mime)) ??
    FileTypes.find(() => fileType === "*/*");
  return match?.icon ?? "insert-drive-file";
}

export async function getFilesInDirectory(dir: Directory) {
  try {
    const entries = await dir.list();

    const detailed = await Promise.all(
      entries.map(async (entry) => {
        const info = await entry.info();
        const entryIcon =
          entry instanceof Directory ? "folder" : getFileIcon(entry);

        return {
          name: entry.name,
          uri: entry.uri,
          isDirectory: entry instanceof Directory,
          icon: entryIcon,
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

export async function truncateName(name: string, maxChar: number = 12) {
  return name.length > maxChar
    ? name.slice(0, 5) + "..." + name.slice(-5)
    : name;
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
  let [name, extension] = baseName.split(".");
  if (extension !== "") extension = `.${extension}`;

  let newName = `${name}(${counter})${extension}`;
  while (existingNames.includes(newName.toLowerCase())) {
    counter++;
    newName = `${baseName}(${counter})${extension}`;
  }

  return newName;
}

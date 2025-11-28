import { Directory, File, Paths } from "expo-file-system";
import { FileTypeInfo, FileTypes } from "../types/ExplorerTypes";
import * as FileSystem from "expo-file-system/legacy";

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

function getFileTypeInfo(file: File): FileTypeInfo {
  const fileType = file.type?.toLowerCase() ?? "";
  const match = FileTypes.find((itemType) =>
    fileType.startsWith(itemType.mime)
  );
  if (match !== undefined) return match;
  else return FileTypes[FileTypes.length - 1];
}

export async function getFilesInDirectory(dir: Directory) {
  try {
    const entries = await dir.list();

    const detailed = await Promise.all(
      entries.map(async (entry) => {
        const info = await entry.info();
        let entryType: FileTypeInfo;
        if (entry instanceof File)
          entryType = getFileTypeInfo(entry) ?? FileTypes.at(-1);
        else entryType = FileTypes[0];

        return {
          name: entry.name,
          uri: entry.uri,
          isDirectory: entry instanceof Directory,
          typeInfo: entryType,
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

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
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
  if (extension !== undefined && extension !== "") extension = `.${extension}`;
  else extension = "";

  let newName = `${name}(${counter})${extension}`;
  while (existingNames.includes(newName.toLowerCase())) {
    counter++;
    newName = `${baseName}(${counter})${extension}`;
  }

  return newName;
}

export async function recursiveDeleteDirectory(dir: Directory) {
  const entries = await dir.list();
  for (const entry of entries) {
    if (entry instanceof File) {
      entry.delete();
    } else if (entry instanceof Directory) {
      await recursiveDeleteDirectory(entry);
    }
  }
  dir.delete();
}

export async function moveFile(fileUri: string, destinationUri: string) {
  try {
    const fileName = fileUri.split('/').pop();
    const destinationPath = `${destinationUri}/${fileName}`;
    await FileSystem.moveAsync({
      from: fileUri,
      to: destinationPath,
    });
  } catch (error) {
    console.error('Error moving file:', error);
  }
}
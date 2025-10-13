import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { Directory, File, Paths } from "expo-file-system";
import {
  FileSystemEntry,
  ensureAppDirectory,
  getFilesInDirectory,
  getUniqueName,
} from "./fileUtils";

const APP_DIR_NAME = "Core/Files";

export function useFileExplorer() {
  const APP_DIR = new Directory(Paths.document, APP_DIR_NAME);
  const [files, setFiles] = useState<FileSystemEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [currentDir, setCurrentDir] = useState<Directory | null>(null);

  useEffect(() => {
    async function setup() {
      try {
        await ensureAppDirectory(APP_DIR_NAME);
        const dir = new Directory(Paths.document, APP_DIR_NAME);
        setCurrentDir(dir);
      } catch (e) {
        console.error("Failed to set up app directory", e);
      }
    }
    setup();
  }, []);

  const refreshFiles = useCallback(
    async (dir?: Directory) => {
      const targetDir = dir ?? currentDir;
      if (!targetDir) return;
      setLoading(true);
      try {
        await ensureAppDirectory(APP_DIR_NAME);
        const list = await getFilesInDirectory(targetDir);
        setFiles(list);
      } catch (e) {
        console.error("Error reading files", e);
        Alert.alert("Error", "Could not read files.");
      } finally {
        setLoading(false);
      }
    },
    [currentDir]
  );

  useEffect(() => {
    if (currentDir) refreshFiles(currentDir);
  }, [currentDir, refreshFiles]);

  const onDelete = async (fileUri: string) => {
    Alert.alert("Delete file", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const file = new File(fileUri);
            file.delete();
            await refreshFiles();
          } catch (e) {
            console.error("Error deleting file", e);
            Alert.alert("Error", "Could not delete file.");
          }
        },
      },
    ]);
  };
  const onRename = async (fileUri: string, oldName: string) => {
    Alert.prompt(
      "Rename file",
      "Type a new filename (incl. extension):",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async (newName?: string) => {
            if (!newName || oldName === newName) return;
            try {
              const file = new File(fileUri);
              const uniqueName = await getUniqueName(file, newName);

              file.rename(uniqueName);
              await refreshFiles();
            } catch (e) {
              console.error("Error renaming file", e);
              Alert.alert("Error", "Could not rename file.");
            }
          },
        },
      ],
      "plain-text",
      oldName
    );
  };
  const onOpen = async (fileUri: string) => {
    try {
      const { exists, isDirectory } = Paths.info(fileUri);
      if (!currentDir || !exists || !isDirectory) return;

      const newDir = new Directory(fileUri);
      setCurrentDir(newDir);
      await refreshFiles(newDir);
    } catch (e) {
      console.error("Error opening file", e);
      Alert.alert("Error", "Could not open file.");
    }
  };
  const createFolder = async () => {
    Alert.prompt("New folder", "Name of folder:", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Create",
        onPress: async (name?: string) => {
          if (!name || !currentDir) return;
          try {
            const uniqueName = await getUniqueName(currentDir, name, true);
            const dir = new Directory(currentDir, uniqueName);
            dir.create();
            await refreshFiles();
          } catch (e) {
            console.error(e);
            Alert.alert("Error", "Could not create folder.");
          }
        },
      },
    ]);
  };

  const onGoUp = async () => {
    if (!currentDir) return;

    const parentDir = currentDir.parentDirectory;
    if (!parentDir) return;

    setCurrentDir(parentDir);
    await refreshFiles(parentDir);
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  return {
    files,
    loading,
    query,
    setQuery,
    currentDir,
    APP_DIR_NAME,
    APP_DIR,
    refreshFiles,
    onDelete,
    onRename,
    onOpen,
    createFolder,
    onGoUp,
    filteredFiles,
  };
}

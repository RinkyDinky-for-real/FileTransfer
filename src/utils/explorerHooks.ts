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

  const refreshFiles = useCallback(async () => {
    if (!currentDir) return;
    setLoading(true);
    try {
      await ensureAppDirectory(APP_DIR_NAME);
      const list = await getFilesInDirectory(currentDir);
      setFiles(list);
    } catch (e) {
      console.error("Error reading files", e);
      Alert.alert("Error", "Could not read files.");
    } finally {
      setLoading(false);
    }
  }, [currentDir]);

  useEffect(() => {
    refreshFiles();
  }, [refreshFiles]);

  const onDelete = async (fileUri: string) => {
    Alert.alert("Delete file", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const file = new File(fileUri);
            await file.delete();
            refreshFiles();
          } catch (e) {
            console.error(e);
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
              const newPath = new Directory(Paths.document, APP_DIR_NAME);
              const uniqueName = await getUniqueName(file, newName);

              const newFile = new File(newPath, uniqueName);

              await file.move(newFile);
              refreshFiles();
            } catch (e) {
              console.error(e);
              Alert.alert("Error", "Could not rename file.");
            }
          },
        },
      ],
      "plain-text",
      oldName
    );
  };
  const createFolder = async () => {
    Alert.prompt("New folder", "Name of folder:", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Create",
        onPress: async (name?: string) => {
          if (!name) return;
          try {
            const uniqueName = await getUniqueName(APP_DIR, name, true);
            const dir = new Directory(
              Paths.document,
              `${APP_DIR_NAME}/${uniqueName}`
            );
            await dir.create();
            refreshFiles();
          } catch (e) {
            console.error(e);
            Alert.alert("Error", "Could not create folder.");
          }
        },
      },
    ]);
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
    createFolder,
    filteredFiles,
  };
}

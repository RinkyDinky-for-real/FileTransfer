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
  const [currentDir, setCurrentDir] = useState<Directory>(APP_DIR);

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
    setLoading(true);
    console.log("Loading started")
    try {
      await ensureAppDirectory(APP_DIR_NAME);
      const list = await getFilesInDirectory(currentDir);
      setFiles(list);
    } catch (e) {
      console.error("Error reading files", e);
      Alert.alert("Feil", "Kunne ikke lese filer.");
    } finally {
      setLoading(false);
      console.log("Loading finished")
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
      if (!exists || !isDirectory) return;

      const newDir = new Directory(fileUri);
      setCurrentDir(newDir);
      setQuery("");
      await refreshFiles();
    } catch (e) {
      console.error("Error opening file", e);
      Alert.alert("Error", "Could not open file.");
    }
  };
  const createFolder = useCallback(async () => {
    console.log("Creating folder...")
    Alert.prompt("New folder", "Name of folder:", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Create",
        onPress: async (name?: string) => {
          if (!name) return;
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
    console.log("Created new folder.")
  }, [refreshFiles, currentDir]);

  const onGoUp = useCallback(async () => {
    const parentDir = currentDir.parentDirectory;
    if (!parentDir) return;

    setCurrentDir(parentDir);
    await refreshFiles();
  }, [currentDir, refreshFiles]);

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  return {
    filteredFiles,
    loading,
    currentDir,
    APP_DIR_NAME,
    APP_DIR,
    query,
    setQuery,
    refreshFiles,
    onDelete,
    onRename,
    onOpen,
    createFolder,
    onGoUp,
  };
}

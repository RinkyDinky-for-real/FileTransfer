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

  const [addFolderPromptVisible, setAddFolderPromptVisible] = useState(false);
  const [renamePromptVisible, setRenamePromptVisible] = useState(false);
  const [deletePromptVisible, setDeletePromptVisible] = useState(false);

  const [currentFileName, setCurrentFileName] = useState("");
  const [targetUri, setTargetUri] = useState<string | null>(null);

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
    try {
      await ensureAppDirectory(APP_DIR_NAME);
      const list = await getFilesInDirectory(currentDir);
      setFiles(list);
    } catch (e) {
      console.error("Error reading files", e);
      Alert.alert("Feil", "Kunne ikke lese filer.");
    } finally {
      setLoading(false);
    }
  }, [currentDir]);

  useEffect(() => {
    refreshFiles();
  }, [refreshFiles]);

  const showDeletePrompt = (fileUri: string) => {
    setTargetUri(fileUri);
    setDeletePromptVisible(true);
  };

  const handleDeleteSubmit = async () => {
    if (!targetUri) return;
    try {
      const file = new File(targetUri);
      file.delete();
      await refreshFiles();
    } catch (e) {
      console.error("Error deleting file", e);
      Alert.alert("Error", "Could not delete file.");
    }
    setDeletePromptVisible(false);
  };

  const showRenamePrompt = (fileUri: string, oldName: string) => {
    setTargetUri(fileUri);
    setCurrentFileName(oldName);
    setRenamePromptVisible(true);
  };

  const handleRenameSubmit = async (newName: string) => {
    if (newName && currentFileName !== newName && targetUri) {
      const file = new Directory(currentDir, currentFileName);
      try {
        const uniqueName: string = await getUniqueName(file, newName);
        if (uniqueName !== file.name) {
          file.rename(uniqueName);
          await refreshFiles();
        }
      } catch (e) {
        console.error("Error renaming file", e);
        Alert.alert("Error", "Could not rename file.");
      }
    }
    setRenamePromptVisible(false);
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

  const handleCreateFolderSubmit = async (name: string) => {
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
    setAddFolderPromptVisible(false);
  };

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
    showDeletePrompt,
    showRenamePrompt,
    onOpen,
    onGoUp,

    addFolderPromptVisible,
    setAddFolderPromptVisible,
    handleCreateFolderSubmit,
    renamePromptVisible,
    handleRenameSubmit,
    setRenamePromptVisible,
    deletePromptVisible,
    handleDeleteSubmit,
    setDeletePromptVisible,

    currentFileName,
  };
}

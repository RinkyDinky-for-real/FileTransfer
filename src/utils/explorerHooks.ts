import * as DocumentPicker from "expo-document-picker";
import { Directory, File, Paths } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import { useCallback, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import type { FileCategory, FileSystemEntry } from "../types/ExplorerTypes";
import {
  ensureAppDirectory,
  getFilesInDirectory,
  getUniqueName,
  recursiveDeleteDirectory,
} from "./fileUtils";

const APP_DIR_NAME = "Core/Files";

export function useFileExplorer() {
  const APP_DIR = new Directory(Paths.document, APP_DIR_NAME);
  const [files, setFiles] = useState<FileSystemEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [currentDir, setCurrentDir] = useState<Directory>(APP_DIR);

  const [importFilesPromptVisible, setImportFilesPromptVisible] =
    useState(false);
  const [addFolderPromptVisible, setAddFolderPromptVisible] = useState(false);
  const [renamePromptVisible, setRenamePromptVisible] = useState(false);
  const [deletePromptVisible, setDeletePromptVisible] = useState(false);

  const [currentFileName, setCurrentFileName] = useState("");
  const [currentFileExtension, setCurrentFileExtension] = useState("");
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

  const exportFile = async (fileUri: string) => {
    if (fileUri === "") return;
    try {
      if (Platform.OS === 'ios') {
        Paths.cache.list().forEach((file) => {
          file.delete();
        });
        const isAvailable = await Sharing.isAvailableAsync();
        if (!isAvailable) return;

        const file = new File(fileUri);
        file.copy(Paths.cache);

        const copyfile = new File(Paths.cache, file.name);

        await Sharing.shareAsync(copyfile.uri);
        copyfile.delete();
      } else {
        const isAvailable = await Sharing.isAvailableAsync();
        if (!isAvailable) return;
        await Sharing.shareAsync(fileUri);
      }
    } catch (e) {
      console.error("Error exporting file", e);
      Alert.alert("Error", "Could not export file.");
    }
  };

  const handleDeleteSubmit = async () => {
    if (!targetUri) return;
    try {
      const file = new File(targetUri);
      file.delete();
      await refreshFiles();
    } catch (e) {
      try {
        const dir = new Directory(targetUri);
        await recursiveDeleteDirectory(dir);
        await refreshFiles();
      } catch (recursiveError) {
        console.error("Error deleting file", e);
        console.error("Error recursively deleting file", recursiveError);
        Alert.alert("Error", "Could not delete file.");
      }
    }
    setDeletePromptVisible(false);
  };

  const handleSetCurrentFileName = async (fullFileName: string) => {
    const parts = fullFileName.split(".");
    if (parts.length === 1) {
      setCurrentFileName(fullFileName);
      setCurrentFileExtension("");
    } else {
      const extension = parts.pop()!;
      const name = parts.join(".");
      setCurrentFileName(name);
      setCurrentFileExtension(extension);
    }
  };

  const handleRenameSubmit = async (newName: string) => {
    if (newName.trim() === "" || currentFileName === newName || !targetUri)
      return;
    let file: File | Directory;
    if (currentFileExtension === "") {
      file = new Directory(currentDir, currentFileName);
    } else {
      file = new File(currentDir, `${currentFileName}.${currentFileExtension}`);
      newName += `.${currentFileExtension}`;
    }
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

  const importFiles = async (fileType: FileCategory) => {
    try {
      let result:
        | DocumentPicker.DocumentPickerResult
        | ImagePicker.ImagePickerResult;
      if (fileType === "image" || fileType === "video") {
        result = await ImagePicker.launchImageLibraryAsync({
          allowsMultipleSelection: true,
          mediaTypes: ["images", "videos"],
        });
      } else {
        result = await DocumentPicker.getDocumentAsync({
          multiple: true,
          copyToCacheDirectory: true,
        });
      }
      if (result.canceled) return;

      result.assets.forEach(async (importedFile) => {
        const newFile = new File(importedFile.uri);
        let fileName: string;
        if ("name" in importedFile) {
          fileName = importedFile.name;
        } else {
          fileName = importedFile.fileName ?? "untitled";
        }

        const uniqueName: string = await getUniqueName(
          currentDir,
          fileName,
          true
        );
        newFile.rename(uniqueName);
        newFile.move(currentDir);

        await refreshFiles();
      });
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not import document files.");
    }
    setImportFilesPromptVisible(false);
  };

  const handleCreateFolderSubmit = async (name: string) => {
    if (name.trim() === "") return;
    try {
      const uniqueName = await getUniqueName(currentDir, name, true);
      const dir = new Directory(currentDir, uniqueName);
      if (!dir.exists) {
        dir.create();
      }
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
    onOpen,
    importFiles,
    exportFile,
    onGoUp,

    importFilesPromptVisible,
    setImportFilesPromptVisible,
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
    handleSetCurrentFileName,
    setTargetUri,
  };
}

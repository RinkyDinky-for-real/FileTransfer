import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { Directory, File, Paths } from "expo-file-system";
import {
  FileSystemEntry,
  ensureAppDirectory,
  getFilesInDirectory,
  getUniqueName,
} from "./fileUtils";

const APP_DIR_NAME = "transfile";
const APP_DIR = new Directory(Paths.document, APP_DIR_NAME);

export function useFileExplorer() {
  const [files, setFiles] = useState<FileSystemEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");

  const refreshFiles = useCallback(async () => {
    setLoading(true);
    try {
      await ensureAppDirectory(APP_DIR_NAME);
      const list = await getFilesInDirectory(APP_DIR);
      setFiles(list);
    } catch (e) {
      console.error("Error reading files", e);
      Alert.alert("Feil", "Kunne ikke lese filer.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFiles();
  }, [refreshFiles]);

  const onDelete = async (fileUri: string) => {
    Alert.alert("Slett fil", "Er du sikker?", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Slett",
        style: "destructive",
        onPress: async () => {
          try {
            const file = new File(fileUri);
            await file.delete();
            refreshFiles();
          } catch (e) {
            console.error(e);
            Alert.alert("Feil", "Kunne ikke slette fil.");
          }
        },
      },
    ]);
  };
  const onRename = async (fileUri: string, oldName: string) => {
    Alert.prompt(
      "Gi nytt navn",
      "Skriv nytt navn for filen (inkl. filendelse):",
      [
        { text: "Avbryt", style: "cancel" },
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
              Alert.alert("Feil", "Kunne ikke gi nytt navn.");
            }
          },
        },
      ],
      "plain-text",
      oldName
    );
  };
  const createFolder = async () => {
    Alert.prompt("Ny mappe", "Navn på mappe:", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Opprett",
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
            Alert.alert("Feil", "Kunne ikke opprette mappe.");
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
    refreshFiles,
    onDelete,
    onRename,
    createFolder,
    filteredFiles,
  };
}

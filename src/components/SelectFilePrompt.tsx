import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Button, Alert, Modal, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Directory, Paths } from "expo-file-system";
import { getFilesInDirectory, ensureAppDirectory } from "../utils/fileUtils";
import type { FileSystemEntry } from "../utils/fileUtils";
import CurrentDirectoryPath from "./CurrentDirectoryPath";

const APP_DIR_NAME = "Core/Files";

type SelectFilePromptProps = {
  visible: boolean;
  onClose: () => void;
  onFileSelect: (file: FileSystemEntry) => Promise<void>;
  onViewMore: () => Promise<void>;
};

export default function SelectFilePrompt({
  visible,
  onClose,
  onFileSelect,
  onViewMore,
}: SelectFilePromptProps) {
  const APP_DIR = new Directory(Paths.document, APP_DIR_NAME);
  const [files, setFiles] = useState<FileSystemEntry[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [currentDir, setCurrentDir] = useState<Directory | null>(null);

  useEffect(() => {
    if (visible) {
      async function resetDir() {
        try {
          await ensureAppDirectory(APP_DIR_NAME);
          const dir = new Directory(Paths.document, APP_DIR_NAME);
          setCurrentDir(dir);
        } catch (e) {
          console.error("Failed to set up app directory", e);
        }
      }
      resetDir();
    }
  }, [visible]);

  const refreshFiles = useCallback(async () => {
    if (!currentDir) return;
    setLoadingFiles(true);
    try {
      await ensureAppDirectory(APP_DIR_NAME);
      const list = await getFilesInDirectory(currentDir);
      setFiles(list);
    } catch (e) {
      console.error("Error reading files", e);
      Alert.alert("Error", "Could not read files.");
    } finally {
      setLoadingFiles(false);
    }
  }, [currentDir]);

  useEffect(() => {
    if (visible && currentDir) {
      refreshFiles();
    }
  }, [visible, currentDir, refreshFiles]);

  const handleOpenDirectory = useCallback(async (fileUri: string) => {
    try {
      const { exists, isDirectory } = Paths.info(fileUri);
      if (!exists || !isDirectory) return;
      const newDir = new Directory(fileUri);
      setCurrentDir(newDir);
      await refreshFiles();
    } catch (e) {
      console.error("Error opening directory", e);
      Alert.alert("Error", "Could not open directory.");
    }
  }, [refreshFiles]);

  const handleGoUp = useCallback(async () => {
    if (!currentDir) return;
    const parentDir = currentDir.parentDirectory;
    if (!parentDir) return;
    setCurrentDir(parentDir);
    await refreshFiles();
  }, [currentDir, refreshFiles]);

  const handleSelectItem = async (file: FileSystemEntry) => {
    if (file.isDirectory) {
      await handleOpenDirectory(file.uri);
      return;
    }
    
    await onFileSelect(file);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Select a file</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={28} />
          </TouchableOpacity>
        </View>

        {currentDir && (
          <CurrentDirectoryPath
            path={`${APP_DIR_NAME}/${currentDir.uri.replace(APP_DIR.uri, "")}`}
            canGoUp={currentDir.uri !== APP_DIR.uri}
            onGoUp={handleGoUp}
          />
        )}

        {loadingFiles ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
          </View>
        ) : files.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 16, color: "#666", marginBottom: 16 }}>
              No files found in this directory
            </Text>
            <Button title="View More" onPress={onViewMore} />
          </View>
        ) : (
          <>
            <FlatList<FileSystemEntry>
              data={files}
              keyExtractor={(item) => item.uri}
              style={{ flex: 1 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectItem(item)}
                  style={{
                    padding: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    borderBottomWidth: 1,
                    borderColor: "#eee",
                  }}
                >
                  <View style={{ width: 36 }}>
                    <MaterialIcons 
                      name={item.isDirectory ? "folder" : "insert-drive-file"} 
                      size={28}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16 }}>{item.name}</Text>
                    <Text style={{ fontSize: 12, color: "#666" }}>
                      {item.isDirectory ? "Folder" : item.size ? `${item.size} bytes` : ""}
                    </Text>
                  </View>
                  {item.isDirectory && (
                    <MaterialIcons name="chevron-right" size={24} color="#999" />
                  )}
                </TouchableOpacity>
              )}
            />
            <View style={{ paddingTop: 16 }}>
              <Button title="View More" onPress={onViewMore} />
            </View>
          </>
        )}
      </SafeAreaView>
    </Modal>
  );
}


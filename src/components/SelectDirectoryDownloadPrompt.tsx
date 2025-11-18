import { MaterialIcons } from "@expo/vector-icons";
import { Directory, Paths } from "expo-file-system";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import type { FileSystemEntry } from "../types/ExplorerTypes";
import { ensureAppDirectory, getFilesInDirectory, getUniqueName } from "../utils/fileUtils";
import AddFolderPrompt from "./AddFolderPrompt";
import CurrentDirectoryPath from "./CurrentDirectoryPath";

const APP_DIR_NAME = "Core/Files";
const APP_DIR = new Directory(Paths.document, APP_DIR_NAME);

type SelectDirectoryDownloadPromptProps = {
  visible: boolean;
  onClose: () => void;
  onDownloadDirectoryPicked: (path: string) => void;
};

export default function SelectDirectoryDownloadPrompt({
  visible,
  onClose,
  onDownloadDirectoryPicked: onDownloadPicked,
}: SelectDirectoryDownloadPromptProps) {
  const [files, setFiles] = useState<FileSystemEntry[]>([]);
  const [currentDir, setCurrentDir] = useState<Directory | null>(null);
  const [addFolderPromptVisible, setAddFolderPromptVisible] = useState(false);

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
    try {
      await ensureAppDirectory(APP_DIR_NAME);
      const list = await getFilesInDirectory(currentDir);
      const directories = list.filter(f => f.isDirectory);
      setFiles(directories);
    } catch (e) {
      console.error("Error reading files", e);
      Alert.alert("Error", "Could not read files.");
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

    const handleCreateFolderSubmit = async (name: string) => {
      if (!name) return;
      try {
        const uniqueName = await getUniqueName(currentDir!, name, true);
        const dir = new Directory(currentDir!, uniqueName);
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, padding: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Download file to...</Text>
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

        {files.length === 0 ? (
            <>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap:"8"}}>
                    <Button title="Add directory?" onPress={() => setAddFolderPromptVisible(true)} />
                </View>
                <View style={{ gap: 8 }}>
                    <Button title={`Download to "${currentDir?.name}"`} onPress={() => onDownloadPicked(currentDir?.uri!)} />
                </View>
            </>
        ) : (
          <>
            <FlatList<FileSystemEntry>
              data={files}
              keyExtractor={(item) => item.uri}
              style={{ flex: 1 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleOpenDirectory(item.uri)}
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
            <View style={{ gap: 8 }}>
              <Button title={`Download to "${currentDir?.name}"`} onPress={() => onDownloadPicked(currentDir?.uri!)} />
            </View>
          </>
        )}
      </View>
      <AddFolderPrompt
        visible={addFolderPromptVisible}
        onCancel={() => setAddFolderPromptVisible(false)}
        onSubmit={handleCreateFolderSubmit}
      />
    </Modal>
    
  );
}


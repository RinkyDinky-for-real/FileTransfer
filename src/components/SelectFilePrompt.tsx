import React, { useState, useEffect, useCallback, Fragment } from "react";
import { View, Text, Button, Alert, Modal, FlatList, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Directory, Paths } from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { uploadFile } from "../utils/transferApi";
import { getFilesInDirectory, ensureAppDirectory } from "../utils/fileUtils";
import type { FileSystemEntry } from "../types/ExplorerTypes";
import CurrentDirectoryPath from "./CurrentDirectoryPath";

const APP_DIR_NAME = "Core/Files";

type SelectFilePromptProps = {
  visible: boolean;
  onClose: () => void;
  onUploadSuccess?: (pin: string) => void;
  setLoading: (loading: boolean) => void;
};

export default function SelectFilePrompt({
  visible,
  onClose,
  onUploadSuccess,
  setLoading,
}: SelectFilePromptProps) {
  const APP_DIR = new Directory(Paths.document, APP_DIR_NAME);
  const [files, setFiles] = useState<FileSystemEntry[]>([]);
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
    try {
      await ensureAppDirectory(APP_DIR_NAME);
      const list = await getFilesInDirectory(currentDir);
      setFiles(list);
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

  const handleSelectFile = async (file: FileSystemEntry) => {
    onClose();
    setLoading(true);
    try {
      const response = await uploadFile(file.uri, file.name);
      if (onUploadSuccess) onUploadSuccess(response.pin);
      Alert.alert("Success", `Your file PIN: ${response.pin}`);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMore = async () => {
    onClose();
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (!result.assets || result.assets.length === 0) return;

      const file = result.assets[0];
      setLoading(true);
      const response = await uploadFile(file.uri, file.name);
      if (onUploadSuccess) onUploadSuccess(response.pin);
      Alert.alert("Success", `Your file PIN: ${response.pin}`);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

    const handleViewMedia = async () => {
    onClose();
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        quality: 1
      });
      if (!result.assets || result.assets.length === 0) return;

      const file = result.assets[0];
      let fileName = "";

      const parts = file.uri.split(".");
      if (parts.length > 1) {
        const extension = parts.pop()!.toLowerCase();
        fileName = file.fileName || `image_${Date.now()}.${extension}`;
      } else throw new Error("Invalid media file");

      setLoading(true);
      const response = await uploadFile(file.uri, fileName);
      if (onUploadSuccess) onUploadSuccess(response.pin);
      Alert.alert("Success", `Your file PIN: ${response.pin}`);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = async (file: FileSystemEntry) => {
    if (file.isDirectory) {
      await handleOpenDirectory(file.uri);
      return;
    }
    
    await handleSelectFile(file);
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

        {files.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap:"8"}}>
            <Text style={{ fontSize: 16, color: "#666", marginBottom: 16 }}>
              No files found in this directory
            </Text>
            <Button title="View Files" onPress={handleViewMore} />
            <Button title="View Media" onPress={handleViewMedia} />

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
            <View style={{ gap: 8 }}>
              <Button title="View Files" onPress={handleViewMore} />
              <Button title="View Media" onPress={handleViewMedia} />
            </View>
          </>
        )}
      </SafeAreaView>
    </Modal>
  );
}


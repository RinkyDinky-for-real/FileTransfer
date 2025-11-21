import React from "react";
import { Platform, ActivityIndicator, FlatList, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddFolderPrompt from "../components/AddFolderPrompt";
import CurrentDirectoryPath from "../components/CurrentDirectoryPath";
import DeletePrompt from "../components/DeletePrompt";
import ExplorerHeader from "../components/ExplorerHeader";
import FileItem from "../components/FileItem";
import ImportFilesPrompt from "../components/ImportFilesPrompt";
import RenamePrompt from "../components/RenamePrompt";
import type { FileSystemEntry } from "../types/ExplorerTypes";
import { useFileExplorer } from "../utils/explorerHooks";
import SelectDirectoryPrompt from "../components/SelectDirectoryPrompt";
import { moveFile } from "../utils/fileUtils";

export default function FileExplorer() {
  const {
    filteredFiles,
    loading,
    currentDir,
    APP_DIR_NAME,
    APP_DIR,
    query,
    setQuery,
    refreshFiles,
    onOpen,
    onLongPress,
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
    setShowDirectoryPicker,
    showDirectoryPicker,
    longPressedFile,

    currentFileName,
    handleSetCurrentFileName,
    setTargetUri,
  } = useFileExplorer();


  if (!currentDir.exists) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView
      edges={Platform.OS === "ios" ? ["left", "right", "bottom"] : ["top","left", "right", "bottom"]}
      style={{ flex: 1, padding: 12 }}
    >
      <ExplorerHeader
        query={query}
        setQuery={setQuery}
        onRefresh={refreshFiles}
        onCreate={() => setAddFolderPromptVisible(true)}
        onImport={() => setImportFilesPromptVisible(true)}
      />
      <View style={{ flex: 1 }}>
        <CurrentDirectoryPath
          path={`${APP_DIR_NAME}/${currentDir.uri.replace(APP_DIR.uri, "")}`}
          canGoUp={currentDir.uri !== APP_DIR.uri}
          onGoUp={onGoUp}
        />
        <View style={{ flex: 1 }}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <FlatList<FileSystemEntry>
              data={filteredFiles}
              keyExtractor={(item) => item.uri}
              renderItem={({ item }) => (
                <FileItem
                  file={item}
                  onDelete={() => {
                    setTargetUri(item.uri);
                    setDeletePromptVisible(true);
                  }}
                  onRename={() => {
                    setTargetUri(item.uri);
                    handleSetCurrentFileName(item.name);
                    setRenamePromptVisible(true);
                  }}
                  onExport={() => exportFile(item.uri)}
                  onOpen={() => onOpen(item.uri)}
                  onLongPress={() => onLongPress(item.uri)}
                />
              )}
            />
          )}
        </View>
      </View>

      <AddFolderPrompt
        visible={addFolderPromptVisible}
        onCancel={() => setAddFolderPromptVisible(false)}
        onSubmit={handleCreateFolderSubmit}
      />

      <ImportFilesPrompt
        visible={importFilesPromptVisible}
        onCancel={() => setImportFilesPromptVisible(false)}
        onSubmit={importFiles}
      />

      <RenamePrompt
        visible={renamePromptVisible}
        oldName={currentFileName}
        onCancel={() => setRenamePromptVisible(false)}
        onSubmit={handleRenameSubmit}
      />

      <DeletePrompt
        visible={deletePromptVisible}
        onCancel={() => setDeletePromptVisible(false)}
        onSubmit={handleDeleteSubmit}
      />

      <SelectDirectoryPrompt
        visible={showDirectoryPicker}
        onClose={() => setShowDirectoryPicker(false)}
        onDirectoryPicked={async (path) => {
          setShowDirectoryPicker(false);
          try {
            await moveFile(longPressedFile!, path);
            await refreshFiles();

            Alert.alert("Moved file", `File moved to: ${path}`);
          } catch (err: any) {
            Alert.alert("Error", err.message);
          } 
        }}
      />
    </SafeAreaView>
  );
}

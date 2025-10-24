import React from "react";
import { View, ActivityIndicator, FlatList } from "react-native";
import FileItem from "../components/FileItem";
import ExplorerHeader from "../components/ExplorerHeader";
import CurrentDirectoryPath from "../components/CurrentDirectoryPath";
import AddFolderPrompt from "../components/AddFolderPrompt";
import RenamePrompt from "../components/RenamePrompt";
import DeletePrompt from "../components/DeletePrompt";
import { useFileExplorer } from "../utils/explorerHooks";
import type { FileSystemEntry } from "../utils/fileUtils";

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
  } = useFileExplorer();

  if (!currentDir.exists) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <ExplorerHeader
        query={query}
        setQuery={setQuery}
        onRefresh={refreshFiles}
        onCreate={() => setAddFolderPromptVisible(true)}
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
                  onDelete={() => showDeletePrompt(item.uri)}
                  onRename={() => showRenamePrompt(item.uri, item.name)}
                  onOpen={() => onOpen(item.uri)}
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
    </View>
  );
}

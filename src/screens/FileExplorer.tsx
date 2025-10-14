import React from "react";
import { View, ActivityIndicator, FlatList } from "react-native";
import FileItem from "../components/FileItem";
import ExplorerHeader from "../components/ExplorerHeader";
import CurrentDirectoryPath from "../components/CurrentDirectoryPath";
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
    onDelete,
    onRename,
    onOpen,
    createFolder,
    onGoUp,
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
        onCreateFolder={createFolder}
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
                  onDelete={() => onDelete(item.uri)}
                  onRename={() => onRename(item.uri, item.name)}
                  onOpen={() => onOpen(item.uri)}
                />
              )}
            />
          )}
        </View>
      </View>
    </View>
  );
}

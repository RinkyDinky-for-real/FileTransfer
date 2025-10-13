import React from "react";
import { View, ActivityIndicator, FlatList, Alert } from "react-native";
import FileItem from "../components/FileItem";
import ExplorerHeader from "../components/ExplorerHeader";
import { useFileExplorer } from "../utils/explorerHooks";
import type { FileSystemEntry } from "../utils/fileUtils";

export default function FileExplorer() {
  const {
    files,
    loading,
    query,
    setQuery,
    filteredFiles,
    refreshFiles,
    onDelete,
    onRename,
    createFolder,
  } = useFileExplorer();

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <ExplorerHeader
        query={query}
        setQuery={setQuery}
        onRefresh={refreshFiles}
        onCreateFolder={createFolder}
      />

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
              onOpen={() =>
                Alert.alert("Åpne", "Åpne-funksjon ikke implementert i alpha.")
              }
            />
          )}
        />
      )}
    </View>
  );
}

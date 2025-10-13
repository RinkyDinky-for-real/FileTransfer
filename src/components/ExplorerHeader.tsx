import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type ExplorerHeaderProps = {
  query: string;
  setQuery: (value: string) => void;
  onRefresh: () => void;
  onCreateFolder: () => void;
};

export default function ExplorerHeader({
  query,
  setQuery,
  onRefresh,
  onCreateFolder,
}: ExplorerHeaderProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", flex: 1 }}>
          Filoversikt
        </Text>
        <TouchableOpacity onPress={onCreateFolder} style={{ padding: 6 }}>
          <MaterialIcons name="create-new-folder" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onRefresh} style={{ padding: 6 }}>
          <MaterialIcons name="refresh" size={24} />
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Søk filer..."
        value={query}
        onChangeText={setQuery}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 8,
        }}
      />
    </View>
  );
}

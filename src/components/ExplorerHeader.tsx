import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type ExplorerHeaderProps = {
  query: string;
  setQuery: (value: string) => void;
  onRefresh: () => void;
  onCreate: () => void;
};

export default function ExplorerHeader({
  query,
  setQuery,
  onRefresh,
  onCreate,
}: ExplorerHeaderProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", flex: 1 }}>
          File Overview
        </Text>
        <Pressable
          onPress={onCreate}
          style={({ pressed }) => ({
            padding: 6,
            opacity: pressed ? 0.4 : 1,
          })}
        >
          <MaterialIcons name="add" size={24} />
        </Pressable>
        <Pressable
          onPress={onRefresh}
          style={({ pressed }) => ({
            padding: 6,
            opacity: pressed ? 0.4 : 1,
          })}
        >
          <MaterialIcons name="refresh" size={24} />
        </Pressable>
      </View>

      <TextInput
        placeholder="Search files..."
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

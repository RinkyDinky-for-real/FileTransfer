import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type ExplorerHeaderProps = {
  query: string;
  setQuery: (value: string) => void;
  onRefresh: () => void;
  onCreate: () => void;
  onImport: () => void;
};

export default function ExplorerHeader({
  query,
  setQuery,
  onRefresh,
  onCreate,
  onImport,
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
          <MaterialIcons name="create-new-folder" size={26} />
        </Pressable>
        <Pressable
          onPress={onImport}
          style={({ pressed }) => ({
            padding: 6,
            opacity: pressed ? 0.4 : 1,
          })}
        >
          <MaterialIcons name="add" size={26} />
        </Pressable>
        <Pressable
          onPress={onRefresh}
          style={({ pressed }) => ({
            padding: 6,
            opacity: pressed ? 0.4 : 1,
          })}
        >
          <MaterialIcons name="refresh" size={26} />
        </Pressable>
      </View>

      <View style={{ position: 'relative' }}>
        <TextInput
          placeholder="Search files..."
          placeholderTextColor="#979797ff"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 8,
            paddingRight: query ? 35 : 10,
          }}
        />
        {query.length > 0 && (
          <Pressable
            onPress={() => setQuery("")}
            style={{
              position: 'absolute',
              right: 8,
              top: 4,
              padding: 4,
            }}
          >
            <MaterialIcons name="clear" size={20} color="#686868ff" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function FileItem({ file, onDelete, onRename, onOpen }) {
  const isFolder = file.isDirectory;

  return (
    <TouchableOpacity
      onPress={onOpen}
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
          name={isFolder ? "folder" : "insert-drive-file"}
          size={28}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16 }}>{file.name}</Text>
        <Text style={{ fontSize: 12, color: "#666" }}>
          {file.size ? `${file.size} bytes` : ""}
        </Text>
      </View>

      <TouchableOpacity onPress={onRename} style={{ padding: 6 }}>
        <MaterialIcons name="drive-file-rename-outline" size={20} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={{ padding: 6 }}>
        <MaterialIcons name="delete-outline" size={20} color="#c00" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

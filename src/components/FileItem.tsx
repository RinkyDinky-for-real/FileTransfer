import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import type { FileSystemEntry } from "../types/ExplorerTypes";

interface FileItemProps {
  file: FileSystemEntry;
  onDelete: () => void;
  onRename: () => void;
  onExport: () => void;
  onOpen: () => void;
  onLongPress: () => void;
}

export default function FileItem({
  file,
  onDelete,
  onRename,
  onExport,
  onOpen,
  onLongPress,
}: FileItemProps) {
  return (
    <TouchableOpacity
      onPress={onOpen}
      onLongPress={onLongPress}
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
          name={file.typeInfo.icon}
          color={file.typeInfo.color}
          size={28}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16 }}>{file.name}</Text>
        <Text style={{ fontSize: 12, color: "#666" }}>
          {file.size ? `${(file.size / 1000000).toFixed(2)} MB` : ""}
        </Text>
      </View>

      <TouchableOpacity onPress={onRename} style={{ padding: 6 }}>
        <MaterialIcons name="drive-file-rename-outline" size={20} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onExport} style={{ padding: 6 }}>
        <MaterialIcons name="share" size={20} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={{ padding: 6 }}>
        <MaterialIcons name="delete-outline" size={20} color="#c00" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

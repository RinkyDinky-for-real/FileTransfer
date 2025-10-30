import { MaterialIcons } from "@expo/vector-icons";

export type FileCategory =
  | "text"
  | "document"
  | "image"
  | "video"
  | "audio"
  | "archive"
  | "unknown";

export interface FileTypeInfo {
  mime: string;
  extensions: string[];
  category: FileCategory;
  icon: keyof typeof MaterialIcons.glyphMap;
}

export const FileTypes: FileTypeInfo[] = [
  {
    mime: "image/png",
    extensions: [".png"],
    category: "image",
    icon: "image",
  },
  {
    mime: "image/jpeg",
    extensions: [".jpg", ".jpeg"],
    category: "image",
    icon: "image",
  },
  {
    mime: "application/pdf",
    extensions: [".pdf"],
    category: "document",
    icon: "picture-as-pdf",
  },
  {
    mime: "application/zip",
    extensions: [".zip", ".rar"],
    category: "archive",
    icon: "archive",
  },
  {
    mime: "text/plain",
    extensions: [".txt"],
    category: "document",
    icon: "description",
  },
  {
    mime: "*/*",
    extensions: [],
    category: "unknown",
    icon: "insert-drive-file",
  },
];

export type IconName = keyof typeof MaterialIcons.glyphMap;

export type FileSystemEntry = {
  name: string;
  uri: string;
  isDirectory: boolean;
  icon: keyof typeof MaterialIcons.glyphMap;
  size: number;
  modificationTime: number;
};

import { MaterialIcons } from "@expo/vector-icons";
import { ColorValue } from "react-native";

export type FileCategory =
  | "text"
  | "document"
  | "image"
  | "video"
  | "audio"
  | "archive"
  | "directory"
  | "unknown";

export interface FileTypeInfo {
  mime: string;
  extensions: string[];
  category: FileCategory;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: ColorValue | undefined;
}

export const FileTypes: FileTypeInfo[] = [
  // folder
  {
    mime: "directory",
    extensions: [],
    category: "directory",
    icon: "folder",
    color: "#ffd754ff",
  },
  // images
  {
    mime: "image/png",
    extensions: [".png"],
    category: "image",
    icon: "image",
    color: "#2c5f92ff",
  },
  {
    mime: "image/jpeg",
    extensions: [".jpg", ".jpeg"],
    category: "image",
    icon: "image",
    color: "#2c5f92ff",
  },
  // videos
  {
    mime: "video/mp4",
    extensions: [".mp4"],
    category: "video",
    icon: "movie",
    color: "#4291d7ff",
  },
  {
    mime: "video/mpeg",
    extensions: [".mpeg", ".mpg"],
    category: "video",
    icon: "movie",
    color: "#4291d7ff",
  },
  {
    mime: "video/quicktime",
    extensions: [".mov"],
    category: "video",
    icon: "movie",
    color: "#4291d7ff",
  },
  {
    mime: "video/x-matroska",
    extensions: [".mkv"],
    category: "video",
    icon: "movie",
    color: "#4291d7ff",
  },
  // audio
  {
    mime: "audio/mpeg",
    extensions: [".mp3"],
    category: "audio",
    icon: "music-note",
    color: "#45216dff",
  },
  {
    mime: "audio/wav",
    extensions: [".wav"],
    category: "audio",
    icon: "music-note",
    color: "#45216dff",
  },
  {
    mime: "audio/aac",
    extensions: [".aac"],
    category: "audio",
    icon: "music-note",
    color: "#45216dff",
  },
  {
    mime: "audio/ogg",
    extensions: [".ogg"],
    category: "audio",
    icon: "music-note",
    color: "#45216dff",
  },
  // documents
  {
    mime: "application/pdf",
    extensions: [".pdf"],
    category: "document",
    icon: "picture-as-pdf",
    color: "#e44b4d",
  },
  {
    mime: "application/zip",
    extensions: [".zip", ".rar"],
    category: "archive",
    icon: "archive",
    color: "#ffd754ff",
  },
  {
    mime: "text/plain",
    extensions: [".txt"],
    category: "document",
    icon: "description",
    color: "#666468ff",
  },
  {
    mime: "*/*",
    extensions: [],
    category: "unknown",
    icon: "insert-drive-file",
    color: "#666468ff",
  },
];

export type IconName = keyof typeof MaterialIcons.glyphMap;

export type FileSystemEntry = {
  name: string;
  uri: string;
  isDirectory: boolean;
  typeInfo: FileTypeInfo;
  size: number;
  modificationTime: number;
};

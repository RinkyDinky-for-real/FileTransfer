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
  // images
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
  // videos
  {
    mime: "video/mp4",
    extensions: [".mp4"],
    category: "video",
    icon: "movie",
  },
  {
    mime: "video/mpeg",
    extensions: [".mpeg", ".mpg"],
    category: "video",
    icon: "movie",
  },
  {
    mime: "video/quicktime",
    extensions: [".mov"],
    category: "video",
    icon: "movie",
  },
  {
    mime: "video/x-matroska",
    extensions: [".mkv"],
    category: "video",
    icon: "movie",
  },
  // audio
  {
    mime: "audio/mpeg",
    extensions: [".mp3"],
    category: "audio",
    icon: "music-note",
  },
  {
    mime: "audio/wav",
    extensions: [".wav"],
    category: "audio",
    icon: "music-note",
  },
  {
    mime: "audio/aac",
    extensions: [".aac"],
    category: "audio",
    icon: "music-note",
  },
  {
    mime: "audio/ogg",
    extensions: [".ogg"],
    category: "audio",
    icon: "music-note",
  },
  // documents
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

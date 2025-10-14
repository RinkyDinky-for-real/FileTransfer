import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { truncateName } from "../utils/fileUtils";

type CurrentDirectoryPathProps = {
  path: string;
  canGoUp?: boolean;
  onGoUp?: () => void;
};

export default function CurrentDirectoryPath({
  path,
  canGoUp = false,
  onGoUp,
}: CurrentDirectoryPathProps) {
  const MAX_SEGMENTS = 3;

  const segments = path.split("/").filter(Boolean);

  let displaySegments = [...segments];
  if (segments.length > MAX_SEGMENTS) {
    displaySegments = ["...", ...segments.slice(-MAX_SEGMENTS)];
  }
  const lastIndex = displaySegments.length - 1;

  return (
    <View style={{ flexDirection: "row", paddingBottom: 4, paddingLeft: 4 }}>
      {canGoUp && (
        <Pressable
          onPress={onGoUp}
          style={({ pressed }) => ({
            marginRight: 4,
            paddingLeft: 2,
            opacity: pressed ? 0.4 : 1,
          })}
          hitSlop={10}
        >
          <MaterialIcons name="arrow-upward" size={16} color={"#333"} />
        </Pressable>
      )}
      <Text
        numberOfLines={1}
        ellipsizeMode="middle"
        style={{ fontSize: 12, color: "#333" }}
      >
        {displaySegments.map((segment, index) => (
          <Text
            key={index}
            style={{
              fontWeight: index === lastIndex ? "700" : "400",
            }}
          >
            {truncateName(segment)}
            {index < lastIndex && "/"}
          </Text>
        ))}
      </Text>
    </View>
  );
}

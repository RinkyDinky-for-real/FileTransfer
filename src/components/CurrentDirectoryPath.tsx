import React from "react";
import { View, Text } from "react-native";

type CurrentDirectoryPathProps = {
  path: string;
};

export default function CurrentDirectoryPath({
  path,
}: CurrentDirectoryPathProps) {
  const segments = path.split("/").filter(Boolean);
  const lastIndex = segments.length - 1;
  return (
    <View style={{ paddingBottom: 4, paddingLeft: 4 }}>
      <Text
        numberOfLines={1}
        ellipsizeMode="middle"
        style={{ fontSize: 12, color: "#333" }}
      >
        {segments.map((segment, index) => (
          <Text
            key={index}
            style={{
              fontWeight: index === lastIndex ? "700" : "400",
            }}
          >
            {segment}
            {index < lastIndex && "/"}
          </Text>
        ))}
      </Text>
    </View>
  );
}

import React from "react";
import { Button, Modal, StyleSheet, Text, View } from "react-native";
import { FileCategory } from "../types/ExplorerTypes";

interface ImportFilesPromptProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (fileType: FileCategory) => void;
}

export default function ImportFilesPrompt({
  visible,
  onCancel,
  onSubmit,
}: ImportFilesPromptProps) {
  return (
    <Modal transparent visible={visible} onRequestClose={() => onCancel()}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Import</Text>
          <Button title="Add Files" onPress={() => onSubmit("document")} />
          <Button title="Add Media" onPress={() => onSubmit("image")} />
          <View style={styles.modalButtonContainer}>
            <Button title="Cancel" onPress={() => onCancel()} color="#888" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    gap: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
});

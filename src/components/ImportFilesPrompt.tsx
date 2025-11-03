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
    <Modal transparent visible={visible} onRequestClose={() => onCancel}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Import</Text>
          <Text style={styles.modalMessage}>Choose type:</Text>
          <View style={styles.modalButtonContainer}>
            <Button
              title="Files"
              onPress={() => onSubmit("document")}
              color="#888"
            />
            <Button title="Media" onPress={() => onSubmit("image")} />
          </View>
          <View style={styles.modalButtonContainer}>
            <Button title="Cancel" onPress={() => onCancel} color="#888" />
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

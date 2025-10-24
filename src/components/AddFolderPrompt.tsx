import React, { useState } from "react";
import { View, Modal, TextInput, Button, StyleSheet, Text } from "react-native";

interface AddFolderPromptProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (name: string) => void;
}

export default function AddfolderPrompt({
  visible,
  onCancel,
  onSubmit,
}: AddFolderPromptProps) {
  const [inputValue, setInputValue] = useState("");

  const handlePressSubmit = () => {
    onSubmit(inputValue);
    setInputValue("");
  };

  const handlePressCancel = () => {
    onCancel();
    setInputValue("");
  };

  return (
    <Modal transparent visible={visible} onRequestClose={handlePressCancel}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>New folder</Text>
          <Text style={styles.modalMessage}>Name of folder:</Text>
          <TextInput
            style={styles.modalInput}
            onChangeText={setInputValue}
            value={inputValue}
            placeholder="Folder name"
          />
          <View style={styles.modalButtonContainer}>
            <Button title="Cancel" onPress={handlePressCancel} color="#888" />
            <Button title="Create" onPress={handlePressSubmit} />
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

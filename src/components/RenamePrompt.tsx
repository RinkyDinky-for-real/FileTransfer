import React, { useState, useEffect } from "react";
import { View, Modal, TextInput, Button, StyleSheet, Text } from "react-native";

interface RenamePromptProps {
  visible: boolean;
  oldName: string;
  onCancel: () => void;
  onSubmit: (newName: string) => void;
}

export default function RenamePrompt({
  visible,
  oldName,
  onCancel,
  onSubmit,
}: RenamePromptProps) {
  const [inputValue, setInputValue] = useState(oldName);

  useEffect(() => {
    if (visible) {
      setInputValue(oldName);
    }
  }, [visible, oldName]);

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
          <Text style={styles.modalTitle}>Rename</Text>
          <Text style={styles.modalMessage}>Type a new name:</Text>
          <TextInput
            style={styles.modalInput}
            onChangeText={setInputValue}
            value={inputValue}
            placeholder="New name"
          />
          <View style={styles.modalButtonContainer}>
            <Button title="Cancel" onPress={handlePressCancel} color="#888" />
            <Button title="OK" onPress={handlePressSubmit} />
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
    marginTop: 8,
  },
});

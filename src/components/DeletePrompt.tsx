import React from "react";
import { View, Modal, Button, StyleSheet, Text } from "react-native";

interface DeletePromptProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function DeletePrompt({
  visible,
  onCancel,
  onSubmit,
}: DeletePromptProps) {
  const handlePressSubmit = () => {
    onSubmit();
  };

  const handlePressCancel = () => {
    onCancel();
  };

  return (
    <Modal transparent visible={visible} onRequestClose={handlePressCancel}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Delete</Text>
          <Text style={styles.modalMessage}>Are you sure?</Text>
          <View style={styles.modalButtonContainer}>
            <Button title="Cancel" onPress={handlePressCancel} color="#888" />
            <Button title="Delete" onPress={handlePressSubmit} />
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

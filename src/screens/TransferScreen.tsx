import React, { useState } from "react";
import { View, Text, Button, Alert, TextInput } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { uploadFile, downloadFile } from "../utils/transferApi";

export default function TransferScreen() {
  const [pin, setPin] = useState<string | null>(null);
  const [downloadPin, setDownloadPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (!result.assets || result.assets.length === 0) return;

      const file = result.assets[0];
      setLoading(true);
      const response = await uploadFile(file.uri, file.name);
      setPin(response.pin);
      Alert.alert("Success", `Your file PIN: ${response.pin}`);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
  if (!downloadPin) return Alert.alert("Error", "Enter a PIN");
  setLoading(true);
  try {
    const localUri = await downloadFile(downloadPin, `downloaded_${Date.now()}`);
    Alert.alert("Downloaded!", `File saved to ${localUri}`);
  } catch (err: any) {
    Alert.alert("Error", err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
        Upload a file
      </Text>
      <Button title="Pick & Upload File" onPress={handlePickFile} disabled={loading} />

      {pin && (
        <Text style={{ marginTop: 12, fontSize: 16 }}>
          Your current PIN: {pin}
        </Text>
      )}

      <View style={{ marginTop: 32 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
          Download a file
        </Text>
        <Text>Enter PIN:</Text>
        <TextInput
          placeholder="PIN"
          value={downloadPin}
          onChangeText={setDownloadPin}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 6,
            padding: 8,
            marginVertical: 8,
          }}
        />
        <Button title="Download File" onPress={handleDownload} disabled={loading} />
      </View>
    </View>
  );
}

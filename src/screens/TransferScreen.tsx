import React, { useState } from "react";
import { View, Text, Button, Alert, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { downloadFile } from "../utils/transferApi";
import SelectFilePrompt from "../components/SelectFilePrompt";
import SelectDirectoryDowloadPrompt from "../components/SelectDirectoryDowloadPrompt";

export default function TransferScreen() {
  const [pin, setPin] = useState<string | null>(null);
  const [downloadPin, setDownloadPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFilePicker, setShowFilePicker] = useState(false);
  const [showDirectoryPicker, setShowDirectoryPicker] = useState(false);

  const handlePickFile = async () => {
    setShowFilePicker(true);
  };

const handleDownload = () => {
  if (!downloadPin)
    return Alert.alert("Error", "Enter a PIN");

  setShowDirectoryPicker(true);
};

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
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

      <SelectFilePrompt
        visible={showFilePicker}
        onClose={() => setShowFilePicker(false)}
        onUploadSuccess={(pin) => setPin(pin)}
        onLoadingChange={setLoading}
      />
      <SelectDirectoryDowloadPrompt
        visible={showDirectoryPicker}
        onClose={() => setShowDirectoryPicker(false)}
        onDownloadDirectoryPicked={async (path) => {
          setShowDirectoryPicker(false);
          try {
            setLoading(true);
            const destination = path.split("Core/Files")[1];
            const localUri = await downloadFile(downloadPin, destination);

            Alert.alert("Downloaded!", `File saved to ${localUri}`);
          } catch (err: any) {
            Alert.alert("Error", err.message);
          } finally {
            setLoading(false);
          }
        }}
      />
    </SafeAreaView>
  );
}

import * as FileSystem from "expo-file-system/legacy";

const SERVER_URL = "https://unvirulent-prunted-kacy.ngrok-free.dev";

export async function uploadFile(fileUri: string, fileName: string) {
  const formData = new FormData();
  formData.append("file", {
    uri: fileUri,
    name: fileName,
    type: "application/octet-stream",
  } as any);

  const res = await fetch(`${SERVER_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");
  return await res.json();
}

export async function downloadFile(pin: string, localFileName: string) {
  const res = await fetch(`${SERVER_URL}/download/${pin}`);
  if (!res.ok) throw new Error("Invalid PIN");

  const arrayBuffer = await res.arrayBuffer();

  let binary = "";
  const bytes = new Uint8Array(arrayBuffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  const base64 = btoa(binary);

  const localUri = (FileSystem as any).documentDirectory + localFileName;
  await (FileSystem as any).writeAsStringAsync(localUri, base64, {
    encoding: "base64",
  });

  return localUri;
}

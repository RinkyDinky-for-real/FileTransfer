import * as FileSystem from "expo-file-system/legacy";

const SERVER_URL = "https://terrie-prepatrician-cira.ngrok-free.dev";
const APP_DIR_NAME = "Core/Files";

export async function uploadFile(fileUri: string, fileName: string) {
  const formData = new FormData();
  formData.append("file", {
    uri: fileUri,
    name: fileName,
    type: "application/octet-stream",
  } as any);

  const res = await fetch(`${SERVER_URL}/upload`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) throw new Error("Upload failed in API");
  return await res.json();
}

export async function downloadFile(pin: string, downloadPath: string) {
  const res = await fetch(`${SERVER_URL}/download/${pin}`);
  if (!res.ok) throw new Error("Invalid PIN");

  const arrayBuffer = await res.arrayBuffer();
  const disposition = res.headers.get("Content-Disposition");
  let filename = "unknown";
  
  if (disposition && disposition.includes("filename=")) {
    filename = disposition.split("filename=")[1].replace(/['"]/g, "");
}
  console.log("Original filename from server:", filename);

  let binary = "";
  const bytes = new Uint8Array(arrayBuffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  const base64 = btoa(binary);
  const localUri = (FileSystem as any).documentDirectory + APP_DIR_NAME + downloadPath + filename;
  console.log("Saving to", localUri);
  await (FileSystem as any).writeAsStringAsync(localUri, base64, {
    encoding: "base64",
  });

  return localUri;
}

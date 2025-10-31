import * as FileSystem from "expo-file-system";

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
  const buffer = Buffer.from(arrayBuffer);

  const localUri = (FileSystem as any).documentDirectory + localFileName;

  await (FileSystem as any).writeAsStringAsync(localUri, buffer.toString("base64"), {
    encoding: (FileSystem as any).EncodingType.BASE64,
  });

  return localUri;
}

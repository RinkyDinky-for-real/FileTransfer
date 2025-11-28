import { Directory, File, Paths } from "expo-file-system";
import { AppwriteException } from "react-native-appwrite";
import { downloadFileFromAppwrite, InputFile, readFileFromAppwrite, uploadFileToAppwrite } from "./appwrite";
import { getUniqueName } from "./fileUtils";

const APP_DIR_NAME = "Core/Files";

export async function uploadFile(fileUri: string, fileName: string, fileType: string, fileSize: number) {
  const url = new URL(fileUri);

  const file: InputFile = {
    name: fileName,
    type: fileType,
    size: fileSize,
    uri: url.href
  }

  return await uploadFileToAppwrite(file)
}

export async function downloadFile(pin: string, downloadPath: string) {
  try {
    const fileData = await readFileFromAppwrite(pin);
    const downloadURL = await downloadFileFromAppwrite(pin); //res.arrayBuffer();

    let filename = fileData.name;
    console.log("Original filename from server:", filename);

    const destinationDir = new Directory(Paths.document, APP_DIR_NAME + downloadPath);
    console.log("Saving to", destinationDir);

    filename = await getUniqueName(destinationDir, filename, true)
    const destinationFile = new File(destinationDir, filename)

    await File.downloadFileAsync(downloadURL.href, destinationFile)

    return APP_DIR_NAME + downloadPath + filename;
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new Error("Invalid PIN");
    }
    console.error("Unable to get file:", error);
  }
}

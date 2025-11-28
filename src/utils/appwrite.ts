import { Client, ID, Models, Storage } from "react-native-appwrite";

const client = new Client()

client
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)

export default client;

const storage = new Storage(client);

export interface InputFile {
    name: string,
    type: string,
    size: number,
    uri: string
}

export async function uploadFileToAppwrite(file: InputFile): Promise<string> {
    try {
        const response = await storage.createFile({
            bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
            fileId: ID.unique(),
            file: file
        });

        return response.$id
    } catch (error) {
        console.error("Error uploading file to appwrite:", error);
        return Promise.reject(error);
    }
    
}

export async function downloadFileFromAppwrite(pinCode: string): Promise<URL> {
    try {
        const result = storage.getFileDownloadURL(process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!, pinCode)
        return result;
    } catch (error) {
        console.error("Error downloading file from appwrite:", error)
        return Promise.reject(error);
    }
    
}

export async function readFileFromAppwrite(pinCode: string): Promise<Models.File> {
    try {
        const result = storage.getFile({
            bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
            fileId: pinCode
        })
        return result;
    } catch (error) {
        console.error("Error downloading file from appwrite:", error)
        return Promise.reject(error);
    }
    
}
import * as FileSystem from 'expo-file-system/legacy';
import { popFileName } from './fileUtils';

export interface FileReceiveResult {
    success: boolean;
    path?: string;
    error?: string;
}

export const receiveFile = async (fileUrl: string): Promise<FileReceiveResult> => {
    try {
        const filename = popFileName(fileUrl);

        const destinationUri = FileSystem.documentDirectory + "Core/Files/" + filename;

        const { uri } = await FileSystem.downloadAsync(fileUrl, destinationUri);
        console.log('Finished downloading to ', uri);

        return {
            success: true,
            path: destinationUri
        };

    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
};

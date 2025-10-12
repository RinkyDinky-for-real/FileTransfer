import * as FileSystem from 'expo-file-system';

export async function ensureAppDirectory(path) {
  try {
    const info = await FileSystem.getInfoAsync(path);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(path, { intermediates: true });
    }
  } catch (e) {
    console.error('ensureAppDirectory error', e);
    throw e;
  }
}

export async function getFilesInDirectory(dir) {
  try {
    const res = await FileSystem.readDirectoryAsync(dir);
    const detailed = await Promise.all(
      res.map(async (name) => {
        const uri = dir + name;
        const info = await FileSystem.getInfoAsync(uri, { size: true });
        return {
          name,
          uri,
          isDirectory: info.isDirectory,
          size: info.size || 0,
          modificationTime: info.modificationTime || 0,
        };
      })
    );
    detailed.sort((a, b) => a.name.localeCompare(b.name));
    return detailed;
  } catch (e) {
    console.error('getFilesInDirectory error', e);
    return [];
  }
}

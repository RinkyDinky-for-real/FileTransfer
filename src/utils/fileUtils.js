import {Directory, Paths} from 'expo-file-system';

export async function ensureAppDirectory(path) {
  try {

    const dir = new Directory(Paths.document, path);

    if (!dir.exists) {
      await dir.create();
    }
  } catch (e) {
    console.error('ensureAppDirectory error', e);
    throw e;
  }
}

export async function getFilesInDirectory(path) {
  try {
    const dir = new Directory(Paths.document, path);

    const entries = await dir.list();

    const detailed = await Promise.all(
      entries.map(async (entry) => {
        const info = await entry.info();
        return {
          name: entry.name,
          uri: entry.uri,
          isDirectory: entry instanceof Directory,
          size: info.size ?? 0,
          modificationTime: info.modificationTime ?? 0,
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

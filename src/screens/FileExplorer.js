import { MaterialIcons } from '@expo/vector-icons';
import {Directory, File, Paths} from 'expo-file-system';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import FileItem from '../components/FileItem';
import { ensureAppDirectory, getFilesInDirectory } from '../utils/fileUtils';

const APP_DIR_NAME = 'transfile'
const APP_DIR = new Directory(Paths.document, APP_DIR_NAME);

export default function FileExplorer({ navigation }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [currentDir, setCurrentDir] = useState(APP_DIR);

  const refreshFiles = useCallback(async () => {
    setLoading(true);
    try {
      await ensureAppDirectory(APP_DIR_NAME);
      const list = await getFilesInDirectory(APP_DIR_NAME);
      setFiles(list);
    } catch (e) {
      console.error('Error reading files', e);
      Alert.alert('Feil', 'Kunne ikke lese filer.');
    } finally {
      setLoading(false);
    }
  }, [currentDir]);

  useEffect(() => {
    refreshFiles();
  }, [refreshFiles]);

  const onDelete = async (fileUri) => {
    Alert.alert('Slett fil', 'Er du sikker?', [
      { text: 'Avbryt', style: 'cancel' },
      {
        text: 'Slett',
        style: 'destructive',
        onPress: async () => {
          try {
            const file = new File(fileUri)
            await file.delete();
            refreshFiles();
          } catch (e) {
            console.error(e);
            Alert.alert('Feil', 'Kunne ikke slette fil.');
          }
        },
      },
    ]);
  };

  const onRename = async (fileUri, oldName) => {
    Alert.prompt(
      'Gi nytt navn',
      'Skriv nytt navn for filen (inkl. filendelse):',
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'OK',
          onPress: async (newName) => {
            if (!newName) return;
            try {
              const file = new File(fileUri);
              const newPath = new Directory(Paths.document, APP_DIR_NAME).uri + newName;
              await file.move(newPath);
              refreshFiles();
            } catch (e) {
              console.error(e);
              Alert.alert('Feil', 'Kunne ikke gi nytt navn.');
            }
          },
        },
      ],
      'plain-text',
      oldName
    );
  };

  const createFolder = async () => {
    Alert.prompt('Ny mappe', 'Navn på mappe:', [
      { text: 'Avbryt', style: 'cancel' },
      {
        text: 'Opprett',
        onPress: async (name) => {
          if (!name) return;
          const path = currentDir + name + '/';
          try {
            const dir = new Directory(Paths.document, `${APP_DIR_NAME}/${name}`)
            await dir.create();
            refreshFiles();
          } catch (e) {
            console.error(e);
            Alert.alert('Feil', 'Kunne ikke opprette mappe.');
          }
        },
      },
    ]);
  };

  const filtered = files.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', flex: 1 }}>Filoversikt</Text>
        <TouchableOpacity onPress={createFolder} style={{ padding: 6 }}>
          <MaterialIcons name="create-new-folder" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={refreshFiles} style={{ padding: 6 }}>
          <MaterialIcons name="refresh" size={24} />
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Søk filer..."
        value={query}
        onChangeText={setQuery}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 8,
          marginBottom: 12,
        }}
      />

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.uri}
          renderItem={({ item }) => (
            <FileItem
              file={item}
              onDelete={() => onDelete(item.uri)}
              onRename={() => onRename(item.uri, item.name)}
              onOpen={() => {
                Alert.alert('Åpne', 'Åpne-funksjon ikke implementert i alpha.');
              }}
            />
          )}
        />
      )}
    </View>
  );
}
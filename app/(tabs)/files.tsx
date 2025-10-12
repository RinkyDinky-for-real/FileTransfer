import { useNavigation } from 'expo-router';
import FileExplorer from '../../src/screens/FileExplorer';

export default function FilesScreen() {
  const navigation = useNavigation();
  return <FileExplorer navigation={navigation} />;
}

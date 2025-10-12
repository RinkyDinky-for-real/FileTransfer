import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import FileExplorer from './src/screens/FileExplorer';
import TransferScreen from './src/screens/TransferScreen'; // bare dummy for now

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Files"
          component={FileExplorer}
          options={{ tabBarIcon: ({ color, size }) => <MaterialIcons name="folder" size={size} color={color} /> }}
        />
        <Tab.Screen
          name="Transfer"
          component={TransferScreen}
          options={{ tabBarIcon: ({ color, size }) => <MaterialIcons name="publish" size={size} color={color} /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

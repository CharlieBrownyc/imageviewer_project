import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LocalImagesScreen from './screens/LocalImagesScreen';
import ServerImagesScreen from './screens/ServerImagesScreen';
import { Image, Cloud } from 'lucide-react-native';
import type { ReactElement } from 'react';

const Tab = createBottomTabNavigator();

const App = (): ReactElement => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Local') {
              return <Image color={color} size={size} />;
            } else if (route.name === 'Server') {
              return <Cloud color={color} size={size} />;
            }
          },
          tabBarActiveTintColor: '#007aff',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Local" component={LocalImagesScreen} />
        <Tab.Screen name="Server" component={ServerImagesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;

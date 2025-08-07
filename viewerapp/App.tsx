import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, SafeAreaView, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LocalImagesScreen from './screens/LocalImagesScreen';
import ServerImagesScreen from './screens/ServerImagesScreen';
import { Image, Cloud } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

const App = () => {
  const [serverUrl, setServerUrl] = useState('http://192.168.0.103:3000'); // 여기에 주소 입력

  useEffect(() => {
    // Initialize any necessary services or state here
    console.log('App initialized');
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Server URL:</Text>
        <TextInput
          value={serverUrl}
          onChangeText={setServerUrl}
          placeholder="http://your-server-address:port"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

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
          <Tab.Screen
            name="Local"
            children={() => <LocalImagesScreen serverUrl={serverUrl} />}
          />
          <Tab.Screen
            name="Server"
            children={() => <ServerImagesScreen serverUrl={serverUrl} />}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
  },
  label: {
    marginBottom: 4,
    fontWeight: 'bold',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'white',
  },
});

export default App;

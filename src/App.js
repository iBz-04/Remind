import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator'; // or your main navigation/root component
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ActivityScreen from './screens/ActivityScreen';
import RemindersScreen from './screens/RemindersScreen';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar 
        style="dark"          // Forces dark icons/text (black)
        backgroundColor="#fff" // Matches your white background
        translucent={false}   // Makes status bar opaque
      />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#fff' },
            // Updated fade transition: removes slide effect and uses only opacity
            cardStyleInterpolator: ({ current }) => ({
              cardStyle: {
                opacity: current.progress,
              },
            }),
            // Reduced duration for a subtle transition
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {
                  duration: 250, // updated duration for opening transition
                },
              },
              close: {
                animation: 'timing',
                config: {
                  duration: 250, // updated duration for closing transition
                },
              },
            },
          }}
        >
          { user ? (
            <>
              <Stack.Screen name="Home">
                {props => <HomeScreen {...props} extraData={user} />}
              </Stack.Screen>
              <Stack.Screen name="Activity">
                {props => <ActivityScreen {...props} extraData={user} />}
              </Stack.Screen>
              <Stack.Screen name="Reminders">
                {props => <RemindersScreen {...props} extraData={user} />}
              </Stack.Screen>
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Registration" component={RegistrationScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
} 
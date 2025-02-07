import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection } from 'firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen, HomeScreen, RegistrationScreen } from './src/screens';
import LoadScreen from './src/screens/LoadScreen/LoadScreen';
import ActivityScreen from './src/screens/ActivityScreen/ActivityScreen';
import RemindersScreen from './src/screens/RemindersScreen/RemindersScreen';
import registerNNPushToken from 'native-notify';

import { decode, encode } from 'base-64';
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Stack = createStackNavigator();
const auth = getAuth(); 
const db = getFirestore(); 

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  registerNNPushToken(27237, 'hYhe8GfMPTwaZ3Edt31CkB');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = doc(db, 'users', user.uid);
          const docSnapshot = await getDoc(userDoc);
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setUser(userData);
          } else {
            setUser(null); // User document doesn't exist
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null); // No authenticated user
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#fff' },
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
              overlayStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                }),
              },
            };
          },
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 300,
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: 300,
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
  );
}


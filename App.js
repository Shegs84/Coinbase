import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; // Fixed: Removed stray _
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

// --- Import all our screens ---
import AzimaAuthScreen from './components/AzimaAuthScreen';
import Account from './components/Account'; // <-- FIXED: Changed path
import HomeScreen from './HomeScreen';
import CreateLoanScreen from './createLoan';
import FundLoansScreen from './loansAll';
import WalletScreen from './components/wallet'; // <-- ADDED: New import for Wallet

// --- Import Supabase ---
import { supabase } from './lib/supabaseClient';
// Removed 'Session' import as it's a type and not used in the JS logic, fixing the warning.

// --- Create Navigators ---
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- Splash Screen: Keep visible ---
// This tells the native splash screen to stay visible until we hide it
SplashScreen.preventAutoHideAsync();

// --- Main App Component ---
export default function App() {
  const [session, setSession] = useState(null); // Removed <Session | null> type
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => { // Fixed: Removed stray _
    async function prepareApp() {
      try {
        // --- 1. Load Fonts ---
        // Load fonts required by the app (like for the tab bar)
        await Font.loadAsync({
          ...Ionicons.font,
          ...FontAwesome5.font,
        });

        // --- 2. Check Supabase Session ---
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        // --- 3. Set up Auth Listener ---
        // Listen for changes in auth state (login/logout)
        supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });
        
        // You can add other async tasks here (e.g., API calls)
        // await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a load

      } catch (e) {
        console.warn(e);
      } finally {
        // --- 4. App is ready ---
        // Tell the app it's ready to render
        setAppIsReady(true);
      }
    }

    prepareApp();
  }, []);

  // --- Hide Splash Screen ---
  // This function is called *after* the layout is ready
  // to prevent a "flicker"
  const onLayoutRootView = useCallback(async () => { // Fixed: Removed stray _
    if (appIsReady) {
      // This will hide the native splash screen
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // --- Render logic ---
  // If the app is not ready, render nothing (splash screen is visible)
  if (!appIsReady) {
    return null;
  }

  // --- App is ready, render the app ---
  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        {/* If session exists, show main app.
          If not, show the login screen.
        */}
        {session && session.user ? (
          <HomeTabs session={session} />
        ) : (
          <AzimaAuthScreen />
        )}
      </NavigationContainer>
    </View>
  );
}

// --- Main App Navigation (Bottom Tabs) ---
// This is shown when the user is LOGGED IN
function HomeTabs({ session }) { // Fixed: Corrected function syntax
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({ // Fixed: Removed stray _
        tabBarIcon: ({ focused, color, size }) => { // Fixed: Removed stray _
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Loans') {
            return <FontAwesome5 name="hand-holding-usd" size={size} color={color} />;
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#00B300',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#1E1E1E',
          borderTopColor: '#333',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={MainStack} />
      {/* We pass the session to the Wallet and Profile screens */}
      <Tab.Screen name="Wallet">
        {(props) => <WalletScreen {...props} session={session} />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {(props) => <Account {...props} session={session} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// --- Stack Navigator (for Home tab) ---
// This allows navigating *within* the Home tab
function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#121212' }
      }}
    >
      <Stack.Screen name="MainHome" component={HomeScreen} />
      <Stack.Screen name="CreateLoan" component={CreateLoanScreen} />
      <Stack.Screen name="FundLoan" component={FundLoansScreen} />
    </Stack.Navigator>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: 'white',
    fontSize: 18,
  },
});


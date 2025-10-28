import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert, // Import Alert
  Dimensions,
  AppState, // Import AppState
  ActivityIndicator, // Import ActivityIndicator
} from 'react-native';
import styles from '../styles'; // <-- Path updated to '../'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import { supabase } from '../lib/supabaseClient'; // <-- Path updated to '../'

const initialLayout = { width: Dimensions.get('window').width };

// Tells Supabase Auth to continuously refresh the session automatically
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const AzimaLogo = () => (
  // This path is now correct, assuming 'assets' is in the root
  <Image source={require('../assets/azima-logo.png')} style={styles.logo} />
);

// ----------------- Sign Up ----------------
const SignUpRoute = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session) Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <AzimaLogo />
      <Text style={styles.header}>Sign Up</Text>
      <Text style={styles.subHeader}>Sign up for P2P transactions</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#aaa"
        onChangeText={(text) => setEmail(text)}
        value={email}
        autoCapitalize={'none'}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
        autoCapitalize={'none'}
      />

      <TouchableOpacity style={styles.button} onPress={signUpWithEmail} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity style={styles.googleButton}>
        <Icon name="google" size={20} color="black" />
        <Text style={styles.googleText}> Sign Up with Google</Text>
      </TouchableOpacity>

      <Text style={styles.bottomText}>
        Already have an account? <Text style={styles.linkText}>Log in here</Text>
      </Text>

      <Text style={styles.terms}>
        By signing up, you agree to the <Text style={styles.linkText}>Terms of Service</Text> &{' '}
        <Text style={styles.linkText}>Privacy Policy</Text>
      </Text>
    </View>
  );
};

// ----------------- Login ----------------
const LoginRoute = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <AzimaLogo />
      <Text style={styles.header}>Login</Text>
      <Text style={styles.subHeader}>Login for P2P transactions</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#aaa"
        onChangeText={(text) => setEmail(text)}
        value={email}
        autoCapitalize={'none'}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
        autoCapitalize={'none'}
      />

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={signInWithEmail} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity style={styles.googleButton}>
        <Icon name="google" size={20} color="black" />
        <Text style={styles.googleText}> Continue with Google</Text>
      </TouchableOpacity>

      <Text style={styles.bottomText}>
        Don't have an account? <Text style={styles.linkText}>Sign Up</Text>
      </Text>
    </View>
  );
};

// ----------------- Tab View ----------------
const AzimaAuthScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'login', title: 'Login' },
    { key: 'signup', title: 'Sign Up' },
  ]);

  const renderScene = SceneMap({
    login: LoginRoute,
    signup: SignUpRoute,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      renderTabBar={props => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: '#00FF00' }}
          style={{ backgroundColor: '#000' }}
          labelStyle={{ color: 'white', fontWeight: 'bold' }}
        />
      )}
    />
  );
};

export default AzimaAuthScreen;

import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, Text } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { supabase } from '../lib/supabaseClient.js'; // Ensure this path is correct

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', session.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const updates = {
        id: session.user.id,
        username,
        website,
        avatar_url: avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Profile</Text>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input 
          label="Email" 
          value={session?.user?.email} 
          disabled 
          labelStyle={styles.label} 
          inputStyle={styles.input}
          inputContainerStyle={styles.inputContainer}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input 
          label="Username" 
          value={username || ''} 
          onChangeText={(text) => setUsername(text)} 
          labelStyle={styles.label} 
          inputStyle={styles.input}
          inputContainerStyle={styles.inputContainer}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input 
          label="Website" 
          value={website || ''} 
          onChangeText={(text) => setWebsite(text)} 
          labelStyle={styles.label} 
          inputStyle={styles.input}
          inputContainerStyle={styles.inputContainer}
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })}
          disabled={loading}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button 
          title="Sign Out" 
          onPress={() => supabase.auth.signOut()} 
          buttonStyle={[styles.button, styles.signOutButton]}
          titleStyle={styles.buttonText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00B300',
    textAlign: 'center',
    marginVertical: 20,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  label: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    color: 'white',
  },
  inputContainer: {
    backgroundColor: '#333333',
    borderBottomWidth: 0,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#00B300',
    borderRadius: 5,
    paddingVertical: 10,
  },
  signOutButton: {
    backgroundColor: '#AA0000',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});


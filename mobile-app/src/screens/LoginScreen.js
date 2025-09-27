import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store user data
      const userData = {
        email,
        name: email.split('@')[0],
        id: Date.now().toString()
      };
      
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      await AsyncStorage.setItem('authToken', 'mock_token_' + Date.now());
      
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Error', 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="fitness" size={60} color="#4ECDC4" />
        <Text style={styles.title}>AthletIQ</Text>
        <Text style={styles.subtitle}>Sports Talent Assessment Platform</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.formTitle}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </Text>
        
        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.authButton, loading && styles.disabledButton]}
          onPress={handleAuth}
          disabled={loading}
        >
          <Text style={styles.authButtonText}>
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsLogin(!isLogin)}
        >
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by Sports Authority of India</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: 30,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
  authButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 20,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  authButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  switchButton: {
    marginTop: 20,
  },
  switchText: {
    color: '#4ECDC4',
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 12,
  },
});

export default LoginScreen;
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebaseConfig';

WebBrowser.maybeCompleteAuthSession();
const { width, height } = Dimensions.get('window');

const LogInPage = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: 'TU_WSTAW_WEB_CLIENT_ID_Z_GOOGLE_CLOUD',
    androidClientId: 'TU_WSTAW_ANDROID_CLIENT_ID_Z_GOOGLE_CLOUD',
    iosClientId: 'TU_WSTAW_IOS_CLIENT_ID_Z_GOOGLE_CLOUD',
  });

  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type !== 'success') {
        if (response?.type === 'error') {
          setLoading(false);
          Alert.alert('Logowanie Google', 'Nie udało się zalogować. Spróbuj ponownie.');
        }
        return;
      }

      const idToken = response.authentication?.idToken || response.params?.id_token;

      if (!idToken) {
        setLoading(false);
        Alert.alert('Logowanie Google', 'Nie udało się pobrać tokenu logowania.');
        return;
      }

      try {
        const credential = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(auth, credential);
      } catch (error) {
        setLoading(false);
        Alert.alert('Błąd logowania', error?.message || 'Nie udało się zalogować do Firebase.');
      }
    };

    handleGoogleResponse();
  }, [response]);

  const handleGoogleSignIn = async () => {
    if (!request) {
      Alert.alert('Konfiguracja', 'Google Sign-In jest chwilowo niedostępny. Spróbuj ponownie.');
      return;
    }

    try {
      setLoading(true);
      await promptAsync();
    } catch (error) {
      setLoading(false);
      Alert.alert('Błąd', 'Wystąpił problem podczas uruchamiania logowania Google.');
    }
  };

  return (
    <View style={styles.main_container}>
      <View style={styles.info_container}>
        <Image source={require('../assets/lemur.png')} style={styles.logo} />
        <Text style={styles.appTitle}>MathDaily</Text>
        <Text style={styles.subtitle}>Zaloguj się kontem Google, aby rozpocząć.</Text>
      </View>

      {loading ? (
        <View style={styles.loading_container}>
          <ActivityIndicator size="large" color="#1E918E" />
          <Text style={styles.loadingText}>Logowanie...</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.login_container}
          onPress={handleGoogleSignIn}
          disabled={!request}
        >
          <Text style={styles.loginText}>Kontynuuj z kontem Google</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#FAFFFF',
    padding: width * 0.05,
    justifyContent: 'center',
  },
  info_container: {
    alignItems: 'center',
    marginBottom: height * 0.08,
  },
  logo: {
    width: 138,
    height: 138,
    marginBottom: height * 0.02,
  },
  appTitle: {
    fontSize: 32,
    color: '#1E918E',
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: height * 0.015,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loading_container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.04,
  },
  loadingText: {
    marginTop: height * 0.015,
    color: '#1E918E',
    fontSize: 16,
  },
  login_container: {
    backgroundColor: '#1E918E',
    marginTop: height * 0.015,
    padding: width * 0.055,
    borderRadius: width * 0.08,
  },
  loginText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LogInPage;

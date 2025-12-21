// import React, { useEffect } from 'react';
// import 'react-native-reanimated';
// import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import 'react-native-gesture-handler';
// import { Dimensions } from 'react-native';
// import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';

// WebBrowser.maybeCompleteAuthSession();
// const { width, height } = Dimensions.get('window');

// const LogInPage = ({ navigation }) => {
//   const [request, response, promptAsync] = Google.useAuthRequest({
//     expoClientId: 'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com',
//     iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
//     androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
//   });

//   useEffect(() => {
//     if (response?.type === 'success') {
//       navigation.replace('MainTabs');
//     } else if (response?.type === 'error') {
//       Alert.alert('Logowanie Google', 'Nie udało się zalogować.');
//     }
//   }, [response, navigation]);

//   const handleGoogleSignIn = () => {
//     if (!request) {
//       Alert.alert('Konfiguracja', 'Uzupełnij identyfikatory klienta Google.');
//       return;
//     }
//     promptAsync();
//   };

//   return (
//     <View style={styles.main_container}>
//       <View style={styles.info_container}>
//         <Image source={require('../assets/lemur.png')} style={{ width: 138, height: 138 }} />
//         <Text style={{ fontSize: 32, color: '#1E918E' }}>MathDaily</Text>
//       </View>
//       <TouchableOpacity style={styles.login_container} onPress={handleGoogleSignIn}>
//         <View style={{ alignItems: 'center' }}>
//           <Text style={{ color: '#fff', fontSize: 20 }}>Kontynuuj z kontem Google</Text>
//         </View>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   main_container: {
//     flex: 1,
//     backgroundColor: '#FAFFFF',
//     padding: width * 0.05,
//     justifyContent: 'center',
//   },
//   info_container: {
//     alignItems: 'center',
//     marginBottom: height * 0.02,
//   },
//   login_container: {
//     backgroundColor: '#1E918E',
//     marginTop: height * 0.015,
//     padding: width * 0.055,
//     borderRadius: width * 0.08,
//   },
// });

// export default LogInPage;

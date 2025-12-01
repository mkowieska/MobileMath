import 'react-native-reanimated';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const page = ({ navigation }) => {
  return (
    <View style={styles.main_container}>
      <View style={styles.info_container}>
            <Image source={require('../assets/lemur.png')} style={{ width: 138, height: 138}}/>
            <Text style={{fontSize: 24}}>Jan Kowalski</Text>
      </View>
      <View style={styles.options_container}>
        <TouchableOpacity style={styles.option_container} onPress={() => navigation.navigate('Dodawanie')}>
        <View style={styles.game}>
            <Ionicons name={'options-outline'} size={40} color="#1E918E" />
            <View style={{ marginLeft: 10, fontSize: 20}}>
                <Text>Powiadomienia</Text>
            </View>
            </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option_container} onPress={() => navigation.navigate('Odejmowanie')}>
        <View style={styles.game}>
            <Ionicons name={'settings-outline'} size={40} color="#1E918E" />
            <View style={{ marginLeft: 10, fontSize: 20}}>
                <Text>Ustawienia konta</Text>
            </View>
            </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option_container} onPress={() => navigation.navigate('Odejmowanie')}>
        <View style={styles.game}>
            <Ionicons name={'help-circle-outline'} size={40} color="#1E918E" />
            <View style={{ marginLeft: 10, fontSize: 20}}>
                <Text>Pomoc</Text>
            </View>
            </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logout_container} onPress={() => navigation.navigate('Odejmowanie')}>
        <View style={styles.game}>
            <Ionicons name={'log-out-outline'} size={40} color="#1E918E" />
            <View style={{ marginLeft: 10, fontSize: 20}}>
                <Text>Wyloguj się</Text>
            </View>
            </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    main_container: {
      flex: 1,
      backgroundColor: '#FAFFFF',
      padding: width * 0.05,
      justifyContent: 'center',
    },
    info_container: {
      alignItems: 'center',
      marginBottom: height * 0.02,
    },
    options_container: {
      backgroundColor: '#F4F4F4',
      padding: width * 0.05,
      borderRadius: width * 0.08,
      marginBottom: height * 0.02,
    },
    option_container: {
      backgroundColor: '#cbdcdb',
      marginTop: height * 0.015,
      padding: width * 0.055,
      borderRadius: width * 0.08,
    },
    logout_container: {
      backgroundColor: '#cbdcdb',
      marginTop: height * 0.03,
      padding: width * 0.05,
      borderRadius: width * 0.08,
    },
    game: {
      flexDirection: 'row',
      alignItems: 'center',
    },
});

export default page;

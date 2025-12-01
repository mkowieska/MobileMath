import 'react-native-reanimated';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const page = ({ navigation }) => {
  return (
    <View style={styles.main_container}>
      <View style={styles.categories_container}>
        <Text style={{fontSize: 24}}>Kategorie</Text>
          <TouchableOpacity style={styles.calculations_container} onPress={() => navigation.navigate('Dodawanie')}>
            <View style={styles.calculations}>
              <Ionicons name={'add-circle-outline'} size={40} color="#1E918E" />
                <View style={{ marginLeft: 10, fontSize: 20}}>
                  <Text>Dodawanie</Text>
                </View>
              </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.calculations_container} onPress={() => navigation.navigate('Odejmowanie')}>
            <View style={styles.calculations}>
              <Ionicons name={'remove-circle-outline'} size={40} color="#1E918E" />
                <View style={{ marginLeft: 10, fontSize: 20}}>
                  <Text>Odejmowanie</Text>
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
    categories_container: {
      backgroundColor: '#F4F4F4',
      padding: width * 0.05,
      borderRadius: width * 0.08,
      marginBottom: height * 0.02,
      bottom: 100,
    },
    calculations_container: {
      backgroundColor: '#cbdcdb',
      marginTop: height * 0.015,
      padding: width * 0.05,
      borderRadius: width * 0.08,
    },
    calculations: {
      flexDirection: 'row',
      alignItems: 'center',
    },
});

export default page;
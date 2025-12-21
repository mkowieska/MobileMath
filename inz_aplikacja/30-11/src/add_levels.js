import 'react-native-reanimated';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const CategoriesAddLevelsPage = ({ navigation }) => {
  return ( 
    <View style={styles.main_container}>
      <View style={styles.categories_container}>
        <Text style={{fontSize: 24}}>Dodawanie</Text>
          <TouchableOpacity style={styles.calculations_container} onPress={() => navigation.navigate('Add1VeryEasy')}>
            <View style={styles.calculations}>
              <Ionicons name={'ribbon-outline'} size={40} color="#1E918E" />
              <Text style={{ marginLeft: 10, fontSize: 20}}>Bardzo łatwy</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.calculations_container} onPress={() => navigation.navigate('Add2Easy')}>
            <View style={styles.calculations}>
              <Ionicons name={'medal-outline'} size={40} color="#1E918E" />
              <Text style={{ marginLeft: 10, fontSize: 20}}>Łatwy</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.calculations_container} onPress={() => navigation.navigate('Add3Medium')}>
            <View style={styles.calculations}>
              <Ionicons name={'trophy-outline'} size={40} color="#1E918E" />
              <Text style={{ marginLeft: 10, fontSize: 20}}>Średni</Text>
            </View>
          </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#1E918E" />
      </TouchableOpacity>
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

export default CategoriesAddLevelsPage;
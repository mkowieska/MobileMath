import 'react-native-reanimated';
import { View, Text, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const page = ({ navigation }) => {
  const showDateAlert = () => {
    const date = new Date();
    const day = date.getDate();
    const year = date.getFullYear();
    const months = ['stycznia','lutego','marca','kwietnia','maja','czerwca','lipca','sierpnia','września','października','listopada','grudnia'];
    const month = months[date.getMonth()];// const month = date.getMonth() + 1;
    const message = `${day} ${month} ${year}`;
    Alert.alert('Dzisiejsza data:', message);
  };
  const nowForRender = new Date();
  const endOfDayForRender = new Date();
  endOfDayForRender.setHours(23, 59, 59, 999);
  const diffForRender = endOfDayForRender - nowForRender;
  const remainingHours = Math.floor(diffForRender / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((diffForRender % (1000 * 60 * 60)) / (1000 * 60));
  return (
    <View style={styles.main_container}>
      <View style={styles.top_container}>
        <Text style={styles.app_name}>MathDaily</Text>
      </View>
      <View style={styles.streak_container}>
        <View style={styles.streak_container_wlasciwosci}>
          <Image source={require('../assets/kalkulator.png')} style={{ width: 40, height: 40}}/>
          <TouchableOpacity onPress={showDateAlert} accessibilityLabel="Pokaż dzisiejszą datę"> {/*popup */}
            <Text style={{fontSize: 24}}>Dzień 24</Text>
          </TouchableOpacity>
          <View style={styles.streak_container_lemur}>
            <Image source={require('../assets/lemur.png')} style={{ width: 138, height: 138}}/>
          </View>
        </View>
      </View>
      <View style={styles.dailytask_container}>
        <Text style={{fontSize: 24}}>Codzienne zadanie</Text>
        <View style={styles.task_container}>
          <Text style={styles.task_subtitle}>Dzień dobry!{'\n'}
            Zostało Ci <Text style={{fontWeight: 'bold'}}>{remainingHours} godzin i {remainingMinutes} minut </Text>do końca dnia.
          </Text>
          <Text style={styles.task_subtitle}>Pierwsze zadanie matematyczne czeka. Powodzenia!</Text>
          <TouchableOpacity style={styles.task_start_button} onPress={() => navigation.navigate('DailyTask')}>
            <Text style={{color: '#fff', fontSize: 24}}>Start</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.stats_container}>
        <Text style={styles.stats_title}>Statystyki</Text>
        <View style={styles.stats}>
          <Ionicons name={'library-outline'} size={40} color="#1E918E" />
          <View style={{ marginLeft: 10, fontSize: 20}}>
            <Text>Rozwiązane zadania</Text>
            <View style={{ fontSize: 18}}>
              <Text>42</Text>
            </View>
          </View>
        </View>
        <View style={styles.stats}>
          <Ionicons name={'bar-chart-outline'} size={40} color="#1E918E" />
            <View style={{ marginLeft: 10, fontSize: 20}}>
            <Text>Średnia punktów</Text>
            <View style={{ fontSize: 18}}>
              <Text>4.12</Text>
            </View>
          </View>
        </View>
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
    top_container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: height * 0.05,
      bottom: -18,
    },
    app_name: {
      fontSize: 32,
      color: '#1E918E',
    },
    streak_container: {
      backgroundColor: '#F4F4F4',
      padding: width * 0.05,
      borderRadius: width * 0.08,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: height * 0.02,
      width: 185,
      height: 70,
      position: 'relative',
      overflow: 'visible',
    },
    streak_container_wlasciwosci: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    streak_container_lemur: {
      position: 'absolute',
      left: 190,
      bottom: -10,
    },
    dailytask_container: {
      backgroundColor: '#F4F4F4',
      padding: width * 0.05,
      borderRadius: width * 0.08,
      marginBottom: height * 0.02,
    },
    task_container: {
      backgroundColor: '#cbdcdb',
      marginTop: height * 0.015,
      padding: width * 0.05,
      borderRadius: width * 0.08,
    },
    task_subtitle: {
      fontSize: 18,
      lineHeight: 25,
      paddingHorizontal: width * 0.01,
      marginBottom: height * 0.01,
      textAlign: 'left',
    },
    task_start_button: {
      backgroundColor: '#1E918E',
      paddingVertical: height * 0.015,
      borderRadius: width * 0.08,
      alignItems: 'center',
      width: width * 0.4,
      alignSelf: 'center',
    },
    stats_container: {
      backgroundColor: '#F4F4F4',
      padding: width * 0.05,
      borderRadius: width * 0.08,
    },
    stats_title: {
      fontSize: 24,
      marginBottom: height * 0.01,
    },
    stats: {
      flexDirection: 'row',
      alignItems: 'center',
    },
});

export default page;
import React, { useState } from 'react';
import 'react-native-reanimated';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_STORAGE_KEY = 'notificationSchedules';
const { width, height } = Dimensions.get('window');

const NewNotificationsPage = ({ navigation }) => {
  const [numberOfDays, setNumberOfDays] = useState(7); 
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [notificationHour, setNotificationHour] = useState(9);
  const [notificationMinute, setNotificationMinute] = useState(0);
  
  const [selectedDays, setSelectedDays] = useState({
    Pn: true,
    Wt: true,
    Śr: true,
    Cz: true,
    Pt: true,
    So: true,
    Nd: true,
  });
  const [everyday, setEveryday] = useState(true);

  const daysOfWeek = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

  const handleDaysChange = (value) => {
    setNumberOfDays(Math.round(value));
    const newEndDate = new Date(startDate.getTime() + Math.round(value) * 24 * 60 * 60 * 1000);
    setEndDate(newEndDate);
  };

  const handleHourChange = (value) => {
    setNotificationHour(Math.round(value));
  };

  const handleMinuteChange = (value) => {
    setNotificationMinute(Math.round(value));
  };

  const adjustStartDate = (days) => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + days);
    setStartDate(newDate);
    const newEndDate = new Date(newDate.getTime() + numberOfDays * 24 * 60 * 60 * 1000);
    setEndDate(newEndDate);
  };

  const adjustEndDate = (days) => {
    const newDate = new Date(endDate);
    newDate.setDate(newDate.getDate() + days);
    setEndDate(newDate);
    const diffTime = Math.abs(newDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setNumberOfDays(diffDays);
  };

  const toggleDay = (day) => {
    if (!everyday) {
      setSelectedDays(prev => ({ ...prev, [day]: !prev[day] }));
    }
  };

  const toggleEveryday = () => {
    const newEveryday = !everyday;
    setEveryday(newEveryday);
    if (newEveryday) {
      const allDays = {};
      daysOfWeek.forEach(day => allDays[day] = true);
      setSelectedDays(allDays);
    } else {
      const noDays = {};
      daysOfWeek.forEach(day => noDays[day] = false);
      setSelectedDays(noDays);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (hour, minute) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const saveNotification = async () => {
    const selectedDaysArray = Object.keys(selectedDays).filter((day) => selectedDays[day]);

    if (!everyday && selectedDaysArray.length === 0) {
      Alert.alert('Brak dni', 'Wybierz przynajmniej jeden dzień tygodnia albo włącz opcję Codziennie.');
      return;
    }

    const safeStartDate = new Date(startDate);
    const safeEndDate = new Date(endDate);

    // Gdy użytkownik przesunie datę końca przed startem, automatycznie naprawiamy zakres.
    if (safeEndDate < safeStartDate) {
      safeEndDate.setTime(safeStartDate.getTime() + numberOfDays * 24 * 60 * 60 * 1000);
    }

    const notification = {
      id: Date.now().toString(),
      numberOfDays,
      startDate: safeStartDate.toISOString(),
      endDate: safeEndDate.toISOString(),
      time: formatTime(notificationHour, notificationMinute),
      selectedDays: everyday ? 'Codziennie' : selectedDaysArray.join(', '),
      selectedDaysArray,
      everyday,
      message: 'Pora na dzisiejsze zadanie',
      scheduledIds: [],
      notificationsEnabled: false,
      createdAt: new Date().toISOString(),
    };

    try {
      const existingRaw = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = [notification, ...existing];
      await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      Alert.alert('Błąd zapisu', 'Nie udało się zapisać ustawień powiadomień.');
      return;
    }

    Alert.alert('Gotowe', 'Ustawienia powiadomien zostaly zapisane.');

    navigation.goBack();
  };

  return ( 
    <View style={styles.main_container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#1E918E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ustawienia powiadomień</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Przez ile dni</Text>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={30}
              step={1}
              value={numberOfDays}
              onValueChange={handleDaysChange}
              minimumTrackTintColor="#1E918E"
              maximumTrackTintColor="#cbdcdb"
              thumbTintColor="#1E918E"
            />
            <Text style={styles.daysText}>{numberOfDays} dni</Text>
          </View>
        </View>

        {/* Sekcja: Od kiedy do kiedy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zakres dat</Text>
          <View style={styles.dateRow}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Od:</Text>
              <View style={styles.dateDisplayContainer}>
                <Text style={styles.dateDisplayText}>{formatDate(startDate)}</Text>
                <View style={styles.dateControls}>
                  <TouchableOpacity 
                    style={styles.dateControlButton} 
                    onPress={() => adjustStartDate(-1)}
                  >
                    <Ionicons name="remove-circle-outline" size={24} color="#1E918E" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.dateControlButton} 
                    onPress={() => adjustStartDate(1)}
                  >
                    <Ionicons name="add-circle-outline" size={24} color="#1E918E" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Do:</Text>
              <View style={styles.dateDisplayContainer}>
                <Text style={styles.dateDisplayText}>{formatDate(endDate)}</Text>
                <View style={styles.dateControls}>
                  <TouchableOpacity 
                    style={styles.dateControlButton} 
                    onPress={() => adjustEndDate(-1)}
                  >
                    <Ionicons name="remove-circle-outline" size={24} color="#1E918E" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.dateControlButton} 
                    onPress={() => adjustEndDate(1)}
                  >
                    <Ionicons name="add-circle-outline" size={24} color="#1E918E" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Godzina powiadomienia</Text>
          <View style={styles.timeSliderContainer}>
            <Text style={styles.timeDisplay}>{formatTime(notificationHour, notificationMinute)}</Text>
            
            <View style={styles.sliderGroup}>
              <Text style={styles.sliderLabel}>Godzina:</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={23}
                step={1}
                value={notificationHour}
                onValueChange={handleHourChange}
                minimumTrackTintColor="#1E918E"
                maximumTrackTintColor="#cbdcdb"
                thumbTintColor="#1E918E"
              />
              <Text style={styles.sliderValue}>{notificationHour.toString().padStart(2, '0')}</Text>
            </View>

            <View style={styles.sliderGroup}>
              <Text style={styles.sliderLabel}>Minuty:</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={59}
                step={1}
                value={notificationMinute}
                onValueChange={handleMinuteChange}
                minimumTrackTintColor="#1E918E"
                maximumTrackTintColor="#cbdcdb"
                thumbTintColor="#1E918E"
              />
              <Text style={styles.sliderValue}>{notificationMinute.toString().padStart(2, '0')}</Text>
            </View>

            <View style={styles.timeButtons}>
              <TouchableOpacity 
                style={styles.presetTimeButton}
                onPress={() => { setNotificationHour(9); setNotificationMinute(0); }}
              >
                <Text style={styles.presetTimeText}>9:00</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.presetTimeButton}
                onPress={() => { setNotificationHour(12); setNotificationMinute(0); }}
              >
                <Text style={styles.presetTimeText}>12:00</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.presetTimeButton}
                onPress={() => { setNotificationHour(18); setNotificationMinute(0); }}
              >
                <Text style={styles.presetTimeText}>18:00</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dni tygodnia</Text>
          
          <View style={styles.everydayContainer}>
            <Text style={styles.everydayLabel}>Codziennie</Text>
            <Switch
              value={everyday}
              onValueChange={toggleEveryday}
              trackColor={{ false: '#cbdcdb', true: '#54a9a6ff' }}
              thumbColor={everyday ? '#1E918E' : '#f4f3f4'}
            />
          </View>

          <View style={styles.daysGrid}>
            {daysOfWeek.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  selectedDays[day] && styles.dayButtonActive,
                  everyday && styles.dayButtonDisabled
                ]}
                onPress={() => toggleDay(day)}
                disabled={everyday}
              >
                <Text style={[
                  styles.dayButtonText,
                  selectedDays[day] && styles.dayButtonTextActive
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveNotification}>
          <Text style={styles.saveButtonText}>Zapisz ustawienia</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#FAFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E918E',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: width * 0.05,
    paddingBottom: height * 0.1,
  },
  section: {
    backgroundColor: '#F4F4F4',
    padding: width * 0.05,
    borderRadius: width * 0.04,
    marginBottom: height * 0.02,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E918E',
    marginBottom: height * 0.015,
  },
  sliderContainer: {
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  daysText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E918E',
    marginTop: height * 0.01,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateItem: {
    flex: 1,
    marginHorizontal: width * 0.01,
  },
  dateLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: height * 0.008,
  },
  dateDisplayContainer: {
    backgroundColor: '#fff',
    padding: width * 0.03,
    borderRadius: width * 0.03,
  },
  dateDisplayText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: height * 0.008,
  },
  dateControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dateControlButton: {
    padding: width * 0.01,
  },
  timeSliderContainer: {
    alignItems: 'center',
  },
  timeDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1E918E',
    marginBottom: height * 0.02,
  },
  sliderGroup: {
    width: '100%',
    marginBottom: height * 0.015,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: height * 0.005,
  },
  sliderValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E918E',
    textAlign: 'center',
    marginTop: height * 0.005,
  },
  timeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  presetTimeButton: {
    backgroundColor: '#fff',
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.06,
    borderRadius: width * 0.03,
  },
  presetTimeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E918E',
  },
  everydayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: width * 0.04,
    borderRadius: width * 0.03,
    marginBottom: height * 0.015,
  },
  everydayLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: '13%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: width * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  dayButtonActive: {
    backgroundColor: '#1E918E',
  },
  dayButtonDisabled: {
    opacity: 0.5,
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  dayButtonTextActive: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#1E918E',
    padding: width * 0.04,
    borderRadius: width * 0.04,
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default NewNotificationsPage;
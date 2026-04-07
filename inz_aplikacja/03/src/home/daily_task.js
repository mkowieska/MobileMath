import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import Add1TestPage from '../categories/add/test/add_1_test';
import Add2TestPage from '../categories/add/test/add_2_test';
import Add3TestPage from '../categories/add/test/add_3_test';

const { width: szerokosc_ekranu, height: wysokosc_ekranu } = Dimensions.get('window');

const DailyTask = ({ navigation }) => {
  const [userLevel, setUserLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTest, setShowTest] = useState(false);

  useEffect(() => {
    loadUserLevel();
  }, []);

  const loadUserLevel = async () => {
    try {
      const level = await AsyncStorage.getItem('userDifficultyLevel');
      if (level) {
        setUserLevel(level);
      } else {
        // Jeśli nie ma ustawionego poziomu, ustaw domyślnie łatwy
        await AsyncStorage.setItem('userDifficultyLevel', 'easy');
        setUserLevel('easy');
      }
    } catch (error) {
      console.error('Błąd ładowania poziomu:', error);
      setUserLevel('easy'); // Domyślnie łatwy
    } finally {
      setLoading(false);
    }
  };

  const getTestComponent = () => {
    switch(userLevel) {
      case 'very_easy':
        return Add1TestPage;
      case 'easy':
        return Add2TestPage;
      case 'medium':
        return Add3TestPage;
      default:
        return Add2TestPage;
    }
  };

  const getLevelName = () => {
    switch(userLevel) {
      case 'very_easy':
        return 'Bardzo łatwy';
      case 'easy':
        return 'Łatwy';
      case 'medium':
        return 'Średni';
      default:
        return 'Łatwy';
    }
  };

  if (loading) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator size="large" color="#1E918E" />
      </View>
    );
  }

  if (showTest) {
    const TestComponent = getTestComponent();
    return <TestComponent navigation={navigation} />;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#1E918E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dzienne zadanie</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Konto', { screen: 'DifficultyLevel' })}>
          <Ionicons name="settings-outline" size={28} color="#1E918E" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Ionicons name="calendar-outline" size={60} color="#1E918E" />
          <Text style={styles.title}>Dzienne Zadanie</Text>
          <Text style={styles.subtitle}>Twój poziom: {getLevelName()}</Text>
          <Text style={styles.description}>
            Rozwiąż dzisiejsze zadanie dostosowane do Twojego poziomu!
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => setShowTest(true)}
        >
          <Text style={styles.startButtonText}>Rozpocznij zadanie</Text>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.changeLevelButton}
          onPress={() => navigation.navigate('Konto', { screen: 'DifficultyLevel' })}
        >
          <Text style={styles.changeLevelText}>Zmień poziom trudności w ustawieniach</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: szerokosc_ekranu * 0.05,
    paddingVertical: wysokosc_ekranu * 0.02,
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
    padding: szerokosc_ekranu * 0.05,
    justifyContent: 'center',
  },
  infoCard: {
    backgroundColor: '#F4F4F4',
    padding: szerokosc_ekranu * 0.08,
    borderRadius: szerokosc_ekranu * 0.04,
    alignItems: 'center',
    marginBottom: wysokosc_ekranu * 0.04,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E918E',
    marginTop: wysokosc_ekranu * 0.02,
    marginBottom: wysokosc_ekranu * 0.01,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: wysokosc_ekranu * 0.02,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#1E918E',
    padding: szerokosc_ekranu * 0.04,
    borderRadius: szerokosc_ekranu * 0.03,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: wysokosc_ekranu * 0.02,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  changeLevelButton: {
    padding: szerokosc_ekranu * 0.03,
    alignItems: 'center',
  },
  changeLevelText: {
    color: '#1E918E',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default DailyTask;
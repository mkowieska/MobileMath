import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const DifficultyLevelPage = ({ navigation }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentLevel();
  }, []);

  const loadCurrentLevel = async () => {
    try {
      const level = await AsyncStorage.getItem('userDifficultyLevel');
      setSelectedLevel(level || 'easy');
    } catch (error) {
      console.error('Błąd ładowania poziomu:', error);
      setSelectedLevel('easy'); 
    } finally {
      setLoading(false);
    }
  };

  const saveLevel = async (level) => {
    try {
      await AsyncStorage.setItem('userDifficultyLevel', level);
      setSelectedLevel(level);
      Alert.alert(
        'Poziom zapisany',
        `Twój poziom trudności został zmieniony na: ${getLevelName(level)}`,
        [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack() 
          }
        ]
      );
    } catch (error) {
      console.error('Błąd zapisywania poziomu:', error);
      Alert.alert('Błąd', 'Nie udało się zapisać poziomu trudności');
    }
  };

  const getLevelName = (level) => {
    switch(level) {
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
      <View style={styles.main_container}>
        <ActivityIndicator size="large" color="#1E918E" />
      </View>
    );
  }

  return (
    <View style={styles.main_container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#1E918E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Poziom trudności</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.description}>
          Wybierz poziom trudności dla dziennych zadań. Możesz go zmienić w każdej chwili.
        </Text>

        <TouchableOpacity
          style={[
            styles.levelCard,
            selectedLevel === 'very_easy' && styles.levelCardSelected
          ]}
          onPress={() => saveLevel('very_easy')}
        >
          <View style={styles.levelHeader}>
            <Ionicons 
              name={selectedLevel === 'very_easy' ? 'radio-button-on' : 'radio-button-off'} 
              size={30} 
              color="#1E918E" 
            />
            <Text style={styles.levelTitle}>Bardzo łatwy</Text>
          </View>
          <Text style={styles.levelDescription}>
            Podstawowe dodawanie dwucyfrowych liczb z pomocą w postaci wyboru z ograniczonej liczby cyfr.
          </Text>
          <View style={styles.exampleBox}>
            <Text style={styles.exampleText}>Przykład: 16 + 23 = ?</Text>
            <Text style={styles.exampleSubtext}>4 cyfry do wyboru</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.levelCard,
            selectedLevel === 'easy' && styles.levelCardSelected
          ]}
          onPress={() => saveLevel('easy')}
        >
          <View style={styles.levelHeader}>
            <Ionicons 
              name={selectedLevel === 'easy' ? 'radio-button-on' : 'radio-button-off'} 
              size={30} 
              color="#1E918E" 
            />
            <Text style={styles.levelTitle}>Łatwy</Text>
          </View>
          <Text style={styles.levelDescription}>
            Dodawanie dwucyfrowych liczb z pełnym wyborem wszystkich cyfr od 0 do 9.
          </Text>
          <View style={styles.exampleBox}>
            <Text style={styles.exampleText}>Przykład: 34 + 45 = ?</Text>
            <Text style={styles.exampleSubtext}>Wszystkie cyfry dostępne</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.levelCard,
            selectedLevel === 'medium' && styles.levelCardSelected
          ]}
          onPress={() => saveLevel('medium')}
        >
          <View style={styles.levelHeader}>
            <Ionicons 
              name={selectedLevel === 'medium' ? 'radio-button-on' : 'radio-button-off'} 
              size={30} 
              color="#1E918E" 
            />
            <Text style={styles.levelTitle}>Średni</Text>
          </View>
          <Text style={styles.levelDescription}>
            Dodawanie dwucyfrowych liczb z przenoszeniem - musisz uzupełnić również przeniesienia.
          </Text>
          <View style={styles.exampleBox}>
            <Text style={styles.exampleText}>Przykład: 47 + 38 = ?</Text>
            <Text style={styles.exampleSubtext}>Z pokazaniem przeniesień</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

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
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: height * 0.03,
    textAlign: 'center',
    lineHeight: 24,
  },
  levelCard: {
    backgroundColor: '#F4F4F4',
    padding: width * 0.05,
    borderRadius: width * 0.04,
    marginBottom: height * 0.02,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  levelCardSelected: {
    borderColor: '#1E918E',
    backgroundColor: '#E8F5F4',
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  levelTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E918E',
    marginLeft: 10,
  },
  levelDescription: {
    fontSize: 15,
    color: '#333',
    marginBottom: height * 0.015,
    lineHeight: 22,
  },
  exampleBox: {
    backgroundColor: '#fff',
    padding: width * 0.03,
    borderRadius: width * 0.02,
    borderLeftWidth: 4,
    borderLeftColor: '#1E918E',
  },
  exampleText: {
    fontSize: 16,
    color: '#1E918E',
    fontWeight: 'bold',
  },
  exampleSubtext: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
});

export default DifficultyLevelPage;

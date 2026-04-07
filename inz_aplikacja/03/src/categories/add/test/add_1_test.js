import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width: szerokosc_ekranu, height: wysokosc_ekranu } = Dimensions.get('window');

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const TOTAL_QUESTIONS = 5;

const losujLiczbyDwuCyfroweZSumaDwuCyfrowa = () => {
  // Bez przeniesienia: suma jednosci musi byc mniejsza niz 10.
  let num1;
  let num2;

  do {
    num1 = Math.floor(Math.random() * (89 - 10 + 1)) + 10;
    const maxNum2 = 99 - num1;
    num2 = Math.floor(Math.random() * (maxNum2 - 10 + 1)) + 10;
  } while ((num1 % 10) + (num2 % 10) >= 10);

  return { num1, num2 };
};

const pickRandomUnique = (arr, count) => {
  const pool = [...arr];
  const out = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return out;
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const createQuestion = () => {
  const { num1, num2 } = losujLiczbyDwuCyfroweZSumaDwuCyfrowa();
  const sumStr = String(num1 + num2);
  const baseDigits = [sumStr[0], sumStr[1]];
  const extrasPool = DIGITS.filter((d) => !baseDigits.includes(d));
  const extras = pickRandomUnique(extrasPool, 2);
  return {
    num1,
    num2,
    correctAnswer: sumStr,
    availableDigits: shuffle([...baseDigits, ...extras]),
  };
};

const markDailyTaskDone = async () => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const countStr = await AsyncStorage.getItem('dailyTaskCompletedCount');
    const nextCount = (parseInt(countStr || '0', 10) || 0) + 1;
    await AsyncStorage.setItem('dailyTaskLastDoneDate', today);
    await AsyncStorage.setItem('dailyTaskCompletedCount', String(nextCount));
  } catch (e) {
    console.warn('Nie udalo sie zapisac statystyk zadania', e);
  }
};

const Add1TestPage = ({ navigation }) => {
  const [questions] = useState(() => Array.from({ length: TOTAL_QUESTIONS }, createQuestion));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState(['', '']);
  const [selectedDigit, setSelectedDigit] = useState(null);

  const currentQuestion = questions[currentIndex];

  const handleDigitSelect = (digit) => {
    setSelectedDigit(digit);
  };

  const handlePlaceSelect = (index) => {
    if (selectedDigit === null) {
      return;
    }
    const newAnswer = [...answer];
    newAnswer[index] = selectedDigit;
    setAnswer(newAnswer);
    setSelectedDigit(null);
  };

  const clearPlace = (index) => {
    const newAnswer = [...answer];
    newAnswer[index] = '';
    setAnswer(newAnswer);
  };

  const resetForNextQuestion = () => {
    setAnswer(['', '']);
    setSelectedDigit(null);
  };

  const finishTest = async (finalScore) => {
    await markDailyTaskDone();
    Alert.alert('Koniec testu', `Twoj wynik: ${finalScore} pkt`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const checkAnswer = async () => {
    const userAnswer = answer.join('');
    const isCorrect = userAnswer === currentQuestion.correctAnswer;
    const nextScore = score + (isCorrect ? 100 : 0);

    setScore(nextScore);

    if (currentIndex === questions.length - 1) {
      await finishTest(nextScore);
      return;
    }

    setCurrentIndex((idx) => idx + 1);
    resetForNextQuestion();
  };

  useEffect(() => {
    if (answer.every((digit) => digit !== '')) {
      checkAnswer();
    }
  }, [answer]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#1E918E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Test - Bardzo latwy</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.progress}>Zadanie {currentIndex + 1} / {TOTAL_QUESTIONS}</Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentIndex + 1) / TOTAL_QUESTIONS) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.score}>Punkty: {score}</Text>
        <Text style={styles.instruction}>Wpisz wynik dodawania:</Text>

        <View style={styles.mathContainer}>
          <View style={styles.mathRow}>
            <Text style={styles.mathNumber}>{currentQuestion.num1}</Text>
          </View>
          <View style={styles.mathRow}>
            <Text style={styles.mathOperator}>+</Text>
            <Text style={styles.mathNumber}>{currentQuestion.num2}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.answerRow}>
            {answer.map((digit, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.answerBox, digit ? styles.answerBoxFilled : styles.answerBoxEmpty]}
                onPress={() => (digit ? clearPlace(index) : handlePlaceSelect(index))}
              >
                <Text style={styles.answerText}>{digit || '?'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.selectInstruction}>
          {selectedDigit ? `Wybrano: ${selectedDigit}` : 'Wybierz cyfre:'}
        </Text>

        <View style={styles.digitsContainer}>
          {currentQuestion.availableDigits.map((digit, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.digitCircle, selectedDigit === digit && styles.digitCircleSelected]}
              onPress={() => handleDigitSelect(digit)}
            >
              <Text style={styles.digitText}>{digit}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E918E',
  },
  content: {
    flexGrow: 1,
    padding: szerokosc_ekranu * 0.05,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: wysokosc_ekranu * 0.06,
  },
  progress: {
    marginTop: wysokosc_ekranu * 0.015,
    fontSize: 16,
    color: '#1E918E',
    fontWeight: 'bold',
  },
  progressTrack: {
    width: '100%',
    height: 10,
    backgroundColor: '#DCECEC',
    borderRadius: 999,
    marginTop: wysokosc_ekranu * 0.01,
    marginBottom: wysokosc_ekranu * 0.012,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1E918E',
    borderRadius: 999,
  },
  score: {
    fontSize: 18,
    color: '#333',
    marginTop: 4,
    marginBottom: wysokosc_ekranu * 0.02,
  },
  instruction: {
    fontSize: 18,
    color: '#333',
    marginBottom: wysokosc_ekranu * 0.02,
    textAlign: 'center',
  },
  mathContainer: {
    backgroundColor: '#F4F4F4',
    padding: szerokosc_ekranu * 0.08,
    borderRadius: szerokosc_ekranu * 0.04,
    marginBottom: wysokosc_ekranu * 0.04,
    minWidth: szerokosc_ekranu * 0.5,
  },
  mathRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: wysokosc_ekranu * 0.01,
  },
  mathOperator: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1E918E',
    marginRight: szerokosc_ekranu * 0.03,
  },
  mathNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    minWidth: szerokosc_ekranu * 0.2,
    textAlign: 'right',
  },
  divider: {
    height: 3,
    backgroundColor: '#1E918E',
    marginVertical: wysokosc_ekranu * 0.015,
  },
  answerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: wysokosc_ekranu * 0.01,
  },
  answerBox: {
    width: szerokosc_ekranu * 0.12,
    height: szerokosc_ekranu * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: szerokosc_ekranu * 0.02,
    marginHorizontal: 3,
  },
  answerBoxEmpty: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#1E918E',
  },
  answerBoxFilled: {
    backgroundColor: '#1E918E',
  },
  answerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  selectInstruction: {
    fontSize: 16,
    color: '#666',
    marginBottom: wysokosc_ekranu * 0.02,
    textAlign: 'center',
  },
  digitsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  digitCircle: {
    width: szerokosc_ekranu * 0.15,
    height: szerokosc_ekranu * 0.15,
    borderRadius: szerokosc_ekranu * 0.075,
    backgroundColor: '#F4F4F4',
    justifyContent: 'center',
    alignItems: 'center',
    margin: szerokosc_ekranu * 0.02,
    borderWidth: 2,
    borderColor: '#1E918E',
  },
  digitCircleSelected: {
    backgroundColor: '#1E918E',
  },
  digitText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E918E',
  },
});

export default Add1TestPage;

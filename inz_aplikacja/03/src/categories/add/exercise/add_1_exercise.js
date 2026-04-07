import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: szerokosc_ekranu, height: wysokosc_ekranu } = Dimensions.get('window');

const DIGITS = ['0','1','2','3','4','5','6','7','8','9'];
const TOTAL_TASKS = 5;

const losujLiczbyDwuCyfroweZSumąDwuCyfrową = () => {
  // Bez przeniesienia: suma jednosci musi byc mniejsza niz 10.
  let num1;
  let num2;

  do {
    num1 = Math.floor(Math.random() * (89 - 10 + 1)) + 10;
    const maxNum2 = 99 - num1; // gwarantuje sume <= 99
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

const generateTask = () => {
  const { num1, num2 } = losujLiczbyDwuCyfroweZSumąDwuCyfrową();
  const sumStr = String(num1 + num2);
  const baseDigits = [sumStr[0], sumStr[1]];
  const extrasPool = DIGITS.filter(d => !baseDigits.includes(d));
  const extras = pickRandomUnique(extrasPool, 2);
  const availableDigits = shuffle([...baseDigits, ...extras]);

  return { num1, num2, availableDigits, correctAnswer: sumStr };
};

const Add1ExercisePage = ({ navigation }) => {
  const [taskIndex, setTaskIndex] = useState(0);
  const [task, setTask] = useState(() => generateTask());
  const [answer, setAnswer] = useState(['', '']); // 2 miejsca na cyfry
  const [selectedDigit, setSelectedDigit] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const handleDigitSelect = (digit) => {
    setSelectedDigit(digit);
  };

  const handlePlaceSelect = (index) => {
    if (selectedDigit !== null) {
      const newAnswer = [...answer];
      newAnswer[index] = selectedDigit;
      setAnswer(newAnswer);
      setSelectedDigit(null);
    }
  };

  const clearPlace = (index) => {
    const newAnswer = [...answer];
    newAnswer[index] = '';
    setAnswer(newAnswer);
  };

  const goToNextTask = () => {
    const nextTaskIndex = taskIndex + 1;
    const nextCorrectCount = correctCount + 1;

    if (nextTaskIndex >= TOTAL_TASKS) {
      Alert.alert(
        'Koniec zadań',
        `Dobrze: ${nextCorrectCount}\nBłędów: ${wrongCount}`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      return;
    }

    setCorrectCount(nextCorrectCount);
    setTaskIndex(nextTaskIndex);
    setTask(generateTask());
    setAnswer(['', '']);
    setSelectedDigit(null);
  };

  const checkAnswer = () => {
    const userAnswer = answer.join('');
    const isCorrect = userAnswer === task.correctAnswer;
    if (isCorrect) {
      // Po poprawnej odpowiedzi przechodzimy do kolejnego zadania.
      goToNextTask();
      return;
    }

    // Po bledzie zostajemy na tym samym zadaniu i pokazujemy dymek.
    setWrongCount((prev) => prev + 1);
    Alert.alert('Ups', 'Ktoś się pomylił. Spróbuj jeszcze raz.');
  };

  const showHint = () => {
    // Dynamiczna podpowiedz liczona na podstawie aktualnego przykladu.
    const tens1 = Math.floor(task.num1 / 10);
    const ones1 = task.num1 % 10;
    const tens2 = Math.floor(task.num2 / 10);
    const ones2 = task.num2 % 10;
    const onesSum = ones1 + ones2;
    const tensSum = tens1 + tens2;

    Alert.alert(
      'Podpowiedz',
      `1) Dodaj jednosci: ${ones1} + ${ones2} = ${onesSum}.\n2) Dodaj dziesiatki: ${tens1} + ${tens2} = ${tensSum}.\n3) Polacz wynik: ${tensSum}${onesSum}.`
    );
  };

  React.useEffect(() => {
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
        <Text style={styles.headerTitle}>Zadania - Dodawanie</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.progress}>Zadanie {taskIndex + 1} / {TOTAL_TASKS}</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${((taskIndex + 1) / TOTAL_TASKS) * 100}%` }]} />
        </View>
        <Text style={styles.instruction}>Wpisz wynik dodawania:</Text>
        {/* Przycisk uruchamia podpowiedz dla biezacego zadania. */}
        <TouchableOpacity style={styles.hintButton} onPress={showHint}>
          <Text style={styles.hintButtonText}>Podpowiedz</Text>
        </TouchableOpacity>

        <View style={styles.mathContainer}>
          <View style={styles.mathRow}>
            <Text style={styles.mathNumber}>{task.num1}</Text>
          </View>
          <View style={styles.mathRow}>
            <Text style={styles.mathOperator}>+</Text>
            <Text style={styles.mathNumber}>{task.num2}</Text>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.answerRow}>
            {answer.map((digit, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.answerBox,
                  digit ? styles.answerBoxFilled : styles.answerBoxEmpty
                ]}
                onPress={() => digit ? clearPlace(index) : handlePlaceSelect(index)}
              >
                <Text style={styles.answerText}>{digit || '?'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.selectInstruction}>
          {selectedDigit ? `Wybrano: ${selectedDigit} - kliknij miejsce powyżej` : 'Wybierz cyfrę:'}
        </Text>

        <View style={styles.digitsContainer}>
          {task.availableDigits.map((digit, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.digitCircle,
                selectedDigit === digit && styles.digitCircleSelected
              ]}
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
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  progressTrack: {
    width: '100%',
    height: 10,
    backgroundColor: '#DCECEC',
    borderRadius: 999,
    marginTop: wysokosc_ekranu * 0.01,
    marginBottom: wysokosc_ekranu * 0.025,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1E918E',
    borderRadius: 999,
  },
  instruction: {
    fontSize: 18,
    color: '#333',
    marginBottom: wysokosc_ekranu * 0.015,
    textAlign: 'center',
  },
  hintButton: {
    backgroundColor: '#1E918E',
    paddingHorizontal: szerokosc_ekranu * 0.06,
    paddingVertical: wysokosc_ekranu * 0.012,
    borderRadius: 12,
    marginBottom: wysokosc_ekranu * 0.025,
  },
  hintButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
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

export default Add1ExercisePage;
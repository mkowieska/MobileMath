import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const STEPS = [
  {
    title: 'Krok 1: Zapis pisemny',
    text: 'Ustaw liczby pod sobą. Najpierw dodajemy jedności, potem dziesiątki.',
    example: ['  58', '+ 27', '----', '  ??'],
  },
  {
    title: 'Krok 2: Jedności i przeniesienie',
    text: '8 + 7 = 15. Wpisujemy 5 na dole, a 1 przenosimy nad kolumnę dziesiątek.',
    example: ['  ¹58', '+ 27', '----', '  ?5'],
  },
  {
    title: 'Krok 3: Dziesiątki z przeniesieniem',
    text: 'Dodajemy dziesiątki razem z przeniesieniem: 1 + 5 + 2 = 8. Wynik to 85.',
    example: ['  ¹58', '+ 27', '----', '  85'],
  },
  {
    title: 'Poziom średni',
    text: 'W zadaniach masz pola na przeniesienia nad działaniem. Najpierw wpisz przeniesienie, potem wynik.',
    example: ['Wskazówka:', 'najpierw prawa kolumna,', 'potem lewa kolumna.'],
  },
];

const Add3ExplanationPage = ({ navigation }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;
  const step = STEPS[stepIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#1E918E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wyjaśnienie - Średni</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.progress}>Krok {stepIndex + 1} / {STEPS.length}</Text>
        <Text style={styles.stepTitle}>{step.title}</Text>
        <Text style={styles.stepText}>{step.text}</Text>

        <View style={styles.exampleBox}>
          {step.example.map((line, index) => (
            <Text key={index} style={styles.exampleLine}>{line}</Text>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.navButton, isFirst && styles.navButtonDisabled]}
            disabled={isFirst}
            onPress={() => setStepIndex((s) => s - 1)}
          >
            <Text style={styles.navButtonText}>Wstecz</Text>
          </TouchableOpacity>

          {!isLast ? (
            <TouchableOpacity style={styles.navButton} onPress={() => setStepIndex((s) => s + 1)}>
              <Text style={styles.navButtonText}>Dalej</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('Add3Exercise')}>
              <Text style={styles.startButtonText}>Przejdź do zadań</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
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
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
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
    flex: 1,
    padding: width * 0.06,
    justifyContent: 'center',
  },
  progress: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: height * 0.01,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E918E',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  stepText: {
    fontSize: 17,
    color: '#333',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: height * 0.03,
  },
  exampleBox: {
    backgroundColor: '#F4F4F4',
    borderRadius: width * 0.04,
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.08,
    marginBottom: height * 0.04,
  },
  exampleLine: {
    fontSize: 30,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'right',
    letterSpacing: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    backgroundColor: '#1E918E',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.07,
    borderRadius: width * 0.03,
  },
  navButtonDisabled: {
    backgroundColor: '#A7D5D3',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#1E918E',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.06,
    borderRadius: width * 0.03,
    marginLeft: 'auto',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Add3ExplanationPage;
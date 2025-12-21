import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const kolumny = 4;
const liczba_par = 8;
const dostepne_pary = [[0, 10], [1, 9], [2, 8], [3, 7], [4, 6], [5, 5],];

function shuffle(array) {
  let a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateTiles(pairsCount) {
  // wybierz losowe pary z dostepne_pary (z powtórzeniami jeśli potrzeba)
  const pairs = [];
  for (let i = 0; i < pairsCount; i++) {
    const p = dostepne_pary[Math.floor(Math.random() * dostepne_pary.length)];
    pairs.push(p);
  }

  // stwórz listę płytek (po 2 dla każdej pary) i zamieszaj
  let tiles = [];
  let id = 0;
  pairs.forEach((p) => {
    const [a, b] = p;
    tiles.push({ id: `${id++}`, value: a, revealed: false, matched: false });
    tiles.push({ id: `${id++}`, value: b, revealed: false, matched: false });
  });

  tiles = shuffle(tiles);
  return tiles;
}

export default function App({ navigation }) {
  const [tiles, setTiles] = useState(() => generateTiles(liczba_par));
  const [selected, setSelected] = useState([]); // indeksy aktualnie odwróconych płytek (max 2)
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);
  const lockRef = useRef(false); // blokada kliknięć podczas animacji

  // Start / reset gry
  function startNewGame() {
    setTiles(generateTiles(liczba_par));
    setSelected([]);
    setScore(0);
    setSeconds(0);
    setRunning(true);
    lockRef.current = false;
  }

  useEffect(() => {
    // autostart nowej gry
    startNewGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running]);

  // Obsługa kliknięcia płytki
  const handlePress = (index) => {
    if (lockRef.current) return; // blokada
    const t = tiles[index];
    if (t.matched || t.revealed) return; // ignoruij klik na już dopasowane lub już odsłonięte

    // odsłoń
    const newTiles = tiles.slice();
    newTiles[index] = { ...newTiles[index], revealed: true };
    const newSelected = [...selected, index];
    setTiles(newTiles);
    setSelected(newSelected);

    if (newSelected.length === 2) {
      lockRef.current = true; // blokuj kolejne kliknięcia dopóki sprawdzamy
      const [i1, i2] = newSelected;
      const v1 = newTiles[i1].value;
      const v2 = newTiles[i2].value;
      if (v1 + v2 === 10) {
        // poprawne dopasowanie
        setTimeout(() => {
          const matchedTiles = newTiles.slice();
          matchedTiles[i1] = { ...matchedTiles[i1], matched: true, revealed: true };
          matchedTiles[i2] = { ...matchedTiles[i2], matched: true, revealed: true };
          setTiles(matchedTiles);
          setSelected([]);
          setScore((s) => s + 100); // przykład punktów
          lockRef.current = false;
          checkGameEnd(matchedTiles);
        }, 400); // krótka przerwa przed oznaczeniem
      } else {
        // niepoprawne => zakryj po chwili
        setTimeout(() => {
          const reverted = newTiles.slice();
          reverted[i1] = { ...reverted[i1], revealed: false };
          reverted[i2] = { ...reverted[i2], revealed: false };
          setTiles(reverted);
          setSelected([]);
          setScore((s) => Math.max(0, s - 10)); // kara
          lockRef.current = false;
        }, 800); // pokaż użytkownikowi przez 800ms
      }
    }
  };

  const checkGameEnd = (currentTiles) => {
    const allMatched = currentTiles.every((t) => t.matched);
    if (allMatched) {
      setRunning(false);
      Alert.alert("Koniec gry!", `Zdobyte punkty: ${score}\nCzas: ${formatTime(seconds)}`, [
        { text: "Nowa gra", onPress: () => startNewGame() },
        { text: "OK" },
      ]);
    }
  };

  const formatTime = (s) => {
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const renderTile = ({ item, index }) => {
    const isRevealed = item.revealed || item.matched;
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.tile, isRevealed ? styles.tileRevealed : styles.tileHidden]}
        onPress={() => handlePress(index)}
      >
        {isRevealed ? <Text style={styles.tileText}>{item.value}</Text> : <Text style={styles.tileText}>?</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Gra Memory - Sumuj do 10</Text>
        <View style={styles.upper}>
          <TouchableOpacity style={styles.button_new} onPress={() => startNewGame()}>
            <Text style={styles.buttonTextNew}>Nowa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button_again} onPress={() => setRunning(true)}>
            <Text style={styles.buttonText}>Wznów</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button_stop} onPress={() => setRunning(false)}>
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.upper}>
          <Text style={styles.upperText}>Czas: {formatTime(seconds)}</Text>
          <Text style={styles.upperText}>Punkty: {score}</Text>
        </View>
      </View>

      <FlatList
        data={tiles}
        renderItem={renderTile}
        keyExtractor={(item) => item.id}
        numColumns={kolumny}
        scrollEnabled={false}
        contentContainerStyle={styles.grid}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Klikaj dwie płytki, które razem dają 10.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFFFF',
  },
  header: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    backgroundColor: '#1E918E',
  },
  backButton: {
    marginBottom: height * 0.01,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: height * 0.015,
    textAlign: 'center',
  },
  upper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: height * 0.012,
  },
  upperText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  button_new: {
    backgroundColor: '#FAFFFF',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.06,
    borderRadius: width * 0.04,
  },
  button_again: {
    backgroundColor: '#54a9a6ff',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.06,
    borderRadius: width * 0.04,
    borderColor: '#FAFFFF',
  },
  button_stop: {
    backgroundColor: '#d32f2f',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.06,
    borderRadius: width * 0.04,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  buttonTextNew: {
    color: '#1E918E',
    fontWeight: 'bold',
    fontSize: 13,
  },
  grid: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    alignItems: 'center',
  },
  tile: {
    width: '22%',
    aspectRatio: 1,
    margin: '2%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.04,
    borderWidth: 3,
  },
  tileHidden: {
    backgroundColor: '#cbdcdb',
    borderColor: '#1E918E',
  },
  tileRevealed: {
    backgroundColor: '#1E918E',
    borderColor: '#1E918E',
  },
  tileText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  footer: {
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    backgroundColor: '#F4F4F4',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

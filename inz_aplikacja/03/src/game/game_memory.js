import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const szerokosc_ekranu = Dimensions.get('window').width;
const wysokosc_ekranu = Dimensions.get('window').height;
const padding_poziomy = szerokosc_ekranu * 0.05;
const dostepna_szerokosc = szerokosc_ekranu - padding_poziomy * 2;
const rozmiar_plytki = (dostepna_szerokosc - 12) / 4; // 12 = margins between 4 tiles
const margines_plytki = 1.5;

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
  const [showPopup, setShowPopup] = useState(true); // popup z wyjaśnieniem
  const timerRef = useRef(null);
  const lockRef = useRef(false); // blokada kliknięć podczas animacji

  // Start / reset gry
  function startNewGame() {
    setTiles(generateTiles(liczba_par));
    setSelected([]);
    setScore(0);
    setSeconds(0);
    setRunning(false);
    setShowPopup(true);
    lockRef.current = false;
  }

  // Rozpocznij grę po zamknięciu popupu
  function startGame() {
    setShowPopup(false);
    setRunning(true);
  }
  
  useEffect(() => {
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
    if (!running) return; // nie pozwalaj klikać przed startem
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
          const newScore = score + 100; // oblicz nowe punkty
          setTiles(matchedTiles);
          setSelected([]);
          setScore(newScore); // ustaw nowe
          lockRef.current = false;
          checkGameEnd(matchedTiles, newScore); // przekaż nowe punkty
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

  const checkGameEnd = (currentTiles, finalScore = score) => {
    const allMatched = currentTiles.every((t) => t.matched);
    if (allMatched) {
      setRunning(false);
      Alert.alert("Koniec gry!", `Zdobyte punkty: ${finalScore}\nCzas: ${formatTime(seconds)}`, [
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
      <Modal
        visible={showPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {}} 
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Gra Memory - Sumuj do 10</Text>
            <Text style={styles.modalText}>
              Znajdź wszystkie pary liczb, które po dodaniu razem dają 10.{'\n'}
              Kliknij dwie liczby, które sumują się do 10.{'\n\n'}
              Odwracaj płytki klikając na nie.{'\n\n'}
              Za poprawną parę otrzymujesz 100 punktów, za błąd tracisz 10 punktów.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.startButton} onPress={startGame}>
                <Text style={styles.startButtonText}>START</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingVertical: wysokosc_ekranu * 0.02,
    paddingHorizontal: padding_poziomy,
    backgroundColor: '#1E918E',
  },
  backButton: {
    marginBottom: wysokosc_ekranu * 0.01,
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
    marginBottom: wysokosc_ekranu * 0.012,
  },
  upperText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  button_new: {
    backgroundColor: '#FAFFFF',
    paddingVertical: wysokosc_ekranu * 0.01,
    paddingHorizontal: szerokosc_ekranu * 0.06,
    borderRadius: szerokosc_ekranu * 0.04,
  },
  button_again: {
    backgroundColor: '#54a9a6ff',
    paddingVertical: wysokosc_ekranu * 0.01,
    paddingHorizontal: szerokosc_ekranu * 0.06,
    borderRadius: szerokosc_ekranu * 0.04,
    borderColor: '#FAFFFF',
  },
  button_stop: {
    backgroundColor: '#d32f2f',
    paddingVertical: wysokosc_ekranu * 0.01,
    paddingHorizontal: szerokosc_ekranu * 0.06,
    borderRadius: szerokosc_ekranu * 0.04,
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
    paddingVertical: wysokosc_ekranu * 0.02,
    paddingHorizontal: padding_poziomy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tile: {
    width: rozmiar_plytki,
    height: rozmiar_plytki,
    margin: margines_plytki,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: szerokosc_ekranu * 0.04,
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
    paddingVertical: wysokosc_ekranu * 0.015,
    paddingHorizontal: padding_poziomy,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FAFFFF',
    borderRadius: szerokosc_ekranu * 0.05,
    padding: szerokosc_ekranu * 0.08,
    width: szerokosc_ekranu * 0.85,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E918E',
    marginBottom: wysokosc_ekranu * 0.02,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: wysokosc_ekranu * 0.03,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  startButton: {
    backgroundColor: '#1E918E',
    paddingVertical: wysokosc_ekranu * 0.015,
    paddingHorizontal: szerokosc_ekranu * 0.12,
    borderRadius: szerokosc_ekranu * 0.05,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  exitButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: wysokosc_ekranu * 0.015,
    paddingHorizontal: szerokosc_ekranu * 0.12,
    borderRadius: szerokosc_ekranu * 0.05,
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

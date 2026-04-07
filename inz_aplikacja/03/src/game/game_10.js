import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const szerokosc_ekranu = Dimensions.get('window').width;
const wysokosc_ekranu = Dimensions.get('window').height;

const padding = szerokosc_ekranu * 0.05;
const dostepna_szerokosc = szerokosc_ekranu - padding * 2; 

const margines_plytki = 8;
const rozmiar_plytki = (dostepna_szerokosc - (margines_plytki * 4)) / 4;

const kolumny = 4;
const liczba_par = 8;
const dostepne_pary = [[0, 10], [1, 9], [2, 8], [3, 7], [4, 6], [5, 5],];

function tasuj(tablica) {
  let a = tablica.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generujPlytki(liczba_par) {
  const pary = [];
  //powtorzenia sa dozwolone, za kazdym razem losujemy z calej listy
  for (let i = 0; i < liczba_par; i++) { 
    const p = dostepne_pary[Math.floor(Math.random() * dostepne_pary.length)];
    pary.push(p);
  }
  // lista par plytek
  let plytki = [];
  let id = 0;
  pary.forEach((p) => {
    const [a, b] = p;
    plytki.push({ id: `${id++}`, value: a, revealed: true, matched: false });
    plytki.push({ id: `${id++}`, value: b, revealed: true, matched: false });
  });
  //tasowanie
  plytki = tasuj(plytki);
  return plytki;
}

export default function App({ navigation }) {
  const [plytki, ustawPlytki] = useState(() => generujPlytki(liczba_par));
  const [wybrane, ustawWybrane] = useState([]); // indeksy aktualnie odwroconych max 2 plytek
  const [punkty, ustawPunkty] = useState(0);
  const [sekundy, ustawSekundy] = useState(0);
  const [uruchomiona, ustawUruchomienie] = useState(false); 
  const [pokazPopup, ustawPokazPopup] = useState(true);
  const czasomierz_ref = useRef(null);
  const blokada_ref = useRef(false); // blokada klikniec podczas animacji

  function rozpocznijNowaGre() {
    ustawPlytki(generujPlytki(liczba_par));
    ustawWybrane([]);
    ustawPunkty(0);
    ustawSekundy(0);
    ustawUruchomienie(false);
    ustawPokazPopup(true);
    blokada_ref.current = false;
  }

  function rozpocznijGre() {
    ustawPokazPopup(false);
    ustawUruchomienie(true);
  }

  // czyszczenie czasomierza przy odmontowaniu
  useEffect(() => {
    return () => {
      if (czasomierz_ref.current) clearInterval(czasomierz_ref.current);
    };
  }, []);

  // mierzenie czasu
  useEffect(() => {
    if (uruchomiona) {
      czasomierz_ref.current = setInterval(() => {
        ustawSekundy((s) => s + 1);
      }, 1000);
    } else {
      if (czasomierz_ref.current) clearInterval(czasomierz_ref.current);
    }
    return () => {
      if (czasomierz_ref.current) clearInterval(czasomierz_ref.current);
    };
  }, [uruchomiona]);

  // Obsluga klikniecia plytki
  const obslugaKlikniecia = (index) => {
    if (!uruchomiona) return; // nie pozwalaj klikac przed startem
    if (blokada_ref.current) return; // blokada
    const t = plytki[index];
    if (t.matched || wybrane.includes(index)) return; // ignoruj klik na juz dopasowane lub juz wybrane

    // wybierz plytke
    const noweWybrane = [...wybrane, index];
    ustawWybrane(noweWybrane);

    if (noweWybrane.length === 2) {
      blokada_ref.current = true; // blokuj kolejne klikniecia dopoki sprawdzamy
      const [i1, i2] = noweWybrane;
      const v1 = plytki[i1].value;
      const v2 = plytki[i2].value;
      if (v1 + v2 === 10) {
        // poprawne dopasowanie
        setTimeout(() => {
          const dopasowanePlytki = plytki.slice();
          dopasowanePlytki[i1] = { ...dopasowanePlytki[i1], matched: true };
          dopasowanePlytki[i2] = { ...dopasowanePlytki[i2], matched: true };
          const nowePunkty = punkty + 100; // oblicz nowe punkty
          ustawPlytki(dopasowanePlytki);
          ustawWybrane([]);
          ustawPunkty(nowePunkty); // ustaw nowe
          blokada_ref.current = false;
          sprawdzKoniecGry(dopasowanePlytki, nowePunkty); // przekaż nowe punkty
        }, 400); // krotka przerwa przed oznaczeniem
      } else {
        // niepoprawne => odznacz po chwili
        setTimeout(() => {
          ustawWybrane([]);
          ustawPunkty((s) => Math.max(0, s - 10)); // kara
          blokada_ref.current = false;
        }, 800); // pokaz uzytkownikowi przez 800ms
      }
    }
  };

  const sprawdzKoniecGry = (aktualnyePlytki, ostateczniePunkty = punkty) => {
    const wszystkieDopasowane = aktualnyePlytki.every((t) => t.matched);
    if (wszystkieDopasowane) {
      ustawUruchomienie(false);
      Alert.alert("Koniec gry!", `Zdobyte punkty: ${ostateczniePunkty}\nCzas: ${sformatujCzas(sekundy)}`, [
        { text: "Nowa gra", onPress: () => rozpocznijNowaGre() },
        { text: "OK" },
      ]);
    }
  };

  const sformatujCzas = (s) => {
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const rysujPlytke = ({ item, index }) => {
    const jestWybrana = wybrane.includes(index);
    const jestDopasowana = item.matched;
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.tile,
          jestDopasowana ? styles.tileMatched : jestWybrana ? styles.tileSelected : styles.tileRevealed
        ]}
        onPress={() => obslugaKlikniecia(index)}
      >
        <Text style={styles.tileText}>{item.value}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={pokazPopup} transparent={true} animationType="fade" onRequestClose={() => {}}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Gra Sumuj do 10</Text>
            <Text style={styles.modalText}>
              Znajdź wszystkie pary liczb, które po dodaniu razem daja 10.{'\n'}
              Kliknij dwie liczby, które sumują się do 10.{'\n\n'}
              Wszystkie liczby są widoczne na planszy.{'\n\n'}
              Za poprawną parę otrzymujesz 100 punktów, za błąd tracisz 10 punktów.
            </Text>
            <TouchableOpacity style={styles.startButton} onPress={rozpocznijGre}>
              <Text style={styles.startButtonText}>START</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Gra - Sumuj do 10</Text>
        <View style={styles.upper}>
          <TouchableOpacity style={styles.button_new} onPress={() => rozpocznijNowaGre()}>
            <Text style={styles.buttonTextNew}>Nowa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button_again} onPress={() => ustawUruchomienie(true)}>
            <Text style={styles.buttonText}>Wznow</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button_stop} onPress={() => ustawUruchomienie(false)}>
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.upper}>
          <Text style={styles.upperText}>Czas: {sformatujCzas(sekundy)}</Text>
          <Text style={styles.upperText}>Punkty: {punkty}</Text>
        </View>
      </View>

      <FlatList
        data={plytki}
        renderItem={rysujPlytke}
        keyExtractor={(item) => item.id}
        numColumns={kolumny}
        scrollEnabled={false}
        contentContainerStyle={styles.grid}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Klikaj dwie plytki, ktore razem daja 10.</Text>
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
    paddingHorizontal: szerokosc_ekranu * 0.05,
    backgroundColor: '#1E918E',
  },
  backButton: {
    marginBottom: wysokosc_ekranu * 0.01,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: wysokosc_ekranu * 0.015,
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
    paddingHorizontal: padding,
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
    backgroundColor: '#349690ff',
    borderColor: '#b96278ff',
  },
  tileRevealed: {
    backgroundColor: '#1E918E',
    borderColor: '#1E918E',
  },
  tileSelected: {//
    backgroundColor: 'rgba(30, 145, 142, 0.7)',
    borderColor: '#ffff',
    borderWidth: 4,
  },
  tileMatched: {//
    backgroundColor: '#1E9124',
    borderColor: '#1E9124',
  },
  tileText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  footer: {
    paddingVertical: wysokosc_ekranu * 0.015,
    paddingHorizontal: szerokosc_ekranu * 0.05,
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
  startButton: {
    backgroundColor: '#1E918E',
    paddingVertical: wysokosc_ekranu * 0.015,
    paddingHorizontal: szerokosc_ekranu * 0.15,
    borderRadius: szerokosc_ekranu * 0.05,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';

const szerokosc_ekranu = Dimensions.get('window').width;
const wysokosc_ekranu = Dimensions.get('window').height;

const StatisticsPage = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalTasksCompleted: 15,
    totalPointsFromTasks: 1350,
    averageTaskPoints: 90,
    highestGameScore: 950,
    gamesPlayed: 8,
    totalGamePoints: 6420,
    averageGamePoints: 802.5, 
    tasksHistory: [
      { id: 1, name: 'Dodawanie do 10', points: 85, date: '2026-01-05' },
      { id: 2, name: 'Odejmowanie do 10', points: 95, date: '2026-01-05' },
      { id: 3, name: 'Mnożenie', points: 80, date: '2026-01-04' },
    ],
    gamesHistory: [
      { id: 1, game: 'Memory Game', points: 850, date: '2026-01-05' },
      { id: 2, game: 'Game 10', points: 920, date: '2026-01-04' },
    ],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#1E918E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Moje Statystyki</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Sekcja zadań */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zadania</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="library-outline" size={32} color="#1E918E" />
              <Text style={styles.statValue}>{stats.totalTasksCompleted}</Text>
              <Text style={styles.statLabel}>Rozwiązane zadania</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="star-outline" size={32} color="#1E918E" />
              <Text style={styles.statValue}>{stats.totalPointsFromTasks}</Text>
              <Text style={styles.statLabel}>Łącznie punktów</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="bar-chart-outline" size={32} color="#1E918E" />
              <Text style={styles.statValue}>{stats.averageTaskPoints}</Text>
              <Text style={styles.statLabel}>Średnia punktów</Text>
            </View>
          </View>
        </View>

        {/* Sekcja gier */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gry</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="game-controller-outline" size={32} color="#1E918E" />
              <Text style={styles.statValue}>{stats.gamesPlayed}</Text>
              <Text style={styles.statLabel}>Gier zagranych</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="trophy-outline" size={32} color="#1E918E" />
              <Text style={styles.statValue}>{stats.highestGameScore}</Text>
              <Text style={styles.statLabel}>Najwyższy wynik</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="podium-outline" size={32} color="#1E918E" />
              <Text style={styles.statValue}>{Math.round(stats.averageGamePoints)}</Text>
              <Text style={styles.statLabel}>Średni wynik</Text>
            </View>
          </View>
        </View>

        {/* Historia zadań */}
        {stats.tasksHistory.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ostatnie zadania</Text>
            {stats.tasksHistory.map((task) => (
              <View key={task.id} style={styles.historyItem}>
                <View>
                  <Text style={styles.historyTitle}>{task.name}</Text>
                  <Text style={styles.historyDate}>{task.date}</Text>
                </View>
                <Text style={styles.historyPoints}>{task.points} pkt</Text>
              </View>
            ))}
          </View>
        )}

        {/* Historia gier */}
        {stats.gamesHistory.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ostatnie gry</Text>
            {stats.gamesHistory.map((game) => (
              <View key={game.id} style={styles.historyItem}>
                <View>
                  <Text style={styles.historyTitle}>{game.game}</Text>
                  <Text style={styles.historyDate}>{game.date}</Text>
                </View>
                <Text style={styles.historyPoints}>{game.points} pkt</Text>
              </View>
            ))}
          </View>
        )}
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E918E',
  },
  scrollContent: {
    padding: szerokosc_ekranu * 0.05,
    paddingBottom: wysokosc_ekranu * 0.08,
    flexGrow: 1,
  },
  section: {
    backgroundColor: '#F4F4F4',
    borderRadius: szerokosc_ekranu * 0.04,
    padding: szerokosc_ekranu * 0.05,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: wysokosc_ekranu * 0.025,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E918E',
    marginBottom: wysokosc_ekranu * 0.015,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: wysokosc_ekranu * 0.015,
    flexWrap: 'wrap',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: szerokosc_ekranu * 0.04,
    padding: szerokosc_ekranu * 0.04,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E918E',
    marginTop: wysokosc_ekranu * 0.008,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: wysokosc_ekranu * 0.006,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: szerokosc_ekranu * 0.04,
    paddingVertical: wysokosc_ekranu * 0.012,
    borderRadius: szerokosc_ekranu * 0.03,
    marginBottom: wysokosc_ekranu * 0.01,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historyDate: {
    fontSize: 12,
    color: '#999',
    marginTop: wysokosc_ekranu * 0.003,
  },
  historyPoints: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E918E',
  },
});

export default StatisticsPage;

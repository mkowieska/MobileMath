import React, { useState, useCallback } from 'react';
import 'react-native-reanimated';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_STORAGE_KEY = 'notificationSchedules';
const { width, height } = Dimensions.get('window');

const NotificationsPage = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setNotifications(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      setNotifications([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications])
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const deleteNotification = (id) => {
    Alert.alert(
      'Usuń powiadomienie',
      'Czy na pewno chcesz usunąć to powiadomienie?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            try {
              const updated = notifications.filter((notif) => notif.id !== id);
              setNotifications(updated);
              await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
            } catch (error) {
              Alert.alert('Błąd', 'Nie udało się usunąć powiadomienia.');
            }
          },
        },
      ]
    );
  };

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <View style={styles.cardHeader}>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={24} color="#1E918E" />
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteNotification(item.id)}
        >
          <Ionicons name="trash-outline" size={24} color="#d32f2f" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <Text style={styles.infoText}>
            {formatDate(item.startDate)} - {formatDate(item.endDate)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={20} color="#666" />
          <Text style={styles.infoText}>{item.numberOfDays} dni</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-number-outline" size={20} color="#666" />
          <Text style={styles.infoText}>{item.selectedDays}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.createdText}>
          Utworzono: {formatDate(item.createdAt)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.main_container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#1E918E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aktualne powiadomienia</Text>
        <View style={{ width: 28 }} />
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={80} color="#cbdcdb" />
          <Text style={styles.emptyText}>Brak aktywnych powiadomień</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('NewNotifications')}
          >
            <Text style={styles.addButtonText}>Dodaj powiadomienie</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('NewNotifications')}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
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
  listContainer: {
    padding: width * 0.05,
    paddingBottom: height * 0.1,
  },
  notificationCard: {
    backgroundColor: '#F4F4F4',
    borderRadius: width * 0.04,
    padding: width * 0.05,
    marginBottom: height * 0.015,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.03,
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E918E',
    marginLeft: width * 0.02,
  },
  deleteButton: {
    padding: width * 0.02,
  },
  cardBody: {
    marginBottom: height * 0.015,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.008,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: width * 0.02,
    fontWeight: '500',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: height * 0.01,
  },
  createdText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.1,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: height * 0.02,
    marginBottom: height * 0.03,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#1E918E',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.08,
    borderRadius: width * 0.04,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  floatingButton: {
    position: 'absolute',
    bottom: height * 0.03,
    right: width * 0.05,
    backgroundColor: '#1E918E',
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default NotificationsPage;

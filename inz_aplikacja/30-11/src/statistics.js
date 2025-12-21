import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const StatisticsPage = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>stat Zadanie</Text>
    <Button title="Rozpocznij" />
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFFFF',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default StatisticsPage;
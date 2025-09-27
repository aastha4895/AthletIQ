import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [userStats, setUserStats] = useState({
    testsCompleted: 0,
    totalScore: 0,
    rank: 'Beginner'
  });

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const stats = await AsyncStorage.getItem('userStats');
      if (stats) {
        setUserStats(JSON.parse(stats));
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const testCategories = [
    { id: 1, name: 'Vertical Jump', icon: 'arrow-up', color: '#FF6B6B' },
    { id: 2, name: 'Shuttle Run', icon: 'flash', color: '#4ECDC4' },
    { id: 3, name: 'Sit-ups', icon: 'fitness', color: '#45B7D1' },
    { id: 4, name: 'Endurance Run', icon: 'walk', color: '#96CEB4' },
    { id: 5, name: 'Height & Weight', icon: 'resize', color: '#FFEAA7' }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AthletIQ</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle" size={32} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Your Progress</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.testsCompleted}</Text>
            <Text style={styles.statLabel}>Tests Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.totalScore}</Text>
            <Text style={styles.statLabel}>Total Score</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.rank}</Text>
            <Text style={styles.statLabel}>Current Rank</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Assessment Tests</Text>
      <View style={styles.testsGrid}>
        {testCategories.map((test) => (
          <TouchableOpacity
            key={test.id}
            style={[styles.testCard, { backgroundColor: test.color }]}
            onPress={() => navigation.navigate('TestSelection', { testType: test.name })}
          >
            <Ionicons name={test.icon} size={40} color="white" />
            <Text style={styles.testName}>{test.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statsCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 15,
    color: '#333',
  },
  testsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  testCard: {
    width: '45%',
    aspectRatio: 1,
    margin: 10,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  testName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default HomeScreen;
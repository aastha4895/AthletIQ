import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [testHistory, setTestHistory] = useState([]);
  const [userStats, setUserStats] = useState({});

  useEffect(() => {
    loadUserData();
    loadTestHistory();
    loadUserStats();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        setUserData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadTestHistory = async () => {
    try {
      const results = await AsyncStorage.getItem('testResults');
      if (results) {
        const parsedResults = JSON.parse(results);
        setTestHistory(parsedResults.slice(-5)); // Show last 5 tests
      }
    } catch (error) {
      console.error('Error loading test history:', error);
    }
  };

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

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(['userData', 'authToken']);
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  const getRankColor = (rank) => {
    const colors = {
      'Elite': '#FFD700',
      'Advanced': '#C0C0C0',
      'Intermediate': '#CD7F32',
      'Beginner': '#4ECDC4'
    };
    return colors[rank] || '#4ECDC4';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="#FF5722" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="#4ECDC4" />
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          <View style={styles.rankBadge}>
            <Ionicons name="trophy" size={16} color={getRankColor(userStats.rank)} />
            <Text style={[styles.rankText, { color: getRankColor(userStats.rank) }]}>
              {userStats.rank || 'Beginner'}
            </Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{userStats.testsCompleted || 0}</Text>
            <Text style={styles.statLabel}>Tests Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{userStats.totalScore || 0}</Text>
            <Text style={styles.statLabel}>Total Score</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {userStats.testsCompleted ? Math.round(userStats.totalScore / userStats.testsCompleted * 10) / 10 : 0}
            </Text>
            <Text style={styles.statLabel}>Average Score</Text>
          </View>
        </View>

        <View style={styles.historyCard}>
          <Text style={styles.sectionTitle}>Recent Tests</Text>
          {testHistory.length > 0 ? (
            testHistory.map((test, index) => (
              <View key={test.id} style={styles.historyItem}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyTestType}>{test.testType}</Text>
                  <Text style={styles.historyDate}>{formatDate(test.date)}</Text>
                </View>
                <View style={styles.historyRight}>
                  <Text style={[styles.historyScore, { color: getScoreColor(test.score) }]}>
                    {test.score}
                  </Text>
                  <Text style={styles.historyConfidence}>
                    {Math.round(test.confidence * 100)}%
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noHistoryText}>No tests completed yet</Text>
          )}
        </View>

        <View style={styles.achievementsCard}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsList}>
            {userStats.testsCompleted >= 1 && (
              <View style={styles.achievementItem}>
                <Ionicons name="medal" size={24} color="#FFD700" />
                <Text style={styles.achievementText}>First Test Completed</Text>
              </View>
            )}
            {userStats.testsCompleted >= 5 && (
              <View style={styles.achievementItem}>
                <Ionicons name="trophy" size={24} color="#C0C0C0" />
                <Text style={styles.achievementText}>5 Tests Milestone</Text>
              </View>
            )}
            {userStats.rank === 'Advanced' && (
              <View style={styles.achievementItem}>
                <Ionicons name="star" size={24} color="#FF9800" />
                <Text style={styles.achievementText}>Advanced Athlete</Text>
              </View>
            )}
            {userStats.rank === 'Elite' && (
              <View style={styles.achievementItem}>
                <Ionicons name="flame" size={24} color="#FF5722" />
                <Text style={styles.achievementText}>Elite Performer</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="notifications" size={20} color="#666" />
            <Text style={styles.settingText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="help-circle" size={20} color="#666" />
            <Text style={styles.settingText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="document-text" size={20} color="#666" />
            <Text style={styles.settingText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const getScoreColor = (score) => {
  const colors = {
    'Excellent': '#4CAF50',
    'Good': '#8BC34A',
    'Average': '#FF9800',
    'Needs Improvement': '#FF5722',
    'Poor': '#F44336'
  };
  return colors[score] || '#666';
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
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  historyCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyLeft: {
    flex: 1,
  },
  historyTestType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  historyDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyScore: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  historyConfidence: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  noHistoryText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  achievementsCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  settingsCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
});

export default ProfileScreen;
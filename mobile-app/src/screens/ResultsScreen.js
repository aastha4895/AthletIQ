import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Circle } from 'react-native-progress';

const ResultsScreen = ({ route, navigation }) => {
  const { testType, analysisResult } = route.params;
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    saveResultLocally();
  }, []);

  const saveResultLocally = async () => {
    try {
      const existingResults = await AsyncStorage.getItem('testResults');
      const results = existingResults ? JSON.parse(existingResults) : [];
      
      const newResult = {
        id: Date.now().toString(),
        testType,
        ...analysisResult,
        date: new Date().toISOString()
      };
      
      results.push(newResult);
      await AsyncStorage.setItem('testResults', JSON.stringify(results));
      
      // Update user stats
      const stats = await AsyncStorage.getItem('userStats');
      const currentStats = stats ? JSON.parse(stats) : { testsCompleted: 0, totalScore: 0, rank: 'Beginner' };
      currentStats.testsCompleted += 1;
      currentStats.totalScore += getNumericScore(analysisResult.score);
      currentStats.rank = calculateRank(currentStats.totalScore, currentStats.testsCompleted);
      
      await AsyncStorage.setItem('userStats', JSON.stringify(currentStats));
    } catch (error) {
      console.error('Error saving result:', error);
    }
  };

  const uploadToSAI = async () => {
    setUploading(true);
    
    try {
      // Simulate upload to SAI servers
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setUploaded(true);
      Alert.alert('Success', 'Your results have been submitted to SAI for evaluation!');
    } catch (error) {
      Alert.alert('Error', 'Failed to upload results. Please try again.');
    } finally {
      setUploading(false);
    }
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

  const getNumericScore = (score) => {
    const scores = {
      'Excellent': 5,
      'Good': 4,
      'Average': 3,
      'Needs Improvement': 2,
      'Poor': 1
    };
    return scores[score] || 0;
  };

  const calculateRank = (totalScore, testsCompleted) => {
    if (testsCompleted === 0) return 'Beginner';
    const avgScore = totalScore / testsCompleted;
    if (avgScore >= 4.5) return 'Elite';
    if (avgScore >= 3.5) return 'Advanced';
    if (avgScore >= 2.5) return 'Intermediate';
    return 'Beginner';
  };

  const renderMetrics = () => {
    const { metrics } = analysisResult;
    return Object.entries(metrics).map(([key, value]) => (
      <View key={key} style={styles.metricItem}>
        <Text style={styles.metricLabel}>{formatMetricLabel(key)}</Text>
        <Text style={styles.metricValue}>{value}</Text>
      </View>
    ));
  };

  const formatMetricLabel = (key) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Test Results</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.testTypeCard}>
          <Text style={styles.testTypeName}>{testType}</Text>
          <Text style={styles.testDate}>
            {new Date(analysisResult.timestamp).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreTitle}>Overall Score</Text>
            <Circle
              size={80}
              progress={analysisResult.confidence}
              showsText={true}
              formatText={() => `${Math.round(analysisResult.confidence * 100)}%`}
              color="#4ECDC4"
              thickness={8}
            />
          </View>
          <View style={styles.scoreDetails}>
            <Text style={[styles.scoreValue, { color: getScoreColor(analysisResult.score) }]}>
              {analysisResult.score}
            </Text>
            <Text style={styles.confidenceText}>
              Confidence: {Math.round(analysisResult.confidence * 100)}%
            </Text>
          </View>
        </View>

        <View style={styles.metricsCard}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          {renderMetrics()}
        </View>

        {analysisResult.cheatDetection && (
          <View style={styles.verificationCard}>
            <Text style={styles.sectionTitle}>Verification Status</Text>
            <View style={styles.verificationItem}>
              <Ionicons 
                name={analysisResult.cheatDetection.isClean ? "checkmark-circle" : "warning"} 
                size={24} 
                color={analysisResult.cheatDetection.isClean ? "#4CAF50" : "#FF9800"} 
              />
              <Text style={styles.verificationText}>
                {analysisResult.cheatDetection.isClean ? 'Verified Clean' : 'Anomalies Detected'}
              </Text>
            </View>
            <Text style={styles.confidenceScore}>
              Verification Score: {Math.round(analysisResult.cheatDetection.confidenceScore * 100)}%
            </Text>
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.uploadButton, uploaded && styles.uploadedButton]}
            onPress={uploadToSAI}
            disabled={uploading || uploaded}
          >
            {uploading ? (
              <View style={styles.loadingContainer}>
                <Circle size={20} indeterminate={true} color="white" />
                <Text style={styles.uploadButtonText}>Uploading...</Text>
              </View>
            ) : uploaded ? (
              <View style={styles.uploadedContainer}>
                <Ionicons name="checkmark-circle" size={20} color="white" />
                <Text style={styles.uploadButtonText}>Uploaded to SAI</Text>
              </View>
            ) : (
              <View style={styles.uploadContainer}>
                <Ionicons name="cloud-upload" size={20} color="white" />
                <Text style={styles.uploadButtonText}>Submit to SAI</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.retakeButton}
            onPress={() => navigation.navigate('TestSelection', { testType })}
          >
            <Ionicons name="refresh" size={20} color="#4ECDC4" />
            <Text style={styles.retakeButtonText}>Retake Test</Text>
          </TouchableOpacity>
        </View>
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
  testTypeCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    alignItems: 'center',
  },
  testTypeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  testDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  scoreCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreDetails: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  confidenceText: {
    fontSize: 14,
    color: '#666',
  },
  metricsCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  metricLabel: {
    fontSize: 16,
    color: '#333',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  verificationCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  verificationText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  confidenceScore: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    gap: 15,
  },
  uploadButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  },
  uploadedButton: {
    backgroundColor: '#4CAF50',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  retakeButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  retakeButtonText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ResultsScreen;
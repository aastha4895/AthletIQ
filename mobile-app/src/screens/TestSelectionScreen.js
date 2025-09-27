import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TestSelectionScreen = ({ route, navigation }) => {
  const { testType } = route.params;

  const testInstructions = {
    'Vertical Jump': {
      description: 'Measure your explosive leg power',
      instructions: [
        'Stand with feet shoulder-width apart',
        'Jump as high as possible with both feet',
        'Land softly on both feet',
        'Ensure camera captures full body'
      ],
      duration: '30 seconds',
      equipment: 'None required'
    },
    'Shuttle Run': {
      description: 'Test your agility and speed',
      instructions: [
        'Set up two markers 10 meters apart',
        'Run back and forth between markers',
        'Touch each marker with your hand',
        'Complete 4 round trips'
      ],
      duration: '2 minutes',
      equipment: '2 markers or cones'
    },
    'Sit-ups': {
      description: 'Measure core strength and endurance',
      instructions: [
        'Lie on your back, knees bent',
        'Hands behind head or crossed on chest',
        'Lift shoulders off ground to sitting position',
        'Return to starting position'
      ],
      duration: '1 minute',
      equipment: 'Exercise mat (optional)'
    },
    'Endurance Run': {
      description: 'Test cardiovascular fitness',
      instructions: [
        'Run at a steady, sustainable pace',
        'Maintain consistent breathing',
        'Complete the designated distance',
        'Track your time and distance'
      ],
      duration: '12 minutes',
      equipment: 'Running track or measured path'
    },
    'Height & Weight': {
      description: 'Record physical measurements',
      instructions: [
        'Stand straight against a wall',
        'Remove shoes for accurate measurement',
        'Look straight ahead',
        'Ensure good lighting for camera'
      ],
      duration: '2 minutes',
      equipment: 'Wall and measuring tape'
    }
  };

  const currentTest = testInstructions[testType];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{testType}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.descriptionCard}>
          <Text style={styles.description}>{currentTest.description}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color="#4ECDC4" />
            <Text style={styles.infoText}>Duration: {currentTest.duration}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="construct" size={20} color="#4ECDC4" />
            <Text style={styles.infoText}>Equipment: {currentTest.equipment}</Text>
          </View>
        </View>

        <View style={styles.instructionsCard}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {currentTest.instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>{index + 1}</Text>
              </View>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tipsCard}>
          <Text style={styles.sectionTitle}>Tips for Best Results</Text>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
            <Text style={styles.tipText}>Ensure good lighting and clear camera view</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
            <Text style={styles.tipText}>Wear appropriate athletic clothing</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
            <Text style={styles.tipText}>Warm up before starting the test</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
            <Text style={styles.tipText}>Follow proper form for accurate results</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('VideoRecording', { testType })}
        >
          <Ionicons name="videocam" size={24} color="white" />
          <Text style={styles.startButtonText}>Start Recording</Text>
        </TouchableOpacity>
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
  placeholder: {
    width: 24,
  },
  content: {
    padding: 20,
  },
  descriptionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  description: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  instructionsCard: {
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
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  tipsCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  startButton: {
    backgroundColor: '#4ECDC4',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    borderRadius: 10,
    elevation: 3,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default TestSelectionScreen;
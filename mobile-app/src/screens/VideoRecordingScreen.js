import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import VideoAnalysisService from '../services/VideoAnalysisService';

const VideoRecordingScreen = ({ route, navigation }) => {
  const { testType } = route.params;
  const [hasPermission, setHasPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const cameraRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      try {
        const video = await cameraRef.current.recordAsync({
          quality: Camera.Constants.VideoQuality['720p'],
          maxDuration: 60,
        });
        
        clearInterval(timerRef.current);
        setIsRecording(false);
        
        // Process video with AI analysis
        await processVideo(video.uri);
      } catch (error) {
        console.error('Recording failed:', error);
        Alert.alert('Error', 'Failed to record video');
        setIsRecording(false);
        clearInterval(timerRef.current);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  const processVideo = async (videoUri) => {
    try {
      Alert.alert('Processing', 'Analyzing your performance...');
      
      const analysisResult = await VideoAnalysisService.analyzeVideo(videoUri, testType);
      
      navigation.navigate('Results', {
        testType,
        videoUri,
        analysisResult
      });
    } catch (error) {
      console.error('Video analysis failed:', error);
      Alert.alert('Error', 'Failed to analyze video. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }
  
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{testType}</Text>
        <View style={styles.placeholder} />
      </View>

      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={cameraRef}
      >
        <View style={styles.overlay}>
          <View style={styles.instructionBox}>
            <Text style={styles.instructionText}>
              {getInstructionText(testType)}
            </Text>
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.recordButton, isRecording && styles.recordingButton]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Ionicons 
                name={isRecording ? "stop" : "radio-button-on"} 
                size={60} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
};

const getInstructionText = (testType) => {
  const instructions = {
    'Vertical Jump': 'Stand in front of camera and jump as high as possible',
    'Shuttle Run': 'Run between the markers as fast as possible',
    'Sit-ups': 'Perform sit-ups with proper form',
    'Endurance Run': 'Run at steady pace for the duration',
    'Height & Weight': 'Stand straight against the wall'
  };
  return instructions[testType] || 'Follow the test instructions';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 24,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  instructionBox: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    margin: 20,
    padding: 15,
    borderRadius: 10,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  timerContainer: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  timerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  controls: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: 'darkred',
  },
});

export default VideoRecordingScreen;
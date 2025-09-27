// AI Video Analysis Service using MediaPipe and TensorFlow.js
class AIAnalysisService {
    constructor() {
        this.pose = null;
        this.isInitialized = false;
        this.exerciseCounter = new ExerciseCounter();
        this.performanceAnalyzer = new PerformanceAnalyzer();
    }

    async initialize() {
        try {
            // Load MediaPipe Pose
            this.pose = new Pose({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
            });

            this.pose.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                enableSegmentation: false,
                smoothSegmentation: false,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            this.pose.onResults(this.onPoseResults.bind(this));
            this.isInitialized = true;
            console.log('AI Analysis Service initialized');
        } catch (error) {
            console.error('Failed to initialize AI service:', error);
            throw error;
        }
    }

    async analyzeVideo(videoElement, exerciseType, onProgress, onComplete) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        const results = {
            exerciseType,
            repetitions: 0,
            formScore: 0,
            duration: 0,
            keyframes: [],
            analysis: {}
        };

        this.exerciseCounter.reset(exerciseType);
        this.performanceAnalyzer.reset();

        return new Promise((resolve) => {
            const processFrame = async () => {
                if (videoElement.ended) {
                    results.duration = videoElement.currentTime;
                    results.repetitions = this.exerciseCounter.getCount();
                    results.formScore = this.performanceAnalyzer.getFormScore();
                    results.analysis = this.performanceAnalyzer.getAnalysis();
                    onComplete(results);
                    resolve(results);
                    return;
                }

                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                await this.pose.send({ image: canvas });

                const progress = (videoElement.currentTime / videoElement.duration) * 100;
                onProgress(progress, this.exerciseCounter.getCount());

                requestAnimationFrame(processFrame);
            };

            videoElement.currentTime = 0;
            videoElement.play();
            processFrame();
        });
    }

    onPoseResults(results) {
        if (results.poseLandmarks) {
            this.exerciseCounter.processPose(results.poseLandmarks);
            this.performanceAnalyzer.analyzePose(results.poseLandmarks);
        }
    }
}

// Exercise Counter for different exercise types
class ExerciseCounter {
    constructor() {
        this.reset();
    }

    reset(exerciseType = 'general') {
        this.exerciseType = exerciseType;
        this.count = 0;
        this.state = 'neutral';
        this.lastAngle = 0;
        this.threshold = this.getThreshold(exerciseType);
    }

    getThreshold(exerciseType) {
        const thresholds = {
            'pushups': { up: 160, down: 90 },
            'situps': { up: 45, down: 90 },
            'squats': { up: 160, down: 90 },
            'tennis': { up: 140, down: 60 },
            'basketball': { up: 120, down: 80 },
            'running': { up: 110, down: 70 },
            'general': { up: 150, down: 100 }
        };
        return thresholds[exerciseType] || thresholds.general;
    }

    processPose(landmarks) {
        const angle = this.calculateExerciseAngle(landmarks);
        
        if (this.state === 'neutral' && angle < this.threshold.down) {
            this.state = 'down';
        } else if (this.state === 'down' && angle > this.threshold.up) {
            this.state = 'up';
            this.count++;
        }

        this.lastAngle = angle;
    }

    calculateExerciseAngle(landmarks) {
        switch (this.exerciseType) {
            case 'pushups':
                return this.calculateArmAngle(landmarks);
            case 'situps':
                return this.calculateTorsoAngle(landmarks);
            case 'squats':
                return this.calculateKneeAngle(landmarks);
            case 'tennis':
                return this.calculateTennisSwing(landmarks);
            case 'basketball':
                return this.calculateShootingAngle(landmarks);
            case 'running':
                return this.calculateRunningStride(landmarks);
            default:
                return this.calculateArmAngle(landmarks);
        }
    }

    calculateArmAngle(landmarks) {
        const shoulder = landmarks[11]; // Left shoulder
        const elbow = landmarks[13];    // Left elbow
        const wrist = landmarks[15];    // Left wrist

        return this.getAngle(shoulder, elbow, wrist);
    }

    calculateKneeAngle(landmarks) {
        const hip = landmarks[23];   // Left hip
        const knee = landmarks[25];  // Left knee
        const ankle = landmarks[27]; // Left ankle

        return this.getAngle(hip, knee, ankle);
    }

    calculateTorsoAngle(landmarks) {
        const shoulder = landmarks[11]; // Left shoulder
        const hip = landmarks[23];      // Left hip
        const knee = landmarks[25];     // Left knee

        return this.getAngle(shoulder, hip, knee);
    }

    calculateTennisSwing(landmarks) {
        // Tennis swing analysis using shoulder-elbow-wrist angle
        const shoulder = landmarks[11]; // Left shoulder
        const elbow = landmarks[13];    // Left elbow
        const wrist = landmarks[15];    // Left wrist
        
        // Also check right arm for backhand
        const rightShoulder = landmarks[12];
        const rightElbow = landmarks[14];
        const rightWrist = landmarks[16];
        
        const leftSwing = this.getAngle(shoulder, elbow, wrist);
        const rightSwing = this.getAngle(rightShoulder, rightElbow, rightWrist);
        
        // Return the more active swing (larger angle change)
        return Math.max(leftSwing, rightSwing);
    }

    calculateShootingAngle(landmarks) {
        // Basketball shooting form - elbow alignment
        const shoulder = landmarks[11];
        const elbow = landmarks[13];
        const wrist = landmarks[15];
        
        return this.getAngle(shoulder, elbow, wrist);
    }

    calculateRunningStride(landmarks) {
        // Running stride analysis - hip-knee-ankle
        const hip = landmarks[23];
        const knee = landmarks[25];
        const ankle = landmarks[27];
        
        return this.getAngle(hip, knee, ankle);
    }

    getAngle(a, b, c) {
        const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
        let angle = Math.abs(radians * 180.0 / Math.PI);
        if (angle > 180.0) {
            angle = 360 - angle;
        }
        return angle;
    }

    getCount() {
        return this.count;
    }
}

// Performance Analyzer for form and technique
class PerformanceAnalyzer {
    constructor() {
        this.reset();
    }

    reset() {
        this.formScores = [];
        this.positionHistory = [];
        this.analysis = {
            avgFormScore: 0,
            consistency: 0,
            recommendations: []
        };
    }

    analyzePose(landmarks) {
        const formScore = this.calculateFormScore(landmarks);
        this.formScores.push(formScore);
        this.positionHistory.push(landmarks);

        // Keep only recent data
        if (this.formScores.length > 100) {
            this.formScores.shift();
            this.positionHistory.shift();
        }
    }

    calculateFormScore(landmarks) {
        // Basic form scoring based on pose alignment
        let score = 100;

        // Check spine alignment
        const spineAlignment = this.checkSpineAlignment(landmarks);
        score -= (1 - spineAlignment) * 30;

        // Check symmetry
        const symmetry = this.checkSymmetry(landmarks);
        score -= (1 - symmetry) * 20;

        // Check stability
        const stability = this.checkStability(landmarks);
        score -= (1 - stability) * 25;

        return Math.max(0, Math.min(100, score));
    }

    checkSpineAlignment(landmarks) {
        const nose = landmarks[0];
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const leftHip = landmarks[23];
        const rightHip = landmarks[24];

        // Calculate alignment score (simplified)
        const shoulderMidpoint = {
            x: (leftShoulder.x + rightShoulder.x) / 2,
            y: (leftShoulder.y + rightShoulder.y) / 2
        };

        const hipMidpoint = {
            x: (leftHip.x + rightHip.x) / 2,
            y: (leftHip.y + rightHip.y) / 2
        };

        const alignment = 1 - Math.abs(shoulderMidpoint.x - hipMidpoint.x);
        return Math.max(0, Math.min(1, alignment));
    }

    checkSymmetry(landmarks) {
        // Check left-right symmetry
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const leftElbow = landmarks[13];
        const rightElbow = landmarks[14];

        const shoulderDiff = Math.abs(leftShoulder.y - rightShoulder.y);
        const elbowDiff = Math.abs(leftElbow.y - rightElbow.y);

        const symmetry = 1 - (shoulderDiff + elbowDiff) / 2;
        return Math.max(0, Math.min(1, symmetry));
    }

    checkStability(landmarks) {
        if (this.positionHistory.length < 5) return 1;

        // Calculate movement variance over recent frames
        const recentFrames = this.positionHistory.slice(-5);
        let totalVariance = 0;

        const keyPoints = [11, 12, 23, 24]; // Shoulders and hips
        
        keyPoints.forEach(pointIndex => {
            const positions = recentFrames.map(frame => frame[pointIndex]);
            const avgX = positions.reduce((sum, pos) => sum + pos.x, 0) / positions.length;
            const avgY = positions.reduce((sum, pos) => sum + pos.y, 0) / positions.length;
            
            const variance = positions.reduce((sum, pos) => {
                return sum + Math.pow(pos.x - avgX, 2) + Math.pow(pos.y - avgY, 2);
            }, 0) / positions.length;
            
            totalVariance += variance;
        });

        const stability = 1 - Math.min(1, totalVariance * 100);
        return Math.max(0, stability);
    }

    getFormScore() {
        if (this.formScores.length === 0) return 0;
        return this.formScores.reduce((sum, score) => sum + score, 0) / this.formScores.length;
    }

    getAnalysis() {
        const avgScore = this.getFormScore();
        const consistency = this.calculateConsistency();
        
        const recommendations = [];
        if (avgScore < 70) recommendations.push("Focus on maintaining proper form");
        if (consistency < 0.7) recommendations.push("Work on movement consistency");
        
        return {
            avgFormScore: Math.round(avgScore),
            consistency: Math.round(consistency * 100),
            recommendations
        };
    }

    calculateConsistency() {
        if (this.formScores.length < 2) return 1;
        
        const mean = this.formScores.reduce((sum, score) => sum + score, 0) / this.formScores.length;
        const variance = this.formScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / this.formScores.length;
        const stdDev = Math.sqrt(variance);
        
        return Math.max(0, 1 - (stdDev / 50)); // Normalize to 0-1
    }
}

// Export the service
window.aiAnalysis = new AIAnalysisService();
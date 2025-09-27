const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testType: {
    type: String,
    required: true,
    enum: ['football', 'basketball', 'tennis', 'running', 'swimming', 'general', 'Vertical Jump', 'Shuttle Run', 'Sit-ups', 'Endurance Run', 'Height & Weight']
  },
  videoData: {
    url: {
      type: String,
      required: true
    },
    originalName: String,
    filename: String,
    path: String,
    size: Number, // in bytes
    mimetype: String,
    uploadedAt: Date,
    duration: Number, // in seconds
    resolution: String,
    format: String
  },
  aiAnalysis: {
    metrics: {
      type: mongoose.Schema.Types.Mixed
    },
    score: {
      type: String,
      enum: ['Poor', 'Needs Improvement', 'Average', 'Good', 'Excellent']
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    processingTime: Number, // in milliseconds
    modelVersion: String
  },
  cheatDetection: {
    isClean: {
      type: Boolean,
      default: true
    },
    anomalies: [String],
    confidenceScore: {
      type: Number,
      min: 0,
      max: 1
    },
    flags: [{
      type: String,
      severity: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      description: String
    }]
  },
  humanReview: {
    isReviewed: {
      type: Boolean,
      default: false
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewDate: Date,
    reviewNotes: String,
    overriddenScore: String,
    approved: Boolean
  },
  benchmarkComparison: {
    ageGroup: String,
    genderGroup: String,
    percentile: Number,
    nationalAverage: Number,
    stateAverage: Number
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'flagged', 'rejected', 'approved'],
    default: 'processing'
  },
  submittedToSAI: {
    type: Boolean,
    default: false
  },
  saiSubmissionDate: Date,
  saiResponse: {
    status: String,
    feedback: String,
    recommendations: [String],
    followUpRequired: Boolean
  },
  retakeCount: {
    type: Number,
    default: 0
  },
  originalAssessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
assessmentSchema.index({ userId: 1, createdAt: -1 });
assessmentSchema.index({ testType: 1 });
assessmentSchema.index({ status: 1 });
assessmentSchema.index({ submittedToSAI: 1 });
assessmentSchema.index({ 'aiAnalysis.score': 1 });

// Calculate numeric score for ranking
assessmentSchema.virtual('numericScore').get(function() {
  const scoreMap = {
    'Poor': 1,
    'Needs Improvement': 2,
    'Average': 3,
    'Good': 4,
    'Excellent': 5
  };
  return scoreMap[this.aiAnalysis.score] || 0;
});

// Check if assessment needs human review
assessmentSchema.methods.needsHumanReview = function() {
  return (
    !this.cheatDetection.isClean ||
    this.aiAnalysis.confidence < 0.7 ||
    this.cheatDetection.flags.some(flag => flag.severity === 'high')
  );
};

// Generate benchmark comparison
assessmentSchema.methods.generateBenchmark = async function() {
  const user = await mongoose.model('User').findById(this.userId);
  if (!user) return;

  const ageGroup = this.getAgeGroup(user.age);
  const genderGroup = user.gender;

  // Find similar assessments for comparison
  const similarAssessments = await this.constructor.find({
    testType: this.testType,
    status: 'approved',
    'benchmarkComparison.ageGroup': ageGroup,
    'benchmarkComparison.genderGroup': genderGroup
  });

  if (similarAssessments.length > 0) {
    const scores = similarAssessments.map(a => a.numericScore);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    const betterScores = scores.filter(s => s < this.numericScore).length;
    const percentile = Math.round((betterScores / scores.length) * 100);

    this.benchmarkComparison = {
      ageGroup,
      genderGroup,
      percentile,
      nationalAverage: avgScore,
      stateAverage: avgScore // Simplified - would calculate state-specific in production
    };
  }
};

assessmentSchema.methods.getAgeGroup = function(age) {
  if (age < 13) return 'Under 13';
  if (age < 16) return '13-15';
  if (age < 19) return '16-18';
  if (age < 23) return '19-22';
  if (age < 30) return '23-29';
  return '30+';
};

// Pre-save middleware
assessmentSchema.pre('save', async function(next) {
  if (this.isNew && this.aiAnalysis.score) {
    await this.generateBenchmark();
  }
  
  if (this.needsHumanReview() && this.status === 'processing') {
    this.status = 'flagged';
  } else if (this.status === 'processing' && this.aiAnalysis.score) {
    this.status = 'completed';
  }
  
  next();
});

module.exports = mongoose.model('Assessment', assessmentSchema);
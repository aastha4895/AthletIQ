const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  height: {
    type: Number // in cm
  },
  weight: {
    type: Number // in kg
  },
  location: {
    state: String,
    district: String,
    pincode: String
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  age: {
    type: Number,
    min: 12,
    max: 100
  },
  primarySport: {
    type: String,
    enum: ['football', 'basketball', 'volleyball', 'tennis', 'swimming', 'running', 'cycling', 'boxing', 'gymnastics', 'martial-arts', 'cricket', 'badminton', 'other']
  },
  experienceLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'competitive', 'professional']
  },
  sportsInterests: [{
    type: String
  }],
  goals: [{
    type: String,
    enum: ['fitness', 'competition', 'skill', 'strength', 'endurance', 'rehabilitation']
  }],
  trainingFrequency: {
    type: String,
    enum: ['1-2', '3-4', '5-6', 'daily']
  },
  sessionDuration: {
    type: Number // in minutes
  },
  injuries: {
    type: String // previous injuries description
  },
  additionalNotes: {
    type: String
  },
  coachingPreferences: {
    skillLevel: String,
    coachExperience: String,
    preferredLocation: String,
    priceRange: String,
    coachingStyle: String
  },
  activePlans: [{
    planId: String,
    planName: String,
    startDate: Date,
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active'
    }
  }],
  profilePicture: {
    type: String // URL to profile picture
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  role: {
    type: String,
    enum: ['athlete', 'coach', 'admin'],
    default: 'athlete'
  },
  stats: {
    testsCompleted: {
      type: Number,
      default: 0
    },
    totalScore: {
      type: Number,
      default: 0
    },
    rank: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Elite'],
      default: 'Beginner'
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    privacy: {
      profileVisible: { type: Boolean, default: true },
      shareResults: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ 'stats.rank': 1 });
userSchema.index({ 'location.state': 1, 'location.district': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate age from dateOfBirth if age field is not set
userSchema.virtual('calculatedAge').get(function() {
  if (this.age) return this.age;
  if (!this.dateOfBirth) return null;
  return Math.floor((Date.now() - this.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
});

// Update user stats
userSchema.methods.updateStats = function(newScore) {
  this.stats.testsCompleted += 1;
  this.stats.totalScore += newScore;
  
  const avgScore = this.stats.totalScore / this.stats.testsCompleted;
  
  if (avgScore >= 4.5) this.stats.rank = 'Elite';
  else if (avgScore >= 3.5) this.stats.rank = 'Advanced';
  else if (avgScore >= 2.5) this.stats.rank = 'Intermediate';
  else this.stats.rank = 'Beginner';
  
  this.stats.lastActive = new Date();
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.verificationToken;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpires;
  return user;
};

module.exports = mongoose.model('User', userSchema);
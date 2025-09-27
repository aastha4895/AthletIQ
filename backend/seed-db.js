const mongoose = require('mongoose');
const User = require('./models/User');
const Assessment = require('./models/Assessment');
require('dotenv').config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/athletiq');
    console.log('Connected to MongoDB');

    // Create test user
    const testUser = new User({
      name: 'Test Athlete',
      email: 'test@example.com',
      password: 'password123',
      dateOfBirth: new Date('2000-01-01'),
      gender: 'male',
      height: 175,
      weight: 70,
      location: {
        state: 'Maharashtra',
        district: 'Mumbai',
        pincode: '400001'
      },
      phoneNumber: '9876543210',
      sportsInterests: ['Cricket', 'Football']
    });

    await testUser.save();
    console.log('Test user created:', testUser.name);

    // Create test assessment
    const testAssessment = new Assessment({
      userId: testUser._id,
      testType: 'Vertical Jump',
      videoUrl: 'https://example.com/test-video.mp4',
      videoMetadata: {
        duration: 30,
        fileSize: 1024000,
        resolution: '1920x1080',
        format: 'mp4'
      },
      aiAnalysis: {
        metrics: {
          jumpHeight: 45,
          takeoffTime: 0.3,
          landingStability: 'Good'
        },
        score: 'Good',
        confidence: 0.85,
        processingTime: 2500,
        modelVersion: 'v1.0'
      },
      cheatDetection: {
        isClean: true,
        anomalies: [],
        confidenceScore: 0.92,
        flags: []
      },
      status: 'completed'
    });

    await testAssessment.save();
    console.log('Test assessment created for:', testUser.name);

    console.log('\n✅ Database seeded successfully!');
    console.log('Check MongoDB Compass - you should now see:');
    console.log('- Database: athletiq');
    console.log('- Collections: users, assessments');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
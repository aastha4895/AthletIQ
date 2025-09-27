const express = require('express');
const Joi = require('joi');
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { analyzeVideo, detectCheating } = require('../utils/aiAnalysis');

const router = express.Router();

// Validation schema for assessment submission
const assessmentSchema = Joi.object({
  testType: Joi.string().valid(
    'football', 'basketball', 'tennis', 'running', 'swimming', 'general',
    'Vertical Jump', 'Shuttle Run', 'Sit-ups', 'Endurance Run', 'Height & Weight'
  ).required(),
  videoUrl: Joi.string().required(),
  metadata: Joi.object({
    originalName: Joi.string(),
    filename: Joi.string(),
    path: Joi.string(),
    size: Joi.number().positive(),
    mimetype: Joi.string(),
    uploadedAt: Joi.date(),
    duration: Joi.number().positive(),
    resolution: Joi.string(),
    format: Joi.string()
  }).optional()
});

// Submit new assessment
router.post('/', auth, async (req, res) => {
  try {
    const { error, value } = assessmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    // Create assessment record with complete video data
    const assessment = new Assessment({
      userId: req.userId,
      testType: value.testType,
      videoData: {
        url: value.videoUrl,
        originalName: value.metadata?.originalName,
        filename: value.metadata?.filename,
        path: value.metadata?.path,
        size: value.metadata?.size,
        mimetype: value.metadata?.mimetype,
        uploadedAt: value.metadata?.uploadedAt || new Date(),
        duration: value.metadata?.duration,
        resolution: value.metadata?.resolution,
        format: value.metadata?.format
      },
      status: 'processing'
    });

    await assessment.save();

    // Process video asynchronously
    processAssessmentAsync(assessment._id);

    res.status(201).json({
      message: 'Assessment submitted successfully',
      assessmentId: assessment._id,
      status: 'processing'
    });
  } catch (error) {
    console.error('Assessment submission error:', error);
    res.status(500).json({
      error: 'Failed to submit assessment',
      message: error.message
    });
  }
});

// Get user's assessments
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, testType, status } = req.query;
    
    const filter = { userId: req.userId };
    if (testType) filter.testType = testType;
    if (status) filter.status = status;

    const assessments = await Assessment.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'name email');

    const total = await Assessment.countDocuments(filter);

    res.json({
      assessments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Assessments fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch assessments',
      message: error.message
    });
  }
});

// Get specific assessment
router.get('/:id', auth, async (req, res) => {
  try {
    const assessment = await Assessment.findOne({
      _id: req.params.id,
      userId: req.userId
    }).populate('userId', 'name email age gender');

    if (!assessment) {
      return res.status(404).json({
        error: 'Assessment not found'
      });
    }

    res.json({ assessment });
  } catch (error) {
    console.error('Assessment fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch assessment',
      message: error.message
    });
  }
});

// Submit assessment to SAI
router.post('/:id/submit-to-sai', auth, async (req, res) => {
  try {
    const assessment = await Assessment.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!assessment) {
      return res.status(404).json({
        error: 'Assessment not found'
      });
    }

    if (assessment.status !== 'completed' && assessment.status !== 'approved') {
      return res.status(400).json({
        error: 'Assessment must be completed before submission to SAI'
      });
    }

    if (assessment.submittedToSAI) {
      return res.status(400).json({
        error: 'Assessment already submitted to SAI'
      });
    }

    // Submit to SAI (simulate API call)
    const saiResponse = await submitToSAI(assessment);
    
    assessment.submittedToSAI = true;
    assessment.saiSubmissionDate = new Date();
    assessment.saiResponse = saiResponse;
    
    await assessment.save();

    res.json({
      message: 'Assessment submitted to SAI successfully',
      saiResponse
    });
  } catch (error) {
    console.error('SAI submission error:', error);
    res.status(500).json({
      error: 'Failed to submit to SAI',
      message: error.message
    });
  }
});

// Get assessment statistics
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const userId = req.userId;
    
    const stats = await Assessment.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$testType',
          count: { $sum: 1 },
          avgScore: { $avg: '$numericScore' },
          bestScore: { $max: '$numericScore' },
          latestDate: { $max: '$createdAt' }
        }
      }
    ]);

    const totalAssessments = await Assessment.countDocuments({ userId });
    const completedAssessments = await Assessment.countDocuments({ 
      userId, 
      status: { $in: ['completed', 'approved'] } 
    });

    res.json({
      totalAssessments,
      completedAssessments,
      testTypeStats: stats
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

// Retake assessment
router.post('/:id/retake', auth, async (req, res) => {
  try {
    const originalAssessment = await Assessment.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!originalAssessment) {
      return res.status(404).json({
        error: 'Original assessment not found'
      });
    }

    // Check retake limit
    if (originalAssessment.retakeCount >= 3) {
      return res.status(400).json({
        error: 'Maximum retake limit reached (3 attempts)'
      });
    }

    const { videoUrl, videoMetadata } = req.body;
    if (!videoUrl) {
      return res.status(400).json({
        error: 'Video URL is required for retake'
      });
    }

    // Create new assessment as retake
    const retakeAssessment = new Assessment({
      userId: req.userId,
      testType: originalAssessment.testType,
      videoUrl,
      videoMetadata: videoMetadata || {},
      retakeCount: originalAssessment.retakeCount + 1,
      originalAssessmentId: originalAssessment._id,
      status: 'processing'
    });

    await retakeAssessment.save();

    // Process video asynchronously
    processAssessmentAsync(retakeAssessment._id);

    res.status(201).json({
      message: 'Retake assessment submitted successfully',
      assessmentId: retakeAssessment._id,
      retakeCount: retakeAssessment.retakeCount
    });
  } catch (error) {
    console.error('Retake submission error:', error);
    res.status(500).json({
      error: 'Failed to submit retake',
      message: error.message
    });
  }
});

// Async function to process assessment
async function processAssessmentAsync(assessmentId) {
  try {
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) return;

    // Simulate processing delay
    setTimeout(async () => {
      try {
        // Perform AI analysis
        const aiAnalysis = await analyzeVideo(assessment.videoUrl, assessment.testType);
        const cheatDetection = await detectCheating(assessment.videoUrl, assessment.testType);

        // Update assessment with results
        assessment.aiAnalysis = aiAnalysis;
        assessment.cheatDetection = cheatDetection;
        
        await assessment.save();

        // Update user stats if assessment is clean and completed
        if (cheatDetection.isClean && assessment.status === 'completed') {
          const user = await User.findById(assessment.userId);
          if (user) {
            const numericScore = assessment.numericScore;
            user.updateStats(numericScore);
            await user.save();
          }
        }

        console.log(`Assessment ${assessmentId} processed successfully`);
      } catch (error) {
        console.error(`Error processing assessment ${assessmentId}:`, error);
        
        // Update assessment status to failed
        await Assessment.findByIdAndUpdate(assessmentId, {
          status: 'rejected',
          'aiAnalysis.error': error.message
        });
      }
    }, 3000); // 3 second delay to simulate processing
  } catch (error) {
    console.error('Error in processAssessmentAsync:', error);
  }
}

// Simulate SAI submission
async function submitToSAI(assessment) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    status: 'received',
    feedback: 'Assessment received and under review by SAI officials',
    recommendations: [
      'Continue regular training',
      'Focus on technique improvement',
      'Consider specialized coaching'
    ],
    followUpRequired: assessment.aiAnalysis.score === 'Excellent'
  };
}

module.exports = router;
const express = require('express');
const { auth } = require('../middleware/auth');
const Assessment = require('../models/Assessment');

const router = express.Router();

// Process AI analysis results
router.post('/process', auth, async (req, res) => {
  try {
    const { assessmentId, aiResults } = req.body;

    if (!assessmentId || !aiResults) {
      return res.status(400).json({
        error: 'Assessment ID and AI results are required'
      });
    }

    // Find the assessment
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({
        error: 'Assessment not found'
      });
    }

    // Verify ownership
    if (assessment.userId.toString() !== req.userId) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    // Update assessment with AI results
    assessment.aiAnalysis = {
      formScore: aiResults.formScore || 0,
      repetitions: aiResults.repetitions || 0,
      duration: aiResults.duration || 0,
      consistency: aiResults.analysis?.consistency || 0,
      recommendations: aiResults.analysis?.recommendations || [],
      processedAt: new Date(),
      version: '1.0'
    };

    assessment.status = 'completed';
    assessment.score = Math.round(aiResults.formScore || 0);

    await assessment.save();

    res.json({
      message: 'AI analysis processed successfully',
      assessment: {
        id: assessment._id,
        score: assessment.score,
        aiAnalysis: assessment.aiAnalysis
      }
    });

  } catch (error) {
    console.error('AI analysis processing error:', error);
    res.status(500).json({
      error: 'Failed to process AI analysis',
      message: error.message
    });
  }
});

// Get AI analysis for assessment
router.get('/assessment/:id', auth, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    
    if (!assessment) {
      return res.status(404).json({
        error: 'Assessment not found'
      });
    }

    // Verify ownership
    if (assessment.userId.toString() !== req.userId) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    if (!assessment.aiAnalysis) {
      return res.status(404).json({
        error: 'AI analysis not available for this assessment'
      });
    }

    res.json({
      assessmentId: assessment._id,
      aiAnalysis: assessment.aiAnalysis,
      testType: assessment.testType,
      createdAt: assessment.createdAt
    });

  } catch (error) {
    console.error('Get AI analysis error:', error);
    res.status(500).json({
      error: 'Failed to retrieve AI analysis',
      message: error.message
    });
  }
});

// Get AI analysis statistics for user
router.get('/stats', auth, async (req, res) => {
  try {
    const assessments = await Assessment.find({ 
      userId: req.userId,
      aiAnalysis: { $exists: true }
    }).sort({ createdAt: -1 });

    const stats = {
      totalAnalyses: assessments.length,
      averageScore: 0,
      averageReps: 0,
      mostCommonSport: null,
      progressTrend: [],
      recentAnalyses: []
    };

    if (assessments.length > 0) {
      // Calculate averages
      const totalScore = assessments.reduce((sum, a) => sum + (a.score || 0), 0);
      const totalReps = assessments.reduce((sum, a) => sum + (a.aiAnalysis?.repetitions || 0), 0);
      
      stats.averageScore = Math.round(totalScore / assessments.length);
      stats.averageReps = Math.round(totalReps / assessments.length);

      // Find most common sport
      const sportCounts = {};
      assessments.forEach(a => {
        sportCounts[a.testType] = (sportCounts[a.testType] || 0) + 1;
      });
      stats.mostCommonSport = Object.keys(sportCounts).reduce((a, b) => 
        sportCounts[a] > sportCounts[b] ? a : b
      );

      // Progress trend (last 10 analyses)
      stats.progressTrend = assessments.slice(0, 10).reverse().map(a => ({
        date: a.createdAt,
        score: a.score || 0,
        sport: a.testType
      }));

      // Recent analyses summary
      stats.recentAnalyses = assessments.slice(0, 5).map(a => ({
        id: a._id,
        sport: a.testType,
        score: a.score || 0,
        reps: a.aiAnalysis?.repetitions || 0,
        date: a.createdAt
      }));
    }

    res.json(stats);

  } catch (error) {
    console.error('AI stats error:', error);
    res.status(500).json({
      error: 'Failed to retrieve AI statistics',
      message: error.message
    });
  }
});

module.exports = router;
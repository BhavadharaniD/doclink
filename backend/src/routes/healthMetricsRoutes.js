// routes/healthMetrics.js
import express from 'express';
import HealthMetric from '../models/HealthMetrics.js';
import {protect} from '../middlewares/auth.js'; // optional JWT middleware

const router = express.Router();

// ✅ POST: Save or update metrics
router.post('/:userId', protect , async (req, res) => {
  try {
    const { bloodPressure, bloodSugar, bmi } = req.body;
    const userId = req.params.userId;

    const metric = await HealthMetric.findOneAndUpdate(
      { userId },
      { bloodPressure, bloodSugar, bmi, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json(metric);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save metrics' });
  }
});

// ✅ GET: Fetch metrics
router.get('/:userId', protect , async (req, res) => {
  try {
    const metric = await HealthMetric.findOne({ userId: req.params.userId });
    res.json(metric || {});
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

export default router;
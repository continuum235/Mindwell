import express from 'express';
import {
  createMoodEntry,
  getMoodEntries,
  getMoodEntryById,
  updateMoodEntry,
  deleteMoodEntry,
  getMoodStats,
} from '../controllers/moodController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected (require authentication)
// Note: /stats must come before /:id to avoid route matching issues
router.get('/stats', protect, getMoodStats);

router.route('/')
  .get(protect, getMoodEntries)
  .post(protect, createMoodEntry);

router.route('/:id')
  .get(protect, getMoodEntryById)
  .put(protect, updateMoodEntry)
  .delete(protect, deleteMoodEntry);

export default router;

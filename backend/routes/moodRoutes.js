import express from 'express';
import {
  createMoodEntry,
  getMoodEntries,
  getMoodEntryById,
  updateMoodEntry,
  deleteMoodEntry,
  getMoodStats,
} from '../controllers/moodController.js';

const router = express.Router();

// Note: /stats must come before /:id to avoid route matching issues
router.get('/stats', getMoodStats);

router.route('/')
  .get(getMoodEntries)
  .post(createMoodEntry);

router.route('/:id')
  .get(getMoodEntryById)
  .put(updateMoodEntry)
  .delete(deleteMoodEntry);

export default router;

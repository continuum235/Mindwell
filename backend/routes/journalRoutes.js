import express from 'express';
import {
  createJournalEntry,
  getJournalEntries,
  getJournalEntryById,
  updateJournalEntry,
  deleteJournalEntry,
  getTodayJournalEntry,
} from '../controllers/journalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected (require authentication)
router.route('/')
  .get(protect, getJournalEntries)
  .post(protect, createJournalEntry);

router.get('/today', protect, getTodayJournalEntry);

router.route('/:id')
  .get(protect, getJournalEntryById)
  .put(protect, updateJournalEntry)
  .delete(protect, deleteJournalEntry);

export default router;

import express from 'express';
import {
  createJournalEntry,
  getJournalEntries,
  getJournalEntryById,
  updateJournalEntry,
  deleteJournalEntry,
  getTodayJournalEntry,
} from '../controllers/journalController.js';

const router = express.Router();

router.route('/')
  .get(getJournalEntries)
  .post(createJournalEntry);

router.get('/today', getTodayJournalEntry);

router.route('/:id')
  .get(getJournalEntryById)
  .put(updateJournalEntry)
  .delete(deleteJournalEntry);

export default router;

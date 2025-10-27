import asyncHandler from 'express-async-handler';
import JournalEntry from '../models/journalModel.js';

// @desc    Create a new journal entry
// @route   POST /api/journal
// @access  Private
const createJournalEntry = asyncHandler(async (req, res) => {
  const { content, date } = req.body;

  // Validate required fields
  if (!content || content.trim() === '') {
    res.status(400);
    throw new Error('Please provide journal content');
  }

  // Create journal entry
  const journalEntry = await JournalEntry.create({
    user: req.user._id,
    content: content.trim(),
    date: date || new Date(),
  });

  res.status(201).json(journalEntry);
});

// @desc    Get all journal entries for logged in user
// @route   GET /api/journal
// @access  Private
const getJournalEntries = asyncHandler(async (req, res) => {
  const { startDate, endDate, limit } = req.query;

  let query = { user: req.user._id };

  // Filter by date range if provided
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const journalEntries = await JournalEntry.find(query)
    .sort({ date: -1 })
    .limit(limit ? parseInt(limit) : 100);

  res.json(journalEntries);
});

// @desc    Get a single journal entry by ID
// @route   GET /api/journal/:id
// @access  Private
const getJournalEntryById = asyncHandler(async (req, res) => {
  const journalEntry = await JournalEntry.findById(req.params.id);

  if (!journalEntry) {
    res.status(404);
    throw new Error('Journal entry not found');
  }

  // Check if the journal entry belongs to the logged in user
  if (journalEntry.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to view this journal entry');
  }

  res.json(journalEntry);
});

// @desc    Update a journal entry
// @route   PUT /api/journal/:id
// @access  Private
const updateJournalEntry = asyncHandler(async (req, res) => {
  const journalEntry = await JournalEntry.findById(req.params.id);

  if (!journalEntry) {
    res.status(404);
    throw new Error('Journal entry not found');
  }

  // Check if the journal entry belongs to the logged in user
  if (journalEntry.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this journal entry');
  }

  // Update fields
  journalEntry.content = req.body.content?.trim() || journalEntry.content;
  journalEntry.date = req.body.date || journalEntry.date;

  const updatedJournalEntry = await journalEntry.save();

  res.json(updatedJournalEntry);
});

// @desc    Delete a journal entry
// @route   DELETE /api/journal/:id
// @access  Private
const deleteJournalEntry = asyncHandler(async (req, res) => {
  const journalEntry = await JournalEntry.findById(req.params.id);

  if (!journalEntry) {
    res.status(404);
    throw new Error('Journal entry not found');
  }

  // Check if the journal entry belongs to the logged in user
  if (journalEntry.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this journal entry');
  }

  await JournalEntry.deleteOne({ _id: req.params.id });

  res.json({ message: 'Journal entry removed' });
});

// @desc    Get journal entry for today
// @route   GET /api/journal/today
// @access  Private
const getTodayJournalEntry = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const journalEntry = await JournalEntry.findOne({
    user: req.user._id,
    date: { $gte: today, $lt: tomorrow }
  }).sort({ date: -1 });

  if (!journalEntry) {
    return res.json(null);
  }

  res.json(journalEntry);
});

export {
  createJournalEntry,
  getJournalEntries,
  getJournalEntryById,
  updateJournalEntry,
  deleteJournalEntry,
  getTodayJournalEntry,
};

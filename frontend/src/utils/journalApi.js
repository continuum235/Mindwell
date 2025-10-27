import apiRequest from './api';

// Journal API calls
export const journalAPI = {
  // Create a new journal entry
  createJournalEntry: async (journalData) => {
    return apiRequest('/api/journal', {
      method: 'POST',
      body: JSON.stringify(journalData),
    });
  },

  // Get all journal entries (with optional filters)
  getJournalEntries: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/api/journal?${queryString}` : '/api/journal';
    return apiRequest(endpoint, {
      method: 'GET',
    });
  },

  // Get today's journal entry
  getTodayJournalEntry: async () => {
    return apiRequest('/api/journal/today', {
      method: 'GET',
    });
  },

  // Get a specific journal entry by ID
  getJournalEntryById: async (id) => {
    return apiRequest(`/api/journal/${id}`, {
      method: 'GET',
    });
  },

  // Update a journal entry
  updateJournalEntry: async (id, journalData) => {
    return apiRequest(`/api/journal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(journalData),
    });
  },

  // Delete a journal entry
  deleteJournalEntry: async (id) => {
    return apiRequest(`/api/journal/${id}`, {
      method: 'DELETE',
    });
  },
};

export default journalAPI;

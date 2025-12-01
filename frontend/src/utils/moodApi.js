import apiRequest from './api';

// Mood API calls
export const moodAPI = {
  // Create a new mood entry
  createMoodEntry: async (moodData) => {
    return apiRequest('/api/mood', {
      method: 'POST',
      body: JSON.stringify(moodData),
    });
  },

  // Get all mood entries (with optional filters)
  getMoodEntries: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/api/mood?${queryString}` : '/api/mood';
    return apiRequest(endpoint, {
      method: 'GET',
    });
  },

  // Get mood stats
  getMoodStats: async (days = 30, userId = null) => {
    const params = { days };
    if (userId) {
      params.user = userId;
    }
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/api/mood/stats?${queryString}`, {
      method: 'GET',
    });
  },

  // Get a specific mood entry by ID
  getMoodEntryById: async (id) => {
    return apiRequest(`/api/mood/${id}`, {
      method: 'GET',
    });
  },

  // Update a mood entry
  updateMoodEntry: async (id, moodData) => {
    return apiRequest(`/api/mood/${id}`, {
      method: 'PUT',
      body: JSON.stringify(moodData),
    });
  },

  // Delete a mood entry
  deleteMoodEntry: async (id) => {
    return apiRequest(`/api/mood/${id}`, {
      method: 'DELETE',
    });
  },
};

export default moodAPI;

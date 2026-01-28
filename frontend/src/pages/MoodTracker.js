import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const MoodTracker = () => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [viewPeriod, setViewPeriod] = useState(30);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editMood, setEditMood] = useState('');
  const [editNote, setEditNote] = useState('');

  const moods = [
    { value: 'excellent', label: 'Excellent', emoji: '😄', color: 'bg-green-500', hoverColor: 'hover:bg-green-600' },
    { value: 'good', label: 'Good', emoji: '😊', color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600' },
    { value: 'okay', label: 'Okay', emoji: '😐', color: 'bg-yellow-500', hoverColor: 'hover:bg-yellow-600' },
    { value: 'bad', label: 'Bad', emoji: '😟', color: 'bg-orange-500', hoverColor: 'hover:bg-orange-600' },
    { value: 'terrible', label: 'Terrible', emoji: '😢', color: 'bg-red-500', hoverColor: 'hover:bg-red-600' },
  ];

  const loadMoodData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = user ? { limit: 50, user: user._id } : { limit: 50 };
      const statsParams = { days: viewPeriod };
      if (user) statsParams.user = user._id;

      const [entriesResponse, statsResponse] = await Promise.all([
        axios.get(`${API_URL}/api/mood`, { params, withCredentials: true }),
        axios.get(`${API_URL}/api/mood/stats`, { params: statsParams, withCredentials: true })
      ]);
      setEntries(entriesResponse.data);
      setStats(statsResponse.data);
    } catch (err) {
      console.error('Error loading mood data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load mood data.');
    } finally {
      setLoading(false);
    }
  }, [viewPeriod, user]);

  useEffect(() => {
    loadMoodData();
  }, [loadMoodData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedMood) {
      setError('Please select a mood');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const moodData = {
        mood: selectedMood,
        note: note.trim(),
      };
      if (user) {
        moodData.user = user._id;
      }

      const response = await axios.post(`${API_URL}/api/mood`, moodData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });

      setEntries([response.data, ...entries]);
      setSuccess('Mood logged successfully!');
      setSelectedMood('');
      setNote('');
      setTimeout(() => setSuccess(''), 3000);
      loadMoodData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to log mood');
    } finally {
      setLoading(false);
    }
  };

  const deleteMoodEntry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/mood/${id}`, { withCredentials: true });
      setEntries(entries.filter(entry => entry._id !== id));
      loadMoodData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete entry');
      console.error(err);
    }
  };

  const startEditEntry = (entry) => {
    setEditingEntry(entry);
    setEditMood(entry.mood);
    setEditNote(entry.note || '');
    setError('');
  };

  const cancelEdit = () => {
    setEditingEntry(null);
    setEditMood('');
    setEditNote('');
    setError('');
  };

  const handleUpdateMood = async (e) => {
    e.preventDefault();
    
    if (!editMood) {
      setError('Please select a mood');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await axios.put(
        `${API_URL}/api/mood/${editingEntry._id}`,
        { mood: editMood, note: editNote.trim() },
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      setEntries(entries.map(entry => 
        entry._id === editingEntry._id ? response.data : entry
      ));
      setSuccess('Mood entry updated successfully!');
      cancelEdit();
      setTimeout(() => setSuccess(''), 3000);
      loadMoodData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update mood entry');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getMoodEmoji = (moodValue) => {
    const mood = moods.find(m => m.value === moodValue);
    return mood ? mood.emoji : '😐';
  };

  const getMoodColor = (moodValue) => {
    const mood = moods.find(m => m.value === moodValue);
    return mood ? mood.color : 'bg-gray-500';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Mood Tracker</h1>
        <p className="text-xl text-gray-600">
          Track your daily mood to identify patterns and improve emotional awareness
        </p>
        {!user && (
          <p className="text-sm text-gray-500 mt-2">
            Tip: <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">Log in</Link> to save your mood history across devices
          </p>
        )}
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">How are you feeling?</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => setSelectedMood(mood.value)}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedMood === mood.value
                        ? `${mood.color} text-white border-transparent shadow-lg`
                        : `bg-white text-gray-700 border-gray-300 ${mood.hoverColor} hover:text-white`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{mood.emoji}</span>
                        <span className="font-medium text-lg">{mood.label}</span>
                      </div>
                      {selectedMood === mood.value && (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add a note (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What's on your mind?"
                  rows="3"
                  maxLength="500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">{note.length}/500 characters</p>
              </div>

              <button
                type="submit"
                disabled={loading || !selectedMood}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Logging...' : 'Log Mood'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {stats && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Mood Overview</h2>
                <select
                  value={viewPeriod}
                  onChange={(e) => setViewPeriod(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={7}>Last 7 days</option>
                  <option value={30}>Last 30 days</option>
                  <option value={90}>Last 90 days</option>
                </select>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Total entries: <span className="font-semibold text-gray-900">{stats.totalEntries}</span>
                </p>
                
                <div className="space-y-3">
                  {moods.map((mood) => {
                    const count = stats.moodCounts[mood.value];
                    const percentage = stats.totalEntries > 0 
                      ? ((count / stats.totalEntries) * 100).toFixed(0) 
                      : 0;
                    
                    return (
                      <div key={mood.value}>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">{mood.emoji}</span>
                            <span className="text-sm font-medium text-gray-700">{mood.label}</span>
                          </div>
                          <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${mood.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Entries</h2>
            
            {loading && entries.length === 0 ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">No mood entries yet.</p>
                <p className="text-sm mt-2">Start tracking your mood to see your history here!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <div
                    key={entry._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3 flex-1">
                        <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`inline-block px-2 py-1 rounded text-white text-sm font-medium ${getMoodColor(entry.mood)}`}>
                              {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatDate(entry.date)} at {formatTime(entry.date)}
                            </span>
                          </div>
                          {entry.note && (
                            <p className="text-gray-700 mt-2">{entry.note}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => startEditEntry(entry)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit entry"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteMoodEntry(entry._id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete entry"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Edit Mood Entry</h2>
                <button
                  onClick={cancelEdit}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUpdateMood}>
                <div className="space-y-4 mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How are you feeling?
                  </label>
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setEditMood(mood.value)}
                      className={`w-full p-3 rounded-lg border-2 transition-all ${
                        editMood === mood.value
                          ? `${mood.color} text-white border-transparent shadow-lg`
                          : `bg-white text-gray-700 border-gray-300 ${mood.hoverColor} hover:text-white`
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{mood.emoji}</span>
                          <span className="font-medium">{mood.label}</span>
                        </div>
                        {editMood === mood.value && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note
                  </label>
                  <textarea
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    placeholder="What's on your mind?"
                    rows="3"
                    maxLength="500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">{editNote.length}/500 characters</p>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !editMood}
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;

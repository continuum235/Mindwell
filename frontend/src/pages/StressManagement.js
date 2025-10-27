// pages/StressManagement.js
import React, { useState, useEffect } from 'react';
import { journalAPI } from '../utils/journalApi';
import { useAuth } from '../context/AuthContext';

const StressManagement = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('meditation');
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('breatheIn');
  const [timer, setTimer] = useState(0);
  const [journalEntry, setJournalEntry] = useState('');
  const [savedEntries, setSavedEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Breathing exercise timer
  useEffect(() => {
    let interval;
    if (breathingActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev >= 7) {
            setBreathPhase(breathPhase === 'breatheIn' ? 'hold' : breathPhase === 'hold' ? 'breatheOut' : 'breatheIn');
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breathingActive, breathPhase]);

  // Load journal entries when journal tab is active
  useEffect(() => {
    if (activeTab === 'journal' && user) {
      loadJournalEntries();
    }
  }, [activeTab, user]);

  const loadJournalEntries = async () => {
    try {
      setLoading(true);
      setError('');
      const entries = await journalAPI.getJournalEntries({ limit: 50 });
      setSavedEntries(entries);
    } catch (err) {
      setError(err.message || 'Failed to load journal entries');
      console.error('Error loading journal entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const startBreathing = () => {
    setBreathingActive(true);
    setBreathPhase('breatheIn');
    setTimer(0);
  };

  const stopBreathing = () => {
    setBreathingActive(false);
    setTimer(0);
  };

  const saveJournalEntry = async () => {
    if (!journalEntry.trim()) return;

    try {
      setLoading(true);
      setError('');
      
      if (editingId) {
        // Update existing entry
        const updated = await journalAPI.updateJournalEntry(editingId, {
          content: journalEntry,
        });
        setSavedEntries(savedEntries.map(entry => 
          entry._id === editingId ? updated : entry
        ));
        setEditingId(null);
      } else {
        // Create new entry
        const newEntry = await journalAPI.createJournalEntry({
          content: journalEntry,
          date: new Date(),
        });
        setSavedEntries([newEntry, ...savedEntries]);
      }
      
      setJournalEntry('');
    } catch (err) {
      setError(err.message || 'Failed to save journal entry');
      console.error('Error saving journal entry:', err);
    } finally {
      setLoading(false);
    }
  };

  const editJournalEntry = (entry) => {
    setJournalEntry(entry.content);
    setEditingId(entry._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteJournalEntry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    try {
      setLoading(true);
      setError('');
      await journalAPI.deleteJournalEntry(id);
      setSavedEntries(savedEntries.filter(entry => entry._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete journal entry');
      console.error('Error deleting journal entry:', err);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setJournalEntry('');
    setEditingId(null);
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
      minute: '2-digit' 
    });
  };

  const breathingText = {
    breatheIn: 'Breathe In...',
    hold: 'Hold...',
    breatheOut: 'Breathe Out...'
  };

  const breathingColor = {
    breatheIn: 'from-green-400 to-blue-400',
    hold: 'from-blue-400 to-purple-400',
    breatheOut: 'from-purple-400 to-pink-400'
  };

  const meditationAudios = [
    { name: 'Guided Meditation', duration: '10 min', type: 'meditation' },
    { name: 'Body Scan', duration: '15 min', type: 'meditation' },
    { name: 'Mindfulness', duration: '8 min', type: 'meditation' },
    { name: 'Sleep Meditation', duration: '20 min', type: 'meditation' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900">Stress Management</h1>
        <p className="mt-4 text-lg text-gray-600">
          Interactive tools to help you relax and manage stress effectively.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg max-w-md mx-auto">
        {['meditation', 'breathing', 'journal'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === tab
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'meditation' && '🧘 Meditation'}
            {tab === 'breathing' && '🌬️ Breathing'}
            {tab === 'journal' && '📔 Journal'}
          </button>
        ))}
      </div>

      {/* Meditation Tab */}
      {activeTab === 'meditation' && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Guided Meditations</h2>
            <p className="text-gray-600">Select a meditation to begin your practice</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {meditationAudios.map((audio, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-200 to-purple-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎵</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{audio.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{audio.duration}</p>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Play
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Meditation Timer</h3>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg shadow hover:shadow-md transition-shadow">
                5 min
              </button>
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg shadow hover:shadow-md transition-shadow">
                10 min
              </button>
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg shadow hover:shadow-md transition-shadow">
                15 min
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Breathing Tab */}
      {activeTab === 'breathing' && (
        <div className="text-center space-y-8">
          <h2 className="text-2xl font-bold text-gray-900">Breathing Exercise</h2>
          
          <div className="max-w-md mx-auto">
            <div className={`w-64 h-64 mx-auto rounded-full bg-gradient-to-br ${breathingColor[breathPhase]} transition-all duration-1000 flex items-center justify-center shadow-2xl ${
              breathingActive ? 'scale-100' : 'scale-90'
            }`}>
              <div className="text-white text-center">
                <div className="text-4xl font-bold mb-2">{timer}</div>
                <div className="text-xl font-semibold">{breathingText[breathPhase]}</div>
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
              <p className="text-gray-600">
                Follow the circle: Breathe in for 4s, hold for 4s, breathe out for 6s
              </p>
              
              {!breathingActive ? (
                <button
                  onClick={startBreathing}
                  className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Start Breathing Exercise
                </button>
              ) : (
                <button
                  onClick={stopBreathing}
                  className="bg-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Stop Exercise
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-3">💨</div>
              <h3 className="font-semibold text-gray-900 mb-2">4-4-6 Pattern</h3>
              <p className="text-gray-600 text-sm">Inhale for 4s, hold for 4s, exhale for 6s</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-3">😌</div>
              <h3 className="font-semibold text-gray-900 mb-2">Calms Nervous System</h3>
              <p className="text-gray-600 text-sm">Activates parasympathetic response</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-3">⏱️</div>
              <h3 className="font-semibold text-gray-900 mb-2">5-10 Minutes</h3>
              <p className="text-gray-600 text-sm">Recommended daily practice</p>
            </div>
          </div>
        </div>
      )}

      {/* Journal Tab */}
      {activeTab === 'journal' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Journal Input */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Daily Journal</h2>
            <p className="text-gray-600 mb-6">Write down your thoughts, feelings, or anything on your mind</p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {editingId && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg flex items-center justify-between">
                <span>Editing entry...</span>
                <button onClick={cancelEdit} className="text-blue-600 hover:text-blue-800 underline text-sm">
                  Cancel
                </button>
              </div>
            )}
            
            <div className="space-y-4">
              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="How are you feeling today? What's on your mind?"
                className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={loading}
              />
              
              <div className="flex space-x-3">
                <button
                  onClick={saveJournalEntry}
                  disabled={!journalEntry.trim() || loading}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Saving...' : editingId ? 'Update Entry' : 'Save Entry'}
                </button>
                <button
                  onClick={() => {
                    setJournalEntry('');
                    setEditingId(null);
                  }}
                  disabled={loading}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Saved Entries */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Previous Entries</h2>
            
            {loading && savedEntries.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-gray-500">Loading entries...</p>
              </div>
            ) : savedEntries.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-500">No entries yet. Start writing!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {savedEntries.map((entry) => (
                  <div key={entry._id} className="border-l-4 border-indigo-500 pl-4 py-3 bg-gray-50 rounded relative group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-gray-500">{formatDate(entry.date)}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{formatTime(entry.date)}</span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                          <button
                            onClick={() => editJournalEntry(entry)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteJournalEntry(entry._id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resources Section */}
      <div className="mt-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">Need Additional Support?</h3>
        <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
          Remember that these tools are for self-help and should not replace professional mental health care when needed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Find a Therapist
          </button>
          <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
            Crisis Resources
          </button>
        </div>
      </div>
    </div>
  );
};

export default StressManagement;
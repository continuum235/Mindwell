// pages/StressManagement.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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

  // Audio states
  const [playingSound, setPlayingSound] = useState(null);
  const [soundVolume, setSoundVolume] = useState(0.5);
  const audioRef = useRef(null);

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

  const loadJournalEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = user ? { limit: 50, user: user._id } : { limit: 50 };
      const response = await axios.get(`${API_URL}/api/journal`, {
        params,
        withCredentials: true
      });
      setSavedEntries(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load journal entries');
      console.error('Error loading journal entries:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load journal entries when journal tab is active
  useEffect(() => {
    if (activeTab === 'journal') {
      loadJournalEntries();
    }
  }, [activeTab, loadJournalEntries]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        const { audioContext, source } = audioRef.current;
        if (source && source.nodes) {
          source.nodes.forEach(node => {
            try {
              if (node.stop) node.stop();
              if (node.disconnect) node.disconnect();
            } catch (e) {}
          });
        }
        if (audioContext && audioContext.state !== 'closed') {
          audioContext.close();
        }
        audioRef.current = null;
      }
    };
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current && audioRef.current.masterGain) {
      audioRef.current.masterGain.gain.setValueAtTime(
        soundVolume,
        audioRef.current.audioContext.currentTime
      );
    }
  }, [soundVolume]);

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
        const response = await axios.put(
          `${API_URL}/api/journal/${editingId}`,
          { content: journalEntry },
          {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
          }
        );
        setSavedEntries(savedEntries.map(entry =>
          entry._id === editingId ? response.data : entry
        ));
        setEditingId(null);
      } else {
        // Create new entry
        const journalData = {
          content: journalEntry,
          date: new Date(),
        };

        if (user) {
          journalData.user = user._id;
        }

        const response = await axios.post(
          `${API_URL}/api/journal`,
          journalData,
          {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
          }
        );
        setSavedEntries([response.data, ...savedEntries]);
      }

      setJournalEntry('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save journal entry');
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
      await axios.delete(`${API_URL}/api/journal/${id}`, {
        withCredentials: true
      });
      setSavedEntries(savedEntries.filter(entry => entry._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete journal entry');
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

  const createWhiteNoise = (audioContext) => {
    const bufferSize = 4096;
    const whiteNoise = audioContext.createScriptProcessor(bufferSize, 1, 1);
    whiteNoise.onaudioprocess = function(e) {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    };
    return whiteNoise;
  };

  const createPinkNoise = (audioContext) => {
    const bufferSize = 4096;
    const pinkNoise = audioContext.createScriptProcessor(bufferSize, 1, 1);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    pinkNoise.onaudioprocess = function(e) {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }
    };
    return pinkNoise;
  };

  const createOceanWaves = (audioContext) => {
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    oscillator1.type = 'sine';
    oscillator1.frequency.setValueAtTime(0.2, audioContext.currentTime);

    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(0.15, audioContext.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, audioContext.currentTime);

    const noise = createWhiteNoise(audioContext);

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    noise.connect(filter);
    filter.connect(gainNode);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

    oscillator1.start();
    oscillator2.start();

    return { nodes: [oscillator1, oscillator2, noise, gainNode], output: gainNode };
  };

  const createRain = (audioContext) => {
    const noise = createPinkNoise(audioContext);
    const filter = audioContext.createBiquadFilter();
    const gainNode = audioContext.createGain();

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, audioContext.currentTime);
    filter.Q.setValueAtTime(1, audioContext.currentTime);

    noise.connect(filter);
    filter.connect(gainNode);

    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);

    return { nodes: [noise, gainNode], output: gainNode };
  };

  const createThunder = (audioContext) => {
    const noise = createWhiteNoise(audioContext);
    const filter = audioContext.createBiquadFilter();
    const gainNode = audioContext.createGain();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, audioContext.currentTime);

    noise.connect(filter);
    filter.connect(gainNode);

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);

    // Create rumbling effect
    const lfo = audioContext.createOscillator();
    const lfoGain = audioContext.createGain();

    lfo.frequency.setValueAtTime(0.5, audioContext.currentTime);
    lfoGain.gain.setValueAtTime(100, audioContext.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    lfo.start();

    return { nodes: [noise, lfo, gainNode], output: gainNode };
  };

  const createWindChimes = (audioContext) => {
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

    const frequencies = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    const oscillators = [];

    frequencies.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const oscGain = audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioContext.currentTime);
      oscGain.gain.setValueAtTime(0, audioContext.currentTime);

      osc.connect(oscGain);
      oscGain.connect(gainNode);

      osc.start();
      oscillators.push({ osc, gain: oscGain });

      // Random chime hits
      setInterval(() => {
        const now = audioContext.currentTime;
        oscGain.gain.cancelScheduledValues(now);
        oscGain.gain.setValueAtTime(0, now);
        oscGain.gain.linearRampToValueAtTime(0.15, now + 0.05);
        oscGain.gain.exponentialRampToValueAtTime(0.01, now + 2);
      }, Math.random() * 3000 + 2000 + i * 500);
    });

    return { nodes: oscillators.map(o => o.osc), output: gainNode };
  };

  const createFireplace = (audioContext) => {
    const noise = createPinkNoise(audioContext);
    const filter = audioContext.createBiquadFilter();
    const gainNode = audioContext.createGain();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, audioContext.currentTime);
    filter.Q.setValueAtTime(0.5, audioContext.currentTime);

    noise.connect(filter);
    filter.connect(gainNode);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

    // Add crackling effect
    const crackle = audioContext.createOscillator();
    const crackleGain = audioContext.createGain();

    crackle.type = 'square';
    crackle.frequency.setValueAtTime(50, audioContext.currentTime);
    crackleGain.gain.setValueAtTime(0.05, audioContext.currentTime);

    crackle.connect(crackleGain);
    crackleGain.connect(gainNode);

    crackle.start();

    return { nodes: [noise, crackle, gainNode], output: gainNode };
  };

  const createForest = (audioContext) => {
    const noise = createPinkNoise(audioContext);
    const filter = audioContext.createBiquadFilter();
    const gainNode = audioContext.createGain();

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2000, audioContext.currentTime);
    filter.Q.setValueAtTime(0.8, audioContext.currentTime);

    noise.connect(filter);
    filter.connect(gainNode);

    gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);

    // Add bird chirps
    const chirpGain = audioContext.createGain();
    chirpGain.gain.setValueAtTime(0.15, audioContext.currentTime);
    chirpGain.connect(gainNode);

    return { nodes: [noise, gainNode], output: gainNode };
  };

  const toggleSound = (soundName) => {
    if (playingSound === soundName) {
      // Stop the sound
      if (audioRef.current) {
        const { audioContext, source } = audioRef.current;
        if (source.nodes) {
          source.nodes.forEach(node => {
            try {
              if (node.stop) node.stop();
              if (node.disconnect) node.disconnect();
            } catch (e) {}
          });
        }
        if (audioContext.state !== 'closed') {
          audioContext.close();
        }
        audioRef.current = null;
      }
      setPlayingSound(null);
    } else {
      // Stop any currently playing sound
      if (audioRef.current) {
        const { audioContext, source } = audioRef.current;
        if (source.nodes) {
          source.nodes.forEach(node => {
            try {
              if (node.stop) node.stop();
              if (node.disconnect) node.disconnect();
            } catch (e) {}
          });
        }
        if (audioContext.state !== 'closed') {
          audioContext.close();
        }
      }

      // Create new audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const masterGain = audioContext.createGain();
      masterGain.gain.setValueAtTime(soundVolume, audioContext.currentTime);
      masterGain.connect(audioContext.destination);

      // Create the appropriate sound
      let source;
      switch(soundName) {
        case 'Rain':
          source = createRain(audioContext);
          break;
        case 'Ocean Waves':
          source = createOceanWaves(audioContext);
          break;
        case 'Forest':
          source = createForest(audioContext);
          break;
        case 'Thunder':
          source = createThunder(audioContext);
          break;
        case 'Fireplace':
          source = createFireplace(audioContext);
          break;
        case 'Wind Chimes':
          source = createWindChimes(audioContext);
          break;
        case 'White Noise':
          const noise = createWhiteNoise(audioContext);
          const whiteGain = audioContext.createGain();
          whiteGain.gain.setValueAtTime(0.3, audioContext.currentTime);
          noise.connect(whiteGain);
          source = { nodes: [noise], output: whiteGain };
          break;
        default:
          source = { nodes: [], output: masterGain };
      }

      source.output.connect(masterGain);

      audioRef.current = { audioContext, source, masterGain };
      setPlayingSound(soundName);
    }
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

  const soothingSounds = [
    { name: 'Rain', icon: '🌧️', color: 'from-blue-400 to-blue-600' },
    { name: 'Ocean Waves', icon: '🌊', color: 'from-cyan-400 to-blue-500' },
    { name: 'Forest', icon: '🌲', color: 'from-green-400 to-emerald-600' },
    { name: 'Thunder', icon: '⛈️', color: 'from-gray-600 to-slate-700' },
    { name: 'Fireplace', icon: '🔥', color: 'from-orange-400 to-red-500' },
    { name: 'Wind Chimes', icon: '🎐', color: 'from-purple-400 to-pink-400' },
    { name: 'White Noise', icon: '📻', color: 'from-gray-400 to-gray-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Stress Management
          </h1>
          <p className="text-xl text-gray-600">
            Interactive tools to help you relax and manage stress effectively.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-100 rounded-xl p-2 mb-8 flex space-x-2">
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
            {/* Soothing Sounds Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Soothing Sounds
              </h2>
              <p className="text-gray-600 mb-6">
                Click to play ambient sounds for relaxation
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {soothingSounds.map((sound) => (
                  <button
                    key={sound.name}
                    onClick={() => toggleSound(sound.name)}
                    className={`relative overflow-hidden rounded-xl p-6 text-center transition-all duration-300 transform hover:scale-105 ${
                      playingSound === sound.name
                        ? `bg-gradient-to-br ${sound.color} shadow-2xl ring-4 ring-white ring-opacity-50`
                        : 'bg-white shadow-lg hover:shadow-xl'
                    }`}
                  >
                    <div className="text-4xl mb-2">{sound.icon}</div>
                    <div className={`font-semibold ${
                      playingSound === sound.name ? 'text-white' : 'text-gray-700'
                    }`}>
                      {sound.name}
                    </div>
                    {playingSound === sound.name && (
                      <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse" />
                    )}
                  </button>
                ))}
              </div>

              {/* Volume Control */}
              {playingSound && (
                <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4">
                  <span className="text-2xl">🔊</span>
                  <span className="text-sm font-medium text-gray-700">Volume</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={soundVolume}
                    onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-right">
                    {Math.round(soundVolume * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* Guided Meditations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Guided Meditations
              </h2>
              <p className="text-gray-600 mb-6">
                Select a meditation to begin your practice
              </p>

              <div className="space-y-4">
                {meditationAudios.map((audio, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-indigo-600 text-white rounded-full p-3">
                        🎵
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{audio.name}</h3>
                        <p className="text-sm text-gray-600">{audio.duration}</p>
                      </div>
                    </div>
                    <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                      Play
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Timer */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Quick Meditation Timer
              </h2>
              <div className="flex space-x-4">
                <button className="flex-1 bg-gradient-to-r from-green-400 to-blue-500 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-shadow">
                  5 min
                </button>
                <button className="flex-1 bg-gradient-to-r from-blue-400 to-purple-500 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-shadow">
                  10 min
                </button>
                <button className="flex-1 bg-gradient-to-r from-purple-400 to-pink-500 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-shadow">
                  15 min
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Breathing Tab */}
        {activeTab === 'breathing' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Breathing Exercise
              </h2>

              {/* Breathing Circle */}
              <div className="flex flex-col items-center justify-center mb-8">
                <div
                  className={`w-64 h-64 rounded-full bg-gradient-to-br ${breathingColor[breathPhase]} shadow-2xl flex items-center justify-center transition-all duration-1000 ${
                    breathingActive ? 'scale-110' : 'scale-100'
                  }`}
                >
                  <div className="text-center text-white">
                    <div className="text-6xl font-bold mb-2">{timer}</div>
                    <div className="text-2xl font-semibold">
                      {breathingText[breathPhase]}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-center text-gray-600 mb-6">
                Follow the circle: Breathe in for 4s, hold for 4s, breathe out for 6s
              </p>

              <div className="flex justify-center space-x-4">
                {!breathingActive ? (
                  <button
                    onClick={startBreathing}
                    className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-shadow"
                  >
                    Start Breathing Exercise
                  </button>
                ) : (
                  <button
                    onClick={stopBreathing}
                    className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-shadow"
                  >
                    Stop Exercise
                  </button>
                )}
              </div>
            </div>

            {/* Benefits Section */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-4xl mb-4">💨</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">4-4-6 Pattern</h3>
                <p className="text-gray-600">Inhale for 4s, hold for 4s, exhale for 6s</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-4xl mb-4">😌</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Calms Nervous System</h3>
                <p className="text-gray-600">Activates parasympathetic response</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-4xl mb-4">⏱️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">5-10 Minutes</h3>
                <p className="text-gray-600">Recommended daily practice</p>
              </div>
            </div>
          </div>
        )}

        {/* Journal Tab */}
        {activeTab === 'journal' && (
          <div className="space-y-8">
            {/* Journal Input */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Daily Journal</h2>
              <p className="text-gray-600 mb-6">
                Write down your thoughts, feelings, or anything on your mind
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {editingId && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
                  <span>Editing entry...</span>
                  <button
                    onClick={cancelEdit}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
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
                    <div
                      key={entry._id}
                      className="border-l-4 border-indigo-500 pl-4 py-3 bg-gray-50 rounded relative group"
                    >
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
            Remember that these tools are for self-help and should not replace professional
            mental health care when needed.
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
    </div>
  );
};

export default StressManagement;
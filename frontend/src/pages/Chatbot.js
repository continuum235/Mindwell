// pages/Chatbot.js
import React, { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../utils/chatApi';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm MindWell AI, your mental health support companion. I'm here to listen without judgment and help you navigate your feelings. How are you doing today? 💙",
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Suggested prompts for mental health
  const suggestedPrompts = [
    "I'm feeling anxious and overwhelmed",
    "Can you teach me a breathing exercise?",
    "I'm having trouble sleeping",
    "Help me manage stress at work",
    "I'm feeling lonely and isolated",
    "Can you suggest some coping strategies?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user'
    };

    setMessages([...messages, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      // Call the backend API using the chat utility
      const data = await chatAPI.sendMessage(currentInput);
      
      const botMessage = {
        id: messages.length + 2,
        text: data.response,
        sender: 'bot'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling chatbot API:', error);
      
      // Fallback response in case of error
      const errorMessage = {
        id: messages.length + 2,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'bot'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedPrompt = (prompt) => {
    setInput(prompt);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">MindWell AI Companion</h1>
        <p className="mt-4 text-lg text-gray-600">
          Your 24/7 mental health support assistant powered by AI
        </p>
        <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Confidential
          </span>
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            24/7 Available
          </span>
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-1 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            Judgment-Free
          </span>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            💬 Mental Health Support Chat
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Share your thoughts and feelings in a safe, supportive space
          </p>
        </div>

        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${message.sender === 'user' ? 'text-right' : ''}`}
            >
              <div
                className={`inline-block rounded-lg px-4 py-2 max-w-xs md:max-w-md ${
                  message.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts - Show when chat is minimal */}
        {messages.length <= 1 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">💭 Not sure what to say? Try one of these:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="text-left text-sm px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSend} className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder={loading ? "Waiting for response..." : "Type your message here..."}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed min-w-[80px]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : (
                'Send'
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">⚠️ Important Safety Information</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p className="mb-2">
                <strong>This AI chatbot provides emotional support but is NOT a replacement for professional mental health care.</strong>
              </p>
              <p className="mb-2">
                <strong>🆘 If you're in crisis or having thoughts of self-harm:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Call emergency services (911) immediately</li>
                <li>Contact the National Suicide Prevention Lifeline: 988</li>
                <li>Text "HELLO" to 741741 (Crisis Text Line)</li>
                <li>Go to your nearest emergency room</li>
              </ul>
              <p className="mt-2">
                For ongoing support, please consult with a licensed mental health professional.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips Section */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">💡 How I Can Help:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
          <div className="flex items-start">
            <span className="mr-2">🧘</span>
            <span>Breathing & relaxation exercises</span>
          </div>
          <div className="flex items-start">
            <span className="mr-2">🧠</span>
            <span>Cognitive reframing techniques</span>
          </div>
          <div className="flex items-start">
            <span className="mr-2">😌</span>
            <span>Stress management strategies</span>
          </div>
          <div className="flex items-start">
            <span className="mr-2">💭</span>
            <span>Active listening & validation</span>
          </div>
          <div className="flex items-start">
            <span className="mr-2">📝</span>
            <span>Journaling prompts</span>
          </div>
          <div className="flex items-start">
            <span className="mr-2">🌱</span>
            <span>Building healthy habits</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
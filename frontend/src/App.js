// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/footer';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import StressManagement from './pages/StressManagement';
import MoodTracker from './pages/MoodTracker';
import Chatbot from './pages/Chatbot';
import About from './pages/About';
import Login from './pages/Login';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/assessment"
                element={
                  <PrivateRoute>
                    <Assessment />
                  </PrivateRoute>
                }
              />
              <Route
                path="/stress-management"
                element={
                  <PrivateRoute>
                    <StressManagement />
                  </PrivateRoute>
                }
              />
              <Route
                path="/mood-tracker"
                element={
                  <PrivateRoute>
                    <MoodTracker />
                  </PrivateRoute>
                }
              />
              <Route
                path="/chatbot"
                element={
                  <PrivateRoute>
                    <Chatbot />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
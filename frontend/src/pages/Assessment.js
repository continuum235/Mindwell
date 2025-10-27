// pages/Assessment.js
import React, { useState } from 'react';

const Assessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 1,
      text: "How often have you felt little interest or pleasure in doing things?",
      options: [
        "Not at all",
        "Several days",
        "More than half the days",
        "Nearly every day"
      ]
    },
    {
      id: 2,
      text: "How often have you felt down, depressed, or hopeless?",
      options: [
        "Not at all",
        "Several days",
        "More than half the days",
        "Nearly every day"
      ]
    },
    {
      id: 3,
      text: "How often have you had trouble falling or staying asleep, or sleeping too much?",
      options: [
        "Not at all",
        "Several days",
        "More than half the days",
        "Nearly every day"
      ]
    },
    {
      id: 4,
      text: "How often have you felt tired or had little energy?",
      options: [
        "Not at all",
        "Several days",
        "More than half the days",
        "Nearly every day"
      ]
    },
    {
      id: 5,
      text: "How often have you had poor appetite or overeaten?",
      options: [
        "Not at all",
        "Several days",
        "More than half the days",
        "Nearly every day"
      ]
    }
  ];

  const handleAnswer = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestion]: answer
    });
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    Object.values(answers).forEach(answer => {
      score += ["Not at all", "Several days", "More than half the days", "Nearly every day"].indexOf(answer);
    });
    return score;
  };

  const getResultMessage = (score) => {
    if (score <= 5) return "Your responses suggest minimal symptoms of depression.";
    if (score <= 10) return "Your responses suggest mild symptoms of depression.";
    if (score <= 15) return "Your responses suggest moderate symptoms of depression.";
    return "Your responses suggest severe symptoms of depression. Consider seeking professional help.";
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Assessment Results</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Based on your responses, here's what we found:
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <p className="text-gray-700 mb-4">{getResultMessage(score)}</p>
            <p className="text-sm text-gray-500">
              Remember: This assessment is not a diagnosis. If you're concerned about your mental health, 
              please consult with a healthcare professional.
            </p>
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setAnswers({});
                setShowResults(false);
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Retake Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Mental Health Assessment</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Answer these questions to get a better understanding of your current mental wellness.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <h4 className="text-md font-medium text-gray-700 mb-4">
            Question {currentQuestion + 1} of {questions.length}
          </h4>
          <p className="text-lg text-gray-900 mb-6">{questions[currentQuestion].text}</p>
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 ${currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Previous
            </button>
            <div className="text-sm text-gray-500">
              {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
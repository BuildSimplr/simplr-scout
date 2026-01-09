import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import StepIndicator from './StepIndicator';
import ProblemInput from './ProblemInput';
import ClarifyingQuestions from './ClarifyingQuestions';
import EmailCapture from './EmailCapture';
import Recommendations from './Recommendations';

function DiscoveryFlow({ onBack }) {
  const [step, setStep] = useState(1);
  const [problem, setProblem] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [recommendations, setRecommendations] = useState(null);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Submit problem and get clarifying questions
  const handleProblemSubmit = async (problemText) => {
    setProblem(problemText);
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'questions',
          problem: problemText
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze problem');
      }

      const data = await response.json();
      setQuestions(data.questions);
      setStep(2);
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong. Please try again.');
      // For demo purposes, use mock questions if API fails
      setQuestions([
        "How long has this problem been affecting your business?",
        "What solutions have you already tried?",
        "What resources (budget, team, time) do you have available?",
        "What would success look like for you?",
        "How urgent is solving this problem?"
      ]);
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Submit answers and trigger email gate
  const handleAnswersSubmit = async (answersData) => {
    setAnswers(answersData);
    setShowEmailCapture(true);
  };

  // After email capture, get recommendations
  const handleEmailSubmit = async (email) => {
    setShowEmailCapture(false);
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'recommendations',
          problem: problem,
          questions: questions,
          answers: answers,
          email: email
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate recommendations');
      }

      const data = await response.json();
      setRecommendations(data);
      setStep(3);
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong. Please try again.');
      // Mock recommendations for demo
      setRecommendations({
        summary: "Based on your inputs, you're facing a common challenge that many businesses encounter. Here's a structured approach to address it.",
        quickWins: [
          "Document your current process to identify immediate bottlenecks",
          "Schedule a team retrospective to gather insights from stakeholders",
          "Set up basic metrics tracking to measure improvement"
        ],
        strategic: [
          "Develop a phased implementation plan with clear milestones",
          "Identify key partners or resources needed for sustainable change"
        ],
        longTerm: [
          "Build organizational capability through training and development",
          "Create feedback loops for continuous improvement"
        ],
        nextStep: "Start by documenting your current state - this will be the foundation for all improvements."
      });
      setStep(3);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setStep(1);
    setProblem('');
    setQuestions([]);
    setAnswers({});
    setRecommendations(null);
    setShowEmailCapture(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-indigo-400" />
            <span className="text-2xl font-bold text-white">Simplr Scout</span>
          </div>
          {step < 3 && (
            <button
              onClick={step === 1 ? onBack : () => setStep(step - 1)}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {step === 1 ? 'Home' : 'Back'}
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="px-6 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Step Indicator */}
          {step < 3 && <StepIndicator currentStep={step} />}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Steps */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <ProblemInput
                key="problem"
                onSubmit={handleProblemSubmit}
                isLoading={isLoading}
              />
            )}

            {step === 2 && (
              <ClarifyingQuestions
                key="questions"
                questions={questions}
                onSubmit={handleAnswersSubmit}
                onBack={() => setStep(1)}
                isLoading={isLoading}
              />
            )}

            {step === 3 && recommendations && (
              <Recommendations
                key="recommendations"
                recommendations={recommendations}
                onStartOver={handleStartOver}
              />
            )}
          </AnimatePresence>

          {/* Loading overlay for final step */}
          {isLoading && step === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-40"
            >
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white text-lg">Generating your personalized solutions...</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Email Capture Modal */}
      <AnimatePresence>
        {showEmailCapture && (
          <EmailCapture onSubmit={handleEmailSubmit} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default DiscoveryFlow;

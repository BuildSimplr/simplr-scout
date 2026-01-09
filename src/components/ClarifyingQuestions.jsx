import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

function ClarifyingQuestions({ questions, onSubmit, onBack, isLoading }) {
  const [answers, setAnswers] = useState(
    questions.reduce((acc, _, index) => ({ ...acc, [index]: '' }), {})
  );

  const handleAnswerChange = (index, value) => {
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoading) {
      onSubmit(answers);
    }
  };

  const allAnswered = Object.values(answers).every(a => a.trim());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Help us understand better
        </h2>
        <p className="text-slate-300">
          Answer these follow-up questions to get more tailored recommendations.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {questions.map((question, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-6 bg-slate-700/50 rounded-xl border border-slate-600/50"
            >
              <label className="block text-white font-medium mb-3">
                <span className="text-indigo-400 mr-2">Q{index + 1}.</span>
                {question}
              </label>
              <textarea
                value={answers[index]}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder="Your answer..."
                className="w-full h-24 p-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                disabled={isLoading}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <button
            type="submit"
            disabled={!allAnswered || isLoading}
            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all hover:scale-105 disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Solutions...
              </>
            ) : (
              <>
                Get My Solutions
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default ClarifyingQuestions;

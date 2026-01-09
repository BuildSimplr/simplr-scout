import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';

function ProblemInput({ onSubmit, isLoading }) {
  const [problem, setProblem] = useState('');

  const examples = [
    "My team is missing deadlines and I don't know why",
    "We're losing customers but our product hasn't changed",
    "I want to expand to a new market but don't know where to start",
    "Our development process is too slow and causing delays"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (problem.trim() && !isLoading) {
      onSubmit(problem);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          What's your business challenge?
        </h2>
        <p className="text-slate-300">
          Describe the problem you're facing in your own words. Be as specific as possible.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Tell us about your business problem..."
          className="w-full h-40 p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          disabled={isLoading}
        />

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            disabled={!problem.trim() || isLoading}
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all hover:scale-105 disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze My Problem
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Example prompts */}
      <div className="mt-10">
        <p className="text-slate-400 text-sm text-center mb-4">
          Need inspiration? Try one of these:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setProblem(example)}
              disabled={isLoading}
              className="px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 text-sm rounded-lg transition-colors disabled:opacity-50"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default ProblemInput;

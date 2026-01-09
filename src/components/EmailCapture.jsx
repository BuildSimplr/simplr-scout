import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';

function EmailCapture({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    // Store email in localStorage for now
    const leads = JSON.parse(localStorage.getItem('simplr-scout-leads') || '[]');
    leads.push({ email, timestamp: new Date().toISOString() });
    localStorage.setItem('simplr-scout-leads', JSON.stringify(leads));

    onSubmit(email);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        className="max-w-md w-full bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Your Solutions Are Ready!
          </h3>
          <p className="text-slate-300">
            Enter your email to view your personalized recommendations.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {error && (
            <p className="mt-2 text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full mt-4 inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all hover:scale-105"
          >
            View My Solutions
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="mt-4 text-center text-slate-400 text-sm">
          We respect your privacy. No spam, ever.
        </p>
      </motion.div>
    </motion.div>
  );
}

export default EmailCapture;

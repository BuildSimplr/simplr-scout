import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Loader2, CheckCircle, User, Mail, Phone, MessageSquare } from 'lucide-react';

function ConsultationModal({ isOpen, onClose, problemSummary }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          problemSummary
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Something went wrong');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Book Free Consultation</h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitStatus === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Request Submitted!</h4>
              <p className="text-slate-300 mb-6">
                Thank you! We'll be in touch within 24 hours to schedule your consultation.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors"
              >
                Close
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-slate-300 text-sm mb-4">
                Get personalized guidance on implementing your recommendations. Fill out the form and we'll reach out within 24 hours.
              </p>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="w-full pl-11 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@company.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Phone <span className="text-slate-500">(optional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    className="w-full pl-11 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  How can we help?
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project or what you'd like to discuss..."
                    rows={3}
                    className="w-full pl-11 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Request Consultation
                  </>
                )}
              </button>

              <p className="text-center text-slate-500 text-xs">
                We respect your privacy. No spam, ever.
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ConsultationModal;

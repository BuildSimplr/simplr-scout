import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Target,
  Rocket,
  RefreshCw,
  CheckCircle,
  Calendar
} from 'lucide-react';
import ConsultationModal from './ConsultationModal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function Recommendations({ recommendations, onStartOver }) {
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const { summary, quickWins, strategic, longTerm, nextStep } = recommendations;

  const sections = [
    {
      title: 'Quick Wins',
      subtitle: 'Implement these now for immediate impact',
      icon: <Zap className="w-6 h-6" />,
      items: quickWins,
      color: 'green'
    },
    {
      title: 'Strategic Moves',
      subtitle: 'Medium-term initiatives for sustainable growth',
      icon: <Target className="w-6 h-6" />,
      items: strategic,
      color: 'blue'
    },
    {
      title: 'Long-term Vision',
      subtitle: 'Build towards these transformative goals',
      icon: <Rocket className="w-6 h-6" />,
      items: longTerm,
      color: 'purple'
    }
  ];

  const colorClasses = {
    green: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      icon: 'text-green-400',
      bullet: 'bg-green-500'
    },
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      icon: 'text-blue-400',
      bullet: 'bg-blue-500'
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      icon: 'text-purple-400',
      bullet: 'bg-purple-500'
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Summary */}
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-bold text-white mb-4"
          >
            Your Personalized Recommendations
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1 } }}
            className="text-lg text-slate-300 max-w-2xl mx-auto"
          >
            {summary}
          </motion.p>
        </div>

        {/* Next Step Highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
          className="mb-10 p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-2xl border border-indigo-500/30"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Your #1 Next Step
              </h3>
              <p className="text-indigo-200">
                {nextStep}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recommendation Sections */}
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`p-6 rounded-2xl border ${colorClasses[section.color].bg} ${colorClasses[section.color].border}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={colorClasses[section.color].icon}>
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {section.title}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {section.subtitle}
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${colorClasses[section.color].bullet}`} />
                    <span className="text-slate-200">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.5 } }}
          className="mt-10 p-8 bg-slate-700/50 rounded-2xl text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-3">
            Ready to Take Action?
          </h3>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto">
            Get personalized guidance on implementing these recommendations.
            Book a free consultation to discuss your specific situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowConsultationModal(true)}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all hover:scale-105"
            >
              <Calendar className="w-5 h-5" />
              Book Free Consultation
            </button>
            <button
              onClick={onStartOver}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-xl transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Analyze Another Problem
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>
            Powered by AI analysis. Results are recommendations only.
          </p>
        </div>
      </motion.div>

      {/* Consultation Modal */}
      <AnimatePresence>
        {showConsultationModal && (
          <ConsultationModal
            isOpen={showConsultationModal}
            onClose={() => setShowConsultationModal(false)}
            problemSummary={summary}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Recommendations;

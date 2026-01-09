import { motion } from 'framer-motion';
import { Sparkles, Target, Lightbulb, ArrowRight, CheckCircle } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function LandingPage({ onStartAnalysis }) {
  const steps = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Describe Your Problem",
      description: "Tell us about the business challenge you're facing in your own words."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Answer Quick Questions",
      description: "Our AI asks targeted follow-up questions to understand your context."
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Get Recommendations",
      description: "Receive actionable solutions tailored to your specific situation."
    }
  ];

  const benefits = [
    "Free AI-powered analysis",
    "Actionable recommendations in minutes",
    "No generic advice - solutions for YOUR problem",
    "Clear next steps to move forward"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-indigo-400" />
            <span className="text-2xl font-bold text-white">Simplr Scout</span>
          </div>
          <a
            href="https://buildsimplr.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-white transition-colors"
          >
            by BuildSimplr
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        className="px-6 py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={itemVariants} className="mb-4">
            <span className="inline-block px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium">
              AI-Powered Business Problem Solver
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Turn Business Challenges into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Actionable Solutions
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto"
          >
            Stuck on a business problem? Our AI consultant helps you scope your challenge
            and delivers tailored recommendations in minutes - not days.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStartAnalysis}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-indigo-500/25"
            >
              Start Free Analysis
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Benefits */}
          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-wrap justify-center gap-4"
          >
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>{benefit}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works */}
      <section className="px-6 py-20 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Get from problem to solution in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative p-8 bg-slate-700/50 rounded-2xl border border-slate-600/50 hover:border-indigo-500/50 transition-colors"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="text-indigo-400 mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-300">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="p-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Solve Your Business Problem?
            </h2>
            <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
              Stop spinning your wheels. Get clear, actionable recommendations
              powered by AI analysis in just a few minutes.
            </p>
            <button
              onClick={onStartAnalysis}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-100 text-indigo-600 font-semibold rounded-xl transition-all hover:scale-105"
            >
              Start Your Free Analysis
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-slate-700">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            <span className="text-lg font-semibold text-white">Simplr Scout</span>
          </div>
          <p className="text-slate-400 text-sm">
            Part of the <a href="https://buildsimplr.github.io" className="text-indigo-400 hover:text-indigo-300">BuildSimplr</a> portfolio
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

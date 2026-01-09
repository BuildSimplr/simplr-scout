import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

function StepIndicator({ currentStep, totalSteps = 3 }) {
  const steps = [
    { label: 'Describe Problem' },
    { label: 'Answer Questions' },
    { label: 'Get Solutions' }
  ];

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isActive
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-700 text-slate-400'
                }`}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stepNum}
              </motion.div>
              <span
                className={`text-xs mt-2 hidden sm:block ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 sm:w-20 h-1 mx-2 rounded ${
                  stepNum < currentStep ? 'bg-green-500' : 'bg-slate-700'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StepIndicator;

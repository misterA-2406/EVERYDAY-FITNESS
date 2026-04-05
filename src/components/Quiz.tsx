import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Target, ArrowRight, CheckCircle2 } from 'lucide-react';

const questions = [
  {
    id: 'goal',
    title: 'What is your primary fitness goal?',
    options: ['Lose Weight', 'Build Muscle', 'Improve Endurance', 'General Health']
  },
  {
    id: 'experience',
    title: 'What is your current experience level?',
    options: ['Beginner', 'Intermediate', 'Advanced', 'Athlete']
  },
  {
    id: 'commitment',
    title: 'How many days a week can you commit?',
    options: ['1-2 Days', '3-4 Days', '5-6 Days', 'Everyday']
  }
];

export const Quiz = () => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleSelect = async (option: string) => {
    const currentQ = questions[step];
    const newAnswers = { ...answers, [currentQ.id]: option };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Finish
      setLoading(true);
      if (currentUser) {
        try {
          await addDoc(collection(db, `users/${currentUser.uid}/onboarding`), {
            ...newAnswers,
            completedAt: serverTimestamp()
          });
        } catch (error) {
          console.error("Error saving quiz:", error);
        }
      }
      setLoading(false);
      setCompleted(true);
    }
  };

  return (
    <section className="py-24 bg-oled-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-electric-lime/10 mb-6">
          <Target className="w-8 h-8 text-electric-lime" />
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold uppercase mb-4">Find Your <span className="text-electric-lime">Path</span></h2>
        <p className="text-gray-400 text-lg mb-12">Take our 3-step quiz to get a personalized training recommendation.</p>

        <div className="bg-dark-gray border border-light-gray rounded-3xl p-8 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!completed ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="text-electric-lime text-sm font-bold tracking-widest mb-4">
                  STEP {step + 1} OF {questions.length}
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold mb-8">{questions[step].title}</h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {questions[step].options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(option)}
                      className="p-4 rounded-xl border border-light-gray bg-oled-black hover:border-electric-lime hover:bg-electric-lime/5 transition-all text-left font-medium group flex justify-between items-center"
                    >
                      {option}
                      <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-electric-lime transition-colors" />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-electric-lime/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-electric-lime" />
                </div>
                <h3 className="text-3xl font-display font-bold mb-4">Profile Generated</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Based on your goals ({answers.goal}) and experience ({answers.experience}), we recommend the <strong>ELITE</strong> tier.
                </p>
                {!currentUser ? (
                  <p className="text-electric-lime text-sm">Log in to save your profile and get your custom plan.</p>
                ) : (
                  <p className="text-electric-lime text-sm">Your profile has been saved to your dashboard.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

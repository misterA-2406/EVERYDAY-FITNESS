import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Calculator } from 'lucide-react';

export const BMI = () => {
  const { currentUser } = useAuth();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateBMI = async (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // convert cm to m
    
    if (w > 0 && h > 0) {
      const bmi = parseFloat((w / (h * h)).toFixed(1));
      setResult(bmi);

      if (currentUser) {
        setLoading(true);
        try {
          await addDoc(collection(db, `users/${currentUser.uid}/metrics`), {
            bmi,
            weight: w,
            height: h * 100,
            createdAt: serverTimestamp()
          });
        } catch (error) {
          console.error("Error saving BMI:", error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const getStatus = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-blue-400' };
    if (bmi < 25) return { text: 'Normal', color: 'text-green-400' };
    if (bmi < 30) return { text: 'Overweight', color: 'text-yellow-400' };
    return { text: 'Obese', color: 'text-red-400' };
  };

  return (
    <section className="py-24 bg-dark-gray border-y border-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-electric-lime/10 mb-6">
              <Calculator className="w-8 h-8 text-electric-lime" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold uppercase mb-6">Calculate Your <span className="text-electric-lime">BMI</span></h2>
            <p className="text-gray-400 text-lg mb-8">
              Body Mass Index (BMI) is a simple calculation using a person's height and weight. The formula is BMI = kg/m².
              Log in to save your history and track your progress over time.
            </p>
            {!currentUser && (
              <p className="text-sm text-electric-lime border border-electric-lime/20 bg-electric-lime/5 p-4 rounded-xl inline-block">
                Log in to automatically save your metrics to your dashboard.
              </p>
            )}
          </div>

          <div className="bg-oled-black border border-light-gray rounded-3xl p-8">
            <form onSubmit={calculateBMI} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Weight (kg)</label>
                  <input 
                    type="number" 
                    required
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    className="w-full bg-dark-gray border border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-electric-lime transition-colors text-xl"
                    placeholder="75"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Height (cm)</label>
                  <input 
                    type="number" 
                    required
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                    className="w-full bg-dark-gray border border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-electric-lime transition-colors text-xl"
                    placeholder="180"
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-electric-lime text-oled-black font-bold py-4 rounded-xl hover:bg-white transition-colors"
              >
                {loading ? 'SAVING...' : 'CALCULATE'}
              </button>
            </form>

            {result && (
              <div className="mt-8 p-6 bg-dark-gray rounded-2xl border border-light-gray text-center">
                <div className="text-sm text-gray-400 mb-1">YOUR BMI IS</div>
                <div className="text-5xl font-display font-bold mb-2">{result}</div>
                <div className={`text-lg font-medium ${getStatus(result).color}`}>
                  {getStatus(result).text}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

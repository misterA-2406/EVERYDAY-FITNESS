import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export const LeadModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', interest: 'Free Trial' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'leads'), {
        ...formData,
        status: 'new',
        uid: currentUser ? currentUser.uid : null,
        createdAt: serverTimestamp()
      });
      setStep(2);
    } catch (error) {
      console.error("Error saving lead:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-oled-black/90 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-dark-gray border border-light-gray rounded-3xl p-8 overflow-hidden shadow-2xl shadow-electric-lime/10"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>

            {step === 1 ? (
              <>
                <h2 className="text-3xl font-display font-bold mb-2">Claim Your <span className="text-electric-lime">Free Trial</span></h2>
                <p className="text-gray-400 mb-8">Experience the elite difference. No commitment required.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-oled-black border border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-electric-lime transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-oled-black border border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-electric-lime transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number (Optional)</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-oled-black border border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-electric-lime transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  
                  <button 
                    disabled={loading}
                    type="submit" 
                    className="w-full bg-electric-lime text-oled-black font-bold text-lg py-4 rounded-xl mt-4 hover:bg-white transition-colors disabled:opacity-50"
                  >
                    {loading ? 'PROCESSING...' : 'GET MY PASS'}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-electric-lime/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-electric-lime" />
                </div>
                <h2 className="text-3xl font-display font-bold mb-4">You're In!</h2>
                <p className="text-gray-400 mb-8">We've received your details. One of our coaches will reach out shortly to schedule your first session.</p>
                <button 
                  onClick={onClose}
                  className="w-full bg-light-gray text-white font-bold py-4 rounded-xl hover:bg-dark-gray transition-colors"
                >
                  CLOSE
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

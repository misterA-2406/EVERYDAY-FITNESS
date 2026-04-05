import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { X, Activity, Target, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export const Dashboard = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { currentUser } = useAuth();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [onboarding, setOnboarding] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && currentUser) {
      const fetchData = async () => {
        setLoading(true);
        try {
          // Fetch metrics
          const qMetrics = query(collection(db, `users/${currentUser.uid}/metrics`), orderBy('createdAt', 'desc'), limit(5));
          const snapMetrics = await getDocs(qMetrics);
          setMetrics(snapMetrics.docs.map(d => ({ id: d.id, ...d.data() })));

          // Fetch onboarding
          const qOnboarding = query(collection(db, `users/${currentUser.uid}/onboarding`), orderBy('completedAt', 'desc'), limit(1));
          const snapOnboarding = await getDocs(qOnboarding);
          if (!snapOnboarding.empty) {
            setOnboarding(snapOnboarding.docs[0].data());
          }
        } catch (error) {
          console.error("Error fetching dashboard data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, currentUser]);

  if (!currentUser) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-oled-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-dark-gray h-full overflow-y-auto border-l border-light-gray shadow-2xl"
          >
            <div className="sticky top-0 bg-dark-gray/90 backdrop-blur-md p-6 border-b border-light-gray flex items-center justify-between z-10">
              <h2 className="text-2xl font-display font-bold">Dashboard</h2>
              <button onClick={onClose} className="p-2 hover:bg-light-gray rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Profile Summary */}
              <div className="flex items-center gap-4">
                <img src={currentUser.photoURL || ''} alt="Profile" className="w-16 h-16 rounded-full border-2 border-electric-lime" />
                <div>
                  <h3 className="text-xl font-bold">{currentUser.displayName}</h3>
                  <p className="text-gray-400 text-sm">{currentUser.email}</p>
                </div>
              </div>

              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-32 bg-light-gray rounded-2xl"></div>
                  <div className="h-48 bg-light-gray rounded-2xl"></div>
                </div>
              ) : (
                <>
                  {/* Goal Summary */}
                  {onboarding ? (
                    <div className="bg-oled-black border border-light-gray rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <Target className="w-5 h-5 text-electric-lime" />
                        <h4 className="font-bold uppercase tracking-wide">Your Profile</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between border-b border-light-gray pb-2">
                          <span className="text-gray-400">Goal</span>
                          <span className="font-medium">{onboarding.goal}</span>
                        </div>
                        <div className="flex justify-between border-b border-light-gray pb-2">
                          <span className="text-gray-400">Level</span>
                          <span className="font-medium">{onboarding.experience}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Commitment</span>
                          <span className="font-medium">{onboarding.commitment}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-oled-black border border-light-gray rounded-2xl p-5 text-center">
                      <p className="text-gray-400 text-sm mb-3">You haven't taken the fitness quiz yet.</p>
                      <button onClick={onClose} className="text-electric-lime text-sm font-bold hover:underline">TAKE QUIZ</button>
                    </div>
                  )}

                  {/* BMI History */}
                  <div className="bg-oled-black border border-light-gray rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Activity className="w-5 h-5 text-electric-lime" />
                      <h4 className="font-bold uppercase tracking-wide">BMI History</h4>
                    </div>
                    
                    {metrics.length > 0 ? (
                      <div className="space-y-4">
                        {metrics.map((m, i) => (
                          <div key={m.id} className="flex items-center justify-between p-3 bg-dark-gray rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-light-gray flex items-center justify-center font-bold text-electric-lime">
                                {m.bmi}
                              </div>
                              <div>
                                <div className="text-sm font-medium">{m.weight}kg / {m.height}cm</div>
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {m.createdAt ? format(m.createdAt.toDate(), 'MMM d, yyyy') : 'Just now'}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-400 text-sm mb-3">No metrics recorded yet.</p>
                        <button onClick={onClose} className="text-electric-lime text-sm font-bold hover:underline">CALCULATE BMI</button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

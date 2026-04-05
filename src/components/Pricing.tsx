import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, Tag } from 'lucide-react';
import { doc, onSnapshot, collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

const defaultPlans = [
  {
    name: "BASE",
    price: "1,999",
    features: [
      "Full gym access",
      "Locker room access",
      "1 Group class/month",
      "App access"
    ],
    popular: false
  },
  {
    name: "ELITE",
    price: "2,999",
    features: [
      "Unlimited gym access",
      "Unlimited group classes",
      "1 PT session/month",
      "Nutrition guide",
      "Guest pass"
    ],
    popular: true
  },
  {
    name: "PRO",
    price: "4,999",
    features: [
      "Everything in Elite",
      "4 PT sessions/month",
      "Custom meal plan",
      "Recovery zone access",
      "Priority booking"
    ],
    popular: false
  }
];

export const Pricing = ({ onSelectPlan }: { onSelectPlan: (plan: string) => void }) => {
  const [plans, setPlans] = useState(defaultPlans);
  const [activeOffers, setActiveOffers] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'content', 'site'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().pricing) {
        setPlans(docSnap.data().pricing);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const q = query(collection(db, 'offers'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const liveOffers = snap.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as any))
            .filter(offer => offer.status === 'live' && new Date(offer.expiryDate) > new Date());
          setActiveOffers(liveOffers);
        }
      } catch (error) {
        console.error("Error fetching offers", error);
      }
    };
    fetchOffers();
  }, []);

  const getOfferForPlan = (planName: string) => {
    return activeOffers.find(offer => 
      offer.targetPlan === 'All' || offer.targetPlan.toLowerCase() === planName.toLowerCase()
    );
  };

  return (
    <section className="py-24 bg-oled-black" id="plans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold uppercase mb-6">
            Choose Your <span className="text-electric-lime">Arsenal</span>
          </h2>
          <p className="text-gray-400 text-lg">
            No hidden fees. No long-term contracts. Just results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const offer = getOfferForPlan(plan.name);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-3xl border ${
                  plan.popular 
                    ? 'border-electric-lime bg-dark-gray' 
                    : 'border-light-gray bg-oled-black'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-electric-lime text-oled-black px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold uppercase mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-display font-bold">₹{plan.price}</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  {offer && (
                    <div className="mt-3 inline-flex items-center gap-1.5 bg-electric-lime/10 text-electric-lime px-3 py-1 rounded-full text-sm font-bold">
                      <Tag className="w-4 h-4" />
                      {offer.discountText}
                    </div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-electric-lime shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => onSelectPlan(plan.name)}
                  className={`w-full py-4 rounded-full font-bold uppercase tracking-wider transition-colors ${
                    plan.popular
                      ? 'bg-electric-lime text-oled-black hover:bg-white'
                      : 'bg-dark-gray text-white border border-light-gray hover:border-electric-lime hover:text-electric-lime'
                  }`}
                >
                  Select Plan
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

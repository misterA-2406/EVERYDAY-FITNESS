import React, { useState, useEffect } from 'react';
import { Timer, Tag } from 'lucide-react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const OffersEvents = () => {
  const [activeOffer, setActiveOffer] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const fetchActiveOffer = async () => {
      try {
        const q = query(collection(db, 'offers'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        
        if (!snap.empty) {
          const liveOffers = snap.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as any))
            .filter(offer => offer.status === 'live');

          if (liveOffers.length > 0) {
            const offer = liveOffers[0];
            // Check if expired
            const expiryDate = new Date(offer.expiryDate);
            if (expiryDate > new Date()) {
              setActiveOffer(offer);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching offers", error);
      }
    };

    fetchActiveOffer();
  }, []);

  useEffect(() => {
    if (!activeOffer) return;

    const expiryDate = new Date(activeOffer.expiryDate).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = expiryDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setActiveOffer(null); // Hide offer when expired
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeOffer]);

  if (!activeOffer) return null;

  return (
    <section className="py-12 bg-electric-lime text-oled-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-oled-black flex items-center justify-center shrink-0">
              <Tag className="w-6 h-6 text-electric-lime" />
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold uppercase mb-1">{activeOffer.title}</h3>
              <p className="font-medium opacity-80">{activeOffer.discountText} on {activeOffer.targetPlan === 'All' ? 'All Plans' : `${activeOffer.targetPlan} Plan`}</p>
            </div>
          </div>

          <div className="flex flex-col md:items-end">
            <div className="flex items-center gap-2 mb-2 font-bold uppercase tracking-wide">
              <Timer className="w-5 h-5" /> Offer Ends In:
            </div>
            <div className="flex gap-4 text-center">
              <div className="bg-oled-black text-white rounded-xl p-3 min-w-[70px]">
                <div className="text-2xl font-display font-bold">{timeLeft.days}</div>
                <div className="text-xs text-gray-400 uppercase">Days</div>
              </div>
              <div className="bg-oled-black text-white rounded-xl p-3 min-w-[70px]">
                <div className="text-2xl font-display font-bold">{timeLeft.hours}</div>
                <div className="text-xs text-gray-400 uppercase">Hours</div>
              </div>
              <div className="bg-oled-black text-white rounded-xl p-3 min-w-[70px]">
                <div className="text-2xl font-display font-bold">{timeLeft.mins}</div>
                <div className="text-xs text-gray-400 uppercase">Mins</div>
              </div>
              <div className="bg-oled-black text-white rounded-xl p-3 min-w-[70px]">
                <div className="text-2xl font-display font-bold">{timeLeft.secs}</div>
                <div className="text-xs text-gray-400 uppercase">Secs</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

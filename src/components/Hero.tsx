import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const Hero = ({ onOpenLead }: { onOpenLead: () => void }) => {
  const [content, setContent] = useState({
    heroTitle: 'Redefine',
    heroSubtitle: 'Your Limits'
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'content', 'site'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setContent({
          heroTitle: data.heroTitle || 'Redefine',
          heroSubtitle: data.heroSubtitle || 'Your Limits'
        });
      }
    });
    return () => unsub();
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background Fallback (using an image for now, but styled as video container) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-oled-black via-oled-black/80 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" 
          alt="Gym Background" 
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-electric-lime/30 bg-electric-lime/10 text-electric-lime text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-electric-lime animate-pulse" />
            ACCEPTING NEW MEMBERS FOR 2026
          </div>
          
          <h1 className="text-6xl sm:text-8xl font-display font-bold uppercase leading-[0.9] tracking-tighter mb-6">
            {content.heroTitle} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-lime to-white">{content.heroSubtitle}</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-xl font-light">
            Join the most elite training facility. State-of-the-art equipment, world-class coaching, and a community built on results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onOpenLead}
              className="group flex items-center justify-center gap-2 bg-electric-lime text-oled-black px-8 py-4 rounded-full font-bold text-lg hover:bg-white transition-all duration-300"
            >
              START FREE TRIAL
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-lg border border-light-gray hover:border-electric-lime hover:text-electric-lime transition-all duration-300 bg-dark-gray/50 backdrop-blur-sm">
              <Play className="w-5 h-5 fill-current" />
              WATCH FACILITY TOUR
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

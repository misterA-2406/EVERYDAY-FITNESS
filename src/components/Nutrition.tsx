import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Download, Apple } from 'lucide-react';

export const Nutrition = () => {
  const { currentUser } = useAuth();

  return (
    <section className="py-24 bg-oled-black border-y border-light-gray relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-electric-lime/10 mb-6">
              <Apple className="w-8 h-8 text-electric-lime" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold uppercase mb-6">Premium <span className="text-electric-lime">Nutrition</span></h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Training is only half the battle. Get access to our exclusive meal plans, macro calculators, and recipe guides designed by certified sports nutritionists.
            </p>

            {currentUser ? (
              <div className="space-y-4">
                <div className="bg-dark-gray border border-light-gray p-4 rounded-2xl flex items-center justify-between hover:border-electric-lime transition-colors cursor-pointer">
                  <div>
                    <h4 className="font-bold">Fat Loss Meal Plan</h4>
                    <p className="text-sm text-gray-400">PDF Guide & Recipes</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-electric-lime/10 flex items-center justify-center text-electric-lime">
                    <Download className="w-5 h-5" />
                  </div>
                </div>
                <div className="bg-dark-gray border border-light-gray p-4 rounded-2xl flex items-center justify-between hover:border-electric-lime transition-colors cursor-pointer">
                  <div>
                    <h4 className="font-bold">Muscle Gain Protocol</h4>
                    <p className="text-sm text-gray-400">Macro Calculator & Guide</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-electric-lime/10 flex items-center justify-center text-electric-lime">
                    <Download className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-dark-gray/50 border border-light-gray p-8 rounded-3xl text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-oled-black/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                  <Lock className="w-8 h-8 text-electric-lime mb-3" />
                  <p className="font-bold">Members Only Content</p>
                  <p className="text-sm text-gray-400 mt-1">Log in to access nutrition guides</p>
                </div>
                {/* Blurred background content */}
                <div className="opacity-30 pointer-events-none">
                  <div className="h-16 bg-light-gray rounded-xl mb-4"></div>
                  <div className="h-16 bg-light-gray rounded-xl"></div>
                </div>
              </div>
            )}
          </div>

          <div className="relative rounded-3xl overflow-hidden aspect-square lg:aspect-auto lg:h-[600px]">
            <img 
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop" 
              alt="Nutrition" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

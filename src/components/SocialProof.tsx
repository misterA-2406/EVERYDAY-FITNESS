import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const defaultTestimonials = [
  {
    name: "Sarah J.",
    role: "Elite Member",
    text: "The best facility I've ever trained at. The equipment is top-notch and the community pushes you to be better.",
    rating: 5,
    beforeImage: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop"
  }
];

export const SocialProof = () => {
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'testimonials'), (snap) => {
      if (!snap.empty) {
        setTestimonials(snap.docs.map(d => d.data() as any));
      }
    });
    return () => unsub();
  }, []);

  const next = () => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const current = testimonials[currentTestimonial] || defaultTestimonials[0];

  return (
    <section className="py-24 bg-dark-gray border-y border-light-gray overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Testimonial Carousel */}
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold uppercase mb-12">
              Don't Just Take <br />
              <span className="text-electric-lime">Our Word For It</span>
            </h2>

            <div className="relative bg-oled-black p-8 md:p-12 rounded-3xl border border-light-gray">
              <div className="flex gap-1 mb-6">
                {[...Array(current.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-electric-lime text-electric-lime" />
                ))}
              </div>
              
              <p className="text-xl md:text-2xl font-light leading-relaxed mb-8 min-h-[120px]">
                "{current.text}"
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-lg">{current.name}</h4>
                  <p className="text-electric-lime text-sm">{current.role}</p>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={prev}
                    className="p-3 rounded-full border border-light-gray hover:border-electric-lime hover:text-electric-lime transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={next}
                    className="p-3 rounded-full border border-light-gray hover:border-electric-lime hover:text-electric-lime transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Transformation Images */}
          <div className="relative">
            <div className="absolute inset-0 bg-electric-lime/20 blur-[100px] rounded-full" />
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="relative rounded-3xl overflow-hidden border border-light-gray aspect-[4/5]">
                  <div className="absolute top-4 left-4 bg-oled-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                    BEFORE
                  </div>
                  <img 
                    src={current.beforeImage || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop"} 
                    alt="Before Transformation" 
                    className="w-full h-full object-cover grayscale opacity-50"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative rounded-3xl overflow-hidden border-2 border-electric-lime aspect-[4/5]">
                  <div className="absolute top-4 left-4 bg-electric-lime text-oled-black px-3 py-1 rounded-full text-xs font-bold z-10">
                    AFTER
                  </div>
                  <img 
                    src={current.afterImage || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop"} 
                    alt="After Transformation" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

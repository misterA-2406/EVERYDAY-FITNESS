import React from 'react';
import { Dumbbell, HeartPulse, Zap, Flame } from 'lucide-react';

const programs = [
  {
    icon: <Dumbbell className="w-8 h-8" />,
    title: "Strength Training",
    desc: "Build muscle and increase power with our comprehensive weightlifting programs."
  },
  {
    icon: <HeartPulse className="w-8 h-8" />,
    title: "Cardio & Endurance",
    desc: "Boost your stamina and heart health with high-intensity cardio sessions."
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "HIIT",
    desc: "Burn maximum calories in minimum time with High-Intensity Interval Training."
  },
  {
    icon: <Flame className="w-8 h-8" />,
    title: "Yoga & Mobility",
    desc: "Improve flexibility, balance, and core strength with guided yoga classes."
  }
];

export const Programs = () => {
  return (
    <section id="programs" className="py-24 bg-dark-gray border-y border-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold uppercase mb-4">Our <span className="text-electric-lime">Programs</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Designed for all fitness levels. Find the perfect program to reach your goals.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((prog, i) => (
            <div key={i} className="bg-oled-black border border-light-gray p-8 rounded-3xl hover:border-electric-lime transition-colors group">
              <div className="w-16 h-16 rounded-2xl bg-dark-gray flex items-center justify-center text-electric-lime mb-6 group-hover:scale-110 transition-transform">
                {prog.icon}
              </div>
              <h3 className="text-xl font-display font-bold mb-3">{prog.title}</h3>
              <p className="text-gray-400 leading-relaxed">{prog.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

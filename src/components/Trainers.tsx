import React from 'react';
import { Instagram, Twitter } from 'lucide-react';

const trainers = [
  {
    name: "Vikram Singh",
    specialty: "Strength & Conditioning",
    image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=1974&auto=format&fit=crop"
  },
  {
    name: "Priya Sharma",
    specialty: "Yoga & Mobility",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Rahul Verma",
    specialty: "HIIT & Cardio",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
  }
];

export const Trainers = () => {
  return (
    <section id="trainers" className="py-24 bg-oled-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold uppercase mb-4">Meet Our <span className="text-electric-lime">Experts</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Learn from the best. Our certified trainers are here to guide your journey.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {trainers.map((trainer, i) => (
            <div key={i} className="group relative rounded-3xl overflow-hidden aspect-[3/4] bg-dark-gray">
              <img 
                src={trainer.image} 
                alt={trainer.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-oled-black via-oled-black/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-display font-bold mb-1">{trainer.name}</h3>
                <p className="text-electric-lime font-medium mb-4">{trainer.specialty}</p>
                <div className="flex gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-electric-lime hover:text-oled-black transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-electric-lime hover:text-oled-black transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

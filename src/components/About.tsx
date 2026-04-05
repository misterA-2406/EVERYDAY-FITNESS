import React from 'react';

export const About = () => {
  return (
    <section id="about" className="py-24 bg-dark-gray border-b border-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-3xl overflow-hidden aspect-square">
            <img 
              src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" 
              alt="About Everyday Fitness" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-oled-black to-transparent opacity-60"></div>
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold uppercase mb-6">About <span className="text-electric-lime">Everyday Fitness</span></h2>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              Founded in Mumbai, EVERYDAY FITNESS is India's premier destination for those who demand more from their workouts. We believe fitness is not a destination, but a daily commitment.
            </p>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Our state-of-the-art facility combines cutting-edge equipment, world-class coaching, and a community of driven individuals. Whether you're a beginner or a seasoned athlete, we provide the environment you need to succeed.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-4xl font-display font-bold text-electric-lime mb-2">10k+</div>
                <div className="text-gray-400 font-medium uppercase tracking-wide">Active Members</div>
              </div>
              <div>
                <div className="text-4xl font-display font-bold text-electric-lime mb-2">50+</div>
                <div className="text-gray-400 font-medium uppercase tracking-wide">Expert Trainers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

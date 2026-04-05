import React from 'react';

const images = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=2071&auto=format&fit=crop"
];

export const Gallery = () => {
  return (
    <section className="py-24 bg-oled-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold uppercase mb-4">Facility <span className="text-electric-lime">Gallery</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Take a look inside our world-class training environment.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src, i) => (
            <div key={i} className={`relative rounded-2xl overflow-hidden bg-dark-gray ${i === 0 || i === 3 ? 'md:col-span-2 md:row-span-2' : ''} aspect-square md:aspect-auto`}>
              <img 
                src={src} 
                alt={`Gallery image ${i + 1}`} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

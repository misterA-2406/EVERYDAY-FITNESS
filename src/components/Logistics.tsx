import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Mail, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const faqs = [
  {
    question: "Do you offer personal training?",
    answer: "Yes, we have a team of elite certified personal trainers. You can book 1-on-1 sessions or join small group training."
  },
  {
    question: "Is there a joining fee?",
    answer: "No, we believe in transparent pricing. You only pay your monthly membership fee."
  },
  {
    question: "Can I freeze my membership?",
    answer: "Yes, Elite and Pro members can freeze their membership for up to 2 months per year for travel or medical reasons."
  },
  {
    question: "Do you have locker rooms and showers?",
    answer: "Yes, we have premium locker rooms with digital locks, rainfall showers, and complimentary towel service."
  }
];

export const Logistics = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [hours, setHours] = useState([
    { day: 'Mon-Fri', time: '6:00 AM - 10:00 PM' },
    { day: 'Sat-Sun', time: '8:00 AM - 8:00 PM' }
  ]);
  const isOpen = true; // Could be calculated dynamically based on current time and `hours`

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'content', 'site'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().hours) {
        setHours(docSnap.data().hours);
      }
    });
    return () => unsub();
  }, []);

  return (
    <section className="py-24 bg-oled-black border-t border-light-gray" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Column: Info & Map */}
          <div>
            <h2 className="text-4xl font-display font-bold uppercase mb-8">
              Find <span className="text-electric-lime">Us</span>
            </h2>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="bg-dark-gray p-3 rounded-xl text-electric-lime">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Location</h3>
                  <p className="text-gray-400">123 Fitness Boulevard<br />Andheri West, Mumbai, Maharashtra 400053<br />India</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-dark-gray p-3 rounded-xl text-electric-lime">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-lg">Staffed Hours</h3>
                    {isOpen ? (
                      <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded-full border border-green-500/30">OPEN NOW</span>
                    ) : (
                      <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded-full border border-red-500/30">CLOSED</span>
                    )}
                  </div>
                  {hours.map((h, i) => (
                    <p key={i} className="text-gray-400">{h.day}: {h.time}</p>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-dark-gray p-3 rounded-xl text-electric-lime">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Contact</h3>
                  <p className="text-gray-400">hello@everydayfitness.in<br />+91 98765 43210</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-64 bg-dark-gray rounded-3xl border border-light-gray overflow-hidden relative group">
              <div className="absolute inset-0 bg-oled-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-electric-lime text-oled-black px-6 py-2 rounded-full font-bold">Get Directions</button>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" 
                alt="Map Location" 
                className="w-full h-full object-cover opacity-50 grayscale"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right Column: Contact Form & FAQ */}
          <div>
            <div className="bg-dark-gray p-8 rounded-3xl border border-light-gray mb-12">
              <h3 className="text-2xl font-bold uppercase mb-6">Send a Message</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Name" className="bg-oled-black border border-light-gray rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-lime transition-colors" />
                  <input type="email" placeholder="Email" className="bg-oled-black border border-light-gray rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-lime transition-colors" />
                </div>
                <textarea rows={4} placeholder="How can we help you?" className="w-full bg-oled-black border border-light-gray rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-lime transition-colors"></textarea>
                <button className="w-full bg-electric-lime text-oled-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors">
                  <Send className="w-5 h-5" />
                  SEND MESSAGE
                </button>
              </form>
            </div>

            <h3 className="text-2xl font-bold uppercase mb-6">FAQ</h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="border border-light-gray rounded-2xl overflow-hidden bg-dark-gray transition-all duration-300"
                >
                  <button
                    className="w-full px-6 py-4 flex items-center justify-between font-bold text-left"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    {faq.question}
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-electric-lime shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />
                    )}
                  </button>
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaq === index ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

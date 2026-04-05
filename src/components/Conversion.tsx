import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

export const Conversion = ({ onOpenLead }: { onOpenLead: () => void }) => {
  return (
    <>
      {/* Sticky Floating Buttons (Desktop & Tablet) */}
      <div className="fixed bottom-8 right-8 z-40 hidden md:flex flex-col gap-4">
        <a 
          href="https://wa.me/919876543210" 
          target="_blank" 
          rel="noreferrer"
          className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </a>
        <a 
          href="tel:+919876543210" 
          className="w-14 h-14 bg-light-gray border border-gray-700 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <Phone className="w-6 h-6 text-white" />
        </a>
      </div>

      {/* Bottom-docked Mobile CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-oled-black/90 backdrop-blur-md border-t border-light-gray p-4 flex gap-3">
        <button 
          onClick={onOpenLead}
          className="flex-1 bg-electric-lime text-oled-black font-bold py-3 rounded-xl text-sm"
        >
          START FREE TRIAL
        </button>
        <a 
          href="https://wa.me/919876543210" 
          className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center shrink-0"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </a>
      </div>
    </>
  );
};

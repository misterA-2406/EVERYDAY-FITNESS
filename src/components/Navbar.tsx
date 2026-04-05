import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle, logOut } from '../lib/firebase';
import { Dumbbell, User as UserIcon, LogOut, ShieldAlert } from 'lucide-react';

export const Navbar = ({ onOpenDashboard }: { onOpenDashboard: () => void }) => {
  const { currentUser, isAdmin } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-oled-black/80 backdrop-blur-md border-b border-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <Dumbbell className="w-8 h-8 text-electric-lime" />
            <span className="font-display font-bold text-xl md:text-2xl tracking-tight uppercase">EVERYDAY<span className="text-electric-lime">FITNESS</span></span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-6 font-medium text-sm tracking-wide">
            <a href="/#about" className="hover:text-electric-lime transition-colors">ABOUT</a>
            <a href="/#programs" className="hover:text-electric-lime transition-colors">PROGRAMS</a>
            <a href="/#pricing" className="hover:text-electric-lime transition-colors">PLANS</a>
            <a href="/#trainers" className="hover:text-electric-lime transition-colors">TRAINERS</a>
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link to="/admin" className="hidden sm:flex items-center gap-1 text-electric-lime text-xs font-bold border border-electric-lime/30 px-2 py-1 rounded">
                    <ShieldAlert className="w-3 h-3" /> ADMIN
                  </Link>
                )}
                <button 
                  onClick={onOpenDashboard}
                  className="flex items-center gap-2 hover:text-electric-lime transition-colors"
                >
                  <img src={currentUser.photoURL || ''} alt="Profile" className="w-8 h-8 rounded-full border border-electric-lime" />
                  <span className="hidden sm:inline">{currentUser.displayName?.split(' ')[0]}</span>
                </button>
                <button onClick={logOut} className="p-2 hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="flex items-center gap-2 bg-electric-lime text-oled-black px-4 py-2 md:px-5 md:py-2.5 rounded-full font-bold hover:bg-white transition-colors text-sm md:text-base"
              >
                <UserIcon className="w-4 h-4" />
                LOGIN
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};


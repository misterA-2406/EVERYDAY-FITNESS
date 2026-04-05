/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Conversion } from './components/Conversion';
import { LeadModal } from './components/LeadModal';
import { Dashboard } from './components/Dashboard';

// Lazy load below-the-fold components for Speed Optimization
const OffersEvents = lazy(() => import('./components/OffersEvents').then(m => ({ default: m.OffersEvents })));
const About = lazy(() => import('./components/About').then(m => ({ default: m.About })));
const Programs = lazy(() => import('./components/Programs').then(m => ({ default: m.Programs })));
const Pricing = lazy(() => import('./components/Pricing').then(m => ({ default: m.Pricing })));
const Trainers = lazy(() => import('./components/Trainers').then(m => ({ default: m.Trainers })));
const SocialProof = lazy(() => import('./components/SocialProof').then(m => ({ default: m.SocialProof })));
const Gallery = lazy(() => import('./components/Gallery').then(m => ({ default: m.Gallery })));
const BMI = lazy(() => import('./components/BMI').then(m => ({ default: m.BMI })));
const Quiz = lazy(() => import('./components/Quiz').then(m => ({ default: m.Quiz })));
const Nutrition = lazy(() => import('./components/Nutrition').then(m => ({ default: m.Nutrition })));
const Logistics = lazy(() => import('./components/Logistics').then(m => ({ default: m.Logistics })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center py-24">
    <div className="w-8 h-8 border-4 border-electric-lime border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const HomePage = ({ setIsLeadModalOpen }: { setIsLeadModalOpen: (val: boolean) => void }) => (
  <main>
    <Hero onOpenLead={() => setIsLeadModalOpen(true)} />
    
    <Suspense fallback={<LoadingFallback />}>
      <OffersEvents />
      <About />
      <Programs />
      <Pricing onSelectPlan={() => setIsLeadModalOpen(true)} />
      <Trainers />
      <SocialProof />
      <Gallery />
      <BMI />
      <Nutrition />
      <Quiz />
      <Logistics />
    </Suspense>
  </main>
);

export default function App() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-oled-black text-white selection:bg-electric-lime selection:text-oled-black flex flex-col">
          <Navbar onOpenDashboard={() => setIsDashboardOpen(true)} />
          
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage setIsLeadModalOpen={setIsLeadModalOpen} />} />
              <Route path="/admin" element={
                <Suspense fallback={<LoadingFallback />}>
                  <ProtectedAdminRoute>
                    <AdminPanel />
                  </ProtectedAdminRoute>
                </Suspense>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          <footer className="bg-dark-gray py-12 border-t border-light-gray text-center text-gray-500 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                <div className="font-display font-bold text-xl uppercase text-white">EVERYDAY<span className="text-electric-lime">FITNESS</span></div>
                <div className="flex gap-6">
                  <a href="#" className="hover:text-electric-lime transition-colors">Instagram</a>
                  <a href="#" className="hover:text-electric-lime transition-colors">Facebook</a>
                  <a href="#" className="hover:text-electric-lime transition-colors">Twitter</a>
                  <a href="#" className="hover:text-electric-lime transition-colors">YouTube</a>
                </div>
              </div>
              <p>&copy; 2026 EVERYDAY FITNESS India. All rights reserved.</p>
            </div>
          </footer>

          <Conversion onOpenLead={() => setIsLeadModalOpen(true)} />
          <LeadModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
          <Dashboard isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} />
        </div>
      </Router>
    </AuthProvider>
  );
}


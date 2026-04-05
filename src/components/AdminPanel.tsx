import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc, collection, query, orderBy, getDocs, updateDoc, addDoc, serverTimestamp, limit, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Settings, Users, DollarSign, Clock, MessageSquare, Sparkles, CheckCircle2, Plus, Trash2, Tag, Upload } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [content, setContent] = useState({
    heroTitle: 'Redefine',
    heroSubtitle: 'Your Limits',
    pricing: [
      { name: 'BASE', price: '1999', features: ['Full gym access', 'Locker room access', '1 Group class/month', 'App access'], popular: false },
      { name: 'ELITE', price: '2999', features: ['Unlimited gym access', 'Unlimited group classes', '1 PT session/month', 'Nutrition guide', 'Guest pass'], popular: true },
      { name: 'PRO', price: '4999', features: ['Everything in Elite', '4 PT sessions/month', 'Custom meal plan', 'Recovery zone access', 'Priority booking'], popular: false }
    ],
    hours: [
      { day: 'Mon-Fri', time: '6:00 AM - 10:00 PM' },
      { day: 'Sat-Sun', time: '8:00 AM - 8:00 PM' }
    ]
  });

  const [leads, setLeads] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', role: '', text: '', rating: 5, beforeImage: '', afterImage: '' });
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [newOffer, setNewOffer] = useState({ title: '', discountText: '', targetPlan: 'All', expiryDate: '', status: 'draft' });

  useEffect(() => {
    if (isAdmin) {
      fetchContent();
      fetchLeads();
      fetchOffers();
      fetchTestimonials();
    }
  }, [isAdmin]);

  const fetchContent = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'content', 'site'));
      if (docSnap.exists()) {
        setContent(prev => ({ ...prev, ...docSnap.data() as any }));
      }
    } catch (error) {
      console.error("Error fetching site content", error);
    }
  };

  const fetchLeads = async () => {
    try {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const leadsData = await Promise.all(snap.docs.map(async (d) => {
        const lead = { id: d.id, ...d.data() } as any;
        if (lead.uid) {
          const obSnap = await getDocs(query(collection(db, `users/${lead.uid}/onboarding`), limit(1)));
          if (!obSnap.empty) {
            lead.onboarding = obSnap.docs[0].data();
          }
        }
        return lead;
      }));
      setLeads(leadsData);
    } catch (error) {
      console.error("Error fetching leads", error);
    }
  };

  const fetchOffers = async () => {
    try {
      const q = query(collection(db, 'offers'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setOffers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching offers", error);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setTestimonials(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching testimonials", error);
    }
  };

  const handleSaveContent = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await setDoc(doc(db, 'content', 'site'), {
        ...content,
        updatedAt: serverTimestamp()
      });
      setMessage('Content saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error saving content", error);
      setMessage('Error saving content.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let beforeImageUrl = newTestimonial.beforeImage;
      let afterImageUrl = newTestimonial.afterImage;

      if (beforeFile) {
        const beforeRef = ref(storage, `testimonials/${Date.now()}_before_${beforeFile.name}`);
        await uploadBytes(beforeRef, beforeFile);
        beforeImageUrl = await getDownloadURL(beforeRef);
      }

      if (afterFile) {
        const afterRef = ref(storage, `testimonials/${Date.now()}_after_${afterFile.name}`);
        await uploadBytes(afterRef, afterFile);
        afterImageUrl = await getDownloadURL(afterRef);
      }

      await addDoc(collection(db, 'testimonials'), {
        ...newTestimonial,
        beforeImage: beforeImageUrl,
        afterImage: afterImageUrl,
        createdAt: serverTimestamp()
      });
      setNewTestimonial({ name: '', role: '', text: '', rating: 5, beforeImage: '', afterImage: '' });
      setBeforeFile(null);
      setAfterFile(null);
      setMessage('Testimonial added!');
      fetchTestimonials();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error adding testimonial", error);
      setMessage('Error uploading testimonial.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      fetchTestimonials();
    } catch (error) {
      console.error("Error deleting testimonial", error);
    }
  };

  const markContacted = async (leadId: string) => {
    try {
      await updateDoc(doc(db, 'leads', leadId), { status: 'contacted' });
      fetchLeads();
    } catch (error) {
      console.error("Error updating lead", error);
    }
  };

  const generateInsight = async (lead: any) => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API key is missing");
      
      const ai = new GoogleGenAI({ apiKey: apiKey });
      let prompt = `Analyze this gym lead: Name: ${lead.name}, Interest: ${lead.interest}. `;
      if (lead.onboarding) {
        prompt += `Quiz Data: Goal: ${lead.onboarding.goal}, Experience: ${lead.onboarding.experience}, Commitment: ${lead.onboarding.commitment}. `;
      }
      prompt += `Predict conversion probability (Low/Medium/High) and give a 1-sentence tip for the sales team.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt
      });
      
      await updateDoc(doc(db, 'leads', lead.id), {
        aiInsight: response.text
      });
      fetchLeads();
    } catch (error) {
      console.error("Error generating insight", error);
      alert("Failed to generate AI insight. Check console for details.");
    }
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'offers'), {
        ...newOffer,
        createdAt: serverTimestamp()
      });
      setMessage('Offer created successfully!');
      setNewOffer({ title: '', discountText: '', targetPlan: 'All', expiryDate: '', status: 'draft' });
      fetchOffers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error saving offer", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    try {
      await deleteDoc(doc(db, 'offers', id));
      fetchOffers();
    } catch (error) {
      console.error("Error deleting offer", error);
    }
  };

  const handleToggleOfferStatus = async (id: string, currentStatus: string) => {
    try {
      await updateDoc(doc(db, 'offers', id), {
        status: currentStatus === 'live' ? 'draft' : 'live'
      });
      fetchOffers();
    } catch (error) {
      console.error("Error toggling offer status", error);
    }
  };

  return (
    <div className="py-12 bg-dark-gray min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-display font-bold uppercase mb-4">
            Admin <span className="text-electric-lime">Panel</span>
          </h2>
          <p className="text-gray-400">Manage your website content, leads, and settings.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-2">
            <button onClick={() => setActiveTab('general')} className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-colors ${activeTab === 'general' ? 'bg-electric-lime text-oled-black' : 'bg-oled-black text-white hover:bg-light-gray'}`}>
              <Settings className="w-5 h-5" /> General
            </button>
            <button onClick={() => setActiveTab('crm')} className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-colors ${activeTab === 'crm' ? 'bg-electric-lime text-oled-black' : 'bg-oled-black text-white hover:bg-light-gray'}`}>
              <Users className="w-5 h-5" /> Lead CRM
            </button>
            <button onClick={() => setActiveTab('pricing')} className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-colors ${activeTab === 'pricing' ? 'bg-electric-lime text-oled-black' : 'bg-oled-black text-white hover:bg-light-gray'}`}>
              <DollarSign className="w-5 h-5" /> Pricing
            </button>
            <button onClick={() => setActiveTab('hours')} className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-colors ${activeTab === 'hours' ? 'bg-electric-lime text-oled-black' : 'bg-oled-black text-white hover:bg-light-gray'}`}>
              <Clock className="w-5 h-5" /> Timings
            </button>
            <button onClick={() => setActiveTab('testimonials')} className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-colors ${activeTab === 'testimonials' ? 'bg-electric-lime text-oled-black' : 'bg-oled-black text-white hover:bg-light-gray'}`}>
              <MessageSquare className="w-5 h-5" /> Testimonials
            </button>
            <button onClick={() => setActiveTab('offers')} className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-colors ${activeTab === 'offers' ? 'bg-electric-lime text-oled-black' : 'bg-oled-black text-white hover:bg-light-gray'}`}>
              <Tag className="w-5 h-5" /> Offers & Promos
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-oled-black border border-light-gray rounded-3xl p-6 md:p-8">
            {message && (
              <div className="mb-6 p-4 bg-electric-lime/10 border border-electric-lime text-electric-lime rounded-xl font-bold">
                {message}
              </div>
            )}

            {activeTab === 'general' && (
              <form onSubmit={handleSaveContent} className="space-y-6">
                <h3 className="text-2xl font-bold mb-6">Hero Section</h3>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Hero Title</label>
                  <input
                    type="text"
                    value={content.heroTitle}
                    onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                    className="w-full bg-dark-gray border border-light-gray rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-lime"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Hero Subtitle</label>
                  <input
                    type="text"
                    value={content.heroSubtitle}
                    onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                    className="w-full bg-dark-gray border border-light-gray rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-lime"
                  />
                </div>
                <button type="submit" disabled={loading} className="bg-electric-lime text-oled-black px-8 py-3 rounded-full font-bold hover:bg-white transition-colors">
                  {loading ? 'Saving...' : 'Save Content'}
                </button>
              </form>
            )}

            {activeTab === 'crm' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Lead CRM</h3>
                  <button onClick={fetchLeads} className="text-sm text-electric-lime hover:underline">Refresh</button>
                </div>
                <div className="space-y-4">
                  {leads.length === 0 ? (
                    <p className="text-gray-400">No leads found.</p>
                  ) : leads.map(lead => (
                    <div key={lead.id} className="p-5 border border-light-gray rounded-xl bg-dark-gray">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <div>
                          <h4 className="font-bold text-lg">{lead.name}</h4>
                          <p className="text-sm text-gray-400">{lead.email} • {lead.phone}</p>
                          <p className="text-sm text-electric-lime mt-1 font-medium">Interest: {lead.interest}</p>
                        </div>
                        {lead.status === 'new' ? (
                          <button onClick={() => markContacted(lead.id)} className="flex items-center gap-2 text-sm font-bold bg-white text-oled-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors shrink-0">
                            <CheckCircle2 className="w-4 h-4" /> Mark Contacted
                          </button>
                        ) : (
                          <span className="text-sm font-bold text-green-400 border border-green-400/30 px-4 py-2 rounded-full shrink-0">Contacted</span>
                        )}
                      </div>
                      
                      {lead.onboarding && (
                        <div className="mb-4 p-4 bg-oled-black rounded-xl text-sm border border-light-gray flex flex-wrap gap-4">
                          <div><span className="font-bold text-gray-400 block text-xs uppercase">Quiz Goal</span> {lead.onboarding.goal}</div>
                          <div><span className="font-bold text-gray-400 block text-xs uppercase">Experience</span> {lead.onboarding.experience}</div>
                          <div><span className="font-bold text-gray-400 block text-xs uppercase">Commitment</span> {lead.onboarding.commitment}</div>
                        </div>
                      )}

                      <div className="bg-electric-lime/5 border border-electric-lime/20 p-4 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="flex items-center gap-2 text-sm font-bold text-electric-lime"><Sparkles className="w-4 h-4" /> AI Insight (Gemini 3.1)</span>
                          {!lead.aiInsight && (
                            <button onClick={() => generateInsight(lead)} className="text-xs font-bold text-electric-lime hover:underline">Generate Prediction</button>
                          )}
                        </div>
                        {lead.aiInsight ? (
                          <p className="text-sm text-gray-300 leading-relaxed">{lead.aiInsight}</p>
                        ) : (
                          <p className="text-sm text-gray-500 italic">No insight generated yet. Click above to analyze this lead.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold mb-6">Membership Pricing</h3>
                {content.pricing.map((plan, index) => (
                  <div key={index} className="p-6 border border-light-gray rounded-xl bg-dark-gray space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Tier Name</label>
                        <input value={plan.name} onChange={(e) => { const newP = [...content.pricing]; newP[index].name = e.target.value; setContent({...content, pricing: newP}) }} className="w-full bg-oled-black border border-light-gray rounded-lg px-3 py-2 text-white" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Price (₹)</label>
                        <input value={plan.price} onChange={(e) => { const newP = [...content.pricing]; newP[index].price = e.target.value; setContent({...content, pricing: newP}) }} className="w-full bg-oled-black border border-light-gray rounded-lg px-3 py-2 text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Features (One per line)</label>
                      <textarea rows={4} value={plan.features.join('\n')} onChange={(e) => { const newP = [...content.pricing]; newP[index].features = e.target.value.split('\n'); setContent({...content, pricing: newP}) }} className="w-full bg-oled-black border border-light-gray rounded-lg px-3 py-2 text-white" />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={plan.popular} onChange={(e) => { const newP = [...content.pricing]; newP[index].popular = e.target.checked; setContent({...content, pricing: newP}) }} className="w-4 h-4 accent-electric-lime" />
                      <span className="text-sm font-bold">Mark as "Most Popular"</span>
                    </label>
                  </div>
                ))}
                <button onClick={handleSaveContent} disabled={loading} className="bg-electric-lime text-oled-black px-8 py-3 rounded-full font-bold hover:bg-white transition-colors">
                  {loading ? 'Saving...' : 'Save Pricing'}
                </button>
              </div>
            )}

            {activeTab === 'hours' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-6">Gym Timings</h3>
                {content.hours.map((hour, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <input placeholder="e.g. Mon-Fri" value={hour.day} onChange={(e) => { const newH = [...content.hours]; newH[index].day = e.target.value; setContent({...content, hours: newH}) }} className="flex-1 bg-dark-gray border border-light-gray rounded-lg px-4 py-3 text-white" />
                    <input placeholder="e.g. 6:00 AM - 10:00 PM" value={hour.time} onChange={(e) => { const newH = [...content.hours]; newH[index].time = e.target.value; setContent({...content, hours: newH}) }} className="flex-1 bg-dark-gray border border-light-gray rounded-lg px-4 py-3 text-white" />
                    <button onClick={() => { const newH = content.hours.filter((_, i) => i !== index); setContent({...content, hours: newH}) }} className="p-3 text-red-500 hover:bg-red-500/10 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button onClick={() => setContent({...content, hours: [...content.hours, {day: '', time: ''}]})} className="flex items-center gap-2 text-electric-lime font-bold hover:underline">
                  <Plus className="w-4 h-4" /> Add Row
                </button>
                <div className="pt-4">
                  <button onClick={handleSaveContent} disabled={loading} className="bg-electric-lime text-oled-black px-8 py-3 rounded-full font-bold hover:bg-white transition-colors">
                    {loading ? 'Saving...' : 'Save Timings'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'testimonials' && (
              <div className="space-y-8">
                <form onSubmit={handleAddTestimonial} className="space-y-6">
                <h3 className="text-2xl font-bold mb-6">Upload Transformation / Testimonial</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Client Name</label>
                    <input required type="text" value={newTestimonial.name} onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })} className="w-full bg-dark-gray border border-light-gray rounded-xl px-4 py-3 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Role / Membership</label>
                    <input type="text" placeholder="e.g. Elite Member" value={newTestimonial.role} onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })} className="w-full bg-dark-gray border border-light-gray rounded-xl px-4 py-3 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Testimonial Text</label>
                  <textarea required rows={4} value={newTestimonial.text} onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })} className="w-full bg-dark-gray border border-light-gray rounded-xl px-4 py-3 text-white" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Before Image (URL or Upload)</label>
                    <div className="space-y-2">
                      <input type="url" placeholder="Paste image URL..." value={newTestimonial.beforeImage} onChange={(e) => setNewTestimonial({ ...newTestimonial, beforeImage: e.target.value })} className="w-full bg-dark-gray border border-light-gray rounded-xl px-4 py-3 text-white" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 uppercase font-bold">OR</span>
                        <label className="flex items-center gap-2 cursor-pointer bg-oled-black border border-light-gray px-3 py-2 rounded-lg text-sm hover:border-electric-lime transition-colors">
                          <Upload className="w-4 h-4" />
                          {beforeFile ? beforeFile.name : 'Upload Local File'}
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => setBeforeFile(e.target.files?.[0] || null)} />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">After Image (URL or Upload)</label>
                    <div className="space-y-2">
                      <input type="url" placeholder="Paste image URL..." value={newTestimonial.afterImage} onChange={(e) => setNewTestimonial({ ...newTestimonial, afterImage: e.target.value })} className="w-full bg-dark-gray border border-light-gray rounded-xl px-4 py-3 text-white" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 uppercase font-bold">OR</span>
                        <label className="flex items-center gap-2 cursor-pointer bg-oled-black border border-light-gray px-3 py-2 rounded-lg text-sm hover:border-electric-lime transition-colors">
                          <Upload className="w-4 h-4" />
                          {afterFile ? afterFile.name : 'Upload Local File'}
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => setAfterFile(e.target.files?.[0] || null)} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="bg-electric-lime text-oled-black px-8 py-3 rounded-full font-bold hover:bg-white transition-colors">
                  {loading ? 'Uploading...' : 'Upload Testimonial'}
                </button>
              </form>

              <div className="mt-12 space-y-4">
                <h4 className="font-bold text-xl">Existing Testimonials</h4>
                {testimonials.length === 0 ? (
                  <p className="text-gray-400 text-sm">No testimonials added yet.</p>
                ) : (
                  <div className="grid gap-4">
                    {testimonials.map(t => (
                      <div key={t.id} className="bg-dark-gray border border-light-gray rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                          <h5 className="font-bold text-lg">{t.name} <span className="text-sm font-normal text-gray-400">({t.role})</span></h5>
                          <p className="text-sm text-gray-300 mt-1 line-clamp-2">{t.text}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => handleDeleteTestimonial(t.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              </div>
            )}

            {activeTab === 'offers' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold mb-6">Offers & Promotions</h3>
                
                <div className="bg-dark-gray rounded-xl p-6 border border-light-gray">
                  <h4 className="font-bold mb-4">Create New Offer</h4>
                  <form onSubmit={handleSaveOffer} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Offer Title</label>
                        <input required type="text" placeholder="e.g., Ramadan Special" value={newOffer.title} onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })} className="w-full bg-oled-black border border-light-gray rounded-lg px-4 py-2 text-white" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Discount Text</label>
                        <input required type="text" placeholder="e.g., 50% OFF" value={newOffer.discountText} onChange={(e) => setNewOffer({ ...newOffer, discountText: e.target.value })} className="w-full bg-oled-black border border-light-gray rounded-lg px-4 py-2 text-white" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Target Plan</label>
                        <select value={newOffer.targetPlan} onChange={(e) => setNewOffer({ ...newOffer, targetPlan: e.target.value })} className="w-full bg-oled-black border border-light-gray rounded-lg px-4 py-2 text-white">
                          <option value="All">All Plans</option>
                          <option value="Basic">Basic</option>
                          <option value="Pro">Pro</option>
                          <option value="Elite">Elite</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Expiry Date</label>
                        <input required type="date" value={newOffer.expiryDate} onChange={(e) => setNewOffer({ ...newOffer, expiryDate: e.target.value })} className="w-full bg-oled-black border border-light-gray rounded-lg px-4 py-2 text-white" />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={newOffer.status === 'live'} onChange={(e) => setNewOffer({ ...newOffer, status: e.target.checked ? 'live' : 'draft' })} className="w-5 h-5 accent-electric-lime" />
                          <span className="text-sm font-bold">{newOffer.status === 'live' ? 'Live (Visible)' : 'Draft (Hidden)'}</span>
                        </label>
                      </div>
                    </div>
                    <button type="submit" disabled={loading} className="bg-electric-lime text-oled-black px-6 py-2 rounded-full font-bold hover:bg-white transition-colors">
                      {loading ? 'Saving...' : 'Save Offer'}
                    </button>
                  </form>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold">Existing Offers</h4>
                  {offers.length === 0 ? (
                    <p className="text-gray-400 text-sm">No offers created yet.</p>
                  ) : (
                    <div className="grid gap-4">
                      {offers.map(offer => (
                        <div key={offer.id} className="bg-dark-gray border border-light-gray rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-bold text-lg">{offer.title}</h5>
                              <span className={`text-xs px-2 py-1 rounded font-bold ${offer.status === 'live' ? 'bg-electric-lime/20 text-electric-lime' : 'bg-gray-500/20 text-gray-400'}`}>
                                {offer.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400">
                              {offer.discountText} • Plan: {offer.targetPlan} • Expires: {offer.expiryDate}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleToggleOfferStatus(offer.id, offer.status)} className="px-4 py-2 bg-oled-black border border-light-gray rounded-lg text-sm font-bold hover:text-electric-lime transition-colors">
                              {offer.status === 'live' ? 'Make Draft' : 'Go Live'}
                            </button>
                            <button onClick={() => handleDeleteOffer(offer.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

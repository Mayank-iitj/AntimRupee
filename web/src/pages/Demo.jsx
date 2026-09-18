import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Play, Pause, FileText, Languages, MapPin, AlertCircle, CheckCircle2, ChevronRight, Check } from 'lucide-react';

export default function Demo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0); // 0: Start, 1: Audio playing, 2: Transcription, 3: Extraction, 4: Clustering & Prioritization, 5: Action Queue

  // Mock audio duration
  const audioDuration = 4000; 

  const handleStartDemo = () => {
    setIsPlaying(true);
    setStep(1);
    
    // Sequence the demo
    setTimeout(() => {
      setIsPlaying(false);
      setStep(2);
      
      setTimeout(() => setStep(3), 1500);
      setTimeout(() => setStep(4), 3000);
      setTimeout(() => setStep(5), 4500);
      
    }, audioDuration);
  };

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-4">
            Interactive Workflow Demo
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4 tracking-tight">
            How Antim Rupee Works
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Experience the journey of a citizen's voice request as it transforms into a prioritized, location-aware infrastructure action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative">
          {/* Left Column: The Storyline Pipeline */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Step 1: Citizen Input */}
            <motion.div 
              className={`p-6 rounded-2xl border ${step >= 1 ? 'bg-white border-blue-200 shadow-lg' : 'bg-white/50 border-gray-200 opacity-70'} transition-all duration-500`}
            >
              <div className="flex items-center gap-3 mb-4 text-blue-600 font-semibold">
                <Mic size={20} />
                <span>1. Citizen Submission</span>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                A citizen sends a voice note via WhatsApp in Hindi reporting an issue.
              </p>
              
              <div className="bg-gray-100 rounded-full p-2 flex items-center gap-3">
                <button 
                  onClick={step === 0 ? handleStartDemo : undefined}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${step === 0 ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' : 'bg-gray-400 cursor-default'}`}
                >
                  {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                </button>
                <div className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: isPlaying ? '100%' : (step > 1 ? '100%' : '0%') }}
                    transition={isPlaying ? { duration: audioDuration/1000, ease: 'linear' } : { duration: 0.1 }}
                    className="absolute left-0 top-0 bottom-0 bg-blue-500"
                  />
                </div>
                <span className="text-xs text-gray-500 font-medium pr-3">0:04</span>
              </div>
            </motion.div>

            {/* Step 2: Transcription & Translation */}
            <motion.div 
              className={`p-6 rounded-2xl border ${step >= 2 ? 'bg-white border-purple-200 shadow-lg' : 'bg-white/50 border-gray-200 opacity-70'} transition-all duration-500`}
            >
              <div className="flex items-center gap-3 mb-4 text-purple-600 font-semibold">
                <Languages size={20} />
                <span>2. AI Transcription & Translation</span>
              </div>
              <AnimatePresence>
                {step >= 2 && (
                  <motion.div {...fadeUp} className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-sm">
                    <p className="text-gray-500 italic mb-2">"वार्ड 12 में सरकारी स्कूल के पास की सड़क छह महीने से खराब है।"</p>
                    <div className="flex items-center gap-2 text-purple-700 font-medium mt-3 pt-3 border-t border-purple-200/50">
                      <Check size={16} />
                      <p>"The road near the government school in Ward 12 has been damaged for six months."</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Step 3: Information Extraction */}
            <motion.div 
              className={`p-6 rounded-2xl border ${step >= 3 ? 'bg-white border-green-200 shadow-lg' : 'bg-white/50 border-gray-200 opacity-70'} transition-all duration-500`}
            >
              <div className="flex items-center gap-3 mb-4 text-green-600 font-semibold">
                <FileText size={20} />
                <span>3. Entity Extraction</span>
              </div>
              <AnimatePresence>
                {step >= 3 && (
                  <motion.div {...fadeUp} className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                      <span className="text-green-800 text-xs font-bold block mb-1 uppercase tracking-wider">Location</span>
                      <span className="text-gray-800 font-medium">Ward 12, Govt School</span>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                      <span className="text-green-800 text-xs font-bold block mb-1 uppercase tracking-wider">Issue Type</span>
                      <span className="text-gray-800 font-medium">Road Repair</span>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                      <span className="text-green-800 text-xs font-bold block mb-1 uppercase tracking-wider">Duration</span>
                      <span className="text-gray-800 font-medium">6 Months</span>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                      <span className="text-green-800 text-xs font-bold block mb-1 uppercase tracking-wider">Confidence</span>
                      <span className="text-gray-800 font-medium">98%</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Column: Visualization & Government Output */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Step 4: Clustering & Map */}
            <motion.div 
              className={`p-6 rounded-2xl border ${step >= 4 ? 'bg-white border-indigo-200 shadow-lg' : 'bg-white/50 border-gray-200 opacity-70'} transition-all duration-500 h-full min-h-[300px] flex flex-col`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-indigo-600 font-semibold">
                  <MapPin size={20} />
                  <span>4. Demand Clustering & Prioritization</span>
                </div>
                {step >= 4 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold">
                    37 Similar Requests Found
                  </motion.span>
                )}
              </div>
              
              <div className="flex-1 flex flex-col md:flex-row gap-6 relative">
                {/* Simulated Map */}
                <div className="flex-1 bg-gray-100 rounded-xl relative overflow-hidden flex items-center justify-center min-h-[200px] border border-gray-200">
                  {step >= 4 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
                      {/* Using a stylized SVG to represent the map and hotspot */}
                      <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none" className="opacity-40">
                         <path d="M0,50 Q100,80 200,30 T400,60 L400,300 L0,300 Z" fill="#e2e8f0"/>
                         <path d="M50,150 Q150,200 250,100 T400,150" fill="none" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round"/>
                         <path d="M200,50 L200,250" fill="none" stroke="#cbd5e1" strokeWidth="8"/>
                      </svg>
                      {/* Hotspot indicator */}
                      <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: [1, 1.2, 1] }} 
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute top-[40%] left-[55%] -translate-x-1/2 -translate-y-1/2"
                      >
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
                          <div className="w-8 h-8 bg-red-500/40 rounded-full flex items-center justify-center">
                            <MapPin className="text-red-600" size={20} fill="currentColor" />
                          </div>
                        </div>
                      </motion.div>
                      {/* Map labels */}
                      <div className="absolute top-[30%] left-[60%] bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-gray-700 shadow-sm border border-gray-200">
                        Ward 12
                      </div>
                      <div className="absolute top-[48%] left-[50%] bg-blue-50 px-2 py-1 rounded text-[10px] font-bold text-blue-700 shadow-sm border border-blue-200 flex items-center gap-1">
                        🏫 Govt School
                      </div>
                    </motion.div>
                  ) : (
                    <span className="text-gray-400 text-sm font-medium">Awaiting spatial data...</span>
                  )}
                </div>

                {/* Priority Score */}
                {step >= 4 && (
                  <motion.div {...fadeUp} className="w-full md:w-[220px] flex flex-col justify-center">
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center mb-3">
                      <span className="text-red-800 text-xs font-bold uppercase tracking-wider block mb-1">AI Priority Score</span>
                      <span className="text-4xl font-display font-bold text-red-600 block">87<span className="text-xl text-red-400">/100</span></span>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-600">
                      <span className="font-bold text-gray-800 block mb-1">Reasoning:</span>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>37 independent requests within 1.8km radius</li>
                        <li>School-bus route severely affected</li>
                        <li>Issue persisted &gt; 5 months</li>
                        <li>No planned project in current budget</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Step 5: Action Queue */}
            <motion.div 
              className={`p-6 rounded-2xl border ${step >= 5 ? 'bg-gray-900 border-gray-800 shadow-2xl text-white' : 'bg-white/50 border-gray-200 opacity-70'} transition-all duration-500`}
            >
              <div className="flex items-center gap-3 mb-6 font-semibold">
                <AlertCircle size={20} className={step >= 5 ? 'text-blue-400' : 'text-gray-400'} />
                <span className={step >= 5 ? 'text-white' : 'text-gray-600'}>5. Government Action Queue</span>
              </div>
              
              {step >= 5 ? (
                <motion.div {...fadeUp} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
                    <span className="text-sm font-medium text-gray-300">New High-Priority Demand Cluster</span>
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md transition-colors">
                      Assign to PWD
                    </button>
                  </div>
                  <div className="p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                      <span className="text-red-400 font-bold text-sm">87</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white text-sm mb-1">Rural Road Repair - Ward 12</h4>
                      <p className="text-gray-400 text-xs mb-3">Generated from 37 verified citizen requests. Location confirmed near Government School.</p>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-[10px] font-medium border border-gray-600">Est. Budget: ₹12L</span>
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-[10px] font-medium border border-gray-600">Affected Pop: ~4,500</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-[120px] bg-gray-100 rounded-xl flex items-center justify-center text-sm text-gray-400 font-medium">
                  Awaiting processed intelligence...
                </div>
              )}
            </motion.div>

          </div>
        </div>
        
        {step >= 5 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 mb-4">This is how Antim Rupee bridges the gap between citizens and infrastructure planning.</p>
            <button 
              onClick={() => {setStep(0); setIsPlaying(false);}}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors shadow-sm"
            >
              Reset Demo
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

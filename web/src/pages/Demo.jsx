import React, { useState } from 'react';
import { motion } from 'framer-motion';
import WhatsAppSimulator from '../components/WhatsAppSimulator';
import GlobeVisualizer from '../components/GlobeVisualizer';
import ProposalGenerator from '../components/ProposalGenerator';
import { ArrowRight, Bot, Cpu, Database } from 'lucide-react';

export default function Demo() {
  const [pipelineStep, setPipelineStep] = useState(0);

  const handleMessageSent = (msg) => {
    // Trigger pipeline animation
    setPipelineStep(1);
    setTimeout(() => setPipelineStep(2), 2000); // AI Extract
    setTimeout(() => setPipelineStep(3), 4000); // Globe Update
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-28 pb-20 px-4 md:px-8 font-sans overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-900/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-900/30 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold mb-6 border border-blue-500/20"
          >
            End-to-End Realtime Platform Showcase
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-white to-indigo-400"
          >
            The Future of Governance
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto font-light"
          >
            Experience how Antim Rupee captures citizen voices from standard apps, processes them with Vertex AI, and turns them into actionable policy documents instantly.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Input (WhatsApp) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-4 flex justify-center lg:justify-end relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 blur-2xl rounded-full" />
            <WhatsAppSimulator onMessageSent={handleMessageSent} />
          </motion.div>

          {/* Middle: Pipeline visualization */}
          <div className="lg:col-span-3 flex flex-col gap-4 justify-center">
             <PipelineNode 
                active={pipelineStep >= 1} 
                icon={<Bot size={28} />} 
                title="Gemini 1.5 Pro" 
                desc="Intent & Sentiment Extraction" 
                color="border-purple-500/50 bg-purple-500/10 text-purple-400 shadow-purple-500/20" 
             />
             <div className="h-6 flex justify-center"><ArrowRight className={`rotate-90 lg:rotate-0 transition-colors ${pipelineStep >= 1 ? 'text-blue-400' : 'text-gray-800'}`} /></div>
             
             <PipelineNode 
                active={pipelineStep >= 2} 
                icon={<Database size={28} />} 
                title="BigQuery Spatial" 
                desc="Cross-referencing Public Data" 
                color="border-blue-500/50 bg-blue-500/10 text-blue-400 shadow-blue-500/20" 
             />
             <div className="h-6 flex justify-center"><ArrowRight className={`rotate-90 lg:rotate-0 transition-colors ${pipelineStep >= 2 ? 'text-indigo-400' : 'text-gray-800'}`} /></div>
             
             <PipelineNode 
                active={pipelineStep >= 3} 
                icon={<Cpu size={28} />} 
                title="Vertex AI AutoML" 
                desc="Prioritization & Routing" 
                color="border-indigo-500/50 bg-indigo-500/10 text-indigo-400 shadow-indigo-500/20" 
             />
          </div>

          {/* Right: Output (Globe & PDF) */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-5 flex flex-col gap-6 h-full justify-center"
          >
            <div className={`transition-all duration-1000 ease-out h-[400px] ${pipelineStep >= 3 ? 'opacity-100 scale-100 ring-2 ring-indigo-500/50 ring-offset-4 ring-offset-gray-950 rounded-3xl' : 'opacity-30 scale-95 grayscale'}`}>
               <GlobeVisualizer />
            </div>

            <div className={`transition-all duration-700 delay-500 ${pipelineStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
               <ProposalGenerator hotspotData={{
                  title: "Emergency Road Repair",
                  location: "Extracted from User Input",
                  budget: "12,00,000",
                  requests: "87 matching requests found",
                  score: "89/100"
               }} />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

const PipelineNode = ({ active, icon, title, desc, color }) => (
  <div className={`p-5 rounded-2xl border backdrop-blur-sm ${active ? color + ' shadow-lg' : 'border-gray-800 bg-gray-900/40 text-gray-600'} transition-all duration-700 flex items-center gap-4`}>
    <div className={`p-3 rounded-xl transition-colors duration-700 ${active ? 'bg-black/40' : 'bg-gray-800/50'}`}>
      {icon}
    </div>
    <div>
      <h4 className={`font-bold text-lg transition-colors duration-700 ${active ? 'text-white' : 'text-gray-500'}`}>{title}</h4>
      <p className={`text-sm transition-colors duration-700 ${active ? 'text-gray-300' : 'text-gray-600'}`}>{desc}</p>
    </div>
  </div>
);

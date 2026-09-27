import React from 'react';
import { motion } from 'framer-motion';
import { Mic, ShieldCheck, Map, FileCheck2, Hammer, CheckCircle2 } from 'lucide-react';

const TimelineStep = ({ icon, title, date, desc, active, delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className={`flex gap-6 relative ${active ? 'opacity-100' : 'opacity-40'}`}
  >
    {/* Line */}
    <div className="absolute left-6 top-12 bottom-[-2rem] w-0.5 bg-gradient-to-b from-blue-500 to-blue-200" />
    
    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 shadow-lg transition-colors duration-500 ${active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
      {icon}
    </div>
    <div className="pb-10 pt-2">
      <div className="flex items-baseline gap-3 mb-1">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full shadow-sm">{date}</span>
      </div>
      <p className="text-gray-600 mt-2 leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

export default function Transparency() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen relative z-10 font-sans">
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
        <div className="mb-12 text-center md:text-left">
           <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-bold mb-4 shadow-sm border border-green-200">
            Public Trust Portal
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6 tracking-tight">Citizen Feedback Loop</h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl">
            See exactly how your voice becomes government action. We believe digital public goods shouldn't be black boxes.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl border border-gray-100 mb-16 relative overflow-hidden">
           {/* Decorative bg */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-bl-full -z-10 opacity-50"></div>

           <h2 className="text-2xl font-bold text-gray-800 mb-10 flex items-center gap-3 border-b border-gray-100 pb-6">
             <div className="p-2 bg-blue-50 rounded-lg"><Map className="text-blue-600" /></div>
             Case Study: Ward 12 Water Pipeline
           </h2>
           
           <div className="ml-2 mt-8">
             <TimelineStep 
               icon={<Mic size={24} />} 
               title="Voice Note Received" 
               date="Oct 12, 10:45 AM" 
               desc="Citizen sent a WhatsApp voice note in Hindi reporting a broken water pipe near the government school."
               active={true} delay={0.1}
             />
             <TimelineStep 
               icon={<ShieldCheck size={24} />} 
               title="AI Validation & Translation" 
               date="Oct 12, 10:45 AM (+2s)" 
               desc="Vertex AI transcribed, translated to English, extracted location entities, and anonymized personal data."
               active={true} delay={0.3}
             />
             <TimelineStep 
               icon={<Map size={24} />} 
               title="Clustered as Demand Hotspot" 
               date="Oct 14, 02:00 PM" 
               desc="System identified 342 similar requests within a 2km radius. Escalated to 'Critical Priority' due to school proximity."
               active={true} delay={0.5}
             />
             <TimelineStep 
               icon={<FileCheck2 size={24} />} 
               title="Proposed in State Budget" 
               date="Nov 01, 09:00 AM" 
               desc="AI Impact Proposal automatically generated and approved by the District Magistrate for emergency funding."
               active={true} delay={0.7}
             />
             <TimelineStep 
               icon={<Hammer size={24} />} 
               title="Tender Allocated" 
               date="Nov 15, 11:30 AM" 
               desc="Contractor assigned. Work scheduled to begin Nov 20."
               active={true} delay={0.9}
             />
             <div className="flex gap-6 relative opacity-50 mt-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 bg-gray-100 border-2 border-dashed border-gray-300 text-gray-400">
                  <CheckCircle2 size={24} />
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-gray-500">Project Completion</h3>
                  <p className="text-gray-400 font-medium">Awaiting contractor update...</p>
                </div>
             </div>
           </div>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-200 shadow-sm text-center md:text-left transition-transform hover:-translate-y-1 duration-300">
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">Total Requests</p>
            <p className="text-4xl font-display font-bold text-gray-900">1.2M+</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-200 shadow-sm text-center md:text-left transition-transform hover:-translate-y-1 duration-300">
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">Projects Approved</p>
            <p className="text-4xl font-display font-bold text-blue-600">3,450</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-200 shadow-sm text-center md:text-left transition-transform hover:-translate-y-1 duration-300">
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">Active Districts</p>
            <p className="text-4xl font-display font-bold text-gray-900">42</p>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

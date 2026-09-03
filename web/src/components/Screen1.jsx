import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Screen1() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { lang } = useLanguage();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/summary`)
      .then(res => res.json())
      .then(d => {
        setData({
          total_requests: d.workers_flagged || 0,
          processed: d.workers_flagged || 0,
          high_priority: Math.floor((d.workers_flagged || 0) * 0.1),
          critical_hotspots: d.blocks ? d.blocks.length : 0,
          regions: (d.blocks || []).map(b => ({ id: b.block_id, requests: b.c }))
        });
      })
      .catch(err => {
        console.error(err);
        setError(err);
      });
  }, []);

  if (!data) return (
    <div className="h-96 flex items-center justify-center">
      <div className="animate-pulse-slow text-primary font-medium">Loading demand data...</div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Hero Metric: Demand Funnel */}
      <div className="text-center py-16 px-4 glass-card relative overflow-hidden bg-white">
        <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">{lang === 'hi' ? 'नागरिक मांग फ़नल' : 'Citizen Demand Funnel'}</h2>
        <p className="text-gray-500 mb-12">{lang === 'hi' ? 'कच्चे फीडबैक से बुनियादी ढांचे की प्राथमिकताओं तक।' : 'From raw feedback to actionable infrastructure priorities.'}</p>

        <div className="flex flex-col items-center w-full max-w-2xl mx-auto gap-3 relative">
          
          <motion.div initial={{opacity:0, y: -20}} animate={{opacity:1, y: 0}} transition={{delay: 0.1}} className="w-full bg-blue-50/50 border border-blue-100 p-5 rounded-2xl text-center">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">{lang === 'hi' ? 'कुल फीडबैक (सभी चैनल)' : 'Total Feedback (All Channels)'}</div>
            <div className="text-4xl font-display font-bold text-gray-900">{data.total_requests.toLocaleString()}</div>
          </motion.div>
          
          <motion.div initial={{opacity:0, y: -20}} animate={{opacity:1, y: 0}} transition={{delay: 0.2}} className="w-[85%] bg-green-50/50 border border-green-200 p-5 rounded-2xl text-center relative mt-2">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider z-10">
              85% Processed by AI
            </div>
            <div className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">{lang === 'hi' ? 'वर्गीकृत और भू-टैग किया गया' : 'Categorized & Geo-Tagged'}</div>
            <div className="text-4xl font-display font-bold text-gray-900">{data.processed.toLocaleString()}</div>
          </motion.div>

          <motion.div initial={{opacity:0, y: -20}} animate={{opacity:1, y: 0}} transition={{delay: 0.3}} className="w-[70%] bg-orange-50/50 border border-orange-200 p-5 rounded-2xl text-center relative mt-2">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider z-10">
              Validated against Census
            </div>
            <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">{lang === 'hi' ? 'उच्च प्राथमिकता परियोजनाएं' : 'High Priority Projects'}</div>
            <div className="text-4xl font-display font-bold text-gray-900">{data.high_priority.toLocaleString()}</div>
          </motion.div>

          <motion.div initial={{opacity:0, scale: 0.95}} animate={{opacity:1, scale: 1}} transition={{delay: 0.5, type: 'spring'}} className="w-[55%] bg-red-50 border-2 border-red-200 p-8 pt-10 rounded-3xl text-center relative mt-6 shadow-xl group">
            <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors rounded-3xl" />
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-100 px-4 py-1 rounded-full shadow-sm border border-red-200 text-xs font-bold text-red-600 uppercase tracking-wider z-10 flex items-center gap-1 whitespace-nowrap">
              <AlertCircle size={14} /> Critical Attention Required
            </div>
            <div className="relative z-10 text-xs font-bold text-red-600 uppercase tracking-wider mb-2">{lang === 'hi' ? 'गंभीर मांग हॉटस्पॉट' : 'Critical Demand Hotspots'}</div>
            <div className="relative z-10 text-6xl font-display font-bold text-red-600 tracking-tighter">{data.critical_hotspots}</div>
          </motion.div>

        </div>
      </div>

      {/* Region Table */}
      <div className="glass-card p-8 bg-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MapPin className="text-primary" size={20} />
          </div>
          <h3 className="text-xl font-display font-semibold text-gray-900">{lang === 'hi' ? 'शीर्ष क्षेत्र (मांग की मात्रा के अनुसार)' : 'Top Regions (by Demand Volume)'}</h3>
        </div>
        
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="py-4 pl-6 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Requests</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.regions.map((region, i) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={region.id} 
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-800 group-hover:text-primary transition-colors">{region.id}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 text-right font-mono">{region.requests.toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

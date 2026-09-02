import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, AlertCircle } from 'lucide-react';
import { mockBlocks } from '../utils/mockData';

export default function Screen1() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/summary`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch summary');
        return res.json();
      })
      .then(fetchedData => {
        setData(fetchedData);
      })
      .catch(err => {
        console.error(err);
        // Fallback to mock data if backend is down
        setData({
          workers_flagged: 12849,
          blocks: mockBlocks
        });
        setError('Using fallback data. Backend connection failed.');
      });
  }, []);

  if (!data) return (
    <div className="h-96 flex items-center justify-center">
      <div className="animate-pulse-slow text-primary font-medium">Loading district data...</div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Hero Metric: Exclusion Funnel */}
      <div className="text-center py-16 px-4 glass-card relative overflow-hidden bg-white">
        <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">The Exclusion Funnel</h2>
        <p className="text-gray-500 mb-12">How structural friction creates silent drop-offs in the district.</p>

        <div className="flex flex-col items-center w-full max-w-2xl mx-auto gap-3 relative">
          
          <motion.div initial={{opacity:0, y: -20}} animate={{opacity:1, y: 0}} transition={{delay: 0.1}} className="w-full bg-blue-50/50 border border-blue-100 p-5 rounded-2xl text-center">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Total FTO Transactions (90 Days)</div>
            <div className="text-4xl font-display font-bold text-gray-900">4,250,192</div>
          </motion.div>
          
          <motion.div initial={{opacity:0, y: -20}} animate={{opacity:1, y: 0}} transition={{delay: 0.2}} className="w-[85%] bg-yellow-50/50 border border-yellow-200 p-5 rounded-2xl text-center relative mt-2">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider z-10">
              92% Success Rate
            </div>
            <div className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-1">Rejected by Bank/PFMS</div>
            <div className="text-4xl font-display font-bold text-gray-900">340,015</div>
          </motion.div>

          <motion.div initial={{opacity:0, y: -20}} animate={{opacity:1, y: 0}} transition={{delay: 0.3}} className="w-[70%] bg-orange-50/50 border border-orange-200 p-5 rounded-2xl text-center relative mt-2">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider z-10">
              65% Resolved by Clerks
            </div>
            <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Unresolved Failures</div>
            <div className="text-4xl font-display font-bold text-gray-900">119,005</div>
          </motion.div>

          <motion.div initial={{opacity:0, scale: 0.95}} animate={{opacity:1, scale: 1}} transition={{delay: 0.5, type: 'spring'}} className="w-[55%] bg-red-50 border-2 border-red-200 p-8 pt-10 rounded-3xl text-center relative mt-6 shadow-xl group">
            <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors rounded-3xl" />
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-100 px-4 py-1 rounded-full shadow-sm border border-red-200 text-xs font-bold text-red-600 uppercase tracking-wider z-10 flex items-center gap-1 whitespace-nowrap">
              <AlertCircle size={14} /> 0 Grievances Filed
            </div>
            <div className="relative z-10 text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Silent Exclusions Flagged</div>
            <div className="relative z-10 text-6xl font-display font-bold text-red-600 tracking-tighter">{data.workers_flagged.toLocaleString()}</div>
          </motion.div>

        </div>
      </div>

      {/* Block Table */}
      <div className="glass-card p-8 bg-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MapPin className="text-primary" size={20} />
          </div>
          <h3 className="text-xl font-display font-semibold text-gray-900">Affected Blocks</h3>
        </div>
        
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="py-4 pl-6 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block ID</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Flagged Workers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.blocks.map((block, i) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={block.block_id} 
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-800 group-hover:text-primary transition-colors">{block.block_id}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 text-right font-mono">{block.c}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

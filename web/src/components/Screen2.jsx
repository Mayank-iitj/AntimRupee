import React, { useEffect, useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { PieChart, Network, Terminal, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockCauses } from '../utils/mockData';

const LiveDecoder = () => {
  const [logs, setLogs] = useState([]);
  const bottomRef = useRef(null);
  
  const sampleErrors = [
    { raw: "ERR_CD_99_ACCT_FRZ_KYC_FAIL", json: { cause: "Account Frozen", action: "Update KYC" } },
    { raw: "REJ_NM_MSMTCH_AADHAAR_LNK_0XF", json: { cause: "Name Mismatch", action: "Re-link Aadhaar" } },
    { raw: "FTO_RTRN_INACTV_ACNT_3992", json: { cause: "Dormant Account", action: "Reactivate Account" } },
    { raw: "VLD_FAIL_IFSC_NOT_FND_RURAL", json: { cause: "Invalid IFSC", action: "Update Bank Details" } },
    { raw: "SYS_ERR_UIDAI_AUTH_TMOUT_993", json: { cause: "Auth Timeout", action: "Retry Processing" } }
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(async () => {
      const error = sampleErrors[index % sampleErrors.length];
      const newLog = {
        id: Date.now(),
        raw: error.raw,
        json: null,
        status: 'processing'
      };
      
      setLogs(prev => [...prev.slice(-2), newLog]);
      
      setTimeout(() => {
        setLogs(prev => prev.map(l => l.id === newLog.id ? { ...l, status: 'done', json: error.json } : l));
      }, 1500);
      
      index++;
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-12 bg-[#0F172A] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden font-mono flex flex-col h-[360px]">
      <div className="bg-[#1E293B] px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-gray-400" />
          <span className="text-sm font-semibold text-gray-200">Gemini 1.5 Pro // Layer 2 Fallback Decoder</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-medium">System Online</span>
        </div>
      </div>
      
      <div className="p-6 overflow-hidden flex-1 relative flex flex-col gap-4">
        <AnimatePresence>
          {logs.map((log) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-6 text-sm"
            >
              <div className="flex-1 bg-[#1E293B] p-4 rounded-lg border border-gray-700/50">
                <div className="text-xs text-gray-500 mb-1">RAW TRACE INPUT</div>
                <div className="text-red-400 font-medium break-all">{log.raw}</div>
              </div>
              
              <div className="flex flex-col items-center justify-center w-32 shrink-0">
                {log.status === 'processing' ? (
                  <div className="flex flex-col items-center gap-2 text-[#A5A4FA]">
                    <Sparkles size={20} className="animate-pulse" />
                    <span className="text-[10px] uppercase tracking-wider animate-pulse">Normalizing</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-emerald-400">
                    <ArrowRight size={20} />
                    <span className="text-[10px] uppercase tracking-wider">Mapped</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 bg-[#1E293B] p-4 rounded-lg border border-gray-700/50 relative">
                <div className="text-xs text-gray-500 mb-1">STRUCTURED OUTPUT</div>
                {log.status === 'processing' ? (
                  <div className="flex items-center h-5">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
                    </div>
                  </div>
                ) : log.status === 'error' ? (
                  <div className="text-red-400">Error decoding trace</div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-300">
                    {`{`}
                    <br/>
                    &nbsp;&nbsp;<span className="text-blue-300">"cause"</span>: <span className="text-yellow-200">"{log.json?.cause}"</span>,
                    <br/>
                    &nbsp;&nbsp;<span className="text-blue-300">"action"</span>: <span className="text-yellow-200">"{log.json?.action}"</span>
                    <br/>
                    {`}`}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function Screen2() {
  const [causes, setCauses] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/causes`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch causes');
        return res.json();
      })
      .then(fetchedCauses => {
        setCauses(fetchedCauses);
      })
      .catch(err => {
        console.error(err);
        setCauses(mockCauses);
      });
  }, []);

  // Soft glowing colors for bars
  const colors = ['#7584D6', '#80E5FF', '#A5A4FA', '#06b6d4', '#3b82f6'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xl">
          <p className="text-gray-900 font-medium mb-1">{label}</p>
          <p className="text-primary font-mono text-lg">{payload[0].value} workers</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-8 bg-white">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <PieChart className="text-secondary" size={24} />
            </div>
            <h2 className="text-3xl font-display font-bold text-gray-900">Root Cause Pareto</h2>
          </div>
          <p className="text-gray-600 text-lg">Four causes explain ~80% of silent exclusions.</p>
        </div>
      </div>
      
      <div className="h-[400px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={causes}
            margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
            <XAxis 
              dataKey="cause_code" 
              angle={-45} 
              textAnchor="end" 
              height={100} 
              tick={{fill: '#6B7280', fontSize: 12}} 
              axisLine={{stroke: 'rgba(0,0,0,0.1)'}}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              stroke="rgba(0,0,0,0.1)" 
              tick={{fill: '#6B7280', fontSize: 12}}
              tickLine={false}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(0,0,0,0.02)'}} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {causes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Live AI Decoder */}
      <LiveDecoder />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white border border-gray-200 shadow-sm p-6 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
          <Network className="text-primary mb-4" size={24} />
          <h4 className="font-semibold text-gray-700">Deterministic Coverage</h4>
          <p className="text-4xl font-display font-bold text-gray-900 mt-2">91<span className="text-xl text-primary">%</span></p>
          <p className="text-sm text-gray-500 mt-2">Mapped via strict string rules</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white border border-gray-200 shadow-sm p-6 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 blur-3xl rounded-full" />
          <Network className="text-secondary mb-4" size={24} />
          <h4 className="font-semibold text-gray-700">Gemini Fallback Coverage</h4>
          <p className="text-4xl font-display font-bold text-gray-900 mt-2">9<span className="text-xl text-secondary">%</span></p>
          <p className="text-sm text-gray-500 mt-2">Unseen strings handled offline</p>
        </motion.div>
      </div>
    </div>
  );
}

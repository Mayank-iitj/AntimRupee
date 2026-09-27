import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, BarChart3, ListTodo, AlertTriangle, Calculator } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Screen1 from '../components/Screen1';
import Screen2 from '../components/Screen2';
import Screen3 from '../components/Screen3';
import BudgetOptimizer from '../components/BudgetOptimizer';

function EarlyWarnings() {
  const [alerts, setAlerts] = useState([]);
  
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/early_warnings')
      .then(res => res.json())
      .then(data => setAlerts(data.alerts || []))
      .catch(() => {});
  }, []);

  if (alerts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {alerts.map((a, i) => (
        <motion.div key={i} initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{delay: i*0.1}} className={`p-4 rounded-xl shadow-sm border ${a.level === 'CRITICAL' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'} flex items-start gap-3`}>
          <AlertTriangle className={`shrink-0 mt-0.5 ${a.level === 'CRITICAL' ? 'text-red-600' : 'text-orange-500'}`} />
          <div>
            <h4 className={`text-sm font-bold ${a.level === 'CRITICAL' ? 'text-red-900' : 'text-orange-900'} mb-1`}>{a.category}</h4>
            <p className={`text-sm ${a.level === 'CRITICAL' ? 'text-red-800' : 'text-orange-800'}`}>{a.message}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('screen1');

  const { lang } = useLanguage();

  const navItems = [
    { id: 'screen1', label: lang === 'hi' ? 'मांग हीटमैप' : 'Demand Heatmap', icon: Map },
    { id: 'screen2', label: lang === 'hi' ? 'श्रेणी विश्लेषण' : 'Category Analysis', icon: BarChart3 },
    { id: 'screen3', label: lang === 'hi' ? 'अनुशंसित परियोजनाएं' : 'Recommended Projects', icon: ListTodo },
    { id: 'screen4', label: 'Budget Optimizer', icon: Calculator },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="min-h-screen bg-background relative overflow-hidden font-sans">
      {/* Floating Navigation */}
      <nav className="fixed top-24 left-1/2 -translate-x-1/2 z-40 shadow-lg rounded-full">
        <div className="bg-white/80 backdrop-blur-xl px-2 py-2 rounded-full flex items-center gap-2 border border-gray-200">
          <div className="px-4 py-2 border-r border-gray-200 mr-2">
            <span className="font-display font-bold text-xl text-gray-900 tracking-tight">{lang === 'hi' ? 'राष्ट्रीय दृश्य' : 'National View'}</span>
          </div>
          
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2
                ${activeTab === item.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'}`}
            >
              {activeTab === item.id && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-gray-100 rounded-full border border-gray-200"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon size={16} className="relative z-10" />
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto pt-48 pb-16 px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border-blue-200 border p-4 rounded-xl mb-8 flex items-start gap-3 shadow-sm"
        >
          <AlertTriangle className="text-blue-600 shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-blue-800 leading-relaxed">
            <strong className="text-blue-900">{lang === 'hi' ? 'एआई सूचना:' : 'AI Notice:'}</strong> {lang === 'hi' ? 'ये अनुशंसाएं नागरिक मांग और जनसांख्यिकीय डेटा के एआई विश्लेषण पर आधारित हैं।' : 'These recommendations are based on AI analysis of aggregated citizen demand and demographic data.'}
          </p>
        </motion.div>
        
        <EarlyWarnings />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'screen1' && <Screen1 />}
            {activeTab === 'screen2' && <Screen2 />}
            {activeTab === 'screen3' && <Screen3 />}
            {activeTab === 'screen4' && <BudgetOptimizer />}
          </motion.div>
        </AnimatePresence>
      </main>
    </motion.div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, BarChart3, ListTodo, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Screen1 from '../components/Screen1';
import Screen2 from '../components/Screen2';
import Screen3 from '../components/Screen3';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('screen3');

  const { lang } = useLanguage();

  const navItems = [
    { id: 'screen1', label: lang === 'hi' ? 'जिला दृश्य' : 'District View', icon: LayoutDashboard },
    { id: 'screen2', label: lang === 'hi' ? 'मूल कारण' : 'Root Cause', icon: BarChart3 },
    { id: 'screen3', label: lang === 'hi' ? 'कार्य सूची' : 'Worklist', icon: ListTodo },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="min-h-screen bg-background relative overflow-hidden font-sans">
      {/* Floating Navigation */}
      <nav className="fixed top-24 left-1/2 -translate-x-1/2 z-40 shadow-lg rounded-full">
        <div className="bg-white/80 backdrop-blur-xl px-2 py-2 rounded-full flex items-center gap-2 border border-gray-200">
          <div className="px-4 py-2 border-r border-gray-200 mr-2">
            <span className="font-display font-bold text-xl text-gray-900 tracking-tight">{lang === 'hi' ? 'राज्य दृश्य' : 'State View'}</span>
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
          className="bg-yellow-50 border-yellow-200 border p-4 rounded-xl mb-8 flex items-start gap-3 shadow-sm"
        >
          <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-yellow-800 leading-relaxed">
            <strong className="text-yellow-900">{lang === 'hi' ? 'डेटा सूचना:' : 'Data Notice:'}</strong> {lang === 'hi' ? 'सिंथेटिक फ़ील्ड (name_local, name_bank, ifsc) प्रकाशित मार्जिनल से मेल खाने के लिए अनुकरण किए गए हैं।' : 'Synthetic fields (name_local, name_bank, ifsc) are simulated to match published marginals.'}
          </p>
        </motion.div>
        
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
          </motion.div>
        </AnimatePresence>
      </main>
    </motion.div>
  );
}

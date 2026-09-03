import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListTodo, CheckCircle2, Download, Eye, X, MapPin, TrendingUp, Sparkles, FileText, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useLanguage } from '../contexts/LanguageContext';

export default function Screen3() {
  const [worklist, setWorklist] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const { lang } = useLanguage();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/worklist`)
      .then(res => res.json())
      .then(data => {
        const mapped = (data || []).map(d => ({
          id: d.cluster_id,
          title: `${d.cause_code} Resolution`,
          location: d.dimension_value,
          category: d.cause_code,
          score: Math.round(d.priority * 100),
          cost_est: `₹${((d.unpaid_total || 0) / 10000000).toFixed(2)} Cr`,
          beneficiaries: d.workers_affected,
          status: d.priority > 0.9 ? 'urgent' : 'high',
          briefing: `AI identified a high priority issue regarding ${d.cause_code} in ${d.dimension_value}. Mean days pending: ${d.mean_days_pending}.`,
          requests: []
        }));
        setWorklist(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[800px] lg:h-[700px]">
      {/* Worklist Column */}
      <div className={`flex-1 glass-card p-4 lg:p-6 flex flex-col transition-all duration-500 bg-white ${selectedProject ? 'lg:w-2/3 w-full' : 'w-full'}`}>
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <ListTodo className="text-accent" size={24} />
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900">{lang === 'hi' ? 'अनुशंसित परियोजनाएं' : 'Recommended Projects'}</h2>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
            <TrendingUp size={16} className="text-gray-500" />
            <select className="bg-transparent text-sm text-gray-700 border-none outline-none cursor-pointer">
              <option className="bg-white">Priority: AI Score</option>
              <option className="bg-white">Priority: Beneficiaries</option>
              <option className="bg-white">Category: Water</option>
            </select>
          </div>
        </div>

        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {worklist.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={item.id} 
              className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:bg-gray-50 hover:border-primary/50 transition-all overflow-hidden shadow-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MapPin size={18} className="text-primary" />
                    {item.title} — {item.location}
                  </h3>
                  <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-mono font-medium text-primary">
                      AI SCORE {item.score}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">{lang === 'hi' ? 'श्रेणी' : 'Category'}</div>
                    <div className="text-lg font-display font-bold text-gray-900">{item.category}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">{lang === 'hi' ? 'अनुमानित लागत' : 'Est. Cost'}</div>
                    <div className="text-lg font-display font-bold text-gray-900">{item.cost_est}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">{lang === 'hi' ? 'नागरिक प्रभाव' : 'Citizen Impact'}</div>
                    <div className="text-lg font-display font-bold text-gray-900">{item.beneficiaries.toLocaleString()}+</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      setWorklist(worklist.filter(w => w.id !== item.id));
                    }}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                    <CheckCircle2 size={16} />
                    {lang === 'hi' ? 'स्वीकृत (निधि के लिए भेजें)' : 'Approve for Funding'}
                  </button>
                  <button 
                    onClick={async () => {
                      const doc = new jsPDF();
                      doc.setFontSize(22);
                      doc.setTextColor(117, 132, 214);
                      doc.text('ANTIM RUPEE - PROJECT PROPOSAL', 14, 20);
                      
                      doc.setFontSize(11);
                      doc.setTextColor(100, 100, 100);
                      doc.text(`Project ID: ${item.id}`, 14, 30);
                      doc.text(`Title: ${item.title}`, 14, 36);
                      doc.text(`Location: ${item.location}`, 14, 42);
                      doc.text(`Category: ${item.category}`, 14, 48);
                      doc.text(`Estimated Cost: ${item.cost_est}`, 14, 54);
                      
                      doc.setDrawColor(200, 200, 200);
                      doc.line(14, 60, 196, 60);
                      
                      doc.setTextColor(50, 50, 50);
                      doc.text('AI Briefing:', 14, 70);
                      doc.setFontSize(10);
                      doc.text(doc.splitTextToSize(item.briefing, 180), 14, 76);
                      
                      doc.save(`Proposal_${item.id}.pdf`);
                    }}
                    className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Download size={16} />
                    {lang === 'hi' ? 'प्रस्ताव निर्यात करें' : 'Export Proposal'}
                  </button>
                  <button 
                    onClick={() => setSelectedProject(item)} 
                    className="flex items-center gap-2 ml-auto text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                  >
                    <Eye size={16} />
                    {lang === 'hi' ? 'विवरण देखें' : 'View Details'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Drawer Column */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: typeof window !== 'undefined' && window.innerWidth < 1024 ? '100%' : '33.333333%' }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            className="glass-card bg-white flex flex-col relative overflow-hidden shadow-xl lg:static absolute inset-0 z-50 lg:z-auto"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Eye className="text-primary" size={20} />
                </div>
                <h3 className="text-lg font-display font-bold text-gray-900">Project Dossier</h3>
              </div>
              <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-gray-50/50 flex-1">
              {/* AI Case Briefing */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-5 mb-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-2xl rounded-full" />
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={18} className="text-primary" />
                  <h4 className="font-bold text-indigo-900">AI Context Brief</h4>
                </div>
                <p className="text-sm text-indigo-800 leading-relaxed mb-4">
                  {selectedProject.briefing}
                </p>
              </div>
              
              <div className="bg-gray-900 rounded-xl p-5 shadow-sm text-gray-300">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sample Citizen Voices</div>
                  <div className="text-[10px] bg-gray-800 px-2 py-1 rounded text-gray-400 font-mono">Translated via Cloud Translation API</div>
                </div>
                <div className="space-y-3">
                  {selectedProject.requests.map((req, idx) => (
                    <div key={idx} className="font-mono text-xs leading-relaxed whitespace-pre-wrap break-all border-l-2 border-emerald-500 pl-3 py-2 bg-gray-800 rounded">
                      <span className="text-emerald-400 font-bold">[{req.type.toUpperCase()}] ({req.lang})</span>: {req.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
